import { pool1 } from "../../database.js";

const postData = async (req, res) => {
  let connection;
  try {
    const { PPONum, designNum, speNum, colors, sunAttendPress } = req.body;
    console.log(req.body);

    if (!PPONum || !designNum || !speNum || !colors || !Array.isArray(colors) || sunAttendPress === null) {
      return res.status(400).json({ error: "Fill out required fields" });
    }

    // contorl data server side, prevent mistakes
    const createdAt = new Date();
    console.log("Created At", createdAt);

    // connection
    connection = await pool1.promise().getConnection();

    try {
      await connection.beginTransaction();

      // insert job data
      const mainInsertQuery = `
        INSERT INTO job_table (PPONum, designNum, speNum, createdAt)
        VALUES (?, ?, ?, ?)
      `;
      const mainInsertValues = [PPONum, designNum, speNum, createdAt];
      await connection.query(mainInsertQuery, mainInsertValues);

      // get last id
      const [result] = await connection.query("SELECT LAST_INSERT_ID() as id");
      const mainId = result[0].id;

      // insert colour data
      const colorInsertQuery = `
        INSERT INTO colour_data (job_id, colour_value, colour_type, anilox, de, target, date, SAP)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const colorInsertValues = colors.map(color => ([
        mainId,
        color.selectedColor,
        color.selectedColorType,
        color.anilox,
        color.DE,
        color.target.toLowerCase(),
        createdAt,
        sunAttendPress
      ]));

      await connection.query(colorInsertQuery, [colorInsertValues]);

      await connection.commit();
      res.json({ success: true, message: "Data inserted successfully" });
    } catch (error) {
      await connection.rollback();
      console.error("Error inserting data:", error);
      res.status(500).json({ error: "Internal Server Error: postData.js" });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error processing request:", error);
    if (connection) {
      try {
        await connection.rollback(); // rollback
      } catch (rollbackError) {
        console.error("Error rolling back transaction:", rollbackError);
      } finally {
        connection.release();
      }
    }
    res.status(500).json({ error: "Internal Server Error: postData.js" });
  }
};

export default postData;
