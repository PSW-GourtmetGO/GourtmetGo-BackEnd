const conexionBD = require('../config/db')
const Dueño = require('../models/dueño');
const Empleado = require('../models/empleado');
const nodemailer = require('nodemailer');

const crypto = require('crypto');

exports.buscarLogeo = async (request, response) => {
    try {
      const { correo, contrasenia } = request.body;
      const query = 'SELECT s.rol_id p_rol, s.restaurante_id r_id, r.nombre r_nombre, s.id p_id, s.planDueño_id plan, r.imagen r_imagen_base64, s.nombre nombreP, s.apellido apellidoP FROM dueños s, restaurantes r WHERE aes_decrypt(correo,"due943") = ? AND contrasenia = ? AND s.restaurante_id = r.id';
      const hash = crypto.createHash('sha256');
      hash.update(contrasenia);
      const contraseniaHash = hash.digest('hex');
      conexionBD.query(query, [correo, contraseniaHash], (err, results) => {
        if (err) {
            console.log(err);
            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: BUSCAR CLIENTE');
        } else if (results.length === 0) {
            const query = 'SELECT e.rol_id p_rol, e.restaurante_id r_id, r.nombre r_nombre, e.id p_id, e.id plan, TO_BASE64(r.imagen) AS r_imagen_base64,e.nombre nombreP,e.apellido apellidoP  FROM empleados e,restaurantes r WHERE e.correo = ? AND e.contrasenia = ? AND r.id = e.restaurante_id';
            conexionBD.query(query, [correo, contraseniaHash], (err, results) => {
                if (err) {
                    console.log(err);
                    response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: BUSCAR CLIENTE');
                } else if (results.length === 0) {
                    response.status(404).send('ERROR DURANTE EL PROCEDIMIENTO: EL EMPLEADO O DUEÑO NO SE ENCUENTRA REGISTRADO');                    
                } else {
                  console.log("algo");
                  console.log(results[0])
                  response.json(results[0]);
                }
              });
        } else {
          const clienteData = results[0];
          response.json(clienteData);
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: BUSCAR CLIENTE');
    }
  };

exports.crearUsuario = async (request, response) => {
    try {
      const { cedula,nombre,apellido,correo, contrasenia,fechaNacimiento,nombreRestaurante,direccion } = request.body;
      const query = 'INSERT INTO restaurantes VALUES(0,?,?,null,1)';
      conexionBD.query(query, [nombreRestaurante,direccion], (err, results) => {
        if (err) {
            console.log(err);
            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: CREAR RESTAURANTE');
        } else {
            const restauranteData = results.insertId;
            const query = 'INSERT INTO dueños VALUES(0,?,?,?,aes_encrypt(?,"due943"),?,?,null,?,1,1)';
            const hash = crypto.createHash('sha256');
            hash.update(contrasenia);
            const contraseniaHash = hash.digest('hex');
            conexionBD.query(query, [cedula,nombre,apellido,correo, contraseniaHash,fechaNacimiento,restauranteData], (err, results) => {
                if (err) {
                    console.log(err);
                    const query = 'DELETE FROM restaurantes Where id = ?';
                    conexionBD.query(query, [restauranteData], (err, results) => {
                        if (err) {
                            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: CREAR DUEÑO');
                        } 
                      });
                }else {
                  const paypal_query = "INSERT INTO paypal VALUES(0,?,null,null)"
                  conexionBD.query(paypal_query, [restauranteData], (err, results) => {
                    if (err) {
                        console.log(err);
                        response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: CREAR PAYPAL');
                    } else {
                      console.log(err);
                      response.status(200).send('PAYPAL CREADO CORRECTAMENTE');
                    }
                  });
                }
              });
          }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: CREAR USUARIO');
    }
  };

  exports.enviarContraseña = async (request, response) => {
    try {
        const { destinatario } = request.body;
        const asunto = 'Recuperacion Clave';
        const query = 'SELECT id FROM dueños WHERE correo = ?';
        conexionBD.query(query, [destinatario], (err, results) => {
            if (err) {
                console.log(err);
                response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: BUSCAR DATOS');
            } else if (results.length === 0) {
              const query = 'SELECT id FROM empleados WHERE correo = ?';
              conexionBD.query(query, [destinatario], (err, results) => {
              if (err) {
                console.log(err);
                response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: BUSCAR DATOS');
              } else if (results.length === 0) {
                response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: NO SE HA ENCONTRADO EL CORREO');                
              } else {
                const query = 'UPDATE empleados set contrasenia = ? WHERE id = ?';
                const contrasenia = generarContraseniaAleatoria(10)
                const hash = crypto.createHash('sha256');
                hash.update(contrasenia);
                const contraseniaHash = hash.digest('hex');
                const id = results[0].id
                console.log(contrasenia)
  
                conexionBD.query(query, [contraseniaHash,id], (err, results) => {
                  if (err) {
                    console.log(err);
                    response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTUALIZAR CONTRASEÑA');
                  } else {
                    const mensaje = `Hola, tu contraseña es: ${contrasenia}. Mensaje enviado por los servicios GourmetGO.`;
                    enviarCorreo(destinatario, asunto, mensaje,response);
                  }
                });
              }
              });                       
            } else {
              const query = 'UPDATE dueños set contrasenia = ? WHERE id = ?';
              const contrasenia = generarContraseniaAleatoria(10)
              const hash = crypto.createHash('sha256');
              hash.update(contrasenia);
              const contraseniaHash = hash.digest('hex');
              const id = results[0].id
              console.log(contrasenia)

              conexionBD.query(query, [contraseniaHash,id], (err, results) => {
                if (err) {
                  console.log(err);
                  response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTUALIZAR CONTRASEÑA');
                } else {
                  const mensaje = `Hola, tu contraseña temporal es: ${contrasenia}. Mensaje enviado por los servicios GourmetGO.`;
                  enviarCorreo(destinatario, asunto, mensaje,response);
                }
              });
            }
          });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

const enviarCorreo= async (destinatario, asunto, mensaje,response) => {
  try {
    //deben crear en su outlook una contrase;a para aplicacion, ahi podran probar
    const correo_empresa = 'silbay4160@uta.edu.ec'
    const clave_empresa = 'wmxhdmwpxdxjbymv'
    let transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: correo_empresa,
        pass: clave_empresa
      }
    });
    console.log(mensaje)
    let info = await transporter.sendMail({
      from: `"GOURMETGO" <${correo_empresa}>`,
      to: destinatario,
      subject: asunto,
      text: mensaje
    });

    response.status(200).send('CORREO ENVIADO DE MANERA EXITOSA');
  } catch (error) {
    response.status(500).send('CORREO FALLIDO');
  }
};

function generarContraseniaAleatoria(longitud) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  let contrasenia = '';
  for (let i = 0; i < longitud; i++) {
    contrasenia += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }

  return contrasenia;
}