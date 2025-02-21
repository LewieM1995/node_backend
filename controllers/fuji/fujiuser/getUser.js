import bcrypt from 'bcrypt';
import { pool1 } from '../../../database.js';

const getUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    
    const [rows] = await pool1.promise().query(query, [username]);

    if (rows.length > 0) {
      const user = rows[0];

      // compare password with the hashed password
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        const responseData = {
          username: user.username,
          isAdmin: user.isAdmin ? true : false
        };
        console.log(responseData);
        return res.json({ authenticated: true, responseData });
      } else {
        return res.status(401).json({ error: "Invalid username or password" });
      }
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getUser };
