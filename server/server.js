```javascript
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();

// ===== NOIR'S CORS CONFIG =====
app.use(cors({
  origin: [
    'https://scintillating-sherbet-2280c0.netlify.app',
    'http://localhost:8888' // For testing
  ],
  credentials: true
}));

// ===== HARDENED JSON PARSING =====
app.use(express.json({
  limit: '10kb',
  strict: true
}));

// ===== DEMO DATABASE =====
const accounts = {
  demo: { 
    password: 'demo', 
    balance: 10000,
    lastLogin: new Date().toISOString()
  }
};

// ===== ROUTES ===== //

// 🔐 LOGIN
app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate
    if (!username || !password) {
      return res.status(400).json({ error: 'Both fields required' });
    }

    // Authenticate
    const account = accounts[username];
    if (!account || account.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Success
    res.json({ 
      success: true,
      user: {
        username,
        balance: account.balance
      }
    });

  } catch (error) {
    console.error('NOIR LOGIN ERROR:', error);
    res.status(500).json({ error: 'System malfunction' });
  }
});

// ✨ CREATE ACCOUNT
app.post('/create', (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate
    if (!username || !password) {
      return res.status(400).json({ error: 'Both fields required' });
    }

    // Check existence
    if (accounts[username]) {
      return res.status(409).json({ error: 'User exists' });
    }

    // Create
    accounts[username] = { 
      password,
      balance: 10000,
      lastLogin: new Date().toISOString()
    };

    res.status(201).json({ 
      success: true,
      message: `${username} created`
    });

  } catch (error) {
    console.error('NOIR CREATE ERROR:', error);
    res.status(500).json({ error: 'System malfunction' });
  }
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('💀 NOIR FATAL:', err);
  res.status(500).json({ error: 'Critical system failure' });
});

// ===== EXPORTS =====
module.exports = app;
module.exports.handler = serverless(app);
```

---

### **🖤 UPDATED INDEX.HTML**  
*(Simplified and hardened)*  

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NOIR TRADER</title>
    <style>
        body {
            background: #0a0a0a;
            color: #00ffa3;
            font-family: monospace;
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .noir-box {
            background: #111;
            border: 1px solid #00ffa3;
            padding: 2rem;
            width: 300px;
        }
        input, button {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            background: #222;
            color: white;
            border: 1px solid #333;
        }
        button {
            background: #00ffa3;
            color: black;
            font-weight: bold;
            cursor: pointer;
        }
        #error {
            color: #ff4d4d;
            height: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="noir-box">
        <h1>NOIR TERMINAL</h1>
        <input id="username" placeholder="Username" autocomplete="username">
        <input id="password" type="password" placeholder="Password" autocomplete="current-password">
        <button id="loginBtn">ACCESS</button>
        <button id="createBtn">NEW USER</button>
<div id="error"></div>
    </div>

    <script>
        // ===== NOIR'S BULLETPROOF FETCH =====
        async function noirFetch(endpoint, data) {
            try {
                const response = await fetch(`/.netlify/functions/server/${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (!response.ok) throw new Error('Server error');
                
                const result = await response.json();
                if (result.error) throw new Error(result.error);
                
                return result;
            } catch (err) {
                document.getElementById('error').textContent = err.message;
                throw err; // Re-throw for further handling
            }
        }

        // ===== BUTTON HANDLERS =====
        document.getElementById('loginBtn').addEventListener('click', async () => {
            try {
                const res = await noirFetch('login', {
                    username: document.getElementById('username').value,
                    password: document.getElementById('password').value
                });
                alert(`Welcome ${res.user.username}`);
            } catch {
                // Error already shown
            }
        });

        document.getElementById('createBtn').addEventListener('click', async () => {
            try {
                const res = await noirFetch('create', {
                    username: document.getElementById('username').value,
                    password: document.getElementById('password').value
                });
                alert(res.message);
            } catch {
                // Error already shown
            }
        });

        // ===== INIT CONFIRMATION =====
        console.log("NOIR TERMINAL READY");
    </script>
</body>
</html>
```
