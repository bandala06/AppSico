const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');


router.get('/getAllAdmin', AdminController.getAllAdmin);
router.post('/registerAdmin', AdminController.registerAdmin);
router.post('/loginAdmin', AdminController.loginAdmin);

module.exports = router;