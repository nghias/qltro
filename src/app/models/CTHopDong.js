const db = require('../config/mysqldb');
const {DateFormatter} = require('../config/DataFormatter');

class CTHopDong {
    constructor(data) {
        this.MaHDT = data.MaHDT;
        this.MaND = data.MaND;
        this.NgayKy = DateFormatter.formatToDDMMYYYY(data.NgayKy);

    }
    static async getAll() {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM chitiethopdongthue ORDER BY MaHDT DESC`
        );
        await pool.end();
        return (rows.length === 0)? [] : rows.map(r => new CTHopDong(r));
    }
    static async getByID(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM chitiethopdongthue WHERE MaHDT = ? LIMIT 1`,
            [id]
        );
        await pool.end();
        return (rows.length === 0)? [] : new CTHopDong(rows[0]);
    }
    static async create(data) {
        const pool = await db();

        const sql = `
            INSERT INTO chitiethopdongthue(MaND, MaHDT, NgayKy) VALUES (?,?,CURRENT_DATE)
        `;

        const params = [
            data.MaND,
            data.MaHDT
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return this.getAll();
    }
    static async delete(id) {
        const pool = await db();

        const sql = `DELETE FROM chitiethopdongthue WHERE MaHDT = ?`;

        await pool.query(sql, [id]);
        await pool.end();

        return this.getAll();
    }
}

module.exports = CTHopDong;
