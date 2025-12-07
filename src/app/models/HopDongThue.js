const db = require('../config/mysqldb');
const {DateFormatter} = require('../config/DataFormatter');

class HopDongThue {
    constructor(data) {
        this.MaHDT = data.MaHDT;
        this.NgayBD = DateFormatter.formatToDDMMYYYY(data.NgayBD);
        this.NgayKT = DateFormatter.formatToDDMMYYYY(data.NgayKT);
        this.TienCoc = Number(data.TienCoc).toLocaleString('vi-VN');
        this.MaPhong = data.MaPhong;

    }
    static async ktHetHDT(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT (NgayKT < CURDATE()) as DaKetThuc 
            FROM hopdongthue 
            WHERE MaHDT = ?`,[id]
        );
        await pool.end();
        if(rows.length === 0) return  false;
        return Boolean(rows[0].DaKetThuc);
    }
    static async getAll() {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM hopdongthue ORDER BY NgayKT DESC`
        );
        await pool.end();
        return (rows.length === 0)? [] : rows.map(r => new HopDongThue(r));
    }
    static async getAllChuaHD() {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT hdt.*
            FROM hopdongthue hdt
            JOIN phong p ON hdt.MaPhong = p.MaPhong
            WHERE hdt.NgayKT >= CURDATE() 
            AND NOT EXISTS (
                SELECT 1 
                FROM hoadon hd 
                WHERE hd.MaHDT = hdt.MaHDT 
                AND MONTH(hd.NgayTinh) = MONTH(CURDATE()) 
                AND YEAR(hd.NgayTinh) = YEAR(CURDATE())
            );`
        );
        await pool.end();
        return (rows.length === 0)? [] : rows.map(r => new HopDongThue(r));
    }
    static async getAllMa() {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM hopdongthue ORDER BY MaHDT DESC`
        );
        await pool.end();
        return (rows.length === 0)? [] : rows.map(r => new HopDongThue(r));
    }
    static async getByID(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM hopdongthue WHERE MaHDT = ? LIMIT 1`,
            [id]
        );
        await pool.end();
        return (rows.length === 0)? [] : new HopDongThue(rows[0]);
    }
    static async getByMaPhong(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM hopdongthue WHERE MaPhong = ? ORDER BY NgayKT DESC LIMIT 1`,
            [id]
        );
        await pool.end();
        return (rows.length === 0)? [] : new HopDongThue(rows[0]);
    }
    static async getByMaND(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM hopdongthue hdt
            JOIN chitiethopdongthue cthdt ON hdt.MaHDT=cthdt.MaHDT
            WHERE cthdt.MaND=?`,
            [id]
        );
        await pool.end();

        return (rows.length === 0)? [] : rows.map(r => new HopDongThue(r));
    }
    static async findByKeyword(keyword) {
        const pool = await db();

        const searchTerm = `%${keyword}%`;

        // SỬA CÂU SQL: Lấy Hợp Đồng làm gốc (FROM hopdongthue)
        const sql = `
            SELECT DISTINCT h.* FROM hopdongthue h
            JOIN phong p ON h.MaPhong = p.MaPhong
            JOIN chitiethopdongthue ct ON h.MaHDT = ct.MaHDT
            JOIN nguoidung nd ON ct.MaND = nd.MaND
            WHERE p.Ten LIKE ? OR nd.HoTen LIKE ?
            ORDER BY h.NgayKT DESC
        `;

        // CHÚ Ý: SQL ở trên chỉ có 2 dấu ? nên chỉ truyền searchTerm 2 lần
        const [rows] = await pool.query(sql, [searchTerm, searchTerm]);
        
        // Lưu ý: Nếu pool dùng chung cho cả app thì ĐỪNG dùng pool.end() ở đây, nó sẽ ngắt kết nối database của các user khác.
        // await pool.end(); 

        return (rows.length === 0)? [] : rows.map(r => new HopDongThue(r));
    }
    static async create(data) {
        const pool = await db();

        const sql = `
            INSERT INTO hopdongthue(MaPhong, NgayBD, NgayKT, TienCoc) VALUES (?,?,?,?)
        `;

        const params = [
            data.MaPhong,
            data.NgayBD,
            data.NgayKT,
            data.TienCoc
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return {
            MaHDT: result.insertId, // Lấy ID vừa tự động tăng
            ...data                 // Gộp các thông tin còn lại (MaPhong, NgayBD...)
        };;
    }
    static async update(id, data) {
        const pool = await db();

        const sql = `
            UPDATE hopdongthue SET 
            MaPhong=?,NgayBD=?,NgayKT=?,TienCoc=? 
            WHERE MaHDT=?
        `;

        const params = [
            data.MaPhong,
            data.NgayBD,
            data.NgayKT,
            data.TienCoc,
            id
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return HopDongThue.getByID(result.insertId);
    }
    static async updateKT(id) {
        const pool = await db();

        const sql = `
            UPDATE hopdongthue SET 
            NgayKT= CURRENT_DATE
            WHERE MaHDT=?
        `;

        const params = [
            id
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return HopDongThue.getByID(result.insertId);
    }
    static async delete(id) {
        const pool = await db();

        const sql = `DELETE FROM hopdongthue WHERE MaHDT = ?`;

        await pool.query(sql, [id]);
        await pool.end();

        return this.getAll();
    }
}

module.exports = HopDongThue;
