const db = require('../config/mysqldb');
const {DateFormatter} = require('../config/DataFormatter');

class GiaDienNuoc {
    constructor(data) {
        this.MaGia = data.MaGia;
        this.GiaDien = Number(data.GiaDien).toLocaleString('vi-VN');
        this.GiaNuoc = Number(data.GiaNuoc).toLocaleString('vi-VN');
        this.NgayApDung = DateFormatter.formatToDDMMYYYY(data.NgayApDung);
    }
    static async getByID(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM giadiennuoc 
            WHERE MaGia = ?`,[id]
        );
        await pool.end();

        return (rows.length === 0)? [] : new GiaDienNuoc(rows[0]);
    }
    static async getByMaHDT(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT dn.* FROM giadiennuoc dn
            LEFT JOIN hoadon hd ON hd.MaGia= dn.MaGia
            LEFT JOIN hopdongthue hdt ON hd.MaHDT=hdt.MaHDT
            WHERE hdt.MaHDT= ?
            ORDER BY hd.NgayTinh DESC LIMIT 1`,
            [id]
        );
        await pool.end();

        return (rows.length === 0)? [] : new GiaDienNuoc(rows[0]);
    }
    static async getByNew() {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM giadiennuoc 
            ORDER BY NgayApDung DESC LIMIT 1`
        );
        await pool.end();

        return (rows.length === 0)? [] : new GiaDienNuoc(rows[0]);
    }
    static async create(data) {
        const pool = await db();

        const sql = `
            INSERT INTO giadiennuoc(GiaDien, GiaNuoc, NgayApDung) 
            VALUES (?,?,CURRENT_DATE)
        `;

        const params = [
            data.GiaDien,
            data.GiaNuoc
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return GiaDienNuoc.getByNew(result.insertId);
    }
    
}

module.exports = GiaDienNuoc;
