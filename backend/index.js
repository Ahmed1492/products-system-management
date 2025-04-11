import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
const app = express();
app.use(express.json());
app.use(cors());
const port = 2000;


dotenv.config();

// Connect to Database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});




// Get Products
app.get('/product', (req, res) => {
  connection.query(`SELECT * from products`, (err, result) => {
    console.log(result);

    return res.json({ status: 200, result });

  });
});


// Add Products
app.post('/product', (req, res) => {
  const { name, price, description } = req.body;

  if (!name || !price || !description) {
    return res.status(400).json({ success: false, message: 'Please provide name, price, and description.' });
  }

  connection.query(
    `INSERT INTO products (name, price, description) VALUES (?, ?, ?)`,
    [name, price, description],
    (err, result) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ success: false, message: 'Database Error' });
      }

      if (result.affectedRows === 0) {
        return res.status(500).json({ success: false, message: 'Failed to add product' });
      }

      return res.status(201).json({ success: true, message: 'Product Added Successfully!' });
    }
  );
});

// Update Products
app.patch('/product/:id', (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  if (!id || !name || !price) {
    return res.status(400).json({ success: false, message: 'Product ID, name, and price are required' });
  }

  connection.query(
    `UPDATE products SET name = ?, price = ? WHERE id = ?`,
    [name, price, id],
    (err, result) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ success: false, message: 'Database Error' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Product Not Found' });
      }

      return res.status(200).json({ success: true, message: 'Product Updated Successfully!' });
    }
  );
});



// Delete Products
app.delete('/product/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Product ID is required' });
  }

  connection.query(
    `DELETE FROM products WHERE id = ?`, [id],
    (err, result) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ success: false, message: 'Database Error' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Product Not Found' });
      }

      return res.status(200).json({ success: true, message: 'Product Deleted Successfully!' });
    }
  );
});


// Get Certin Product

app.get('/product/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Product ID is required' });
  }

  connection.query(`SELECT * FROM products WHERE id = ?`, [id], (error, result) => {
    if (error) {
      console.error('DB Error:', error);
      return res.status(500).json({ success: false, message: 'Database Error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json({ success: true, result });
  });
});




app.listen(port, () => console.log(`Example app listening on port ${port}!`));