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