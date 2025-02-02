const db = require('../config/database');
const { DatabaseError } = require('../middleware/databaseErrorHandler');

class Product {
  static async getAll() {
    try {
      const products = await db.query('SELECT * FROM products WHERE deleted_at IS NULL');
      return products;
    } catch (error) {
      throw new DatabaseError(`Failed to fetch products: ${error.message}`);
    }
  }

  static async getById(id) {
    try {
      const [product] = await db.query('SELECT * FROM products WHERE id = ? AND deleted_at IS NULL', [id]);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw new DatabaseError(`Failed to fetch product: ${error.message}`);
    }
  }

  static async create(productData) {
    try {
      const result = await db.query(
        'INSERT INTO products (name, hsn_code, unit, price, gst_rate, description) VALUES (?, ?, ?, ?, ?, ?)',
        [productData.name, productData.hsn_code, productData.unit, productData.price, productData.gst_rate, productData.description]
      );
      return this.getById(result.insertId);
    } catch (error) {
      throw new DatabaseError(`Failed to create product: ${error.message}`);
    }
  }

  static async update(id, productData) {
    try {
      await db.query(
        'UPDATE products SET name = ?, hsn_code = ?, unit = ?, price = ?, gst_rate = ?, description = ? WHERE id = ?',
        [productData.name, productData.hsn_code, productData.unit, productData.price, productData.gst_rate, productData.description, id]
      );
      return this.getById(id);
    } catch (error) {
      throw new DatabaseError(`Failed to update product: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const result = await db.query(
        'UPDATE products SET deleted_at = NOW() WHERE id = ?',
        [id]
      );
      if (result.affectedRows === 0) {
        throw new Error('Product not found');
      }
      return true;
    } catch (error) {
      throw new DatabaseError(`Failed to delete product: ${error.message}`);
    }
  }
}

module.exports = Product; 