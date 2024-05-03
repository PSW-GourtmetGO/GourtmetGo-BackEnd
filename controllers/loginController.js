const conexionBD = require('../config/db')
const Dueño = require('../models/dueño');
const Empleado = require('../models/empleado');

const crypto = require('crypto');

exports.buscarLogeo = async (request, response) => {
    try {
      const { correo, contrasenia } = request.body;
      const query = 'SELECT * FROM dueños WHERE correo = ? AND contrasenia = ?';
      
      const hash = crypto.createHash('sha256');
      hash.update(contrasenia);
      const contraseniaHash = hash.digest('hex');

      conexionBD.query(query, [correo, contraseniaHash], (err, results) => {
        if (err) {
            console.log(err);
            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: BUSCAR CLIENTE');
        } else if (results.length === 0) {
            const query = 'SELECT * FROM empleados WHERE correo = ? AND contrasenia = ?';
            conexionBD.query(query, [correo, contraseniaHash], (err, results) => {
                if (err) {
                    console.log(err);
                    response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: BUSCAR CLIENTE');
                } else if (results.length === 0) {
                    response.status(404).send('ERROR DURANTE EL PROCEDIMIENTO: EL EMPLEADO O DUEÑO NO SE ENCUENTRA REGISTRADO');                    
                } else {
                  const clienteData = results[0];
                  const cliente = new Empleado(clienteData.id, clienteData.cedula, clienteData.nombre, clienteData.apellido, clienteData.correo, clienteData.contrasenia, clienteData.telefono, clienteData.direccion, clienteData.rol_id, clienteData.estado);
                  response.json(cliente);
                }
              });
        } else {
          const clienteData = results[0];
          const cliente = new Dueño(clienteData.id, clienteData.cedula, clienteData.nombre, clienteData.apellido, clienteData.correo, clienteData.contrasenia, clienteData.telefono, clienteData.direccion, clienteData.rol_id, clienteData.estado);
          response.json(cliente);
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: BUSCAR CLIENTE');
    }
  };
