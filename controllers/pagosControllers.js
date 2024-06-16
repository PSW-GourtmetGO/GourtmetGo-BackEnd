require('dotenv').config({ path: 'variables.env' });
const axios = require('axios');
const { query } = require('../config/db');

const paypal = {
    api: process.env.PAYPAL_API
};

exports.createOrder = async (req, res) => {
    try {
        const { restaurante, precio } = req.body;
        console.log(restaurante)

        const queryStr = 'SELECT id,restaurante_id,cast(aes_decrypt(nombre_tienda,"pay92838") as char) AS nombre_tienda,cast(aes_decrypt(secret,"pay92838") as char) AS secret FROM paypal WHERE restaurante_id = ?;';
        const datosPaypal = await query(queryStr, [restaurante]);

        if (datosPaypal.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron datos de PayPal para el restaurante especificado' });
        }

        const { nombre_tienda, secret } = datosPaypal[0];

        console.log(nombre_tienda)
        console.log(secret)

        const order = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: precio.toString()
                    }
                }
            ],
            application_context: {
                brand_name: "GourmetGo",
                landing_page: "NO_PREFERENCE",
                user_action: "PAY_NOW",
                return_url: `http://localhost:4500/api/payment/capture-order/?restaurante=${restaurante}`,
                cancel_url: `http://localhost:4500/api/payment/cancel-order`,
            }
        };

        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");

        const authResponse = await axios.post(`${paypal.api}/v1/oauth2/token`, params, {
            auth: {
                username: nombre_tienda,
                password: secret
            }
        });

        const access_token = authResponse.data.access_token;

        if (!access_token) {
            throw new Error('No se pudo obtener el token de acceso de PayPal');
        }

        const response = await axios.post(`${paypal.api}/v2/checkout/orders`, order, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        return res.json(response.data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al crear la orden de pago', error: error.message });
    }
};

exports.captureOrder = async (req, res) => {
    try {
        const { token, restaurante, id } = req.query;

        console.log('Restaurante ID:', restaurante);
        console.log('Token:', token);
        console.log('Pedido:', id);

        if (!restaurante || !token) {
            return res.status(400).json({ success: false, message: 'Id Restaurante y token son requeridos' });
        }

        const queryPedido = 'UPDATE pedidos SET estado = "Pendiente" WHERE id=?';
        const pedidos = await query(queryPedido, [id]);

        const queryStr = 'SELECT id,restaurante_id,cast(aes_decrypt(nombre_tienda,"pay92838") as char) AS nombre_tienda,cast(aes_decrypt(secret,"pay92838") as char) AS secret FROM paypal WHERE restaurante_id = ?;';
        const datosPaypal = await query(queryStr, [restaurante]);

        if (datosPaypal.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron datos de PayPal para el restaurante especificado' });
        }

        const { nombre_tienda, secret } = datosPaypal[0];
        console.log('Nombre Tienda:', nombre_tienda);
        console.log('Secret:', secret);

        const response = await axios.post(`${paypal.api}/v2/checkout/orders/${token}/capture`, {}, {
            auth: {
                username: nombre_tienda,
                password: secret
            },
        });

        res.redirect('http://localhost:4200/inicio/historial?pedido=exito');
        // res.status(200).json({ success: true, data: response.data });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al capturar la orden de pago', error: error.message });
    }
};

exports.cancelOrder = (req, res) => {
    res.redirect('http://localhost:4200/inicio/carrito');
};
