// src/routes/sanityRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sanityController');

router.post('/message', ctrl.postUserMessage);        // POST /api/sanity/message
router.post('/ai', ctrl.postAIMessage);              // POST /api/sanity/ai
router.get('/', ctrl.getSanity);                     // GET  /api/sanity?sessionId=...
router.post('/reality-check', ctrl.postRealityCheck);// POST /api/sanity/reality-check
router.post('/calm-mode', ctrl.postCalmMode);        // POST /api/sanity/calm-mode

module.exports = router;
