const deleteImage = require('../controllers/DeletePic');
const Phong = require('../models/Phong');

class PhongTroContrroller{
    async phongTro(req, res) {
        const search = req.query.search || "";
        let dsPhongFirst;
        if (search.trim() === "") {
            dsPhongFirst = await Phong.getAll();
        }else {
            dsPhongFirst = await Phong.findByKeyword(search);
        }

        // danh sách đã thuê
        const dsPhongDaThue = await Phong.getPhongDaThue();

        // Tạo set để kiểm tra nhanh
        const daThueSet = new Set(dsPhongDaThue.map(p => p.MaPhong));

        // Gắn thêm thuộc tính IsRented
        const dsPhong = dsPhongFirst.map(p => ({
            ...p,
            isRented: daThueSet.has(p.MaPhong)
        }));

        if (!dsPhong || dsPhong.length === 0) {
            return res.render("pages/admin/phongTro", { empty: true });
        }
        res.render('pages/admin/phongTro', {
            dsPhong,   // Danh sách phòng gửi cho view
            search            // Để giữ lại chữ trong ô tìm kiếm
        });
    }
    async layThongTinPhong(req, res) {
        try {
            const id = req.params.id;
            const phong = await Phong.getById(id);
            res.json(phong);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async themPhongTro(req, res) {
        let tenFileAnh = req.file ? req.file.filename : "logo.png";
        const data = {
            TenPhong: req.body.TenPhong,
            Gia: req.body.Gia,
            DienTich: req.body.DienTich,
            Hinh: tenFileAnh
        };
        
        const newPhong = await Phong.create(data);
        return res.redirect('/admin/phongTro?status=themp&highlight='+newPhong.MaPhong);
    }
    async suaPhongTro(req, res) {
        const id = req.params.id;
        const Ten = req.body.TenPhong;
        const Gia = req.body.Gia;
        const DienTich = req.body.DienTich;
        const HinhCu = req.body.HinhCu;

        let tenFileAnh = req.file ? req.file.filename : HinhCu;

        if(req.file && HinhCu != 'logo.png'){
            deleteImage(HinhCu);
        }

        const phong = await Phong.update(id, Ten, DienTich, Gia, tenFileAnh);
        return res.redirect('/admin/phongTro?status=suap&highlight='+phong.MaPhong);
    }
    async xoaPhongTro(req, res) {
        const id = req.params.id;
        const HinhCu = req.body.HinhXoa;
        if(HinhCu!='logo.png') deleteImage(HinhCu);

        await Phong.delete(id);
        return res.redirect('/admin/phongTro?status=xoap');
    }
}
module.exports = new PhongTroContrroller