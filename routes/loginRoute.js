const express = require('express')
const router = express.Router()
const clienteController = require('../controllers/loginController')

router.post('/login',clienteController.buscarLogeo)
router.post('/register',clienteController.crearUsuario)
router.post('/recuperar',clienteController.enviarContraseña)
module.exports= router