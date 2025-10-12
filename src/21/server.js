// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import postsRouter from './src/routes/posts.js';
import { ensureTables } from './src/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 기본 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일
app.use(express.static(path.join(__dirname, 'public')));

// API 라우트
app.use('/api/posts', postsRouter);

// 404
app.use((req, res, next) => res.status(404).json({ error: 'Not Found' }));

// 에러 핸들러
app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 3000;
ensureTables().then(() => {
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
});
