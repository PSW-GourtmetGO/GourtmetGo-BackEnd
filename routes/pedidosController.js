const express = require('express')
const router = express.Router()
const pedidosController = require('../controllers/pedidosController')

router.get('/:restaurante',pedidosController.obtenerPedidos)
router.get('/',pedidosController.obtenerPedidosCodigo)
router.get('/buscar/pedido',pedidosController.obtenerPedidosFiltro)
router.get('/detalle/:pedido',pedidosController.obtenerDetallePedidos)
router.put('/',pedidosController.actualizarEstadoPedido)
module.exports= router