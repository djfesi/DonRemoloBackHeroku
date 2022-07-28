const pool = require("../db/config");

const getAllUsers = async () => {
  const query = "SELECT * FROM users";
  try {
    return await pool.query(query);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

const getUsersById = async (id) => {
  const query = `SELECT * FROM users WHERE id = ${id}`;
  try {
    return await pool.query(query);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

const addNewUser = async (user) => {
  const query = `INSERT INTO users SET ?`;
  try {
    return await pool.query(query, user);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

const loginUser = async (email) => {
  const query = `SELECT * FROM users WHERE email = '${email}'`
  try {
    return await pool.query(query);
  } catch (error) {
    error.message = error.code;
    return error
  }
}

const editUserById = async (id, user) => {
  const query = `UPDATE users SET ? WHERE id = ${id}`;
  try {
    return await pool.query(query, user);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

const deleteUserById = async (id) => {
  const query = `DELETE FROM users WHERE id = ${id}`;
  try {
    return await pool.query(query);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

module.exports = {
  getAllUsers,
  getUsersById,
  addNewUser,
  loginUser,
  editUserById,
  deleteUserById,
};
