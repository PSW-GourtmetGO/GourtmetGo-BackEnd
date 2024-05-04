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
        let query = 'SELECT * FROM categorias WHERE restaurante_id = ? and estado = 1';

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

exports.obtenerCategoria = async (request, response) => {
    try {
        const { categoria_id } = request.query;
        let query = 'SELECT * FROM categorias WHERE id = ? and estado = 1';

        conexionBD.query(query, [categoria_id], (err, categorias) => {
            if (err) {
                console.log(err);
                response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENCIÓN DE CATEGORÍA');
                return;
            }
            if (categorias.length === 0) {
                response.status(404).send('NO EXISTEN LA CATEGORIA');
            } else {
                console.log(categorias);
                response.json(categorias);
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER CATEGORÍA');
    }
};

exports.eliminarCategoria = async (request, response) => {
    try {
        const { categoria_id } = request.query; 
        let query = 'UPDATE categorias SET estado = 0 WHERE id = ?'; 

        conexionBD.query(query, [categoria_id], (err, resultado) => {
            if (err) {
                console.log(err);
                response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ELIMINACIÓN DE CATEGORÍA');
                return;
            }
            if (resultado.affectedRows === 0) {
                response.status(404).send('NO SE ENCONTRÓ LA CATEGORÍA A ELIMINAR');
            } else {
                response.status(200).send('CATEGORÍA ELIMINADA CORRECTAMENTE');
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ELIMINAR CATEGORÍA');
    }
};

exports.actualizarCategoria = async (request, response) => {
    try {
      const { nombre,descripcion, categoria_id} = request.body;
      const query = 'UPDATE categorias set nombre=?,descripcion=? WHERE id = ?';
      conexionBD.query(query, [nombre,descripcion, categoria_id], (err, results) => {
        if (err) {
            console.log(err);
            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTUALIZACIÓN DE CATEGORÍA');
            return;
        }
        if (results.affectedRows === 0) {
            response.status(404).send('NO SE ENCONTRÓ LA CATEGORÍA A ACTUALIZAR');
        } else {
            response.status(200).send('CATEGORÍA ACTUALIZADA CORRECTAMENTE');
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTUALIZAR CATEGORIA');
    }
  };
