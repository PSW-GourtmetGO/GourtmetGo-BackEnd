const express = require('express')
const router = express.Router()
const platoController = require('../controllers/platoController')

router.post('/:categoria',platoController.crearPlato)
router.get('/duenio/categoria/:categoria',platoController.obtenerPlatosDueñoCategoria)

router.get('/duenio',platoController.obtenerPlatoBuscado)

router.get('/duenio/restaurante/:restaurante',platoController.obtenerPlatosDueñoTodos)
router.get('/usuario',platoController.obtenerPlatosUsuarios)
router.get('/get',platoController.obtenerPlato)
router.delete('/',platoController.eliminarPlato)
router.put('/:id',platoController.actualizarPlato)
module.exports= router