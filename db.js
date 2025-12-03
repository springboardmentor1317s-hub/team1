const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, '../data');
const usersFile = path.join(dataDir, 'users.json');
const eventsFile = path.join(dataDir, 'events.json');
const regsFile = path.join(dataDir, 'registrations.json');
const feedbackFile = path.join(dataDir, 'feedback.json');
const logsFile = path.join(dataDir, 'admin_logs.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

function read(file) {
  if (!fs.existsSync(file)) return [];
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch {
    return [];
  }
}

function write(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function now() {
  return new Date().toISOString();
}

// Simple ID generator
function nextId(items) {
  return (items.length ? Math.max(...items.map(i => i.id || 0)) : 0) + 1;
}

// Users API
function getUserByEmail(email) {
  const users = read(usersFile);
  return users.find(u => u.email === email) || null;
}

function createUser({ name, email, password, college, role }) {
  const users = read(usersFile);
  const id = nextId(users);
  const user = { id, name, email, password, college: college || null, role, created_at: now() };
  users.push(user);
  write(usersFile, users);
  return user;
}

function getUserById(id) {
  const users = read(usersFile);
  return users.find(u => u.id === id) || null;
}

// Events (stubs for later)
function listEvents() {
  return read(eventsFile);
}

function createEvent({ college_id, title, description, category, location, start_date, end_date }) {
  const events = read(eventsFile);
  const id = nextId(events);
  const event = { id, college_id, title, description, category, location, start_date, end_date, created_at: now() };
  events.push(event);
  write(eventsFile, events);
  return event;
}

module.exports = {
  getUserByEmail,
  createUser,
  getUserById,
  listEvents,
  createEvent,
};
