import { pool1 } from "../../database.js";

const postProcessData = async (req, res) => {
  let connection;
  
  try {
    const processedData = req.body.map((item) => ({
      id: item.id,
      date: item.datetime,
      anilox: item.anilox,
      colour: item.color,
      pressResult: parseFloat(item.pressResult),
      prooferResult: parseFloat(item.prooferResult),
    }));

    connection = await pool1.promise().getConnection();
    await connection.beginTransaction(); // connect transaction

    const query = `
      INSERT INTO process_data 
      (id, date, anilox, colour, press_result, proofer_result) 
      VALUES ?
    `;

    const [result] = await connection.query(query, [
      processedData.map(item => [
        item.id, 
        item.date, 
        item.anilox, 
        item.colour, 
        item.pressResult, 
        item.prooferResult
      ])
    ]);

    await connection.commit(); // commit 
    connection.release();

    res.status(200).json({ 
      message: `Successfully inserted ${result.affectedRows} records`,
      insertedIds: processedData.map(item => item.id)
    });

  } catch (error) {
    if (connection) {
      try {
        await connection.rollback(); // rollback if error
      } catch (rollbackError) {
        console.error("Error rolling back transaction:", rollbackError);
      } finally {
        connection.release();
      }
    }

    console.error("Error processing data:", error);
    res.status(500).json({ error: "Failed to process data" });
  }
};

export default postProcessData;
