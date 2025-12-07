const db = require('../config/mysqldb'); // file connectDB bạn đã tạo

class Phong {
    constructor(data) {
        this.MaPhong = data.MaPhong;
        this.Ten = data.Ten;
        this.DienTich = Number(data.DienTich);
        this.Gia = Number(data.Gia).toLocaleString('vi-VN');
        this.HinhAnh = data.HinhAnh;
    }
    static async thongKePhong() {
        const pool = await db();

        const [rows] = await pool.query(`
            SELECT 
            (SELECT COUNT(*) FROM phong) AS TongSoPhong,
            (SELECT COUNT(DISTINCT MaPhong) 
                FROM hopdongthue
                WHERE NgayKT >= CURDATE()) AS SoPhongDaThue,
            (
                (SELECT COUNT(*) FROM phong) - 
                (SELECT COUNT(DISTINCT MaPhong) FROM hopdongthue WHERE NgayKT >= CURDATE())
            ) AS SoPhongTrong
        `);
        
        await pool.end();
        
        // Trả về object kết quả đầu tiên (vì COUNT luôn trả về 1 dòng)
        return rows[0]; 
    }
    // ----------- Lấy user theo tên phòng -----------
    static async getByName(name) {
        const pool = await db();

        const [rows] = await pool.query(
            "SELECT * FROM Phong WHERE Ten = ? LIMIT 1",
            [name]
        );
        await pool.end();

        return (rows.length === 0)? [] : rows.map(row => new Phong(row));
    }
    // ----------- Lấy user theo tên phòng -----------
    static async getById(id) {
        const pool = await db();

        const [rows] = await pool.query(
            "SELECT * FROM Phong WHERE MaPhong = ? LIMIT 1",
            [id]
        );
        await pool.end();

        return (rows.length === 0)? [] : rows.map(row => new Phong(row));
    }
    static async getByMaHDT(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT p.* FROM phong p
            JOIN hopdongthue hdt ON p.MaPhong=hdt.MaPhong
            WHERE hdt.MaHDT = ? LIMIT 1`,
            [id]
        );
        await pool.end();

        return (rows.length === 0)? [] : rows.map(row => new Phong(row));
    }
    static async getByMaND(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT p.* FROM phong p 
            JOIN hopdongthue hdt ON p.MaPhong=hdt.MaPhong AND hdt.NgayKT > CURRENT_DATE
            JOIN chitiethopdongthue ct ON hdt.MaHDT=ct.MaHDT
            WHERE ct.MaND= ? LIMIT 1`,
            [id]
        );
        await pool.end();

        return (rows.length === 0)? [] : rows.map(row => new Phong(row));
    }
    static async getByMaPP(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT * FROM phong p
            JOIN hopdongthue hdt ON p.MaPhong=hdt.MaPhong AND hdt.NgayKT > CURRENT_DATE
            JOIN chitietphuphi ctpp ON hdt.MaHDT=ctpp.MaHDT
            WHERE ctpp.MaPP = ?`,
            [id]
        );
        await pool.end();

        return (rows.length === 0)? [] : rows.map(row => new Phong(row));
    }
    static async getByMaPPDT(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT p.* FROM phong p
            JOIN hopdongthue hdt ON p.MaPhong=hdt.MaPhong AND hdt.NgayKT > CURRENT_DATE
            WHERE p.MaPhong not in 
                (SELECT p.MaPhong FROM phong p
                JOIN hopdongthue hdt ON p.MaPhong=hdt.MaPhong AND hdt.NgayKT > CURRENT_DATE
                JOIN chitietphuphi ctpp ON hdt.MaHDT=ctpp.MaHDT
                WHERE ctpp.MaPP = ?)`,
            [id]
        );
        await pool.end();

        return (rows.length === 0)? [] : rows.map(row => new Phong(row));
    }
    static async getByMaHD(id) {
        const pool = await db();

        const [rows] = await pool.query(
            `SELECT p.* FROM phong p
            JOIN hopdongthue hdt ON p.MaPhong=hdt.MaPhong
            JOIN hoadon hd ON hdt.MaHDT=hd.MaHDT
            WHERE hd.MaHD = ? LIMIT 1`,
            [id]
        );
        await pool.end();

        return (rows.length === 0)? [] : rows.map(row => new Phong(row));
    }
    // ----------- Tìm kiếm phòng -----------
    static async findByKeyword(search) {
        const pool = await db();

        const s = search.toLowerCase().trim();

        let rows=[];

        // Danh sách từ khóa
        // Bỏ dấu tiếng Việt
        function removeAccents(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        }

        // Từ khóa gốc
        const hiringKeywords = [
            "đang cho thuê",
            "cho thuê",
            "đang thuê",
            "thuê"
        ].map(removeAccents);
        const emptyKeywords = [
            "đang cho thuê",
            "cho thuê",
            "đang thuê",
            "thuê"
        ].map(removeAccents);

        // Hàm kiểm tra
        const cleanText = removeAccents(s.toLowerCase());

        // Nếu search chứa từ khóa thì tìm phòng
        const isHiringSearch = hiringKeywords.some(key => cleanText.includes(key));
        const isEmptySearch = emptyKeywords.some(key => cleanText.includes(key));

        if (isHiringSearch) {
            [rows] = await pool.query(`
                SELECT p.*
                FROM Phong p
                JOIN HopDongThue h ON p.MaPhong = h.MaPhong
                WHERE h.NgayKT > CURRENT_DATE
            `);
        }else if (isEmptySearch) {
            [rows] = await pool.query(`
                SELECT p.*
                FROM Phong p
                LEFT JOIN HopDongThue h ON p.MaPhong = h.MaPhong 
                    AND h.NgayKT > CURRENT_DATE
                WHERE h.MaPhong IS NULL
            `);
        }else{
            const like = `%${search}%`;
            [rows] = await pool.query(
                `SELECT * FROM Phong WHERE Ten LIKE ? `,
                [like]
            );
        }

        await pool.end();

        return (rows.length === 0)? [] : rows.map(row => new Phong(row));
    }

    static async getAll() {
        const pool = await db();

        const [rows] = await pool.query("SELECT * FROM Phong ORDER BY MaPhong ASC");
        await pool.end();

        return (rows.length === 0)? [] : rows.map(row => new Phong(row));
    }
    static async getPhongDaThue(){
        const pool =  await db();
        const [rows] = await pool.query("SELECT * FROM `phong` WHERE MaPhong in (SELECT MaPhong FROM `hopdongthue` WHERE NgayKT > CURRENT_DATE)")
        await pool.end();
        
        return (rows.length === 0)? [] : rows.map(row => new Phong(row));
    }
    static async getPhongDaThueChuaCS(){
        const pool =  await db();
        const [rows] = await pool.query(`
            SELECT * FROM phong p
            WHERE 
                p.MaPhong IN (
                    SELECT MaPhong 
                    FROM hopdongthue 
                    WHERE NgayKT >= CURDATE()
                )
                
                AND NOT EXISTS (
                    SELECT 1 
                    FROM chisodiennuoc cs 
                    WHERE cs.MaPhong = p.MaPhong 
                    AND MONTH(cs.NgayGhi) = MONTH(CURDATE()) 
                    AND YEAR(cs.NgayGhi) = YEAR(CURDATE())
                );
            `)
        await pool.end();
        
        return (rows.length === 0)? [] : rows.map(row => new Phong(row));
    }
    static async getPhongTrong(){
        const pool =  await db();
        const [rows] = await pool.query("SELECT * FROM `phong` WHERE MaPhong not in (SELECT MaPhong FROM `hopdongthue` WHERE NgayKT > CURRENT_DATE) ORDER BY MaPhong")
        await pool.end();
        
        return (rows.length === 0)? [] : rows.map(row => new Phong(row));
    }
    
    static async create(data) {
        const pool = await db();

        const sql = `
            INSERT INTO Phong (Ten, DienTich, Gia, HinhAnh) VALUES (?, ?, ?, ?)
        `;
        const params = [
            data.TenPhong,
            data.DienTich,
            data.Gia,
            data.Hinh
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return this.getById(result.insertId);
    }

    static async update(id, Ten, DienTich, Gia, HinhAnh) {
        const pool = await db();

        const sql = `
            UPDATE Phong
            SET Ten = ?, Gia = ?, DienTich = ?, HinhAnh = ?
            WHERE MaPhong = ?
        `;

        const params = [Ten, Gia, DienTich, HinhAnh, id];

        await pool.query(sql, params);
        await pool.end();

        return this.getById(id);
    }

    static async delete(id) {
        const pool = await db();

        const sql = `DELETE FROM Phong WHERE MaPhong = ?`;

        await pool.query(sql, [id]);
        await pool.end();

        return this.getAll();
    }
}

module.exports = Phong;
