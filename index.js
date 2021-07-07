require('dotenv').config(); //llamam a las variables de entorno
const express = require('express'); //instancia exprees
const helmet = require('helmet'); //instancia helmet ayuda a la seguridad de la API
const APP_PORT = process.env.PORT || 3000; //puerto donde correra express
const mongoose = require('mongoose'); //instancia moongoose
const MONGO_URI = process.env.MONGO_URI; //url de la DB  de mongoose
const app = express(); //inicia express
const auth = require('./middleware/authentication');

app.use(helmet()); //uso de helmet para la seguridad de la API

//verificar la conexión a mongoDB
const conectionMongoDB = () => {
    return mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

//establecer json para la API
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ruta de prueba
app.get('/inicio', (req, res) => {
    return res.json({
        message: "Bienvenido"
    })
});

//rutas
app.use('/auth', require('./handlers/auth'));
app.use('/rifas', auth, require('./handlers/rifa'));
app.use('/boletos', auth, require('./handlers/boleto'));
//probar la conexion a mongoDB e iniciar el puerto 
conectionMongoDB().then(() => {
    app.listen(APP_PORT, () => {
        console.log(`Corriendo en el puerto ${APP_PORT}`);
    });
});