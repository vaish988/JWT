const verifyRole = (requiredRole) => {
    
    return (req, res, next) => {
        if (req.userRole !== requiredRole) {
            return res.status(403).json({ message: 'Access Denied' });
        }
        next();
    };
};

module.exports = verifyRole;
