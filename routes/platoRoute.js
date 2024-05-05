const express = require('express')
const router = express.Router()
const platoController = require('../controllers/platoController')

router.post('/',platoController.crearPlato)
router.get('/',platoController.obtenerPlatos)
router.get('/get',platoController.obtenerPlato)
module.exports= router