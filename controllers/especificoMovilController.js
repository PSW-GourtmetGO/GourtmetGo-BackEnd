const { promisify } = require('util');
const crypto = require('crypto');
const conexionBD = require('../config/db');

// Promisify the query method
const query = promisify(conexionBD.query).bind(conexionBD);

exports.actualizarPedidoCarrito = async (request, response) => {
    try {
        const { id,cantidad,plato_id,pedido_id} = request.body;

        const precio = await obtenerPrecioPlato(plato_id);
        const queryStr = 'UPDATE pedidodetalle SET cantidad=?, precio =? WHERE id=?';
        const pedidos = await query(queryStr, [cantidad,(cantidad*precio),id]);
        await recalculoCarrito(pedido_id);

        response.status(200).json({ success: true, message: 'PROCESO EXITOSO PEDIDOS', result: pedidos });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: 'PROCESO FALLIDO PEDIDOS' });
    }
};

exports.eliminarPedidoCarrito = async (request, response) => {
    try {
        const { id, pedido_id } = request.body;

        const queryDel = 'DELETE FROM pedidodetalle WHERE id=?';
        await query(queryDel, [id]);

        const querySelect = 'SELECT count(*) AS count FROM pedidodetalle WHERE pedido_id=?';
        const [result] = await query(querySelect, [pedido_id]);
        const count = result.count;

        if (count > 0) {
            await recalculoCarrito(pedido_id);
        } else {
            const queryDel2 = 'DELETE FROM pedidos WHERE id=?';
            await query(queryDel2, [pedido_id]);
        }

        response.status(200).json({ success: true, message: 'PROCESO EXITOSO PEDIDOS' });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: 'PROCESO FALLIDO PEDIDOS' });
    }
};

exports.obtenerPedidoCarrito = async (request, response) => {
    try {
        const { cliente } = request.query;

        const queryStr = 'SELECT p.*,r.nombre nombreRestaurante, r.imagen restauranteImagen FROM pedidos p, restaurantes r WHERE p.cliente_id=? AND p.estado="Carrito" AND r.id=p.restaurante_id';
        const pedidos = await query(queryStr, [cliente]);

        for (const pedido of pedidos) {
            const detalles = await obtenerDetalleCarrito(pedido.id);
            pedido.detalles = detalles;
        }

        response.status(200).json({ success: true, message: 'PROCESO EXITOSO PEDIDOS', result: pedidos });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: 'PROCESO FALLIDO PEDIDOS' });
    }
};

exports.obtenerPedidosHistorial = async (request, response) => {
    try {
        const { cliente } = request.query;

        const queryStr = 'SELECT p.*,r.nombre nombreRestaurante, r.imagen restauranteImagen FROM pedidos p, restaurantes r WHERE p.cliente_id=? AND p.estado != "Carrito" AND r.id=p.restaurante_id';
        const pedidos = await query(queryStr, [cliente]);

        for (const pedido of pedidos) {
            const detalles = await obtenerDetalleCarrito(pedido.id);
            pedido.detalles = detalles;
        }

        response.status(200).json({ success: true, message: 'PROCESO EXITOSO HISTORIAL', result: pedidos });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: 'PROCESO FALLIDO HISTORIAL' });
    }
};

exports.obtenerPedidoEspecifico = async (request, response) => {
    try {
        const { id } = request.query;

        const queryStr = 'SELECT p.*,r.nombre nombreRestaurante, r.imagen restauranteImagen, r.id restauranteId FROM pedidos p, restaurantes r WHERE p.id=? AND r.id=p.restaurante_id';
        const pedidos = await query(queryStr, [id]);

        response.status(200).json({ success: true, message: 'PROCESO EXITOSO HISTORIAL', result: pedidos });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: 'PROCESO FALLIDO HISTORIAL' });
    }
};

exports.obtenerDatosPago = async (request, response) => {
    try {
        const { restaurante } = request.query;
        const queryStr = 'SELECT * FROM paypal WHERE restaurante_id=?';
        const datos = await query(queryStr, [restaurante]);

        if (datos.length === 0) {
            return response.status(404).json({ success: false, message: 'No se encontraron datos de PayPal para el restaurante especificado' });
        }

        response.status(200).json({ success: true, message: 'PROCESO EXITOSO PEDIDOS', result: datos });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: 'PROCESO FALLIDO PEDIDOS' });
    }
};

exports.agregarPlatoCarrito = async (request, response) => {
    try {
        const { restaurante, plato, cliente } = request.body;

        const pedido = await comprobarPedido(restaurante, cliente);
        const precio = await obtenerPrecioPlato(plato);

        if (pedido == null || precio == null) {
            response.status(500).json({ success: false, message: 'PROCESO FALLIDO PEDIDOS' });
            return;
        }

        const queryStr = 'INSERT INTO pedidoDetalle VALUES(0,?,1,?,?,0)';
        const result = await query(queryStr, [plato, precio, pedido]);
        await recalculoCarrito(pedido);
        response.status(200).json({ success: true, message: 'PROCESO EXITOSO PEDIDOS', result });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: 'PROCESO FALLIDO RESTAURANTES' });
    }
};

async function comprobarPedido(restaurante, cliente) {
    try {
        const queryStr = 'SELECT id FROM pedidos WHERE cliente_id = ? AND restaurante_id = ? AND estado = "Carrito"';
        const resultados = await query(queryStr, [cliente, restaurante]);

        if (resultados.length === 0) {
            return await abrirPedido(restaurante, cliente);
        } else {
            return resultados[0].id;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function abrirPedido(restaurante, cliente) {
    try {
        const codigo = generarCodigoAleatorioNoRepetible(10);
        const queryStr = 'INSERT INTO pedidos VALUES(0,?,0,?,?,"Carrito")';
        const result = await query(queryStr, [codigo, cliente, restaurante]);

        return result.insertId;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const codigosGenerados = new Set();

function generarCodigoAleatorioNoRepetible(longitud) {
    let codigo;
    do {
        codigo = crypto.randomBytes(longitud)
            .toString('base64')
            .replace(/[^a-zA-Z0-9]/g, '')
            .slice(0, longitud);
    } while (codigosGenerados.has(codigo));

    codigosGenerados.add(codigo);
    return codigo;
}

async function obtenerPrecioPlato(plato) {
    try {
        const queryStr = 'SELECT precio FROM platos WHERE id = ?';
        const resultados = await query(queryStr, [plato]);

        if (resultados.length === 0) {
            return null;
        } else {
            return resultados[0].precio;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function recalculoCarrito(idPedido) {
    try {
        const querySelect = 'SELECT * FROM pedidodetalle WHERE pedido_id=?';
        const detalles = await query(querySelect, [idPedido]);
        let precio_total=0
        for(const detalle of detalles){
            precio_total= precio_total+detalle.precio
        }
        const queryUpdate = 'UPDATE pedidos SET precio_total = ? WHERE id=?'
        const resultado = await query(queryUpdate, [precio_total,idPedido]);
        return resultado
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function obtenerDetalleCarrito(idPedido) {
    try {
        const queryStr = 'SELECT pd.*,plt.nombre platoNombre,plt.imagen platoImagen FROM pedidodetalle pd, platos plt WHERE pd.pedido_id=? AND plt.id=pd.plato_id';
        const result = await query(queryStr, [idPedido]);
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}