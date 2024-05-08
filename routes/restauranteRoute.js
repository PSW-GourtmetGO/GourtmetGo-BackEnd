const express = require('express')
const router = express.Router()
const restauranteController = require('../controllers/restauranteController')

router.put('/',restauranteController.actualizarRestaurante)
module.exports= router