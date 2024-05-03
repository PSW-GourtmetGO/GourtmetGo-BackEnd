const express = require('express')
const router = express.Router()
const clienteController = require('../controllers/loginController')

router.post('/login',clienteController.buscarLogeo)
module.exports= router