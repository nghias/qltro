const Phong = require('../models/Phong');
const HopDongThue = require('../models/HopDongThue');
const CTPhuPhi = require('../models/CTPhuPhi');
const PhuPhi = require("../models/PhuPhi");

class PhuPhiController{
    async phuPhi(req, res) {
        const search = req.query.searchPP || "";
        let dsPhuPhi;
        if(search.trim()===""){
            dsPhuPhi = await PhuPhi.getAll();
        }else{
            dsPhuPhi = await PhuPhi.findByKeyword(search);
        }
        if (!dsPhuPhi || dsPhuPhi.length === 0) {
            return res.render("pages/admin/phuPhi", { empty: true });
        }
        res.render('pages/admin/phuPhi',{dsPhuPhi});
    }
    async layDuLieuTaophuPhi(req, res) {
        try {
            const phongTro = await Phong.getPhongDaThue(); 
            
            res.json({
                dsPhong: phongTro,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async layDuLieuSuaphuPhi(req, res) {
        try {
            const id = req.params.id;
            const pp = await PhuPhi.getById(id);
            let rawPhongTro = await Phong.getByMaPP(id);
            let rawPhongTroDT = await Phong.getByMaPPDT(id);

            const toArray = (data) => {
                if (!data) return []; 
                return Array.isArray(data) ? data : [data];
            };

            // 3. Áp dụng chuẩn hóa
            const phongTro = toArray(rawPhongTro);
            const phongTroDT = toArray(rawPhongTroDT);

             const phongTro_marked = phongTro.map(item => ({
                ...item,
                isSelected: true 
            }));
            
            const phongTroDT_marked = phongTroDT.map(item => ({
                ...item,
                isSelected: false
            }));
            
            const ds = [...phongTro_marked,...phongTroDT_marked];
            
            res.json({
                dsPhong: ds,
                PP: pp
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async themPhuPhi(req, res){
        try {
            const data = {
                TenPP: req.body.TenPP,
                Gia:  req.body.GiaPP,
                GhiChu: req.body.GhiChuPP
            }
            console.log(data)
            const pp = await PhuPhi.create(data);
            let dsP = req.body.PhongPP || []; 
            if (!Array.isArray(dsP)) {
                dsP = [dsP];
            }

           // Kiểm tra xem có dữ liệu không
            if (dsP.length > 0) {
                await Promise.all(dsP.map(async (map) => {
                    const hdt = await HopDongThue.getByMaPhong(map);
                    const dt = {
                        MaPP: pp.MaPP, 
                        MaHDT: hdt.MaHDT
                    };
                    
                    await CTPhuPhi.create(dt);
                }));
            } else {
                console.log("Không có phòng nào được chọn.");
            }
            return res.redirect('/admin/phuphi?status=them&highlight='+pp.MaPP);
        } catch (error) {
            res.status(500).redirect('/admin/phuphi?status=fail');
        }
    }
    async suaPhuPhi(req, res){
        try {
            const id = req.params.id;
            const data = {
                TenPP: req.body.TenPP,
                Gia:  req.body.GiaPP,
                GhiChu: req.body.GhiChuPP
            }
            const pp = await PhuPhi.update(id, data);
            let dsP = req.body.PhongPP || []; 
            if (!Array.isArray(dsP)) {
                dsP = [dsP];
            }
            await CTPhuPhi.delete(id);
           // Kiểm tra xem có dữ liệu không
            if (dsP.length > 0) {
                await Promise.all(dsP.map(async (map) => {
                    const hdt = await HopDongThue.getByMaPhong(map);
                    const dt = {
                        MaPP: id, 
                        MaHDT: hdt.MaHDT
                    };
                    await CTPhuPhi.create(dt);
                }));
            } else {
                console.log("Không có phòng nào được chọn.");
            }
            return res.redirect('/admin/phuphi?status=sua&highlight='+id);
        } catch (error) {
            console.log(error)
            res.status(500).redirect('/admin/phuphi?status=fail');
        }
    }
    async xoaPhuPhi(req, res){
        try {
            const id = req.params.id;
            await CTPhuPhi.delete(id);
            await PhuPhi.delete(id);
            return res.redirect('/admin/phuphi?status=xoa');
        } catch (error) {
            res.status(500).redirect('/admin/phuphi?status=fail');
        }
    }
}
module.exports = new PhuPhiController