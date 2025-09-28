const express = require('express');
const router = express.Router();

// 상품 목록
router.get('/', (req, res) => {
    res.send('상품 목록');
});

// 상품 등록
router.post('/', (req, res) => {
    res.send('상품 등록 완료');
});

module.exports = router;