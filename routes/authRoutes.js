const express = require('express');
const router = express.Router();
const { 
    loginAdmin, 
    registerAdmin, 
    verifyToken, 
    changePassword 
} = require('../controllers/authController');
const { requireAdmin } = require('../middleware/auth');

router.post('/login', loginAdmin);
router.post('/register', registerAdmin);

router.get('/verify', requireAdmin, verifyToken);
router.put('/change-password', requireAdmin, changePassword);

module.exports = router;
