const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());

// DB 연결
const db = new sqlite3.Database(':memory:');

// 테이블 초기화
db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER)");
    db.run("INSERT INTO users (name, age) VALUES ('Alice', 25), ('Bob', 30)");
});

// 전체 사용자 조회
app.get('/users', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 사용자 추가
app.post('/users', (req, res) => {
    const { name, age } = req.body;
    db.run("INSERT INTO users (name, age) VALUES (?, ?)", [name, age], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, name, age });
    });
});

app.listen(3000, () => console.log("SQLite example on http://localhost:3000"));