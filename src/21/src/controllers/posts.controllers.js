// src/controllers/posts.controller.js
import { run, get, all } from '../db.js';

export const list = async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '10', 10)));
    const offset = (page - 1) * limit;

    const items = await all(
        'SELECT * FROM posts ORDER BY id DESC LIMIT ? OFFSET ?',
        [limit, offset]
    );
    const totalRow = await get('SELECT COUNT(*) AS cnt FROM posts');
    res.json({ page, limit, total: totalRow.cnt, items });
};

export const detail = async (req, res) => {
    const row = await get('SELECT * FROM posts WHERE id=?', [req.params.id]);
    if (!row) {
        const err = new Error('Not Found');
        err.status = 404;
        throw err;
    }
    res.json(row);
};

export const create = async (req, res) => {
    const { title, content, author } = req.body;
    const r = await run(
        'INSERT INTO posts (title, content, author) VALUES (?,?,?)',
        [title, content, author || 'Anonymous']
    );
    const created = await get('SELECT * FROM posts WHERE id=?', [r.lastID]);
    res.status(201).json(created);
};

export const update = async (req, res) => {
    const { title, content, author } = req.body;
    const r = await run(
        'UPDATE posts SET title=?, content=?, author=? WHERE id=?',
        [title, content, author || 'Anonymous', req.params.id]
    );
    if (r.changes === 0) {
        const err = new Error('Not Found');
        err.status = 404;
        throw err;
    }
    const updated = await get('SELECT * FROM posts WHERE id=?', [req.params.id]);
    res.json(updated);
};

export const remove = async (req, res) => {
    const r = await run('DELETE FROM posts WHERE id=?', [req.params.id]);
    if (r.changes === 0) {
        const err = new Error('Not Found');
        err.status = 404;
        throw err;
    }
    res.status(204).send();
};
