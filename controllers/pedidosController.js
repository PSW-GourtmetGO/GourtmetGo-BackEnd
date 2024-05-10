const conexionBD = require('../config/db')

exports.obtenerPedidos = async (request, response) => {
    try {
      const { restaurante_id } = request.query;
      const query = 'SELECT * from pedidos WHERE restaurante_id=? AND NOT estado = 0'; // no entregado
      conexionBD.query(query, [restaurante_id], (err, pedidos) => {
        if (err) {
            console.log(err);
            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER PEDIDOS');
            return;
        }
        if (pedidos.length === 0) {
            response.status(404).send('NO EXISTEN PEDIDOS');
        } else {
            response.json(pedidos);
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER PEDIDOS');
    }
  };