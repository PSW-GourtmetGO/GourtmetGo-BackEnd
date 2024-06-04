const conexionBD = require('../config/db')

exports.obtenerRestaurantes = async (request, response) => {
    try {
        let query = 'SELECT r.* FROM restaurantes r, dueños d WHERE r.id = d.restaurante_id AND d.planDueño_id is not null';

        conexionBD.query(query, (err, restaurantes) => {
            if (err) {
                console.log(err);
                response.status(500).json({ success: false, message: 'PROCESO FALLIDO RESTAURANTES' });
            }else {
                response.status(200).json({ success: true, message: 'PROCESO EXITOSO RESTAURANTES',restaurantes });
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: 'PROCESO FALLIDO RESTAURANTES' });
    }
};

exports.obtenerRestaurante = async (request, response) => {
    try {
        const {nombre} = request.body
        const nombreParam = `%${nombre}%`;
        let query = 'SELECT r.* FROM restaurantes r, dueños d WHERE r.id = d.restaurante_id AND d.planDueño_id is not null AND r.nombre LIKE ?';

        conexionBD.query(query, [nombreParam] , (err, restaurantes) => {
            if (err) {
                console.log(err);
                response.status(500).json({ success: false, message: 'PROCESO FALLIDO RESTAURANTES' });
            }else {
                response.status(200).json({ success: true, message: 'PROCESO EXITOSO RESTAURANTES',restaurantes });
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: 'PROCESO FALLIDO RESTAURANTES' });
    }
};

exports.obtenerPlatosRestaurantes = async (request, response) => {
    try {
        const {restaurante} = request.query
        let query = 'SELECT s.* FROM platos s, categorias c WHERE s.categoria_id=c.id AND c.restaurante_id=? AND c.eliminado="false" AND c.ver="true" AND s.eliminado ="false" AND s.ver="true"';

        conexionBD.query(query, [restaurante],(err, restaurantes) => {
            if (err) {
                console.log(err);
                response.status(500).json({ success: false, message: 'PROCESO FALLIDO PLATOS' });
            }else {
                response.status(200).json({ success: true, message: 'PROCESO EXITOSO PLATOS',restaurantes });
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: 'PROCESO FALLIDO PLATOS' });
    }
};

exports.obtenerPlatosRestaurantesFiltro = async (request, response) => {
    try {
        const {restaurante,plato} = request.body
        const nombrePlato = `%${plato}%`;
        let query = 'SELECT s.* FROM platos s, categorias c WHERE s.categoria_id=c.id AND c.restaurante_id=? AND c.eliminado="false" AND c.ver="true" AND s.eliminado ="false" AND s.ver="true" AND s.nombre LIKE ?';

        conexionBD.query(query, [restaurante,nombrePlato],(err, restaurantes) => {
            if (err) {
                console.log(err);
                response.status(500).json({ success: false, message: 'PROCESO FALLIDO PLATOS FILTRO' });
            }else {
                response.status(200).json({ success: true, message: 'PROCESO EXITOSO PLATOS FILTRO',restaurantes });
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: 'PROCESO FALLIDO PLATOS FILTRO' });
    }
};

exports.obtenerCategoriasRestaurantes = async (request, response) => {
    try {
        const {restaurante} = request.query
        let query = 'SELECT * FROM categorias WHERE restaurante_id=? AND eliminado="false" AND ver="true"';

        conexionBD.query(query, [restaurante],(err, restaurantes) => {
            if (err) {
                console.log(err);
                response.status(500).json({ success: false, message: 'PROCESO FALLIDO CATEGORIAS' });
            }else {
                response.status(200).json({ success: true, message: 'PROCESO EXITOSO CATEGORIAS',restaurantes });
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: 'PROCESO FALLIDO CATEGORIAS' });
    }
};