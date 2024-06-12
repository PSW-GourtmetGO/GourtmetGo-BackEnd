const conexionBD = require('../config/db')
const Plato = require('../models/platos');

exports.crearPlato = async (request, response) => {
    try {
      const {categoria} = request.params;
      const { nombre,precio, imagen, ver} = request.body;
      const query = 'INSERT INTO platos VALUES (0,?,?,?,"false",?,?)';
      conexionBD.query(query, [nombre,precio, imagen,ver,categoria], (err, results) => {
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

exports.obtenerPlatosDueñoCategoria = async (request, response) => {
    try {
        const { categoria } = request.params;
        let query = 'SELECT p.*,c.nombre categoria_nombre,c.id categoria_id FROM platos p,categorias c,restaurantes s WHERE c.restaurante_id = s.id AND p.categoria_id = c.id AND c.id = ? AND p.eliminado = "false" AND c.eliminado = "false"';

        conexionBD.query(query, [categoria], (err, platos) => {
            if (err) {
                console.log(err);
                response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENCION DE PLATOS');
                return;
            }
            else {
                console.log(platos);
                response.json(platos);
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENCION DE PLATOS');
    }
};

exports.obtenerPlatosDueñoTodos = async (request, response) => {
    try {
        const { restaurante } = request.params;
        let query = 'SELECT p.*,c.nombre categoria_nombre,c.id categoria_id FROM platos p,categorias c,restaurantes s WHERE c.restaurante_id = s.id AND p.categoria_id = c.id AND c.restaurante_id=? AND p.eliminado = "false" AND c.eliminado = "false"';

        conexionBD.query(query, [restaurante], (err, platos) => {
            if (err) {
                console.log(err);
                response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENCION DE PLATOS');
                return;
            }
            if (platos.length === 0) {
                response.status(404).send('NO EXISTEN PLATOS');
            } else {
                console.log(platos);
                response.json(platos);
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENCION DE PLATOS');
    }
};

exports.obtenerPlatosUsuarios = async (request, response) => {
    try {
        const { restaurante_id } = request.query;
        let query = 'SELECT p.* FROM platos p,categorias c,restaurantes s WHERE p.categoria_id = c.id AND c.restaurante_id = s.id AND s.id=? AND p.eliminado = 1 AND p.estado=1 AND c.estado = 1 ORDER BY c.nombre';

        conexionBD.query(query, [restaurante_id], (err, platos) => {
            if (err) {
                console.log(err);
                response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENCION DE PLATOS');
                return;
            }
            if (platos.length === 0) {
                response.status(404).send('NO EXISTEN PLATOS');
            } else {
                console.log(platos);
                response.json(platos);
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENCION DE PLATOS');
    }
};

exports.obtenerPlato = async (request, response) => {
    try {
        const { plato_id } = request.query;
        let query = 'SELECT * FROM platos WHERE id = ? and eliminado = 1';

        conexionBD.query(query, [plato_id], (err, platos) => {
            if (err) {
                console.log(err);
                response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENCIÓN DE PLATO');
                return;
            }
            if (platos.length === 0) {
                response.status(404).send('NO EXISTEN EL PLATO');
            } else {
                const platoData = platos[0]
                const plato = new Plato(platoData.id,platoData.precio,platoData.descripcion,platoData.imagen,platoData.categoria_id,platoData.estado,platoData.eliminado)
                response.json(plato);
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENER PLATO');
    }
};

exports.eliminarPlato = async (request, response) => {
    try {
        const { plato_id } = request.query; 
        let query = 'UPDATE platos SET eliminado = 0 WHERE id = ?'; 

        conexionBD.query(query, [plato_id], (err, resultado) => {
            if (err) {
                console.log(err);
                response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ELIMINAR PLATO');
                return;
            }
            if (resultado.affectedRows === 0) {
                response.status(404).send('NO SE ENCONTRÓ EL PLATO A ELIMINAR');
            } else {
                response.status(200).send('PLATO ELIMINADO CORRECTAMENTE');
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ELIMINAR PLATO');
    }
};

exports.actualizarPlato = async (request, response) => {
    try {
      const {id} = request.params;
      const { nombre,precio,imagen,categoria,ver} = request.body;
      const query = 'UPDATE platos set nombre=?,precio=?,imagen=?,categoria_id=?,ver=? WHERE id = ?';
      conexionBD.query(query, [nombre,precio,imagen,categoria,ver,id], (err, results) => {
        if (err) {
            console.log(err);
            response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTUALIZAR PLATO');
            return;
        }
        if (results.affectedRows === 0) {
            response.status(404).send('NO SE ENCONTRÓ EL PLATO A ACTUALIZAR');
        } else {
            response.status(200).send('PLATO ACTUALIZADO CORRECTAMENTE');
        }
      });
    } catch (error) {
      console.log(error);
      response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: ACTUALIZAR PLATO');
    }
  };
  
  exports.obtenerPlatoBuscado = async (request, response) => {
    try {
        const { restaurante,plato } = request.query;
        let query = 'SELECT p.*,c.nombre categoria_nombre,c.id categoria_id FROM platos p,categorias c,restaurantes s WHERE c.restaurante_id=s.id AND p.categoria_id = c.id AND c.restaurante_id=? AND p.eliminado = "false" AND c.eliminado = "false" AND p.nombre LIKE ?';
        const platoParam = `%${plato}%`;
        conexionBD.query(query, [restaurante,platoParam], (err, platos) => {
            if (err) {
                console.log(err);
                response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENCION DE PLATOS');
                return;
            }else {
                console.log(platos);
                response.json(platos);
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('ERROR DURANTE EL PROCEDIMIENTO: OBTENCION DE PLATOS');
    }
};

