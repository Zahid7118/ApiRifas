const express = require('express');
const { RifaModel } = require('../models/rifa');
const validator = require('validatorjs');
const router = express.Router();
const permissions = require('../middleware/permissions');

//obtener rifas
router.get('/', permissions('participante', 'organizador'), async(req, res) => {
    const rifas = await RifaModel.find();
    return res.json({
        results: rifas,
    });
});

router.get('/:id', permissions('participante', 'organizador'), async(req, res) => {
    const rifas = await RifaModel.findOne({ id: req.id });
    return res.json({
        results: rifas,
    });
});

router.post('/register', permissions('organizador'), async(req, res) => {
    try {
        const validation = new validator(req.body, {
            nombre: 'required',
            premio: 'required',
            lugar: 'required',
            fecha: 'required',
            hora: 'required',
            boletos: 'required',
            precio: 'required',
            descripcion: 'required'
        });

        if (!validation.passes()) {
            const { errors } = validation.errors;
            return res.status(400).json({
                message: errors,
            });
        }

        const {
            nombre,
            premio,
            lugar,
            fecha,
            hora,
            boletos,
            precio,
            descripcion
        } = req.body;

        const rifa = new RifaModel({
            nombre,
            premio,
            lugar,
            fecha,
            hora,
            boletos,
            precio,
            descripcion
        });
        await rifa.save();
        return res.json({ message: 'Rifa registrada correctamente' });
    } catch (e) {
        return res.status(400).json({ message: ' Error al guardar' });
    }
});

//actualizar rifa 
router.put('/update/:id', permissions('organizador'), async(req, res) => {
    const { id } = req.params;

    const validation = new validator(req.body, {
        lugar: 'required',
        fecha: 'required',
        hora: 'required',
        precio: 'required',
        descripcion: 'required'
    });

    if (!validation.passes()) {
        const { errors } = validation.errors;
        return res.status(400).json({ message: errors });
    }

    const rifa = await RifaModel.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({
        result: rifa,
    });
});

//eliminar rifa 
router.delete('/delete/:id', permissions('organizador'), async(req, res) => {
    const { id } = req.params;
    await RifaModel.findByIdAndDelete(id);
    return res.json({ message: 'Rifa eliminada' });
});

module.exports = router;