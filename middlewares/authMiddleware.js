
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');

function authenticateToken(requiredRoles) {
    return (req, res, next) => {
        const token = req?.header('Authorization');

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Missing token' });
        }

        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden: Invalid token' });
            }

            req.user = user;

            if (requiredRoles && !requiredRoles.includes(user.role)) {
                return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            }

            next();
        });
    }
}

module.exports = authenticateToken;
