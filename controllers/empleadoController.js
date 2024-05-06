const conexionBD = require('../config/db')
const Empleado = require('../models/empleado');
const crypto = require('crypto');

exports.crearEmpleado = async (request, response) => {
    try {
      const { cedula,nombre,apellido,correo,contrasenia,telefono,direccion,restaurante_id} = request.body;
      const hash = crypto.createHash('sha256');
      hash.update(contrasenia);
      const contraseniaHash = hash.digest('hex');
      const query = 'INSERT INTO empleados VALUES (0,?,?,?,?,?,?,?,2,?,1)';
      conexionBD.query(query, [cedula,nombre,apellido,correo,contraseniaHash,telefono,direccion,restaurante_id], (err, results) => {
        if (err) {
            console.log(err);
            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: EMPLEADO DUPLICADO');
        } else {
          const empleadoId = results.insertId;
          response.json(empleadoId);
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: CREAR EMPLEADO');
    }
  };