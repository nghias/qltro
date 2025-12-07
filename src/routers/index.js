const adminRouter = require('./admin');
const userRouter = require('./user');
const loginRouter = require('./login');

function route(app){
    app.use((req, res, next) => {
        // Ngăn chặn site bị load trong iframe, trừ khi iframe đó thuộc cùng domain
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        
        // Tăng cường bảo mật thêm bằng Content-Security-Policy (CSP)
        // Dòng này chỉ cho phép nhúng frame từ chính domain hiện tại ('self')
        res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
        
        next();
    });
    app.use('/admin', adminRouter);
    app.use('/user', userRouter);
    app.use('/',loginRouter);
    app.use((req, res)=>{
        res.status(404).render('layouts/error',{
            layout: 'error',
            title: '404 - Not Found',
            message: 'Không tìm thấy trang này.'
        });
    });
}

module.exports = route