const express = require('express')
const router = express.Router()
const empleadoController = require('../controllers/empleadoController')

router.post('/',empleadoController.crearEmpleado)
module.exports= router