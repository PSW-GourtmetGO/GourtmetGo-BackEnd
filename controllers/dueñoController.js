const conexionBD = require('../config/db')

exports.activarPlan = async (request, response) => {
    try {
      const fecha_inicio = new Date();
      const fecha_fin = new Date(fecha_inicio);
      fecha_fin.setMonth(fecha_fin.getMonth() + 1);
      const { plan_id ,id_propietario} = request.body;
      const query = 'INSERT INTO plandueño VALUES(0,?,?,?,1)';
      conexionBD.query(query, [plan_id , fecha_inicio ,fecha_fin], (err, results) => {
        if (err) {
            console.log(err);
            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTIVAR PLAN');
        }
        else {
            const id_plan_activado = results.insertId;
            const updateQuery = 'UPDATE dueños SET planDueño_id = ? WHERE id= ?';
            conexionBD.query(updateQuery, [id_plan_activado,id_propietario], (err, results) => {
              if (err) {
                  console.log(err);
                  response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTIVAR PLAN');
              }
              else {
                  response.status(200).send('PLAN ACTIVADO');
              }
            });
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTIVAR PLAN');
    }
  };

  exports.actualizarPaypal = async (request, response) => {
    try {
        const{restaurante} = request.params
      const { empresa,token} = request.body;
      const query = 'UPDATE paypal SET nombre_tienda = aes_encrypt(?,"pay92838"), token = aes_encrypt(?,"pay92838") WHERE restaurante_id = ?';
      conexionBD.query(query, [empresa,token,restaurante], (err, results) => {
        if (err) {
            console.log(err);
            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTUALIZAR PAYPAL');
        }
        else {
            response.status(200).send('PAYPAL ACTUALIZADO');
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTUALIZAR PAYPAL');
    }
  };

  exports.obtenerPaypal = async (request, response) => {
    try {
      const{restaurante} = request.params
      const query = 'SELECT id,restaurante_id,cast(aes_decrypt(nombre_tienda,"pay92838") as char) AS nombre_tienda,cast(aes_decrypt(token,"pay92838") as char) AS token FROM paypal WHERE restaurante_id = ?;';
      conexionBD.query(query, [restaurante], (err, results) => {
        if (err) {
            console.log(err);
            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTUALIZAR PAYPAL');
        }
        else {
            response.json(results);
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTUALIZAR PAYPAL');
    }
  };

  exports.obtenerInformacion = async (request, response) => {
    try {
        const { id } = request.params;
        let query = 'SELECT d.cedula cedula_p, d.nombre nombre_p,d.apellido apellido_p,d.fecha_nacimiento fecha_nacimiento_p,d.correo correo_p, r.direccion direccion_r, r.nombre nombre_r,r.imagen imagen_r FROM dueños d, restaurantes r WHERE d.id = ? AND d.restaurante_id = r.id';
  
        conexionBD.query(query, [id], (err, informacion) => {
            if (err) {
                console.log(err);
                response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER INFORMACION');
                return;
            }
            if (informacion.length === 0) {
                response.status(404).send('NO HAY REGISTROS');
            } else {
              response.json(informacion);
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER INFORMACION');
    }
  };

  exports.actualizarInformacion = async (request, response) => {
    try {
        const { cedula,nombre,apellido,fechaNacimiento,correo,direccion,NombreRestaurante,imagen } = request.body;
        const { idD } = request.params
        console.log(nombre)
        let query = 'UPDATE dueños AS d JOIN restaurantes AS r ON d.restaurante_id = r.id SET d.cedula = ?, d.nombre = ?, d.apellido = ?, d.fecha_nacimiento = ?, d.correo = ?, r.direccion = ?, r.nombre = ?, r.imagen = ? WHERE d.id = ?';
  
        conexionBD.query(query, [cedula,nombre,apellido,fechaNacimiento,correo,direccion,NombreRestaurante,imagen,idD], (err, informacion) => {
            if (err) {
                console.log(err);
                response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER INFORMACION');
                return;
            }
            if (informacion.length === 0) {
                response.status(404).send('NO HAY REGISTROS');
            } else {
              response.json(informacion);
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER INFORMACION');
    }
  };


  exports.obtenerEstadisticas = async (request, response) => {
    try {
        const { id } = request.params;
        let estadisticas = {};

        let pedidosQUERY = 'SELECT COUNT(*) AS total_pedidos FROM pedidos WHERE restaurante_id = ? ';
        conexionBD.query(pedidosQUERY, [id], (err, total_pedidos) => {
            if (err) {
                console.log(err);
                response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER ESTADISTICAS');
                return;
            } else {
                estadisticas.total_pedidos = total_pedidos[0].total_pedidos;

                let platosQUERY = 'SELECT COUNT(*) AS total_platos FROM platos p INNER JOIN categorias c ON p.categoria_id = c.id WHERE c.restaurante_id = ? AND p.eliminado = "false" AND c.eliminado = "false"';

                conexionBD.query(platosQUERY, [id], (err, total_platos) => {
                    if (err) {
                        console.log(err);
                        response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER ESTADISTICAS');
                        return;
                    } else {
                        estadisticas.total_platos = total_platos[0].total_platos;

                        let empleadosQUERY = 'SELECT COUNT(*) AS total_empleados FROM empleados WHERE restaurante_id = ?';
                        conexionBD.query(empleadosQUERY, [id], (err, total_empleados) => {
                            if (err) {
                                console.log(err);
                                response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER ESTADISTICAS');
                                return;
                            } else {
                                estadisticas.total_empleados = total_empleados[0].total_empleados;
                                response.json(estadisticas);
                            }
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER INFORMACION');
    }
};
