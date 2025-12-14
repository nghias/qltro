const NguoiDung = require('../models/NguoiDung');
const bcrypt = require('../config/hash');
const deleteImage = require('../controllers/DeletePic');
class LoginContrroller{
    index(req, res) {
        // 1. Hủy session lưu trên server
        req.session.destroy((err) => {
            if (err) {
                return res.render('layouts/login', {layout: 'login'});
            }else{
                res.clearCookie('connect.sid'); 
                return res.render('layouts/login', {layout: 'login'});
            }
        });  
    }
    async login(req, res){
        try{
            const btnLogin = req.body?.btnLogin || 0;
            if(btnLogin){
                const { username, password } = req.body;
                const userFound = await NguoiDung.getPasByUsername(username);
                const isMatch = await bcrypt.compare(password,userFound.MatKhau);

                if (userFound == null) {
                    return res.render('layouts/login', { 
                        isTrue: true,
                        layout: 'login',
                        UserName: username,
                        PassWord: password
                    });
                }else if (!isMatch) {
                    return res.render('layouts/login', { 
                        isTrue: true,
                        layout: 'login',
                        UserName: username,
                        PassWord: password
                    });
                }else{
                    const user = await NguoiDung.getByUsernameID(username, userFound.MaND);

                    req.session.user = { 
                        info: {
                            MaND: user.MaND,
                            HoTen: user.HoTen,
                            CCCD: user.CCCD,
                            NamSinh: user.NamSinh,
                            SDT: user.SDT,
                            ThuongTru: user.ThuongTru,
                            TenTK: user.TenTK,
                            MatKhau :user.MatKhau,
                            AVT: user.AVT
                        },
                        role: user.Quyen 
                    };
                    req.session.save(()=>{
                        return res.redirect('/'+req.session.user.role);
                    })
                }
            }else{
                return res.render('layouts/login', {layout: 'login'});
            }
        }catch(err){
            res.status(500).json({ error: 'Lỗi đăng nhập' });
        }
    }
    async accupdate(req, res){
        try {
            const id = req.params.id;
            const curUser = req.session.user.info;
            let tenFileAnh = req.file ? req.file.filename : req.body.HinhNDCu;
            const data = {
                HoTen: req.body.HoTenND,
                CCCD: req.body.CMNDND,
                NamSinh: req.body.NamSinhND,
                SDT: req.body.SDTND,
                ThuongTru: req.body.ThuongTruND,
                AVT: tenFileAnh
            };
            
            console.log(data)
            
            const existSDT = await NguoiDung.checkExist('SDT', req.body.SDTND);
            const existCMND = await NguoiDung.checkExist('CCCD', req.body.CMNDND);
            if (existSDT != null && existSDT != id) {
                return res.redirect('/'+req.session.user.role+'?status=sdtfail');
            }else if (existCMND != null && existCMND != id) {
                return res.redirect('/'+req.session.user.role+'?status=cmndfail');
            }else{
                req.session.user = { 
                    info: {
                        ...curUser,
                        HoTen: data.HoTen,
                        CCCD: data.CCCD,
                        NamSinh: data.NamSinh,
                        SDT: data.SDT,
                        ThuongTru: data.ThuongTru,
                        AVT: data.AVT
                    },
                    role: req.session.user.role 
                };

                if(req.file && req.body.HinhNDCu != 'logo.png'){
                    deleteImage(req.body.HinhNDCu);
                }

                await NguoiDung.updatefull(id, data);
                req.session.save(()=>{
                    return res.redirect('/'+req.session.user.role+'?status=sua');
                })
            }
        } catch (error) {
            res.status(500).json({ error: 'Lỗi cập nhật thông tin' });
        }
    }
    async getAccupdate(req, res) {
        try {
            const id = req.params.id;
            const user = await NguoiDung.getById(id);
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async mkupdate(req, res){
        try {
            const btnLuuCMK = req.body?.btnLuuCMK || 0;
            if(btnLuuCMK){

                const data = {
                    MatKhauCu: req.body.MKC,
                    MatKhauMoi: await bcrypt.hash(req.body.MKM)
                }

                await NguoiDung.updatepass(req.body.MaNDCMK, data);
                return res.redirect('/');
            }
        } catch (error) {
            res.status(500).json({ error: 'Lỗi cập nhật mật khẩu' });
        }
    }
}
module.exports = new LoginContrroller