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
            ORDER BY NgayGui DESC`,
            [id, id]
        );
        await pool.end();
        return (rows.length === 0)? [] : rows.map(r => new ThongBao(r));
    }
    static async findByKeyword(keyword, id) {
        const pool = await db();

        const searchTerm = `%${keyword}%`;

        const sql = `
            SELECT tb.*
            FROM ThongBao tb
            JOIN NguoiDung nd ON tb.NDGui = nd.MaND OR tb.NDNhan = nd.MaND
            WHERE 
                (tb.TieuDe LIKE ? 
                OR tb.NoiDung LIKE ? 
                OR nd.HoTen LIKE ?)
                AND (NDGui = ? OR NDNhan = ?)
            ORDER BY NgayGui DESC
        `;

        const [rows] = await pool.query(sql, [searchTerm, searchTerm, searchTerm, id, id]);
        
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
            ORDER BY NgayGui DESC`,
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
            ORDER BY NgayGui DESC`,
            [id]
        );
        await pool.end();

        return (rows.length === 0)? [] : rows.map(r => new ThongBao(r));
    }
    static async create(data) {
        const pool = await db();

        const sql = `
            INSERT INTO thongbao(NDGui, NDNhan, TieuDe, NoiDung, NgayGui, TrangThai) 
            VALUES (?,?,?,?, CURRENT_DATE,'Chưa đọc')
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
