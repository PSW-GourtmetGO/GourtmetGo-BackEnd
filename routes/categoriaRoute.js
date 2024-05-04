const express = require('express')
const router = express.Router()
const categoriaController = require('../controllers/categoriaController')

router.post('/',categoriaController.crearCategoria)
router.get('/', categoriaController.obtenerCategorias);
router.get('/get', categoriaController.obtenerCategoria);
router.delete('/', categoriaController.eliminarCategoria);
router.put('/', categoriaController.actualizarCategoria);
module.exports= router