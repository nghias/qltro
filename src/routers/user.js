const express = require('express');
const router = express.Router();
const HopDongThueController = require('../app/controllers/HopDongThueController');
const HoaDonController = require('../app/controllers/HoaDonController');
const middleWare = require('../middlewares/auth');
const upload = require('../app/config/multer');
const loginController = require('../app/controllers/LoginController');
const ThongBaoController = require('../app/controllers/ThongBaoController');

router.get('/hoadon/taocode/:id', middleWare.isUser , HoaDonController.taoCode);
router.get('/hoadon/laychitiet/:id', middleWare.isUser, HoaDonController.layChiTiet);
router.get('/hoadon', middleWare.isUser , HoaDonController.hoaDonUser);
router.post('/hoadon/xntra/:id', middleWare.isUser , HoaDonController.xnTraHoaDonUser);

router.get('/hopdong', middleWare.isUser , HopDongThueController.hopDongUser);

router.get('/accupdate/:id', loginController.getAccupdate);
router.put('/accupdate/:id', upload.single("HinhND"), loginController.accupdate);
router.post('/mkupdate', loginController.mkupdate);

router.get('/thongbao/laydlsoan', middleWare.isUser, ThongBaoController.layDLSoan);
router.get('/thongbao/laydulieuthongbao/:id', middleWare.isUser, ThongBaoController.layTBNDNhan);
router.get('/thongbao/chitiet/:id', middleWare.isUser, ThongBaoController.ctThongBao);
router.get('/thongbao/:id', middleWare.isUser, ThongBaoController.thongBao);
router.post('/thongbao/traloi/:id', middleWare.isUser, ThongBaoController.traLoiThongBao);
router.post('/thongbao/:id', middleWare.isUser, ThongBaoController.themThongBao);
router.put('/thongbao/dadocnhieu/:id', middleWare.isUser, ThongBaoController.daDocNhieuThongBao);
router.put('/thongbao/dadoc/:id', middleWare.isUser, ThongBaoController.daDocThongBao);
router.put('/thongbao/chuadoc/:id', middleWare.isUser, ThongBaoController.chuaDocThongBao);
router.delete('/thongbao/xoanhieu/:id', middleWare.isUser, ThongBaoController.xoaNhieuThongBao);
router.delete('/thongbao/:id', middleWare.isUser, ThongBaoController.xoaThongBao);

router.get('/', middleWare.isUser , HoaDonController.hoaDonUser);

module.exports = router;