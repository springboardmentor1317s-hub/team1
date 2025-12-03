const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');  // db.js also inside src/

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'campus_eventhub_demo_secret';

app.use(cors());
app.use(express.json());

// STATIC FILES → serve all HTML inside src/
const publicPath = __dirname;
app.use(express.static(publicPath));



app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'eventhub.html'));
});

app.get('/role1', (req, res) => {
  res.sendFile(path.join(publicPath, 'role1.html'));
});

app.get('/role2', (req, res) => {
  res.sendFile(path.join(publicPath, 'role2.html'));
});



function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}



app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, college, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const validRoles = ['student', 'college_admin', 'super_admin'];
  if (!validRoles.includes(role)) return res.status(400).json({ error: 'Invalid role' });

  try {
    const existing = db.getUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashed = bcrypt.hashSync(password, 10);
    const created = db.createUser({ name, email, password: hashed, college, role });

    const safeUser = {
      id: created.id,
      name: created.name,
      email: created.email,
      college: created.college,
      role: created.role
    };

    const token = signToken(safeUser);
    return res.json({ token, user: safeUser });
  } catch (e) {
    console.error('Signup failed', e);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Missing email or password' });

  try {
    const user = db.getUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      college: user.college,
      role: user.role
    };

    const token = signToken(safeUser);

    return res.json({ token, user: safeUser });
  } catch (e) {
    console.error('Login failed', e);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  try {
    const user = db.getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Not found' });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      college: user.college,
      role: user.role,
      created_at: user.created_at
    };

    return res.json({ user: safeUser });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});



app.get('/api/events', (req, res) => {
  try {
    const events = db.listEvents();
    res.json({ events });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/events', authMiddleware, (req, res) => {
  const { title, description, category, location, start_date, end_date } = req.body;

  if (req.user.role === 'student')
    return res.status(403).json({ error: 'Forbidden' });

  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const event = db.createEvent({
      college_id: req.user.id,
      title,
      description,
      category,
      location,
      start_date,
      end_date
    });

    res.json({ event });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});



app.listen(PORT, () => {
  console.log(`CampusEventHub running at http://localhost:${PORT}/`);
});
