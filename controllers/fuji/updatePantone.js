import { pool1 } from '../../database.js';

const updatePantone = async (req, res) => {
  let connection;

  try {
    const { id, label, value, type, hex, r, g, b } = req.body;

    console.log(req.body);

    if (id && label && value && type) {
      const query = `
        UPDATE pantones
        SET label = ?, value = ?, type = ?, hex = ?, r = ?, g = ?, b = ?
        WHERE id = ?
      `;

      connection = await pool1.promise().getConnection();
      await connection.beginTransaction(); // Start transaction

      const [result] = await connection.query(query, [label, value, type, hex, r, g, b, id]);

      if (result.affectedRows > 0) {
        await connection.commit(); // Commit transaction
        res.status(200).json({ message: "Pantone updated successfully" });
      } else {
        await connection.rollback(); // Rollback if not found
        res.status(404).json({ error: "Pantone not found" });
      }
    } else {
      res.status(400).json({ error: "Invalid data" });
    }
  } catch (error) {
    console.error("Error updating Pantone:", error);
    if (connection) await connection.rollback();
    res.status(500).json({ error: "Failed to update Pantone" });
  } finally {
    if (connection) connection.release();
  }
};

export default updatePantone;
