const express = require('express');
const cors = require('cors');
const app = express();

// 1. Add CORS configuration (paste this at the TOP)
app.use(cors({
  origin: ['https://your-site-name.netlify.app', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// 2. Your existing routes stay here
let accounts = {
  demo: { username: 'demo', password: 'demo', balance: 10000 }
};

app.post('/login', (req, res) => {
  // ... your existing login code ...
});

app.post('/create', (req, res) => {
  // ... your existing create account code ...
});

// 3. Add error handling middleware (paste this AFTER all routes)
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 4. Export for Netlify (add this at the BOTTOM)
module.exports = app;
