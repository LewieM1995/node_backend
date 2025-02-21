import { pool1 } from "../../database.js";

const getPantones = async (req, res) => {
  try {
    const [rows] = await pool1.promise().query(
      "SELECT * FROM pantones"
    );

    console.log("Returned Rows:", rows.length);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching Pantones:", error);
    res.status(500).json({ error: "Failed to fetch Pantones" });
  }
};

export default getPantones;
