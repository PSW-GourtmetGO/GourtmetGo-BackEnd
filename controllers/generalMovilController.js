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
