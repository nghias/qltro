const NguoiDung = require('../models/NguoiDung');
const Phong = require('../models/Phong');
const ThongBao = require('../models/ThongBao');
class ThongBaoController{
    async thongBao(req, res){
        const search = req.query.searchTB || "";
        const id = req.params.id;
        let dsthongbao;
        if(search.trim()===""){
            dsthongbao = await ThongBao.getAll(id);
        }else{
            dsthongbao = await ThongBao.findByKeyword(search, id);
        }
        
        const nd = await NguoiDung.getById(id);
        if (!dsthongbao || dsthongbao.length === 0) {
            return res.render(`pages/${nd.Quyen}/thongBao`, { 
                empty: true,
                ma: id,
                role: nd.Quyen
            });
        }
        const tongSoThongBao = dsthongbao.filter(i => i.TrangThai === "Chưa đọc").length;

        const thongbao = await Promise.all(dsthongbao.map(async (tb) => {
            const nDNhan = await NguoiDung.getById(tb.NDNhan);
            const nDGui = await NguoiDung.getById(tb.NDGui);
            return {
                ...tb,
                NDNhan: nDNhan.HoTen,
                NDGui: nDGui.HoTen,
                MaND: (nDGui.MaND == id)
            }
        }));
        res.render(`pages/${nd.Quyen}/thongBao`,{
            thongbao,
            tongSoThongBao,
            ma: id,
            role: nd.Quyen
        });
    }
    async ctThongBao(req, res){
        // Mã thông báo
        const id = req.params.id;
        // Mã người dùng
        const ma = req.query.ma;

        const thongbao = await ThongBao.getByID(id);
        if(thongbao.NDGui!=ma){
            await ThongBao.updateTrangThaiDD(id);
        }
        
        const NDNhan = await NguoiDung.getById(thongbao.NDNhan);
        const NDGui = await NguoiDung.getById(thongbao.NDGui);
        const MaND = (NDGui.MaND == ma);
        const nd = await NguoiDung.getById(ma);

        res.render(`pages/${nd.Quyen}/ctThongBao`,{
            thongbao,
            NDNhan,
            NDGui,
            MaND,
            ma,
            role: nd.Quyen
        });
    }
    async layTBNDNhan(req, res){
        try {
            const id = req.params.id;
            const tb = await ThongBao.getByNDNhan(id);
            
            const sltbcd = tb.filter(item => item.TrangThai === "Chưa đọc").length;
            
            res.json({
                tb: tb,
                tbcd: sltbcd
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async layDLSoan(req, res){
        try {
            const dsnd = await NguoiDung.getNDThueTB();

            const dsNN = await Promise.all(dsnd.map(async (nd)=>{
                const phong = await Phong.getByMaND(nd.MaND);
                return {
                    MaND: nd.MaND,
                    Ten: (phong.MaPhong)?(nd.HoTen+" - "+ phong.Ten):(nd.HoTen +" - Chủ trọ")
                }
            }))
            
            res.json({
                dsNN
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async themThongBao(req, res) {
        try {
            const ma = req.params.id;

            const nDGuiInfo = await NguoiDung.getById(ma);

            let dsNN = req.body.NNhan || [];
            if (!Array.isArray(dsNN)) {
                dsNN = [dsNN];
            }

            if (dsNN.length > 0) {
                await Promise.all(dsNN.map(async (mand) => {
                    const data = {
                        NDGui: ma,
                        NDNhan: mand,
                        TieuDe: req.body.TieuDe,
                        NoiDung: req.body.NoiDung,
                        TrangThai: 'Chưa đọc', 
                        NgayGui: new Date() 
                    }

                    const newTB = await ThongBao.create(data);

                    // if (req.io) {
                    //     req.io.to(`user_${mand}`).emit('thong_bao_moi', {
                    //         MaTB: newTB?.insertId || null,
                    //         TieuDe: data.TieuDe,
                    //         NoiDung: data.NoiDung,
                    //         NDGui: nDGuiInfo.HoTen,
                    //         ThoiGian: data.NgayGui,
                    //         TrangThai: 'Chưa đọc'
                    //     });
                    // }
                }));
            } else {
                console.log("Không có người nào được chọn.");
            }

            const dsthongbao = await ThongBao.getAll(ma);
            const nd = nDGuiInfo;

            if (!dsthongbao || dsthongbao.length === 0) {
                return res.render(`pages/${nd.Quyen}/thongBao`, { empty: true });
            }
            
            const tongSoThongBao = dsthongbao.filter(i => i.TrangThai === "Chưa đọc").length;
            const thongbao = await Promise.all(dsthongbao.map(async (tb) => {
                const nDNhan = await NguoiDung.getById(tb.NDNhan);
                const nDGui = await NguoiDung.getById(tb.NDGui);
                return {
                    ...tb,
                    NDNhan: nDNhan.HoTen,
                    NDGui: nDGui.HoTen,
                    MaND: (nDGui.MaND == ma)
                }
            }));

            res.render(`pages/${nd.Quyen}/thongBao`, {
                thongbao,
                tongSoThongBao,
                ma: ma,
                role: nd.Quyen
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    
    async traLoiThongBao(req, res){
        try {
            const ma = req.params.id;
            
            
            const data = {
                NDGui: ma,
                NDNhan: req.body.MaNN,
                TieuDe: req.body.TieuDeTL,
                NoiDung:  req.body.NoiDungTL
            }
            
            await ThongBao.create(data);

            const dsthongbao = await ThongBao.getAll(ma);
            const nd = await NguoiDung.getById(ma);
            if (!dsthongbao || dsthongbao.length === 0) {
                return res.render(`pages/${nd.Quyen}/thongBao`, { empty: true });
            }
            const tongSoThongBao = dsthongbao.filter(i => i.TrangThai === "Chưa đọc").length;

            const thongbao = await Promise.all(dsthongbao.map(async (tb) => {
                const nDNhan = await NguoiDung.getById(tb.NDNhan);
                const nDGui = await NguoiDung.getById(tb.NDGui);
                return {
                    ...tb,
                    NDNhan: nDNhan.HoTen,
                    NDGui: nDGui.HoTen,
                    MaND: (nDGui.MaND == ma)
                }
            }));

            res.render(`pages/${nd.Quyen}/thongBao`,{
                thongbao,
                tongSoThongBao,
                ma: ma,
                role: nd.Quyen
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }   
    }
    async daDocThongBao(req, res){
        try {
            // Mã thông báo
            const id = req.params.id;
            // Mã người dùng
            const ma = req.query.ma;


            const t = await ThongBao.getByID(id);
            if(t.NDGui!=ma){
                await ThongBao.updateTrangThaiDD(id);
            }

            const dsthongbao = await ThongBao.getAll(ma);
            const nd = await NguoiDung.getById(ma);
            if (!dsthongbao || dsthongbao.length === 0) {
                return res.render(`pages/${nd.Quyen}/thongBao`, { empty: true });
            }
            const tongSoThongBao = dsthongbao.filter(i => i.TrangThai === "Chưa đọc").length;

            const thongbao = await Promise.all(dsthongbao.map(async (tb) => {
                const nDNhan = await NguoiDung.getById(tb.NDNhan);
                const nDGui = await NguoiDung.getById(tb.NDGui);
                return {
                    ...tb,
                    NDNhan: nDNhan.HoTen,
                    NDGui: nDGui.HoTen,
                    MaND: (nDGui.MaND == ma)
                }
            }));

            res.render(`pages/${nd.Quyen}/thongBao`,{
                thongbao,
                tongSoThongBao,
                ma: ma,
                role: nd.Quyen
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async daDocNhieuThongBao(req, res){
        try {
            // Mã người dùng
            const ma = req.params.id;
            const { ids } = req.body;

            if(ids && ids.length > 0){
                for (const id of ids) {
                    const t = await ThongBao.getByID(id);
                    if(t.NDGui!=ma){
                        await ThongBao.updateTrangThaiDD(id); 
                    }
                }
            }

            const dsthongbao = await ThongBao.getAll(ma);
            const nd = await NguoiDung.getById(ma);
            if (!dsthongbao || dsthongbao.length === 0) {
                return res.render(`pages/${nd.Quyen}/thongBao`, { empty: true });
            }
            const tongSoThongBao = dsthongbao.filter(i => i.TrangThai === "Chưa đọc").length;

            const thongbao = await Promise.all(dsthongbao.map(async (tb) => {
                const nDNhan = await NguoiDung.getById(tb.NDNhan);
                const nDGui = await NguoiDung.getById(tb.NDGui);
                return {
                    ...tb,
                    NDNhan: nDNhan.HoTen,
                    NDGui: nDGui.HoTen,
                    MaND: (nDGui.MaND == ma)
                }
            }));

            res.render(`pages/${nd.Quyen}/thongBao`,{
                thongbao,
                tongSoThongBao,
                ma: ma,
                role: nd.Quyen
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async chuaDocThongBao(req, res){
        try {
            // Mã thông báo
            const id = req.params.id;
            // Mã người dùng
            const ma = req.query.ma;


            const t = await ThongBao.getByID(id);
            if(t.NDGui!=ma){
                await ThongBao.updateTrangThaiCD(id);
            }

            const dsthongbao = await ThongBao.getAll(ma);
            const nd = await NguoiDung.getById(ma);
            if (!dsthongbao || dsthongbao.length === 0) {
                return res.render(`pages/${nd.Quyen}/thongBao`, { empty: true });
            }
            const tongSoThongBao = dsthongbao.filter(i => i.TrangThai === "Chưa đọc").length;

            const thongbao = await Promise.all(dsthongbao.map(async (tb) => {
                const nDNhan = await NguoiDung.getById(tb.NDNhan);
                const nDGui = await NguoiDung.getById(tb.NDGui);
                return {
                    ...tb,
                    NDNhan: nDNhan.HoTen,
                    NDGui: nDGui.HoTen,
                    MaND: (nDGui.MaND == ma)
                }
            }));

            res.render(`pages/${nd.Quyen}/thongBao`,{
                thongbao,
                tongSoThongBao,
                ma: ma,
                role: nd.Quyen
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async xoaThongBao(req, res){
        try {
            // Mã thông báo
            const id = req.params.id;
            // Mã người dùng
            const ma = req.query.ma;

            await ThongBao.delete(id);

            const dsthongbao = await ThongBao.getAll(ma);
            const nd = await NguoiDung.getById(ma);
            if (!dsthongbao || dsthongbao.length === 0) {
                return res.render(`pages/${nd.Quyen}/thongBao`, { empty: true });
            }
            const tongSoThongBao = dsthongbao.filter(i => i.TrangThai === "Chưa đọc").length;

            const thongbao = await Promise.all(dsthongbao.map(async (tb) => {
                const nDNhan = await NguoiDung.getById(tb.NDNhan);
                const nDGui = await NguoiDung.getById(tb.NDGui);
                return {
                    ...tb,
                    NDNhan: nDNhan.HoTen,
                    NDGui: nDGui.HoTen,
                    MaND: (nDGui.MaND == ma)
                }
            }));

            res.render(`pages/${nd.Quyen}/thongBao`,{
                thongbao,
                tongSoThongBao,
                ma: ma,
                role: nd.Quyen
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async xoaNhieuThongBao(req, res){
        try {
            // Mã người dùng
            const ma = req.params.id;

            const { ids } = req.body;

            if(ids && ids.length > 0){
                for (const id of ids) {
                    await ThongBao.delete(id);
                }
            }

            const dsthongbao = await ThongBao.getAll(ma);
            const nd = await NguoiDung.getById(ma);
            if (!dsthongbao || dsthongbao.length === 0) {
                return res.render(`pages/${nd.Quyen}/thongBao`, { empty: true });
            }
            const tongSoThongBao = dsthongbao.filter(i => i.TrangThai === "Chưa đọc").length;

            const thongbao = await Promise.all(dsthongbao.map(async (tb) => {
                const nDNhan = await NguoiDung.getById(tb.NDNhan);
                const nDGui = await NguoiDung.getById(tb.NDGui);
                return {
                    ...tb,
                    NDNhan: nDNhan.HoTen,
                    NDGui: nDGui.HoTen,
                    MaND: (nDGui.MaND == ma)
                }
            }));

            res.render(`pages/${nd.Quyen}/thongBao`,{
                thongbao,
                tongSoThongBao,
                ma: ma,
                role: nd.Quyen
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
}
module.exports = new ThongBaoController