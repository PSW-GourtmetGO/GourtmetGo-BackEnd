const express = require('express')
const router = express.Router()
const controller = require('../controllers/generalMovilController')

router.get('/restaurantes',controller.obtenerRestaurantes)
router.post('/restaurantes',controller.obtenerRestaurante)
module.exports= router