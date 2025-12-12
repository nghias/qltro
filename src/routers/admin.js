const express = require('express');
const router = express.Router();
const ThongKeController = require('../app/controllers/ThongKeController');
const PhongTroController = require('../app/controllers/PhongTroController');
const NguoiDungController = require('../app/controllers/NguoiDungController');
const HopDongThueController = require('../app/controllers/HopDongThueController');
const PhuPhiController = require('../app/controllers/PhuPhiController');
const DienNuocController = require('../app/controllers/DienNuocController');
const HoaDonController = require('../app/controllers/HoaDonController');
const ThongBaoController = require('../app/controllers/ThongBaoController');

const middleWare = require('../middlewares/auth');
const loginController = require('../app/controllers/LoginController');
const upload = require('../app/config/multer');

router.get('/hoadon/laychitiet/:id', middleWare.isAdmin, HoaDonController.layChiTiet);
router.get('/hoadon', middleWare.isAdmin, HoaDonController.hoaDonAdmin);
router.post('/hoadon/xntra/:id', middleWare.isAdmin, HoaDonController.xnTraHoaDonAdmin);
router.post('/hoadon', middleWare.isAdmin, HoaDonController.taoHoaDon);
router.delete('/hoadon/:id', middleWare.isAdmin, HoaDonController.xoaHoaDon);

router.get('/diennuoc/laydulieusua/:id', middleWare.isAdmin, DienNuocController.layDuLieuSuaDienNuoc);
router.get('/diennuoc/kiemtra/:id', middleWare.isAdmin, DienNuocController.kTDienNuoc);
router.get('/diennuoc', middleWare.isAdmin, DienNuocController.dienNuoc);
router.post('/dienuoc/capnhatgia', middleWare.isAdmin, DienNuocController.themGiaDienNuoc);
router.post('/diennuoc', middleWare.isAdmin, DienNuocController.themCSDienNuoc);
router.put('/diennuoc/:id', middleWare.isAdmin, DienNuocController.suaCSDienNuoc);
router.delete('/diennuoc/xoatheongay/:id', middleWare.isAdmin, DienNuocController.xoaCSDienNuocNgay);
router.delete('/diennuoc/:id', middleWare.isAdmin, DienNuocController.xoaCSDienNuoc);


router.get('/phuphi/laydulieusua/:id', middleWare.isAdmin, PhuPhiController.layDuLieuSuaphuPhi);
router.get('/phuphi/laydulieu', middleWare.isAdmin, PhuPhiController.layDuLieuTaophuPhi);
router.get('/phuphi', middleWare.isAdmin, PhuPhiController.phuPhi);
router.post('/phuphi', middleWare.isAdmin, PhuPhiController.themPhuPhi);
router.put('/phuphi/:id', middleWare.isAdmin, PhuPhiController.suaPhuPhi);
router.delete('/phuphi/:id', middleWare.isAdmin, PhuPhiController.xoaPhuPhi);


router.get('/hopdong/laydulieutao', middleWare.isAdmin, HopDongThueController.layDuLieuTaoHopDong);
router.get('/hopdong/laydulieusua/:id', middleWare.isAdmin, HopDongThueController.layDuLieuSuaHopDong);
router.get('/hopdong', middleWare.isAdmin, HopDongThueController.hopDongAdmin);
router.get('/hopdong/:id', middleWare.isAdmin, HopDongThueController.layHopDong);
router.post('/hopdong', middleWare.isAdmin, HopDongThueController.themHopDong);
router.put('/hopdong/kthopdong/:id', middleWare.isAdmin, HopDongThueController.kTHopDong);
router.put('/hopdong/:id', middleWare.isAdmin, HopDongThueController.suaHopDong);
router.delete('/hopdong/:id', middleWare.isAdmin, HopDongThueController.xoaHopDong);

router.get('/nguoidung', middleWare.isAdmin, NguoiDungController.nguoiDung);
router.post('/nguoidung/datlaimk/:id', middleWare.isAdmin, NguoiDungController.DatLaiMK);
router.get('/nguoidung/:id', middleWare.isAdmin, NguoiDungController.layThongTinNguoiDung);
router.post('/nguoidung', upload.single("HinhND"), middleWare.isAdmin, NguoiDungController.themNguoiDung);
router.put('/nguoidung/:id', upload.single("HinhND"), middleWare.isAdmin, NguoiDungController.suaNguoiDung);
router.delete('/nguoidung/:id', middleWare.isAdmin, NguoiDungController.xoaNguoiDung);

router.get('/phongtro', middleWare.isAdmin, PhongTroController.phongTro);
router.get('/phongtro/:id', middleWare.isAdmin, PhongTroController.layThongTinPhong);
router.post('/phongtro', upload.single("HinhPhong"), middleWare.isAdmin, PhongTroController.themPhongTro);
router.put('/phongtro/:id', upload.single("HinhPhong"), middleWare.isAdmin, PhongTroController.suaPhongTro);
router.delete('/phongtro/:id', middleWare.isAdmin, PhongTroController.xoaPhongTro);



router.get('/acc/:id', loginController.getAccupdate);
router.put('/accupdate/:id', upload.single("HinhND"), loginController.accupdate);
router.post('/mkupdate', loginController.mkupdate);

router.get('/thongbao/laydlsoan', middleWare.isAdmin, ThongBaoController.layDLSoan);
router.get('/thongbao/laydulieuthongbao/:id', middleWare.isAdmin, ThongBaoController.layTBNDNhan);
router.get('/thongbao/chitiet/:id', middleWare.isAdmin, ThongBaoController.ctThongBao);
router.get('/thongbao/:id', middleWare.isAdmin, ThongBaoController.thongBao);
router.post('/thongbao/traloi/:id', middleWare.isAdmin, ThongBaoController.traLoiThongBao);
router.post('/thongbao/:id', middleWare.isAdmin, ThongBaoController.themThongBao);
router.put('/thongbao/dadocnhieu/:id', middleWare.isAdmin, ThongBaoController.daDocNhieuThongBao);
router.put('/thongbao/dadoc/:id', middleWare.isAdmin, ThongBaoController.daDocThongBao);
router.put('/thongbao/chuadoc/:id', middleWare.isAdmin, ThongBaoController.chuaDocThongBao);
router.delete('/thongbao/xoanhieu/:id', middleWare.isAdmin, ThongBaoController.xoaNhieuThongBao);
router.delete('/thongbao/:id', middleWare.isAdmin, ThongBaoController.xoaThongBao);

router.get('/thongkethanhtoan', middleWare.isAdmin, ThongKeController.layDLTKTT);
router.get('/laydlthongke', middleWare.isAdmin, ThongKeController.layDLTK);
router.get('/thongke', middleWare.isAdmin, ThongKeController.thongKe);
router.get('/', middleWare.isAdmin, ThongKeController.thongKe);

module.exports = router;