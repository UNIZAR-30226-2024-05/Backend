function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        if (req.session.user.role === 'admin') {
            return next();
        } else {
            return res.status(403).json({
                error: 'Forbidden: Solo los administradores tienen acceso a esta página'
            });
        }
    } else {
        return res.status(401).json({
            error: 'Unauthorized'
        });
    }
}
  
module.exports = { isAuthenticated };
