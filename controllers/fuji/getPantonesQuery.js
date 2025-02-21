import { pool1 } from "../../database.js";

const getPantones = async (req, res) => {
  let page = parseInt(req.query.page, 10) || 1;
  let limit = 300;
  let offset = (page - 1) * limit;

  console.log(`Fetching Pantones -> Page: ${page}, Limit: ${limit}, Offset: ${offset}`);

  try {
    const [rows] = await pool1.promise().query(
      "SELECT * FROM pantones LIMIT ? OFFSET ?",
      [limit, offset]
    );

    console.log("Returned Rows:", rows.length);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching Pantones:", error);
    res.status(500).json({ error: "Failed to fetch Pantones" });
  }
};

export default getPantones;
