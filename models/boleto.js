const mongoose = require('mongoose');
const schema = mongoose.Schema;

const boletoSchema = new schema({
    idRifa: { type: schema.ObjectId, ref: 'rifas' },
    numero_boleto: Number,
    fecha_compra: String,
    numero_transaccion: Number,
    ganador: String,
    idUsuario: { type: schema.ObjectId, ref: 'users' }
}, {
    timestamps: true,
});

const BoletoModelo = new mongoose.model('Boleto', boletoSchema);

module.exports = {
    boletoSchema,
    BoletoModelo
}