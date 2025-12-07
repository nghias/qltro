const Phong = require('../models/Phong');
const HopDongThue = require('../models/HopDongThue');
const HoaDon = require("../models/HoaDon");
const PhuPhi = require("../models/PhuPhi");
const GiaDienNuoc = require("../models/GiaDienNuoc");
const CSDienNuoc = require("../models/CSDienNuoc");

class HoaDonController{
    async hoaDonAdmin(req, res) {
        const dsHoaDonB = await HoaDon.getAll();
        const dsHoaDon = await Promise.all(dsHoaDonB.map(async (hd)=>{
            const phong = await Phong.getByMaHD(hd.MaHD);
            const tenPhong = (phong && phong.length > 0) ? phong[0].Ten : "Không xác định";
            return {
                ...hd,
                TenPhong:tenPhong,
                isKetThuc: HopDongThue.ktHetHDT(hd.MaHDT)
            };
        }))
        if (!dsHoaDon || dsHoaDon.length === 0) {
            return res.render("pages/admin/hoaDon", { empty: true });
        }
        res.render('pages/admin/hoaDon',{dsHoaDon});
    }
    async hoaDonUser(req, res) {
        const MaND = req.session.user.info.MaND;
        const dsHoaDon = await HoaDon.getByMaND(MaND);
        if (!dsHoaDon || dsHoaDon.length === 0) {
            return res.render("pages/user/hoadon", { empty: true });
        }
        res.render('pages/user/hoadon', {
            dsHoaDon
        });
    }
    async layChiTiet(req, res) {
         try {
            const id = req.params.id;

            const hd = await HoaDon.getId(id);
            const phongTro = await Phong.getByMaHD(id); 
            const cs = await CSDienNuoc.getByID(hd.MaCS);
            const pp = await PhuPhi.getByMaHDT(hd.MaHDT);
            const gia = await GiaDienNuoc.getByID(hd.MaGia);
            res.json({
                HD:hd,
                Phong: phongTro[0],
                CS: {...cs[0]},
                PP: JSON.stringify(pp),
                Gia: gia
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async taoHoaDon(req, res) {
        try{
            const dshdt = await HopDongThue.getAllChuaHD();
            if(dshdt && dshdt.length==0) return res.status(500).redirect('/admin/hoadon?status=failthem');
            await Promise.all(dshdt.map(async (hdt)=>{
                const phong = await Phong.getByMaHDT(hdt.MaHDT);
                
                const cs = await CSDienNuoc.getByMaPhongNew(phong[0].MaPhong);
                if(cs && cs.length == 0) return res.status(500).redirect('/admin/hoadon?status=fail');
                const ttdien = parseInt(cs[0].SoDMoi.toString().replace(/\./g, '')) - parseInt(cs[0].SoDCu.toString().replace(/\./g, ''));
                const ttnuoc = parseInt(cs[0].SoNMoi.toString().replace(/\./g, '')) - parseInt(cs[0].SoDCu.toString().replace(/\./g, ''));
                const giadn = await GiaDienNuoc.getByNew();
                const giadien = parseInt(giadn.GiaDien.toString().replace(/\./g, ''));
                const gianuoc = parseInt(giadn.GiaNuoc.toString().replace(/\./g, ''));

                const pp = await PhuPhi.getByMaHDT(hdt.MaHDT);

                let tongpp =0;
                await Promise.all(pp.map(async (p)=>{
                    tongpp += parseInt(p.Gia.toString().replace(/\./g, ''))
                }))

                const tongdien = ttdien*giadien;
                const tongnuoc = ttnuoc*gianuoc;
                const giaphong = phong[0].Gia;

                const data = {
                    MaCS: cs[0].MaCS,
                    MaHDT: hdt.MaHDT,
                    MaGia: giadn.MaGia,
                    TienPhong: giaphong,
                    TienDien: tongdien,
                    TienNuoc: tongnuoc,
                    PhuThu: tongpp,
                    TrangThai: 'Chưa thanh toán'
                }
                await HoaDon.create(data);

            }))
            res.redirect('/admin/hoadon?status=them');
        }catch (error) {
            res.status(500).redirect('/admin/hoadon?status=fail');
        }
    }
    async xoaHoaDon(req, res) {
        try{
            const id = req.params.id;
            await HoaDon.delete(id);
            res.redirect('/admin/hoadon?status=xoa');
        }catch (error) {
            res.status(500).redirect('/admin/hoadon?status=fail');
        }
    }
    async xnTraHoaDonAdmin(req, res) {
        try{
            const id = req.params.id;
            await HoaDon.XacNhanTraAdmin(id);
            res.redirect('/admin/hoadon?status=xntra');
        }catch (error) {
            res.status(500).redirect('/admin/hoadon?status=fail');
        }
    }
    async xnTraHoaDonUser(req, res) {
        try{
            const id = req.params.id;
            await HoaDon.XacNhanTraUser(id);
            res.redirect('/user/hoadon?status=xntra');
        }catch (error) {
            res.status(500).redirect('/user/hoadon?status=fail');
        }
    }
    async taoCode(req, res) {
         try {
            const id = req.params.id;

            const hd = await HoaDon.getId(id);
            const phongTro = await Phong.getByMaHD(id);
            res.json({
                NgayTinh:hd.NgayTinh,
                TenPhong: phongTro[0].Ten
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
}
module.exports = new HoaDonController