const express = require('express')
const router = express.Router()
const pedidosController = require('../controllers/pedidosController')

router.get('/',pedidosController.obtenerPedidos)
module.exports= router