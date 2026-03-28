export const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Необхідна авторизація. Будь ласка, увійдіть в систему.' });
    }
    next();
};

export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.status(401).json({ message: 'Необхідна авторизація.' });
        }
        
        if (!roles.includes(req.session.user.role)) {
            return res.status(403).json({ 
                message: `Доступ заборонено. Ваша роль: ${req.session.user.role}. Потрібна одна з ролей: ${roles.join(', ')}` 
            });
        }
        next();
    };
};