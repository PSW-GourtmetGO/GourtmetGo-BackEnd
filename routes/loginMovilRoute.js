const express = require('express')
const router = express.Router()
const clienteController = require('../controllers/loginMovilController')

router.post('/register',clienteController.crearCliente)
router.post('/login',clienteController.buscarLogeo)
router.post('/olvido',clienteController.enviarContraseña)
module.exports= router