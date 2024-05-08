const conexionBD = require('../config/db')

exports.actualizarRestaurante = async (request, response) => {
    try {
      const { restaurante_id, nombre, direccion, imagen} = request.body;
      const query = 'UPDATE restaurantes set nombre=?,direccion=?,imagen=? WHERE id = ?';
      conexionBD.query(query, [nombre, direccion, imagen,restaurante_id], (err, results) => {
        if (err) {
            console.log(err);
            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTUALIZAR RESTAURANTE');
            return;
        }
        if (results.affectedRows === 0) {
            response.status(404).send('NO SE ENCONTRÓ EL RESTAURANTE PARA ACTUALIZAR');
        } else {
            response.status(200).send('RESTAURANTE ACTUALIZADO CORRECTAMENTE');
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTUALIZAR RESTAURANTE');
    }
  };