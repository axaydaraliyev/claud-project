const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "Token yo'q, ruxsat etilmagan." });
    }

    try {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length).trimLeft();
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token yaroqsiz." });
    }
};

// Role-based ruxsatni tekshirish (RBAC)
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Bu amalni bajarish uchun sizda huquq yo'q." });
        }
        next();
    };
};

module.exports = { protect, authorize };
