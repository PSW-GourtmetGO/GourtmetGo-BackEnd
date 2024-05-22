const conexionBD = require('../config/db')
const nodemailer = require('nodemailer');

const crypto = require('crypto');

exports.buscarLogeo = async (request, response) => {
    try {
      const { correo, contrasenia } = request.body;
      const query = 'SELECT * FROM clientes WHERE correo=? AND contrasenia = ?';
      const hash = crypto.createHash('sha256');
      hash.update(contrasenia);
      const contraseniaHash = hash.digest('hex');
      conexionBD.query(query, [correo, contraseniaHash], (err, results) => {
        if (err) {
          response.status(500).json({ success: false, message: 'ERROR DURANTE EL PROCEDIMIENTO: LOGIN' });
        } else if (results.length === 0) {
          response.status(500).json({ success: false, message: 'NO SE ENCONTRO LAS CREDENCIALES' });
        } else {
          const clienteData = results[0];
          response.status(200).json({ success: true, message: 'CLIENTE CREADO DE MANERA EXITOSA',clienteData });
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: BUSCAR CLIENTE');
    }
  };

  exports.crearCliente = async (request, response) => {
    try {
      const { cedula, nombre, apellido, fecha_nacimiento, correo, contrasenia, telefono, direccion } = request.body;
      const hash = crypto.createHash('sha256');
      hash.update(contrasenia);
      const contraseniaHash = hash.digest('hex');
      const query = 'INSERT INTO clientes VALUES(0,?,?,?,?,?,?,?,?,1)';
      conexionBD.query(query, [cedula, nombre, apellido, fecha_nacimiento, correo, contraseniaHash, telefono, direccion], (err, results) => {
        if (err) {
          console.log(err);
          response.status(500).json({ success: false, message: 'ERROR DURANTE EL PROCEDIMIENTO: CREAR CLIENTE' });
        } else {
          response.status(200).json({ success: true, message: 'CLIENTE CREADO DE MANERA EXITOSA' });
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).json({ success: false, message: 'ERROR DURANTE EL PROCEDIMIENTO: CREAR USUARIO' });
    }
  };

  exports.enviarContraseña = async (request, response) => {
    try {
        const { destinatario } = request.body;
        const asunto = 'Recuperacion Clave';
        const query = 'SELECT id FROM clientes WHERE correo = ?';
        conexionBD.query(query, [destinatario], (err, results) => {
            if (err) {
              response.status(500).json({ success: false, message: 'ERROR DURANTE EL PROCEDIMIENTO: ENVIAR CONTRASEÑA' });
            } else if (results.length === 0) {
              response.status(500).json({ success: false, message: 'ERROR DURANTE EL PROCEDIMIENTO: ENVIAR CONTRASEÑA' });
            } else {
              const query = 'UPDATE clientes set contrasenia = ? WHERE id = ?';
              const contrasenia = generarContraseniaAleatoria(10)
              const hash = crypto.createHash('sha256');
              hash.update(contrasenia);
              const contraseniaHash = hash.digest('hex');
              const id = results[0].id

              conexionBD.query(query, [contraseniaHash,id], (err, results) => {
                if (err) {
                  console.log(err);
                  response.status(500).json({ success: false, message: 'ERROR DURANTE EL PROCEDIMIENTO: ACTUALIZAR CONTRASEÑA' });
                } else {
                  const mensaje = `Hola, tu contraseña temporal es: ${contrasenia}. Mensaje enviado por los servicios GourmetGO.`;
                  enviarCorreo(destinatario, asunto, mensaje,response);
                }
              });
            }
          });
    } catch (error) {
      response.status(500).json({ success: false, message: 'ERROR DURANTE EL PROCEDIMIENTO: ENVIAR CONTRASEÑA' });
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

    response.status(200).json({ success: true, message: 'CONTRASEÑA ENVIADA AL CORREO'});
  } catch (error) {
    response.status(500).json({ success: false, message: 'CONTRASEÑA NO ENVIADA AL CORREO'});
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