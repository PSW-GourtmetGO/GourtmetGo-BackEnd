const express = require('express');
const router = express.Router();
const pagosControllers = require('../controllers/pagosControllers');

router.post('/create-order', pagosControllers.createOrder);
router.get('/capture-order', pagosControllers.captureOrder);
router.get('/cancel-order', pagosControllers.cancelOrder);

module.exports = router;
