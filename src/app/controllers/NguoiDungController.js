const deleteImage = require('../controllers/DeletePic');
const NguoiDung = require('../models/NguoiDung');

class NguoiDungController{
    async nguoiDung(req, res) {
        const search = req.query.searchND || "";
        let dsNguoiDung;
        if (search.trim() === "") {
            dsNguoiDung = await NguoiDung.getAll();
        }else {
            dsNguoiDung = await NguoiDung.findByKeyword(search);
        }

        if (!dsNguoiDung || dsNguoiDung.length === 0) {
            return res.render("pages/admin/nguoiDung", { empty: true });
        }
        res.render('pages/admin/nguoiDung', {
            dsNguoiDung,   // Danh sách phòng gửi cho view
            search            // Để giữ lại chữ trong ô tìm kiếm
        });
    }
    async layThongTinNguoiDung(req, res) {
        try {
            const id = req.params.id;
            const user = await NguoiDung.getById(id);
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async themNguoiDung(req, res){
        try {
            let tenFileAnh = req.file ? req.file.filename : "logo.png";
            const data = {
                HoTen: req.body.HoTenND,
                CCCD: req.body.CMNDND,
                NamSinh: req.body.NamSinhND,
                SDT: req.body.SDTND,
                ThuongTru: req.body.ThuongTruND,
                TenTK: req.body.SDTND,
                MatKhau: '00000000',
                Quyen: req.body.QuyenND || 'user',
                AVT: tenFileAnh
            }
            const existSDT = await NguoiDung.checkExist('SDT', req.body.SDTND);
            const existCMND = await NguoiDung.checkExist('CCCD', req.body.CMNDND);
            if (existSDT) {
                return res.redirect('/admin/nguoiDung?status=sdtfail');
            }
            if (existCMND) {
                return res.redirect('/admin/nguoiDung?status=cmndfail');
            }
            
            const newND = await NguoiDung.create(data);
            
            return res.redirect('/admin/nguoiDung?status=themsua&highlight='+newND.MaND);
        } catch (error) {
            res.status(500).redirect('/admin/nguoiDung?status=fail');
        }
    }
    async suaNguoiDung(req, res) {
        try {
            const id = req.params.id;
            let tenFileAnh = req.file ? req.file.filename : req.body.HinhNDCu;
            const data = {
                HoTen: req.body.HoTenND,
                CCCD: req.body.CMNDND,
                NamSinh: req.body.NamSinhND,
                SDT: req.body.SDTND,
                ThuongTru: req.body.ThuongTruND,
                Quyen: req.body.QuyenND,
                AVT: tenFileAnh
            }
            const existSDT = await NguoiDung.checkExist('SDT', req.body.SDTND);
            const existCMND = await NguoiDung.checkExist('CCCD', req.body.CMNDND);
            if (existSDT != null && existSDT != id) {
                return res.redirect('/admin/nguoiDung?status=sdtfail');
            }
            if (existCMND != null && existCMND != id) {
                return res.redirect('/admin/nguoiDung?status=cmndfail');
            }
            if(req.file && req.body.HinhNDCu != 'logo.png'){
                deleteImage(req.body.HinhNDCu);
            }

            await NguoiDung.update(id, data);
            return res.redirect('/admin/nguoiDung?status=sua&highlight='+id);
        } catch (error) {
            res.status(500).redirect('/admin/nguoiDung?status=fail');
        }
    }
    async DatLaiMK(req, res) {
        try {
            const id = req.params.id;
            
            await NguoiDung.resetpass(id);
            return res.redirect('/admin/nguoiDung?status=resetpass');
        } catch (error) {
            res.status(500).redirect('/admin/nguoiDung?status=fail');
        }
    }
    async xoaNguoiDung(req, res){
        try {
            const id = req.params.id;
            const HinhCu = req.body.HinhNDXoa;
            
            if(HinhCu!='logo.png') deleteImage(HinhCu);

            await NguoiDung.delete(id);

            return res.redirect('/admin/nguoiDung?status=xoa');
        } catch (error) {
            res.status(500).redirect('/admin/nguoiDung?status=fail');
        }
    }
}
module.exports = new NguoiDungController