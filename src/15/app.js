const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } // 1 minute
}));

const USERS = { admin: '1234', user: 'abcd' };

// Handle login requests
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (USERS[username] === password) {
        req.session.user = username;
        res.send(`Login success: ${username}`);
    } else {
        res.status(401).send('Login failed');
    }
});

// Serve a protected page only for logged-in users
app.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.status(403).send('Authentication required.');
    res.send(`Welcome, ${req.session.user}!`);
});

// Handle logout requests
app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.send('Logout complete');
    });
});

// codex로 테스트할 수 있도록 간단한 HTML 클라이언트 제공 
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Session Test Client</title>
<style>
body { font-family: Arial, sans-serif; margin: 2rem; }
section { margin-bottom: 1.5rem; }
button { margin-right: 0.5rem; }
input { margin-right: 0.5rem; }
#output { white-space: pre-line; border: 1px solid #ccc; padding: 1rem; }
</style>
</head>
<body>
<h1>Session Test Client</h1>
<section>
  <h2>Login</h2>
  <label>Username <input type="text" id="username" value="admin"></label>
  <label>Password <input type="password" id="password" value="1234"></label>
  <button id="loginBtn">Login</button>
</section>
<section>
  <h2>Protected Route</h2>
  <button id="dashboardBtn">Get Dashboard</button>
</section>
<section>
  <h2>Logout</h2>
  <button id="logoutBtn">Logout</button>
</section>
<section>
  <h2>Responses</h2>
  <div id="output">Ready.</div>
</section>
<script>
const output = document.getElementById('output');
function printResponse(status, text) {
  output.textContent = status + " " +  text;
}
async function handleRequest(url, options) {
  try {
    const res = await fetch(url, { ...options, credentials: 'include' });
    const text = await res.text();
    printResponse(res.status, text);
  } catch (error) {
    printResponse('error', error.message);
  }
}
document.getElementById('loginBtn').addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  handleRequest('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
});
document.getElementById('dashboardBtn').addEventListener('click', () => {
  handleRequest('/dashboard', { method: 'GET' });
});
document.getElementById('logoutBtn').addEventListener('click', () => {
  handleRequest('/logout', { method: 'POST' });
});
</script>
</body>
</html>`);
});

app.listen(3000, () => console.log('Auth server on http://localhost:3000'));
