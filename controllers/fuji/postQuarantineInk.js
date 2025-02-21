import { pool1 } from "../../database.js";

const postQuarantineInks = async (req, res) => {
  let connection;
  try {
    const { formState } = req.body;
    console.log(req.body);

    // valdiate input
    const requiredFields = ['technician', 'design', 'weight', 'ppo', 'reason'];
    if (Object.keys(formState).length !== 5 || !requiredFields.every(field => formState[field])) {
      return res.status(400).json({ error: "Fill out required fields" });
    }

    // create date --- or add date/time input to client and remove this.
    const createdAt = new Date();
    console.log("created At", createdAt);

    // Main insert query
    const mainInsertQuery = `
      INSERT INTO quarantine_table (technician, design, weight, ppo, reason, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const mainInsertValues = [
      formState.technician,
      formState.design,
      formState.weight,
      formState.ppo,
      formState.reason,
      createdAt,
    ];

    // Get a database connection from the pool1
    connection = await pool1.promise().getConnection();

    try {
      await connection.beginTransaction();

      await connection.query(mainInsertQuery, mainInsertValues);

      await connection.commit();
      res.json({ success: true, message: "Data inserted successfully" });
    } catch (error) {
      // Rollback transaction if error
      await connection.rollback();
      console.error("Error inserting data:", error);
      res.status(500).json({ error: "Internal Server Error: postQuarantineInks.js" });
    } finally {
      // end connection
      connection.release();
    }
  } catch (error) {
    console.error("Error processing request:", error);
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Error rolling back transaction:", rollbackError);
      } finally {
        connection.release();
      }
    }
    res.status(500).json({ error: "Internal Server Error: postQuarantineInks.js" });
  }
};

export default postQuarantineInks;
