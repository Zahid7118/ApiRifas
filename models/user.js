const mongoose = require('mongoose'); //instanciar a monggose
const schema = mongoose.Schema; //instanciar un schema

const userSchema = new schema({
    nombre: String,
    apellidoPaterno: String,
    apellidoMaterno: String,
    correo: {
        type: String,
        inndex: {
            unique: true
        }
    },
    telefono: String,
    password: String,
    tipo: String
}, {
    timestamps: true,
});

const UserModel = new mongoose.model('User', userSchema);

module.exports = {
    userSchema,
    UserModel
}