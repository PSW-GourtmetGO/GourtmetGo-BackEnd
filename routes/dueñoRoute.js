const express = require('express')
const router = express.Router()
const dueñoController = require('../controllers/dueñoController')

router.post('/',dueñoController.activarPlan)
router.put('/paypal/:restaurante',dueñoController.actualizarPaypal)
router.get('/paypal/:restaurante',dueñoController.obtenerPaypal)
router.put('/:idD',dueñoController.actualizarInformacion)
router.get('/:id',dueñoController.obtenerInformacion)
router.get('/estadisticas/:id',dueñoController.obtenerEstadisticas)
module.exports= router