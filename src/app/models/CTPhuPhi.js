const db = require('../config/mysqldb');
const {DateFormatter} = require('../config/DataFormatter');

class CTPhuPhi {
    constructor(data) {
        this.MaPP = data.MaPP;
        this.MaHDT = data.MaHDT;
        this.NgayApDung = DateFormatter.formatToDDMMYYYY(data.NgayApDung);
    }
    static async getAll() {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM phuphi ORDER BY TenPP DESC`
        );
        await pool.end();
        return (rows.length === 0)? [] : rows.map(r => new CTPhuPhi(r));
    }
    static async getByMaPP(id) {
        const pool = await db();

        const [rows] = await pool.query(
            "SELECT * FROM chitietphuphi WHERE MaPP = ?",
            [id]
        );
        await pool.end();

        if (rows.length === 0) return null;

        return new CTPhuPhi(rows[0]);
    }
    static async getByMaHDT(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM chitietphuphi 
            WHERE MaHDT=?`,
            [id]
        );
        await pool.end();

        return (rows.length === 0)? [] : rows.map(r => new CTPhuPhi(r));
    }
    static async create(data) {
        const pool = await db();

        const sql = `
            INSERT INTO chitietphuphi(MaPP, MaHDT, NgayApDung) VALUES (?,?,CURRENT_DATE)
        `;

        const params = [
            data.MaPP,
            data.MaHDT
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return ;
    }
    static async delete(id) {
        const pool = await db();

        const sql = `DELETE FROM chitietphuphi WHERE MaPP = ?`;

        await pool.query(sql, [id]);
        await pool.end();

        return this.getAll();
    }
}

module.exports = CTPhuPhi;
