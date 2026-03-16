```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// ===== BABY-PROOF CORS SETUP =====
app.use(cors({
  origin: [
    'https://your-site-name.netlify.app', // YOUR ACTUAL NETLIFY URL
    'http://localhost:3000'              // For local testing
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));

// ===== BODY PARSER WITH SAFETY LIMITS =====
app.use(express.json({ 
  limit: '10kb',     // No huge payloads
  strict: true       // Only parse arrays/objects
}));

// ===== SIMPLE DATABASE (FOR DEMO) =====
let accounts = {
  demo: { 
    username: 'demo', 
    password: 'demo', 
    balance: 10000,
    lastLogin: new Date()
  }
};

// ===== ROUTES ===== //

// 🟢 LOGIN
app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password required' 
      });
    }

    // Check credentials
    const account = accounts[username];
    if (!account || account.password !== password) {
      return res.status(401).json({ 
        error: 'Wrong username or password' 
      });
    }

    // Update last login
    account.lastLogin = new Date();

    // Successful response
    res.json({ 
      success: true,
      user: {
        username: account.username,
        balance: account.balance
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Server messed up during login' 
    });
  }
});

// 🔵 CREATE ACCOUNT
app.post('/create', (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password required' 
      });
    }

    if (username.length < 3 || password.length < 3) {
      return res.status(400).json({ 
        error: 'Username and password need 3+ characters' 
      });
    }

    // Check if exists
    if (accounts[username]) {
      return res.status(409).json({ 
        error: 'Username already taken' 
      });
    }

    // Create account
    accounts[username] = { 
      username,
      password,
      balance: 10000,
      lastLogin: new Date()
    };

    // Success response
    res.status(201).json({ 
      success: true,
      message: `Account ${username} created`
    });

  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ 
      error: 'Server messed up during account creation' 
    });
  }
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('💥 UNHANDLED ERROR:', err.stack);
  res.status(500).json({ 
    error: 'Something broke!',
    message: err.message 
  });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ===== NETLIFY REQUIREMENT =====
module.exports = app;
```
