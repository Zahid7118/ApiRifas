const express = require('express');
const { BoletoModelo } = require('../models/boleto');
const validator = require('validatorjs');
const router = express.Router();
const permissions = require('../middleware/permissions');
const mongoose = require('mongoose');

router.get('/:id', permissions('organizador', 'participante'), async(req, res) => {
    const { id } = req.params;
    const boletos = await BoletoModelo.count({ idRifa: id }, async(err, count) => {
        if (count == 0) {
            return res.status(400).json({
                message: 'No se encontraton boletos'
            });
        }
        const listaBoletos = await BoletoModelo.find({ idRifa: id });
        return res.json({
            results: listaBoletos,
        });
    });


});

router.post('/sell', permissions('participante', 'organizador'), async(req, res) => {
    try {
        const validation = new validator(req.body, {
            idRifa: 'required',
            numero_boleto: 'required',
            fecha_compra: 'required',
            numero_transaccion: 'required',
            ganador: 'required',
            idUser: 'required'
        });

        if (!validation.passes()) {
            const { errors } = validation.errors;
            return res.status(400).json({
                message: errors,
            });
        }

        let {
            idRifa,
            numero_boleto,
            fecha_compra,
            numero_transaccion,
            ganador,
            idUser
        } = req.body;

        idRifa = mongoose.Types.ObjectId(idRifa);
        const idUsuario = mongoose.Types.ObjectId(idUser);
        const boleto = new BoletoModelo({
            idRifa,
            numero_boleto,
            fecha_compra,
            numero_transaccion,
            ganador,
            idUsuario
        });

        await boleto.save();
        return res.json({ message: 'Boleto registrado correctamente' });


    } catch (e) {
        return res.status(400).json({ message: ' Error al guardar' });
    }
});

module.exports = router;