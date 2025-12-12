const Phong = require('../models/Phong');
const NguoiDung = require('../models/NguoiDung');
const HoaDon = require("../models/HoaDon");


class ThongKeController{
    async thongKe(req, res) {
        res.render('pages/admin/thongKe');
    }
    async layDLTK(req, res){
        try {
            const dsHD = await HoaDon.thongKeHoaDon();
            const tkPhong = await Phong.thongKePhong();
            const tkND = await NguoiDung.thongKeNguoiDung();
            const tkTT = await HoaDon.thongKeThanhToan();
            res.json({
                dsHD,
                Phong: tkPhong,
                NguoiDung: tkND,
                ThanhToan: tkTT
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async layDLTKTT(req, res){
        try {
            const { thang, nam } = req.query
            const ThanhToan = await HoaDon.thongKeThanhToan(thang,nam);
            res.json({
                ThanhToan
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
}
module.exports = new ThongKeController