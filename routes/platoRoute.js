const express = require('express')
const router = express.Router()
const platoController = require('../controllers/platoController')

router.post('/',platoController.crearPlato)
module.exports= router