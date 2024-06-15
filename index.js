const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Crear Servidor
const app = express();

// Conectar BD
console.log(connectDB);

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
    res.send('Hola mundo');
});

app.use('/api/Web/clientes', require('./routes/loginRoute'));
app.use('/api/Web/categoria', require('./routes/categoriaRoute'));
app.use('/api/Web/plato', require('./routes/platoRoute'));
app.use('/api/Web/empleado', require('./routes/empleadoRoute'));
app.use('/api/Web/restaurante', require('./routes/restauranteRoute'));
app.use('/api/Web/propietario', require('./routes/dueñoRoute'));
app.use('/api/Web/pedidos', require('./routes/pedidosController'));

app.use('/api/Movil/login', require('./routes/loginMovilRoute'));
app.use('/api/Movil/general', require('./routes/generalMovilRoutes'));
app.use('/api/Movil/especifico', require('./routes/especificoMovilRoute'));

app.use('/api/payment', require('./routes/pagosRoute'));

app.listen(4500, () => {
    console.log("El servidor está funcionando en el puerto 4500");
});
