// controllers/userController.js
exports.getUsers = (req, res) => {
    res.json([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
};

exports.createUser = (req, res) => {
    const { name } = req.body;
    res.status(201).json({ message: `사용자 ${name} 생성 완료` });
};