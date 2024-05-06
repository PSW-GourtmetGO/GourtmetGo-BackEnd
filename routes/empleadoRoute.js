const express = require('express')
const router = express.Router()
const empleadoController = require('../controllers/empleadoController')

router.post('/',empleadoController.crearEmpleado)
router.get('/',empleadoController.obtenerEmpleados)
router.get('/get',empleadoController.obtenerEmpleado)
module.exports= router