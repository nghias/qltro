const Phong = require('../models/Phong');
const HoaDon = require("../models/HoaDon");
const GiaDienNuoc = require("../models/GiaDienNuoc");
const CSDienNuoc = require("../models/CSDienNuoc");

class DienNuocController{
    async dienNuoc(req, res) {
        const search = req.query.searchDN || "";
        let dsdnB;
        if(search.trim()===""){
            dsdnB = await CSDienNuoc.findByKeyword(search);
        }else{
            dsdnB = await CSDienNuoc.getAll();
        }
        const dsdn = await Promise.all(dsdnB.map(async (dn)=>{
            const phong = await Phong.getById(dn.MaPhong);
            const dh = await HoaDon.getMaCS(dn.MaCS);
            return {
                ...dn,
                TenPhong:phong[0].Ten,
                isXoa: (phong[0].Ten)?false:true,
                isSua: !((dh && dh.length > 0) || false)
            };
        }))
        const giadn = await GiaDienNuoc.getByNew(); 
        const listPhong = await Phong.getPhongDaThueChuaCS();
        if (!dsdn || dsdn.length === 0) {
            return res.render("pages/admin/dienNuoc", { empty: true });
        }
        res.render('pages/admin/dienNuoc',{
            dsdn,
            giadn,
            listPhong,
            isPhongRong: (listPhong.length===0)
        });
    }
    async layDuLieuSuaDienNuoc(req, res) {
        try {
            const id = req.params.id;
            const cs = await CSDienNuoc.getByID(id);
            
            res.json({
                cs: cs
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async kTDienNuoc(req, res) {
        try {
            const id = req.params.id;
            const cs = await CSDienNuoc.getByMaPhongNew(id);
            
            res.json({
                cs: cs
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async themCSDienNuoc(req, res) {
        try {
            if(CSDienNuoc.ktCoCS()>0){
                return res.status(500).redirect('/admin/diennuoc?status=failthem');
            }
            const jsonString = req.body.dataJson;
            
            if (!jsonString) {
                console.log("Không có dữ liệu gửi lên!");
            }
            
            const listData = JSON.parse(jsonString);

            for (const item of listData) {
                if(item.MaPhong && item.SoDMoi && item.SoNMoi) {
                    const cscu = await CSDienNuoc.getByMaPhongNew(item.MaPhong);
                    let data;
                    if (!cscu || cscu.length === 0) {
                        data = {
                            MaPhong: item.MaPhong,
                            SoDCu: 0,
                            SoDMoi: item.SoDMoi,
                            SoNCu: 0,
                            SoNMoi: item.SoNMoi
                        }
                    }else{
                        data = {
                            MaPhong: item.MaPhong,
                            SoDCu: cscu[0].SoDCu,
                            SoDMoi: item.SoDMoi,
                            SoNCu: cscu[0].SoNCu,
                            SoNMoi: item.SoNMoi
                        }
                    }
                    await CSDienNuoc.create(data);
                }
            }

            res.redirect('/admin/diennuoc?status=them');

        } catch (error) {
            res.status(500).redirect('/admin/diennuoc?status=fail');
        }
    }
    async themGiaDienNuoc(req, res) {
        try {
            let giaDienRaw = req.body.giaDien; 
            let giaNuocRaw = req.body.giaNuoc; 

            const giaDienChuan = parseInt(giaDienRaw.toString().replace(/\./g, '')); 
            const giaNuocChuan = parseInt(giaNuocRaw.toString().replace(/\./g, ''));
            const data = {
                GiaDien: giaDienChuan,
                GiaNuoc: giaNuocChuan
            }
            
            await GiaDienNuoc.create(data);

            res.redirect('/admin/diennuoc?status=themgia');

        } catch (error) {
            res.status(500).redirect('/admin/diennuoc?status=fail');
        }
    }
    async suaCSDienNuoc(req, res) {
        try {
            const id = req.params.id;
            const data = {
                SoDMoi: req.body.CSDM,
                SoNMoi: req.body.CSNM
            }
            
            await CSDienNuoc.update(id,data);

            res.redirect('/admin/diennuoc?status=sua');

        } catch (error) {
            res.status(500).redirect('/admin/diennuoc?status=fail');
        }
    }
    async xoaCSDienNuoc(req, res) {
        try {
            const id = req.params.id;
            
            await CSDienNuoc.delete(id);

            res.redirect('/admin/diennuoc?status=xoa');

        } catch (error) {
            res.status(500).redirect('/admin/diennuoc?status=fail');
        }
    }
    async xoaCSDienNuocNgay(req, res) {
        try {
            const id = req.params.id;
            const dn=await CSDienNuoc.getByID(id);
            const parts = (dn[0].NgayGhi).split('/');

            const ngay = `${parts[2]}-${parts[1]}-${parts[0]}`;
            await CSDienNuoc.deleteByNgay(ngay);

            res.redirect('/admin/diennuoc?status=xoa');

        } catch (error) {
            res.status(500).redirect('/admin/diennuoc?status=fail');
        }
    }
}
module.exports = new DienNuocController