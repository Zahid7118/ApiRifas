const express = require('express');
const router = express.Router(); //utilizar distintas rutas 
const bcrypt = require('bcrypt'); //seguridad en contraseñas
const validator = require('validatorjs'); //validador de datos
const { UserModel } = require('../models/user');
const jsontoken = require('jsonwebtoken'); //token a generar
//rutas

//registrarse en el sistema
router.post('/register', async(req, res) => {
    //asginar valores
    let {
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        correo,
        telefono,
        password,
        tipo
    } = req.body;

    //validar valores
    const validation = new validator(req.body, {
        nombre: 'required',
        apellidoPaterno: 'required',
        apellidoMaterno: 'required',
        correo: 'required',
        telefono: 'required',
        password: 'required',
        tipo: 'required'
    });

    //comprovar validación
    if (!validation.passes()) {
        const { errors } = validation.errors;
        return res.status(400).json({
            message: errors,
        });
    }

    //buscar si ya existe el correo 
    let user = await UserModel.findOne({ correo });

    //validar si encontro el registro 
    if (user) {
        return res.status(400).json({
            message: 'Este correo ya tiene una cuenta asociada'
        });
    }

    //encriptar la password
    const salt = bcrypt.genSaltSync();
    password = bcrypt.hashSync(password, salt);

    //generar modelo a guardar
    user = await UserModel({
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        correo,
        telefono,
        password,
        tipo
    });

    //guardar registro
    await user.save();

    return res.json({
        message: 'Registrado correctamente',
    })
});

//login
router.post('/login', async(req, res) => {
    const { correo, password } = req.body;
    const validation = new validator(req.body, {
        correo: "required",
        password: "required"
    });

    if (!validation.passes()) {
        const { errors } = validation.errors;
        return res.status(400).json({
            message: errors,
        });
    }

    const user = await UserModel.findOne({ correo });

    //validar si el usuario existe
    if (!user) {
        return res.status(400).json({
            message: 'Unauthorized',
        });
    }

    //validar el password 
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
        return res.status(400).json({
            message: 'Unauthorized',
        });
    }

    //crear token
    const token = jsontoken.sign({
            iss: 'Rifas10 SA de CV',
            id: user.id
        },
        'RiFaS10', {
            expiresIn: 180000
        }
    );

    return res.json({
        token: token,
        nombre: user.nombre,
    });

});


module.exports = router;