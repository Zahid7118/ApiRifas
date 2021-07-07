const permissions = (...allowedRoles) => {
    return (req, res, next) => {
        const { user } = req;
        if (user && allowedRoles.includes(user.tipo)) {
            return next();
        }

        return res.status(404).json({ message: 'Sin permisos' });
    }
}

module.exports = permissions;