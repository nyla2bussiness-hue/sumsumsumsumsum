const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple in-memory database
let accounts = {
  demo: {
    username: 'demo',
    password: 'demo',
    balance: 10000
  }
};

// Account endpoints
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!accounts[username] || accounts[username].password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({ account: accounts[username] });
});

app.post('/api/create', (req, res) => {
  const { username, password } = req.body;
  
  if (accounts[username]) {
    return res.status(400).json({ error: 'Username exists' });
  }
  
  accounts[username] = {
    username,
    password,
    balance: 10000
  };
  
  res.json({ success: true });
});

module.exports = app;
