const express = require('express')
const router = express.Router()
const controller = require('../controllers/generalMovilController')

router.get('/restaurantes',controller.obtenerRestaurantes)
router.post('/restaurantes',controller.obtenerRestaurante)
router.get('/platos',controller.obtenerPlatosRestaurantes)
router.post('/platos',controller.obtenerPlatosRestaurantesFiltro)
router.get('/categorias',controller.obtenerCategoriasRestaurantes)
module.exports= router