const express = require('express')
const router = express.Router()
const platoController = require('../controllers/platoController')

router.post('/',platoController.crearPlato)
router.get('/duenio',platoController.obtenerPlatosDueño)
router.get('/usuario',platoController.obtenerPlatosUsuarios)
router.get('/get',platoController.obtenerPlato)
router.delete('/',platoController.eliminarPlato)
router.put('/',platoController.actualizarPlato)
module.exports= router