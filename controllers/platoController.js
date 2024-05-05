const conexionBD = require('../config/db')
const Plato = require('../models/platos');

exports.crearPlato = async (request, response) => {
    try {
      const { nombre,precio, descripcion,imagen,categoria_id } = request.body;
      const query = 'INSERT INTO platos VALUES (0,?,?,?,?,?,1,1)';
      conexionBD.query(query, [nombre,precio, descripcion,imagen,categoria_id], (err, results) => {
        if (err) {
            console.log(err);
            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: CREAR PLATO');
        } else {
          response.status(200).send('PROCESO REALIZADO DE MANERA EXITOSA: CREAR PLATO');
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: CREAR PLATO');
    }
  };

  
