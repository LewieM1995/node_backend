import { pool1 } from '../../database.js';

const deletePantone = async (req, res) => {
  const { id } = req.params;

  try {
    // validate id
    if (!id) {
      return res.status(400).json({ error: 'Pantone ID is required' });
    }

    const query = 'DELETE FROM pantones WHERE id = ?';

    const [result] = await pool1.promise().query(query, [id]);

    // Check if deleted
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Pantone deleted successfully' });
    } else {
      res.status(404).json({ error: 'Pantone not found' });
    }
  } catch (error) {
    console.error('Error deleting Pantone:', error);
    res.status(500).json({ error: 'Failed to delete Pantone' });
  }
};

export default deletePantone;
