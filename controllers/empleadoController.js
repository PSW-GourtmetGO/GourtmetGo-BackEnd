const conexionBD = require('../config/db')
const Empleado = require('../models/empleado');
const crypto = require('crypto');

exports.crearEmpleado = async (request, response) => {
    try {
      const {restaurante_id} = request.query;
      const { cedula,nombre,apellido,fecha_Nacimiento,correo,contrasenia,telefono,direccion} = request.body;
      const hash = crypto.createHash('sha256');
      hash.update(contrasenia);
      const contraseniaHash = hash.digest('hex');
      const query = 'INSERT INTO empleados VALUES (0,?,?,?,?,aes_encrypt(?,"emp271"),?,?,?,2,?,1)';
      conexionBD.query(query, [cedula,nombre,apellido,fecha_Nacimiento,correo,contraseniaHash,telefono,direccion,restaurante_id], (err, results) => {
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

exports.obtenerEmpleados = async (request, response) => {
    try {
        const { restaurante_id } = request.query;
        let query = 'SELECT id,cedula,nombre,apellido,fecha_nacimiento,cast(aes_decrypt(correo,"emp271") as char) as correo,contrasenia,telefono,direccion,rol_id,restaurante_id,estado FROM empleados WHERE restaurante_id = ?';

        conexionBD.query(query, [restaurante_id], (err, empleados) => {
            if (err) {
                console.log(err);
                response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER EMPLEADOS');
                return;
            }
            if (empleados.length === 0) {
                response.status(404).send('NO EXISTEN EMPLEADOS');
            } else {
                console.log(empleados);
                response.json(empleados);
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER EMPLEADOS');
    }
};

exports.obtenerEmpleado = async (request, response) => {
  try {
      const { cedula,restaurante } = request.query;

      let query = 'SELECT id,cedula,nombre,apellido,fecha_nacimiento,cast(aes_decrypt(correo,"emp271") as char) as correo,contrasenia,telefono,direccion,rol_id,restaurante_id,estado FROM empleados WHERE restaurante_id = ? AND nombre LIKE ?';
      const cedulaParam = `%${cedula}%`;
      conexionBD.query(query, [restaurante,cedulaParam], (err, empleado) => {
          if (err) {
              console.log(err);
              response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER EMPLEADO');
              return;
          }else {
            response.json(empleado);
          }
      });
  } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER EMPLEADO');
  }
};

exports.eliminarEmpleado = async (request, response) => {
  try {
      const { empleado_id } = request.query; 
      let query = 'DELETE FROM empleados WHERE id = ?'; 

      conexionBD.query(query, [empleado_id], (err, resultado) => {
          if (err) {
              console.log(err);
              response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ELIMINAR EMPLEADO');
              return;
          }
          if (resultado.affectedRows === 0) {
              response.status(404).send('ERROR DURANTE EL PROCEDIMIENTO: NO SE ENCONTRO EL EMPLEADO');
          } else {
              response.status(200).send('EMPLEADO ELIMINADO CORRECTAMENTE');
          }
      });
  } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ELIMINAR EMPLEADO');
  }
};

exports.actualizarEmpleado = async (request, response) => {
  try {
    const { cedula, nombre, apellido, correo, fecha_Nacimiento,telefono, direccion, id } = request.body;
    const query = 'UPDATE empleados SET cedula=?, nombre=?, apellido=?, correo=aes_encrypt(?,"emp271"), telefono=?, direccion=?,fecha_nacimiento = ? WHERE id = ?';
    conexionBD.query(query, [cedula, nombre, apellido, correo, telefono, direccion,fecha_Nacimiento, id], (err, results) => {
      if (err) {
        console.log(err);
        response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTUALIZAR EMPLEADO');
        return;
      }
      if (results.affectedRows === 0) {
        response.status(404).send('NO SE ENCONTRÓ EL EMPLEADO A ACTUALIZAR');
      } else {
        response.status(200).send('EMPLEADO ACTUALIZADO CORRECTAMENTE');
      }
    });
  } catch (error) {
    console.log(error);
    response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTUALIZAR EMPLEADO');
  }
};