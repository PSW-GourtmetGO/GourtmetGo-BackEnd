const express = require('express')
const router = express.Router()
const dueñoController = require('../controllers/dueñoController')

router.post('/',dueñoController.activarPlan)
router.put('/',dueñoController.actualizarPaypal)
module.exports= router