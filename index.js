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

app.listen(4500 , ()=> {
    console.log("El servidor funcionando")
})