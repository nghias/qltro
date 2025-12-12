const db = require('../config/mysqldb');
const {DateFormatter} = require('../config/DataFormatter');

class CSDienNuoc {
    constructor(data) {
        this.MaCS = data.MaCS;
        this.MaPhong = data.MaPhong;
        this.SoDCu = Number(data.SoDCu).toLocaleString('vi-VN');
        this.SoDMoi = Number(data.SoDMoi).toLocaleString('vi-VN');
        this.SoNCu = Number(data.SoNCu).toLocaleString('vi-VN');
        this.SoNMoi = Number(data.SoNMoi).toLocaleString('vi-VN');
        this.NgayGhi = DateFormatter.formatToDDMMYYYY(data.NgayGhi);
    }
    static async ktCoCS() {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT COUNT(*) AS SO FROM chisodiennuoc 
            WHERE MONTH(NgayGhi) = MONTH(CURDATE()) 
            AND YEAR(NgayGhi) = YEAR(CURDATE());`,
        );
        await pool.end();
        return (rows.length === 0)? 0 : rows[0].SO;
    }
    static async getAll() {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM chisodiennuoc ORDER BY NgayGhi DESC`
        );
        await pool.end();
        return (rows.length === 0)? [] : rows.map(r => new CSDienNuoc(r));
    }
    static async getByID(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM chisodiennuoc WHERE MaCS = ? LIMIT 1`,
            [id]
        );
        await pool.end();
        return (rows.length === 0)? [] : new CSDienNuoc(rows[0]);
    }
    static async getByMaPhong(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM chisodiennuoc WHERE MaPhong = ?`,
            [id]
        );
        await pool.end();
        return (rows.length === 0)? [] : rows.map(r => new CSDienNuoc(r));
    }
    static async getByMaPhongNew(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM chisodiennuoc WHERE MaPhong = ? ORDER BY NgayGhi DESC LIMIT 1`,
            [id]
        );
        await pool.end();
        return (rows.length === 0)? [] : new CSDienNuoc(rows[0]);
    }
    static async findByKeyword(keyword) {
        const pool = await db();

        const searchTerm = `%${keyword}%`;
        let sql = `
            SELECT c.* FROM chisodiennuoc c
            JOIN Phong p ON c.MaPhong = p.MaPhong
            WHERE p.Ten LIKE ?
            ORDER BY c.NgayGhi DESC
        `;

        const [rows] = await pool.query(sql, [searchTerm]);
        await pool.end();

        return (rows.length === 0)? [] : rows.map(r => new CSDienNuoc(r));
    }
    static async create(data) {
        const pool = await db();

        const sql = `
            INSERT INTO chisodiennuoc(MaPhong, SoDCu, SoDMoi, SoNCu, SoNMoi, NgayGhi)
            VALUES (?,?,?,?,?,CURRENT_DATE)
        `;

        const params = [
            data.MaPhong,
            data.SoDCu,
            data.SoDMoi,
            data.SoNCu,
            data.SoNMoi
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return CSDienNuoc.getByID(result.insertId);
    }
    static async update(id, data) {
        const pool = await db();

        const sql = `
            UPDATE chisodiennuoc 
            SET SoDMoi=?, SoNMoi=?
            WHERE MaCS=?
        `;

        const params = [
            data.SoDMoi,
            data.SoNMoi,
            id
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return CSDienNuoc.getByID(result.insertId);
    }

    static async delete(id) {
        const pool = await db();

        const sql = `DELETE FROM chisodiennuoc WHERE MaCS=?`;

        await pool.query(sql, [id]);
        await pool.end();

        return this.getAll();
    }
    
    static async deleteByNgay(id) {
        const pool = await db();

        const sql = `DELETE FROM chisodiennuoc WHERE Ngayghi=?`;

        await pool.query(sql, [id]);
        await pool.end();

        return this.getAll();
    }
}

module.exports = CSDienNuoc;
