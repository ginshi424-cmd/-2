require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allows your React app to talk to this server
app.use(bodyParser.json());

// Database Connection Configuration
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'f1_tickets',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test Database Connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Please make sure MySQL is running and you have created the "f1_tickets" database.');
  } else {
    console.log('✅ Connected to MySQL database');
    connection.release();
  }
});

// --- API ROUTES ---

// 1. GET ALL EVENTS
app.get('/api/events', (req, res) => {
  const sql = 'SELECT * FROM events';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Transform database rows (snake_case) to frontend objects (camelCase)
    const events = results.map(row => ({
      id: row.id,
      name: row.name,
      location: row.location,
      // Convert Date object to YYYY-MM-DD string
      date: row.event_date instanceof Date 
            ? row.event_date.toISOString().split('T')[0] 
            : row.event_date,
      year: row.year,
      imageUrl: row.image_url,
      flagUrl: row.flag_url,
      // Parse JSON string back to object
      tickets: typeof row.tickets === 'string' ? JSON.parse(row.tickets) : row.tickets
    }));
    
    res.json(events);
  });
});

// 2. CREATE EVENT
app.post('/api/events', (req, res) => {
  const { id, name, location, date, year, imageUrl, flagUrl, tickets } = req.body;
  
  const sql = `
    INSERT INTO events (id, name, location, event_date, year, image_url, flag_url, tickets) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  // Convert tickets array to JSON string for storage
  const ticketsJson = JSON.stringify(tickets);
  
  db.execute(sql, [id, name, location, date, year, imageUrl, flagUrl, ticketsJson], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create event' });
    }
    console.log(`Event created: ${name}`);
    res.status(201).json({ message: 'Event created', id });
  });
});

// 3. UPDATE EVENT
app.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const { name, location, date, year, imageUrl, flagUrl, tickets } = req.body;
  
  const sql = `
    UPDATE events 
    SET name=?, location=?, event_date=?, year=?, image_url=?, flag_url=?, tickets=? 
    WHERE id=?
  `;
  
  const ticketsJson = JSON.stringify(tickets);

  db.execute(sql, [name, location, date, year, imageUrl, flagUrl, ticketsJson, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update event' });
    }
    console.log(`Event updated: ${id}`);
    res.json({ message: 'Event updated' });
  });
});

// 4. DELETE EVENT
app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  
  const sql = 'DELETE FROM events WHERE id=?';
  
  db.execute(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete event' });
    }
    console.log(`Event deleted: ${id}`);
    res.json({ message: 'Event deleted' });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});