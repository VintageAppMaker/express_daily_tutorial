// src/routes/posts.js
import { Router } from 'express';
import * as C from '../controllers/posts.controllers.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import { requireFields } from '../middlewares/validate.js';

const router = Router();

// /api/posts
router.get('/', asyncHandler(C.list));
router.get('/:id', asyncHandler(C.detail));
router.post('/', requireFields(['title', 'content']), asyncHandler(C.create));
router.put('/:id', requireFields(['title', 'content']), asyncHandler(C.update));
router.delete('/:id', asyncHandler(C.remove));

export default router;
