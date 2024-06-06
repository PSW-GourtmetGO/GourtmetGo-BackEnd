const express = require('express')
const router = express.Router()
const controller = require('../controllers/especificoMovilController')

router.post('/carrito',controller.agregarPlatoCarrito)
router.get('/carrito',controller.obtenerPedidoCarrito)
router.put('/carrito',controller.actualizarPedidoCarrito)
router.put('/carritoDel',controller.eliminarPedidoCarrito)

module.exports= router