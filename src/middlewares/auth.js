function isLogin(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
}

function isAdmin (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/');
    }

    // Nếu không phải admin → cấm vào
    if (req.session.user.role !== 'admin') {
        return res.status(403).render('layouts/error',{
            layout: 'error',
            title: '403 - Forbidden',
            code: 403,
            message: 'Bạn không đủ quyền để xem trang này.'
        });
    }
    next();
};
function isUser (req, res, next) {
        if (!req.session.user) {
        return res.redirect('/');
    }

    // Nếu không phải admin → cấm vào
    if (req.session.user.role !== 'user') {
        return res.status(403).render('layouts/error',{
            layout: 'error',
            title: '403 - Forbidden',
            message: 'Bạn không đủ quyền để xem trang này.'
        });
    }
    next();
};

module.exports = { isLogin, isAdmin, isUser };
