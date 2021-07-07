const mongoose = require('mongoose');
const schema = mongoose.Schema;

const rifaSchema = new schema({
    nombre: String,
    premio: String,
    lugar: String,
    fecha: String,
    hora: String,
    boletos: Number,
    precio: Number,
    descripcion: String,
}, {
    timestamps: true,
});

const RifaModel = new mongoose.model('Rifa', rifaSchema);

module.exports = {
    rifaSchema,
    RifaModel
}