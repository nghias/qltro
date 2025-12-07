const db = require('../config/mysqldb');
const {DateFormatter} = require('../config/DataFormatter');

class ThongBao {
    constructor(data) {
        this.MaTB = data.MaTB;
        this.NDGui = data.NDGui;
        this.NDNhan = data.NDNhan;
        this.TieuDe = data.TieuDe;
        this.NoiDung = data.NoiDung;
        this.NgayGui = DateFormatter.formatToDDMMYYYY(data.NgayGui);
        this.TrangThai = data.TrangThai;
    }
    static async getAll(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM thongbao
            Where NDGui = ? OR NDNhan = ?
            ORDER BY NgayGui`,
            [id, id]
        );
        await pool.end();
        return (rows.length === 0)? [] : rows.map(r => new ThongBao(r));
    }
    static async getByID(id) {
        const pool = await db();

        const [rows] = await pool.query(
            "SELECT * FROM thongbao WHERE MaTB = ? LIMIT 1",
            [id]
        );
        await pool.end();

        if (rows.length === 0) return null;

        return new ThongBao(rows[0]);
    }
    static async getByNDNhan(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM thongbao
            WHERE NDNhan=?
            ORDER BY NgayGui`,
            [id]
        );
        await pool.end();

        return (rows.length === 0)? [] : rows.map(r => new ThongBao(r));
    }
    static async getByNDGui(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM thongbao
            WHERE NDGui=?
            ORDER BY NgayGui`,
            [id]
        );
        await pool.end();

        return (rows.length === 0)? [] : rows.map(r => new ThongBao(r));
    }
    static async findByKeyword(keyword) {
        const pool = await db();

        const searchTerm = `%${keyword}%`;

        // SỬA CÂU SQL: Lấy Hợp Đồng làm gốc (FROM hopdongthue)
        const sql = `
            SELECT * FROM PhuPhi 
            WHERE TenPP LIKE ? 
            OR GhiChu LIKE ?
        `;

        // CHÚ Ý: SQL ở trên chỉ có 2 dấu ? nên chỉ truyền searchTerm 2 lần
        const [rows] = await pool.query(sql, [searchTerm, searchTerm]);
        
        // Lưu ý: Nếu pool dùng chung cho cả app thì ĐỪNG dùng pool.end() ở đây, nó sẽ ngắt kết nối database của các user khác.
        // await pool.end(); 

        return (rows.length === 0)? [] : rows.map(r => new PhuPhi(r));
    }
    static async create(data) {
        const pool = await db();

        const sql = `
            INSERT INTO thongbao(NDGui, NDNhan, TieuDe, NoiDung, TrangThai) 
            VALUES (?,?,?,?,'Chưa đọc')
        `;

        const params = [
            data.NDGui,
            data.NDNhan,
            data.TieuDe,
            data.NoiDung
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return {
            MaTB: result.insertId,
            ...data                
        };
    }
    static async updateTrangThaiDD(id) {
        const pool = await db();

        const sql = `
            UPDATE thongbao SET 
            TrangThai='Đã đọc'
            WHERE MaTB=?
        `;

        const params = [
            id
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return {
            MaTB: result.insertId             
        };
    }
    static async updateTrangThaiCD(id) {
        const pool = await db();

        const sql = `
            UPDATE thongbao SET 
            TrangThai='Chưa đọc'
            WHERE MaTB=?
        `;

        const params = [
            id
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return {
            MaTB: result.insertId             
        };
    }
    static async delete(id) {
        const pool = await db();

        const sql = `DELETE FROM thongbao WHERE MaTB = ?`;

        await pool.query(sql, [id]);
        await pool.end();

        return ThongBao.getAll();
    }
}

module.exports = ThongBao;
