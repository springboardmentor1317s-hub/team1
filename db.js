// =====================
// IMPORTS
// =====================
const mysql = require("mysql2/promise");
const { v4: uuid } = require("uuid");

// =====================
// MYSQL CONNECTION POOL
// =====================
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",          // your password
  database: "campus_eventhub",
  connectionLimit: 10
});

// =====================
// USERS
// =====================
module.exports.getUserByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT * FROM Users WHERE email = ?",
    [email]
  );
  return rows[0] || null;
};

module.exports.getUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM Users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
};

module.exports.createUser = async ({ name, email, password, college, role }) => {
  const id = uuid();

  await pool.query(
    "INSERT INTO Users (id, name, email, password, college, role) VALUES (?, ?, ?, ?, ?, ?)",
    [id, name, email, password, college, role]
  );

  return { id, name, email, college, role };
};

module.exports.updateUserPassword = async (email, newPass) => {
  const [result] = await pool.query(
    "UPDATE Users SET password=? WHERE email=?",
    [newPass, email]
  );

  return result.affectedRows > 0;
};

// =====================
// PASSWORD RESET
// =====================
module.exports.createResetToken = async (email, token, expires_at) => {
  await pool.query(
    `INSERT INTO PasswordReset (email, token, expires_at, used)
     VALUES (?, ?, ?, 0)`,
    [email, token, expires_at]
  );
};

module.exports.getValidResetToken = async (token) => {
  const [rows] = await pool.query(
    "SELECT * FROM PasswordReset WHERE token=? AND used=0 AND expires_at > NOW()",
    [token]
  );
  return rows[0] || null;
};

module.exports.markResetUsed = async (token) => {
  await pool.query(
    "UPDATE PasswordReset SET used=1 WHERE token=?",
    [token]
  );
};

// =====================
// EVENTS
// =====================
module.exports.listEvents = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM Events ORDER BY start_date ASC"
  );
  return rows;
};

module.exports.createEvent = async (data) => {
  const id = uuid();
  const {
    college_id,
    title,
    description,
    category,
    location,
    start_date,
    end_date
  } = data;

  await pool.query(
    `INSERT INTO Events (id, college_id, title, description, category, location, start_date, end_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, college_id, title, description, category, location, start_date, end_date]
  );

  return { id, ...data };
};

module.exports.deleteEvent = async (id) => {
  await pool.query("DELETE FROM Events WHERE id = ?", [id]);
};

// =====================
// REGISTRATIONS
// =====================
module.exports.createRegistration = async ({ event_id, user_id }) => {
  const id = uuid();

  await pool.query(
    `INSERT INTO Registrations (id, event_id, user_id, status)
     VALUES (?, ?, ?, 'confirmed')`,
    [id, event_id, user_id]
  );

  return { id, event_id, user_id, status: "confirmed" };
};

module.exports.registrationsByEvent = async (event_id) => {
  const [rows] = await pool.query(
    `SELECT r.id, r.user_id, u.name, u.email, r.status, r.timestamp
     FROM Registrations r
     JOIN Users u ON u.id = r.user_id
     WHERE r.event_id = ?`,
    [event_id]
  );
  return rows;
};

module.exports.countRegistrationsByEvent = async (event_id) => {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS count FROM Registrations WHERE event_id = ?",
    [event_id]
  );
  return rows[0].count;
};

// Export Pool
module.exports.pool = pool;
