const express = require('express');
const router = express.Router();

// 사용자 목록
router.get('/', (req, res) => {
    res.send('사용자 목록');
});

// 특정 사용자 조회
router.get('/:id', (req, res) => {
    res.send(`사용자 ID: ${req.params.id}`);
});

module.exports = router;