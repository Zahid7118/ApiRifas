const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user');

const authentication = (req, res, next) => {
    const {
        authorization: token
    } = req.headers;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, 'RiFaS10', async(err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = await UserModel.findById(decoded.id);
        console.log(req.user);
        next();
    });
}

module.exports = authentication;