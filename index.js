const express = require('express');
const cors = require('cors')
const connectDB = require('./config/db')
//Crear Servidor
const app = express()

//Conectar bd

console.log(connectDB)

//
app.use(express.json())
app.use(cors())

//rutas

app.get('/',(request,response) =>{
    response.send('hola mundo')
})

app.use('/api/Web/clientes',require('./routes/loginRoute'))
app.use('/api/Web/categoria',require('./routes/categoriaRoute'))
app.use('/api/Web/plato',require('./routes/platoRoute'))
app.use('/api/Web/empleado',require('./routes/empleadoRoute'))
app.use('/api/Web/restaurante',require('./routes/restauranteRoute'))
app.use('/api/Web/propietario',require('./routes/dueñoRoute'))
app.use('/api/Web/pedidos',require('./routes/pedidosController'))

app.listen(4500 , ()=> {
    console.log("El servidor funcionando")
})