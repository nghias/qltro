const db = require('../config/mysqldb');
const {DateFormatter} = require('../config/DataFormatter');

class HoaDon {
    constructor(data) {
        this.MaHD = data.MaHD;
        this.MaCS = data.MaCS;
        this.MaHDT = data.MaHDT;
        this.MaGia = data.MaGia;
        this.TienPhong = Number(data.TienPhong).toLocaleString('vi-VN');
        this.TienDien = Number(data.TienDien).toLocaleString('vi-VN');
        this.TienNuoc = Number(data.TienNuoc).toLocaleString('vi-VN');
        this.PhuThu = Number(data.PhuThu).toLocaleString('vi-VN');
        this.NgayTinh = DateFormatter.formatToDDMMYYYY(data.NgayTinh);
        this.TrangThai = data.TrangThai;
        const tong = Number(data.TienPhong) + Number(data.TienDien) + Number(data.TienNuoc) + Number(data.PhuThu);
        this.TongTien = Number(tong).toLocaleString('vi-VN');
    }
    static async thongKeThanhToan(thang, nam) {
        const pool = await db();

        const query = `
            SELECT 
                COUNT(*) AS TongHD,
                SUM(COALESCE(TienPhong, 0) + COALESCE(TienDien, 0) + COALESCE(TienNuoc, 0) + COALESCE(PhuThu, 0)) AS TongTien,
                COUNT(CASE WHEN TrangThai = 'Đã thanh toán' THEN 1 END) AS DaThanhToan_SL,
                SUM(CASE WHEN TrangThai = 'Đã thanh toán' 
                        THEN (COALESCE(TienPhong, 0) + COALESCE(TienDien, 0) + COALESCE(TienNuoc, 0) + COALESCE(PhuThu, 0)) 
                        ELSE 0 END) AS DaThanhToan_Tien,
                COUNT(CASE WHEN TrangThai != 'Đã thanh toán' THEN 1 END) AS ChuaThanhToan_SL,
                SUM(CASE WHEN TrangThai != 'Đã thanh toán' 
                        THEN (COALESCE(TienPhong, 0) + COALESCE(TienDien, 0) + COALESCE(TienNuoc, 0) + COALESCE(PhuThu, 0)) 
                        ELSE 0 END) AS ChuaThanhToan_Tien
            FROM hoadon
            WHERE MONTH(NgayTinh) = ? AND YEAR(NgayTinh) = ?
        `;

        const [rows] = await pool.query(query, [thang, nam]);
        await pool.end();

        if (!rows[0] || rows[0].TongHD === 0) {
            return {
                TongHD: 0, TongTien: 0,
                DaThanhToan_SL: 0, DaThanhToan_Tien: 0,
                ChuaThanhToan_SL: 0, ChuaThanhToan_Tien: 0
            };
        }

        return rows[0];
    }
    static async thongKeHoaDon(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM (
                SELECT 
                    DATE_FORMAT(NgayTinh, '%m/%Y') AS ThangHienThi,
                    DATE_FORMAT(NgayTinh, '%Y-%m') AS ThangSort,
                    SUM(
                        COALESCE(TienPhong, 0) + 
                        COALESCE(TienDien, 0) + 
                        COALESCE(TienNuoc, 0) + 
                        COALESCE(PhuThu, 0)
                    ) AS TongTien
                FROM hoadon
                GROUP BY ThangSort, ThangHienThi
                ORDER BY ThangSort DESC
                LIMIT 12
            ) AS SubQuery
            ORDER BY ThangSort ASC;`
        );
        
        await pool.end();

        if (rows.length === 0) return [];

        // Map dữ liệu để format tiền và chỉ lấy 2 trường cần thiết
        return rows.map(r => ({
            ThangHienThi: r.ThangHienThi,
            // Chuyển TongTien sang số (Number) rồi format kiểu tiền Việt
            TongTien: Number(r.TongTien)
        }));
    }
    // ----------- Lấy user theo ID -----------
    static async getByMaND(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT hd.* FROM nguoidung as nd 
            JOIN chitiethopdongthue as cthdt ON nd.MaND = cthdt.MaND 
            JOIN hopdongthue as hdt ON cthdt.MaHDT=hdt.MaHDT
            JOIN hoadon AS hd ON hd.MaHDT = hdt.MaHDT 
            WHERE nd.MaND = ?`,
            [id]
        );
        await pool.end();

        return (rows.length === 0)? [] : rows.map(r => new HoaDon(r));
    }
    // ----------- Lấy tất cả user -----------
    static async getAll() {
        const pool = await db();

        const [rows] = await pool.query("SELECT * FROM HoaDon ORDER BY NgayTinh DESC");
        await pool.end();

        return rows.map(row => new HoaDon(row));
    }
    static async getId(id) {
        const pool = await db();

        const [rows] = await pool.query("SELECT * FROM HoaDon WHERE MaHD = ? LIMIT 1",[id]);
        await pool.end();

        return (rows.length === 0)? [] : new HoaDon(rows[0]);
    }
    static async getMaCS(id) {
        const pool = await db();

        const [rows] = await pool.query("SELECT * FROM HoaDon WHERE MaCS = ? LIMIT 1",[id]);
        await pool.end();

        return (rows.length === 0)? [] : new HoaDon(rows[0]);
    }
    static async create(data) {
        const pool = await db();

        const sql = `
            INSERT INTO hoadon(MaCS, MaHDT, MaGia, TienPhong, TienDien, TienNuoc, PhuThu, NgayTinh, TrangThai) 
            VALUES (?,?,?,?,?,?,?,CURRENT_DATE,'Chưa thanh toán')
        `;

        const params = [
            data.MaCS,
            data.MaHDT,
            data.MaGia,
            data.TienPhong,
            data.TienDien,
            data.TienNuoc,
            data.PhuThu
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return {
            MaHDT: result.insertId, // Lấy ID vừa tự động tăng
            ...data                 // Gộp các thông tin còn lại (MaPhong, NgayBD...)
        };;
    }
    static async XacNhanTraAdmin(id) {
        const pool = await db();

        const sql = `UPDATE hoadon SET TrangThai='Đã thanh toán' WHERE MaHD = ?`;

        await pool.query(sql, [id]);
        await pool.end();

        return HoaDon.getAll();
    }
    static async XacNhanTraUser(id) {
        const pool = await db();

        const sql = `UPDATE hoadon SET TrangThai='Chờ thanh toán' WHERE MaHD = ?`;

        await pool.query(sql, [id]);
        await pool.end();

        return HoaDon.getAll();
    }
    static async delete(id) {
        const pool = await db();

        const sql = `DELETE FROM hoadon WHERE MaHD = ?`;

        await pool.query(sql, [id]);
        await pool.end();

        return HoaDon.getAll();
    }
}

module.exports = HoaDon;
