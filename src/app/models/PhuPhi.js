const db = require('../config/mysqldb');

class PhuPhi {
    constructor(data) {
        this.MaPP = data.MaPP;
        this.TenPP = data.TenPP;
        this.Gia = Number(data.Gia).toLocaleString('vi-VN');
        this.GhiChu = data.GhiChu;
    }
    static async getAll() {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM phuphi ORDER BY TenPP DESC`
        );
        await pool.end();
        return (rows.length === 0)? [] : rows.map(r => new PhuPhi(r));
    }
    static async getById(id) {
        const pool = await db();

        const [rows] = await pool.query(
            "SELECT * FROM phuphi WHERE MaPP = ? LIMIT 1",
            [id]
        );
        await pool.end();

        if (rows.length === 0) return null;

        return new PhuPhi(rows[0]);
    }
    static async getByMaHDT(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM phuphi pp
            JOIN chitietphuphi ctpp ON pp.MaPP=ctpp.MaPP
            WHERE ctpp.MaHDT=?`,
            [id]
        );
        await pool.end();

        return (rows.length === 0)? [] : rows.map(r => new PhuPhi(r));
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
            INSERT INTO phuphi(TenPP, Gia, GhiChu) VALUES (?,?,?)
        `;

        const params = [
            data.TenPP,
            data.Gia,
            data.GhiChu
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return {
            MaPP: result.insertId,
            ...data                
        };
    }
    static async update(id, data) {
        const pool = await db();

        const sql = `
            UPDATE phuphi SET 
            TenPP=?,Gia=?,GhiChu=?
            WHERE MaPP=?
        `;

        const params = [
            data.TenPP,
            data.Gia,
            data.GhiChu,
            id
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return {
            MaPP: result.insertId,
            ...data                
        };;;
    }
    static async delete(id) {
        const pool = await db();

        const sql = `DELETE FROM phuphi WHERE MaPP = ?`;

        await pool.query(sql, [id]);
        await pool.end();

        return PhuPhi.getAll();
    }
}

module.exports = PhuPhi;
