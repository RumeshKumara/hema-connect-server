const express = require('express');

const authController = require('../controllers/auth.controller');
const { verifyAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', verifyAuth, authController.me);

module.exports = router;
