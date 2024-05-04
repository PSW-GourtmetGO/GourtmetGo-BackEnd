const conexionBD = require('../config/db')
const Categoria = require('../models/categorias');

exports.crearCategoria = async (request, response) => {
    try {
      const { nombre,descripcion, restaurante_id} = request.body;
      const query = 'INSERT INTO categorias VALUES (0,?,?,?,1)';
      conexionBD.query(query, [nombre,descripcion, restaurante_id], (err, results) => {
        if (err) {
            console.log(err);
            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: CATEGORIA YA CREADA ANTERIORMENTE');
        } else {
          const categoriaId = results.insertId;
          response.json(categoriaId);
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: CREAR CATEGORIA');
    }
  };

  exports.obtenerCategorias = async (request, response) => {
    try {
        const { restaurante_id } = request.query;
        let query = 'SELECT * FROM categorias WHERE restaurante_id = ?';

        conexionBD.query(query, [restaurante_id], (err, categorias) => {
            if (err) {
                console.log(err);
                response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENCIÓN DE CATEGORÍAS');
                return;
            }
            if (categorias.length === 0) {
                response.status(404).send('NO EXISTEN CATEGORIAS');
            } else {
                console.log(categorias);
                response.json(categorias);
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER CATEGORÍAS');
    }
};

