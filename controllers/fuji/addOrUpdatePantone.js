import { pool1 } from '../../database.js';

const addPantone = async (req, res) => {
  try {
    const { label, value, type, hex, r, g, b } = req.body;

    console.log(req.body);

    if (label && value && type) {
      // check for duplicate pantone
      const [duplicates] = await pool1.promise().query(
        'SELECT * FROM pantones WHERE value = ? OR label = ?',
        [value, label]
      );

      if (duplicates.length > 0) {
        return res.status(400).json({ error: 'Pantone with the same value or label already exists' });
      }

      const query = `
        INSERT INTO pantones (label, value, type, hex, r, g, b)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await pool1.promise().query(query, [label, value, type, hex, r, g, b]);
      
      if (result.affectedRows > 0) {
        res.status(201).json({ message: 'New Pantone added successfully' });
      } else {
        res.status(500).json({ error: 'Failed to add new Pantone' });
      }
    } else {
      res.status(400).json({ error: 'Invalid Pantone data' });
    }
  } catch (error) {
    console.error('Error adding new Pantone:', error);
    res.status(500).json({ error: 'Failed to add new Pantone' });
  }
};

export default addPantone;
