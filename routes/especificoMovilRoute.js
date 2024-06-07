const express = require('express')
const router = express.Router()
const controller = require('../controllers/especificoMovilController')

router.post('/carrito',controller.agregarPlatoCarrito)
router.get('/carrito',controller.obtenerPedidoCarrito)
router.get('/historial',controller.obtenerPedidosHistorial)
router.get('/especifico',controller.obtenerPedidoEspecifico)
router.get('/pago',controller.obtenerDatosPago)
router.put('/carrito',controller.actualizarPedidoCarrito)
router.put('/carritoDel',controller.eliminarPedidoCarrito)

module.exports= router