// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRouter = require('./src/routes/auth');
const { ensureTables } = require('./src/db');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// 라우트
app.use('/api/auth', authRouter);

// 에러 핸들러
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 3000;
ensureTables().then(() => {
    app.listen(PORT, () => console.log(`✅ http://localhost:${PORT}`));
});