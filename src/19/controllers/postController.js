exports.getPosts = (req, res) => {
    res.json([{ id: 1, title: 'Hello Express', author: 'Admin' }]);
};