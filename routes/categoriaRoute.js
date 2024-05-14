const express = require('express')
const router = express.Router()
const categoriaController = require('../controllers/categoriaController')

router.post('/:restaurante',categoriaController.crearCategoria)
router.get('/:id', categoriaController.obtenerCategorias);
router.get('/get', categoriaController.obtenerCategoria);
router.delete('/:id', categoriaController.eliminarCategoria);
router.put('/ver/:id', categoriaController.actualizarEstadoCategoria);
router.put('/:id', categoriaController.actualizarCategoria);
module.exports= router