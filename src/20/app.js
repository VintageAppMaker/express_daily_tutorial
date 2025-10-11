// app.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const DB_PATH = path.join(__dirname, 'blog.db');
const db = new sqlite3.Database(DB_PATH);

// Body 파서
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공: public 폴더
app.use(express.static(path.join(__dirname, 'public')));

// 테이블 생성
db.run(`CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title   TEXT NOT NULL,
  content TEXT NOT NULL,
  author  TEXT DEFAULT 'Anonymous',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// REST API ------------------------------
// 목록
app.get('/posts', (req, res) => {
    db.all('SELECT * FROM posts ORDER BY id DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 상세
app.get('/posts/:id', (req, res) => {
    db.get('SELECT * FROM posts WHERE id=?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Not Found' });
        res.json(row);
    });
});

// 생성
app.post('/posts', (req, res) => {
    const { title, content, author } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'title, content 필수' });

    db.run(
        'INSERT INTO posts (title, content, author) VALUES (?, ?, ?)',
        [title, content, author || 'Anonymous'],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, title, content, author: author || 'Anonymous' });
        }
    );
});

// 수정(전체 업데이트)
app.put('/posts/:id', (req, res) => {
    const { title, content, author } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'title, content 필수' });

    db.run(
        'UPDATE posts SET title=?, content=?, author=? WHERE id=?',
        [title, content, author || 'Anonymous', req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Not Found' });
            res.json({ id: Number(req.params.id), title, content, author: author || 'Anonymous' });
        }
    );
});

// 삭제
app.delete('/posts/:id', (req, res) => {
    db.run('DELETE FROM posts WHERE id=?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Not Found' });
        res.status(204).send();
    });
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));