const Phong = require('../models/Phong');
const NguoiDung = require('../models/NguoiDung');
const HopDongThue = require('../models/HopDongThue');
const CTHopDong = require('../models/CTHopDong');
const GiaDienNuoc = require("../models/GiaDienNuoc");
const {DateFormatter} = require('../config/DataFormatter');

class HopDongThueController{
    async hopDongAdmin(req, res) {
        const search = req.query.searchHDT || "";
        let hopdongthue;
        if(search.trim()===""){
            hopdongthue = await HopDongThue.getAll();
        }else{
            hopdongthue = await HopDongThue.findByKeyword(search);
        }
        if (!hopdongthue || hopdongthue.length === 0) {
            return res.render("pages/admin/hopDong", { empty: true });
        }
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0'); 
        const day = String(new Date().getDate()).padStart(2, '0');
        const temp = `${year}-${month}-${day}`;
        const today = DateFormatter.formatToDDMMYYYY(temp);

        const dshdt = await Promise.all(hopdongthue.map(async (hd) => {
            
            // hd bây giờ là một object cụ thể trong mảng
            const nguoidung = await NguoiDung.getByHDT(hd.MaHDT);
            const p = await Phong.getById(hd.MaPhong);
            const giadn = await GiaDienNuoc.getByNew();
            
            // Trả về object đã gộp đủ thông tin
            return {
                MaHDT: hd.MaHDT,
                NgayBD: hd.NgayBD,
                NgayKT: hd.NgayKT,
                dsND: nguoidung,
                phong: p,
                giadien: giadn.GiaDien,
                gianuoc: giadn.GiaNuoc,
                trangthai: (DateFormatter.parseDatevn(hd.NgayKT)>DateFormatter.parseDatevn(today))
            };
        }));
        res.render('pages/admin/hopDong',{
            dshdt,
            search
        });
    }
    async hopDongUser(req, res) {
        const hopdongthue = await HopDongThue.getByMaND(req.session.user.info.MaND);
        const dshdt = await Promise.all(hopdongthue.map(async (hd) => {
            
            // hd bây giờ là một object cụ thể trong mảng
            const nguoidung = await NguoiDung.getByHDT(hd.MaHDT);
            const phong = await Phong.getById(hd.MaPhong);
            const giadn = await GiaDienNuoc.getByMaHDT(hd.MaHDT);

            // Trả về object đã gộp đủ thông tin
            return {
                MaHDT: hd.MaHDT,
                NgayBD: hd.NgayBD,
                NgayKT: hd.NgayKT,
                dsND: nguoidung,
                phong: phong,
                giadien: giadn.GiaDien,
                gianuoc: giadn.GiaNuoc
            };
        }));
        if (!dshdt || dshdt.length === 0) {
            return res.render("pages/user/hoadon", { empty: true });
        }
        res.render('pages/user/hopDong', {
            dshdt
        });
    }
    async layDuLieuTaoHopDong(req, res) {
        try {
            // 1. Lấy danh sách phòng (thường là phòng còn trống)
            const phongTro = await Phong.getPhongTrong(); 
            
            // 2. Lấy danh sách người dùng (vai trò người thuê)
            const nguoiThue = await NguoiDung.getNDTrong(); 

            // 3. Trả về JSON gồm 2 danh sách này
            res.json({
                dsPhong: phongTro,
                dsNguoi: nguoiThue
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async layDuLieuSuaHopDong(req, res) {
        try {
            const id = req.params.id;
            const toArray = (data) => {
                if (!data) return []; 
                return Array.isArray(data) ? data : [data]; 
            }

            const hdt = await HopDongThue.getByID(id); 

            const rawListPTHDT = await Phong.getByMaHDT(id);
            const rawListPhongTrong = await Phong.getPhongTrong();
            
            const rawListNTHDT = await NguoiDung.getByHDT(id);
            const rawListNguoiTrong = await NguoiDung.getNDTrong();

            const listPTHDT = toArray(rawListPTHDT);
            const listPhongTrong = toArray(rawListPhongTrong);
            const listNTHDT = toArray(rawListNTHDT);
            const listNguoiTrong = toArray(rawListNguoiTrong);

            const pthdt_marked = listPTHDT.map(item => ({
                ...item,
                isSelected: true
            }));
            const phongTrong_marked = listPhongTrong.map(item => ({
                ...item,
                isSelected: false
            }));

            const nthdt_marked = listNTHDT.map(item => ({
                ...item,
                isChecked: true
            }));
            const nguoiTrong_marked = listNguoiTrong.map(item => ({
                ...item,
                isChecked: false
            }));
            
            const dsPT = [...pthdt_marked, ...phongTrong_marked];
            const dsNT = [...nthdt_marked, ...nguoiTrong_marked];
            console.log(dsPT);

            // 3. Trả về JSON gồm 2 danh sách này
            res.json({
                HDT: hdt,
                dsPhong: dsPT,
                dsNguoi: dsNT
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async layHopDong(req, res) {
        try {
            const id = req.params.id;
            const hdt = await HopDongThue.getById(id);
            res.json(hdt);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async themHopDong(req, res){
        try {
            const data = {
                MaPhong: req.body.PhongHDT,
                NgayBD:  req.body.NgayBD,
                NgayKT: req.body.NgayKT,
                TienCoc: req.body.TienCoc
            }
            const hd = await HopDongThue.create(data);
            let dsNT = req.body.NThue || []; 
            if (!Array.isArray(dsNT)) {
                dsNT = [dsNT];
            }

           // Kiểm tra xem có dữ liệu không
            if (dsNT.length > 0) {
                await Promise.all(dsNT.map(async (mand) => {
                    const dt = {
                        MaHDT: hd.MaHDT, 
                        MaND: mand
                    };
                    
                    await CTHopDong.create(dt);
                }));
            } else {
                console.log("Không có người thuê nào được chọn.");
            }
            return res.redirect('/admin/hopDong?status=them');
        } catch (error) {
            res.status(500).redirect('/admin/hopDong?status=fail');
        }
    }
    async suaHopDong(req, res){
        try {
            const id = req.params.id;
            const data = {
                MaPhong: req.body.PhongHDT,
                NgayBD:  req.body.NgayBD,
                NgayKT: req.body.NgayKT,
                TienCoc: req.body.TienCoc
            }
            await HopDongThue.update(id, data);
            let dsNT = req.body.NThue || []; 
            if (!Array.isArray(dsNT)) {
                dsNT = [dsNT];
            }
            await CTHopDong.delete(id);
           // Kiểm tra xem có dữ liệu không
            if (dsNT.length > 0) {
                await Promise.all(dsNT.map(async (mand) => {
                    const dt = {
                        MaHDT: id, 
                        MaND: mand
                    };
                    
                    await CTHopDong.create(dt);
                }));
            } else {
                console.log("Không có người thuê nào được chọn.");
            }
            return res.redirect('/admin/hopDong?status=sua');
        } catch (error) {
            res.status(500).redirect('/admin/hopDong?status=fail');
        }
    }
    async xoaHopDong(req, res){
        try {
            const id = req.params.id;
            await CTHopDong.delete(id);
            await HopDongThue.delete(id);
            return res.redirect('/admin/hopDong?status=xoa');
        } catch (error) {
            res.status(500).redirect('/admin/hopDong?status=fail');
        }
    }
    async kTHopDong(req, res){
        try {
            const id = req.params.id;
            await HopDongThue.updateKT(id);
            return res.redirect('/admin/hopDong?status=kthdt');
        } catch (error) {
            res.status(500).redirect('/admin/hopDong?status=fail');
        }
    }
}
module.exports = new HopDongThueController