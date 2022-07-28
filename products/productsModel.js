const pool = require("../db/config");
const fs = require('fs');
const cloudinary = require("../util/cloudinary")

const getAllProducts = async () => {
  const query = "SELECT * FROM products";
  try {
    return await pool.query(query);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

const getWithType = async (type) => {
const query = `SELECT * FROM products WHERE tipo LIKE "%${type}%"`
console.log(query)
try {
  return await pool.query(query);
} catch (error) {
  error.message = error.code;
  return error;
}
} 

const getWithProduct = async (product) => {
  const query = `SELECT * FROM products WHERE producto LIKE "%${product}%"`
  try {
    return await pool.query(query);
  } catch (error) {
    error.message = error.code;
    return error;
  }
  }

const getProductById = async (id) => {
  const query = `SELECT * FROM products WHERE id = ${id}`;
  try {
    return await pool.query(query);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

const addNewProduct = async (product) => {
  const query = `INSERT INTO products SET ?`;
  try {
    return await pool.query(query, product);
  } catch (error) {
    error.message = error.code;
    return error;
  } 
};

const editProductById = async (id, product) => {
  const param = await getProductById(id);
  await cloudinary.uploader.destroy(param[0].cantidad, function(error,result) {
    console.log(result, error) });
  const query = `UPDATE products SET ? WHERE id = ${id}`;
  try {
    return await pool.query(query, product);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

const deleteProductById = async (id) => {
  const param = await getProductById(id);
  await cloudinary.uploader.destroy(param[0].cantidad, function(error,result) {
    console.log(result, error) });
  const query = `DELETE FROM products WHERE id = ${id}`;
  try {
    return await pool.query(query);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

module.exports = {
  getAllProducts,
  getWithType,
  getWithProduct,
  getProductById,
  addNewProduct,
  editProductById,
  deleteProductById,
};
