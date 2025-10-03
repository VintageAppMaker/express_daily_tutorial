const express = require('express');
const app = express();
app.use(express.json());

// 임시 데이터 저장 (DB 대체)
let users = [
    { id: 1, name: 'Alice', age: 23 },
    { id: 2, name: 'Bob', age: 30 }
];

// 1. 전체 사용자 목록 조회
app.get('/users', (req, res) => {
    res.json(users);
});

// 2. 특정 사용자 조회
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === Number(req.params.id));
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

// 3. 사용자 생성
app.post('/users', (req, res) => {
    const newUser = { id: Date.now(), ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});

// 4. 사용자 수정 (전체 교체)
app.put('/users/:id', (req, res) => {
    const idx = users.findIndex(u => u.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    users[idx] = { id: Number(req.params.id), ...req.body };
    res.json(users[idx]);
});

// 5. 사용자 삭제
app.delete('/users/:id', (req, res) => {
    users = users.filter(u => u.id !== Number(req.params.id));
    res.status(204).send(); // 내용 없는 성공 응답
});

app.listen(3000, () => console.log('RESTful API server on http://localhost:3000'));