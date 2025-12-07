const Bcrypt = require('../config/hash');
const db = require('../config/mysqldb'); // file connectDB bạn đã tạo

class NguoiDung {
    constructor(data) {
        this.MaND = data.MaND;
        this.HoTen = data.HoTen;
        this.CCCD = data.CCCD;
        this.NamSinh = data.NamSinh;
        this.SDT = data.SDT;
        this.ThuongTru = data.ThuongTru;
        this.TenTK = data.TenTK;
        this.MatKhau = data.MatKhau;
        this.Quyen = data.Quyen;
        this.AVT = data.AVT;
        this.TenPhong = data.Ten || '';
        // this.TenPhong = data.Ten ? data.Ten : (data.Quyen === 'admin' ? "Chủ trọ" : "Hết hợp đồng");
    }
    static async thongKeNguoiDung() {
        const pool = await db();

        const [rows] = await pool.query(`
            SELECT 
            (SELECT COUNT(*) FROM nguoidung WHERE Quyen = 'user') AS TongKhachHang,
            (SELECT COUNT(*) FROM nguoidung WHERE Quyen = 'admin') AS TongAdmin,
            (SELECT COUNT(DISTINCT ct.MaND) 
                FROM chitiethopdongthue ct 
                JOIN hopdongthue hd ON ct.MaHDT = hd.MaHDT 
                WHERE hd.NgayKT >= CURDATE()) AS KhachDangThue,
            (SELECT COUNT(DISTINCT MaND) FROM chitiethopdongthue) AS KhachCoLichSu
        `);
        
        await pool.end();
        
        const data = rows[0];

        // Tính toán các chỉ số còn lại từ dữ liệu thô
        const khachHetHan = data.KhachCoLichSu - data.KhachDangThue;
        const khachChuaThue = data.TongKhachHang - data.KhachCoLichSu;

        return {
            tongNguoiDung: data.TongKhachHang + data.TongAdmin,
            tongKhachHang: data.TongKhachHang,                  
            admin: data.TongAdmin,
            dangThue: data.KhachDangThue,
            hetHanHopDong: khachHetHan,
            chuaCoHopDong: khachChuaThue
        };
    }
    // ----------- Lấy user theo tên tài khoản -----------
    static async getByUsernameID(username, MaND) {
        const pool = await db();

        const [rows] = await pool.query(
            "SELECT * FROM NguoiDung WHERE TenTK = ? AND MaND = ? LIMIT 1",
            [username, MaND]
        );
        await pool.end();

        if (rows.length === 0) return null;

        return new NguoiDung(rows[0]);
    }

    static async getPasByUsername(username) {
        const pool = await db();

        // 1. Sửa câu lệnh SQL: Chỉ SELECT MaND và MatKhau
        // 2. Bỏ điều kiện 'AND MatKhau = ?' đi (chỉ tìm theo user)
        const [rows] = await pool.query(
            "SELECT MaND, MatKhau FROM NguoiDung WHERE TenTK = ? LIMIT 1",
            [username]
        );
        await pool.end();

        // Nếu không tìm thấy user nào
        if (rows.length === 0) return null;

        // Trả về kết quả (chứa MaND và chuỗi hash MatKhau)
        return rows[0]; 
        // Lưu ý: Nếu class NguoiDung của bạn yêu cầu full dữ liệu thì dòng trên
        // nên để là return rows[0] thay vì new NguoiDung(rows[0]) để tránh lỗi thiếu trường.
    }

    static async getById(id) {
        const pool = await db();

        const [rows] = await pool.query(
            "SELECT * FROM NguoiDung WHERE MaND = ? LIMIT 1",
            [id]
        );
        await pool.end();

        if (rows.length === 0) return null;

        return new NguoiDung(rows[0]);
    }

    static async findByKeyword(keyword) {
        const pool = await db();

        const searchTerm = `%${keyword}%`;
        const sql = `
            SELECT nd.*, p.Ten 
            FROM NguoiDung nd
            LEFT JOIN chitiethopdongthue cthdt ON nd.MaND = cthdt.MaND
            LEFT JOIN hopdongthue hdt ON cthdt.MaHDT = hdt.MaHDT AND hdt.NgayKT > CURRENT_DATE
            LEFT JOIN phong p ON hdt.MaPhong = p.MaPhong
            WHERE nd.HoTen LIKE ? 
               OR nd.SDT LIKE ? 
               OR nd.CCCD LIKE ?
               OR p.Ten LIKE ?
            ORDER BY p.Ten ASC, nd.HoTen
        `;

        // 3. Truyền tham số (Vì có 3 dấu ? nên phải truyền searchTerm 3 lần)
        const [rows] = await pool.query(sql, [searchTerm, searchTerm, searchTerm, searchTerm]);
        await pool.end();

        return rows.map(row => new NguoiDung(row));
    }
    static async getByHDT(id) {
        const pool = await db();

        const [rows] = await pool.query(
            "SELECT nd.* FROM nguoidung nd JOIN chitiethopdongthue cthdt ON cthdt.MaND=nd.MaND WHERE cthdt.MaHDT=?",
            [id]
        );
        await pool.end();

        if (rows.length === 0) return null;

        return rows;
    }
    // ----------- Lấy tất cả user -----------
    static async getAll() {
        const pool = await db();

        const [rows] = await pool.query(`
            SELECT nd.*, p.Ten
            FROM NguoiDung nd
            LEFT JOIN chitiethopdongthue cthdt ON nd.MaND = cthdt.MaND
            LEFT JOIN hopdongthue hdt ON cthdt.MaHDT = hdt.MaHDT AND hdt.NgayKT > CURRENT_DATE 
            LEFT JOIN phong p ON hdt.MaPhong = p.MaPhong
            ORDER BY p.Ten ASC, nd.HoTen
        `);
        await pool.end();

        return rows.map(row => new NguoiDung(row));
    }
    static async getNDTrong() {
        const pool = await db();

        const [rows] = await pool.query(`
           SELECT * FROM nguoidung
            WHERE Quyen = "user" 
            AND MaND NOT IN 
            (SELECT cthdt.MaND 
            FROM chitiethopdongthue cthdt 
            LEFT JOIN hopdongthue hdt 
            ON cthdt.MaHDT = hdt.MaHDT 
            WHERE hdt.NgayKT > CURRENT_DATE) 
        `);
        await pool.end();

        return rows.map(row => new NguoiDung(row));
    }
    static async getNDThue() {
        const pool = await db();

        const [rows] = await pool.query(`
           SELECT * FROM nguoidung
            WHERE Quyen = "user" 
            AND MaND IN 
            (SELECT cthdt.MaND 
            FROM chitiethopdongthue cthdt 
            LEFT JOIN hopdongthue hdt 
            ON cthdt.MaHDT = hdt.MaHDT 
            WHERE hdt.NgayKT > CURRENT_DATE) 
        `);
        await pool.end();

        return rows.map(row => new NguoiDung(row));
    }
    static async getNDThueTB() {
        const pool = await db();

        const [rows] = await pool.query(`
           SELECT * FROM nguoidung
            WHERE Quyen = 'admin' OR MaND IN 
            (SELECT cthdt.MaND 
            FROM chitiethopdongthue cthdt 
            LEFT JOIN hopdongthue hdt 
            ON cthdt.MaHDT = hdt.MaHDT 
            WHERE hdt.NgayKT > CURRENT_DATE) 
        `);
        await pool.end();

        return rows.map(row => new NguoiDung(row));
    }
    static async checkExist(field, value, excludeId = null) {
        const pool = await db();
        
        // 1. Sửa câu SQL: Chỉ lấy cột MaND, thêm LIMIT 1 cho nhanh
        let sql = `SELECT MaND FROM NguoiDung WHERE ${field} = ?`;
        const params = [value];

        // 2. Nếu đang SỬA (có excludeId), trừ người hiện tại ra
        if (excludeId) {
            sql += ` AND MaND != ?`;
            params.push(excludeId);
        }

        // Thêm LIMIT 1 để tìm thấy 1 cái là dừng luôn -> Tối ưu tốc độ
        sql += ` LIMIT 1`;

        const [rows] = await pool.query(sql, params);
        await pool.end();

        // 3. Kiểm tra và trả về kết quả
        if (rows.length > 0) {
            return rows[0].MaND; // Trả về Mã Người Dùng tìm thấy (ví dụ: 5, 10...)
        }
        
        return null; // Không tìm thấy thì trả về null
    }

    // ----------- Thêm người dùng -----------
    static async create(data) {
        const pool = await db();

        const sql = `
            INSERT INTO NguoiDung (HoTen, CCCD, NamSinh, SDT, ThuongTru, TenTK, MatKhau, Quyen, AVT)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            data.HoTen,
            data.CCCD,
            data.NamSinh,
            data.SDT,
            data.ThuongTru,
            data.TenTK,
            data.MatKhau,
            data.Quyen,
            data.AVT
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return this.getById(result.insertId);
    }
    static async update(id, data) {
        const pool = await db();

        const sql = `
            UPDATE NguoiDung
            SET HoTen = ?, CCCD = ?, NamSinh = ?, SDT = ?, ThuongTru = ?, Quyen = ?, AVT = ?
            WHERE MaND = ?
        `;

        const params = [
            data.HoTen, 
            data.CCCD, 
            data.NamSinh, 
            data.SDT, 
            data.ThuongTru, 
            data.Quyen, 
            data.AVT, 
            id
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return this.getById(result.insertId);
    }
    static async updatefull(id, data) {
        const pool = await db();

        const sql = `
            UPDATE NguoiDung
            SET HoTen = ?, CCCD = ?, NamSinh = ?, SDT = ?, ThuongTru = ?,  AVT = ?
            WHERE MaND = ? AND MatKhau = ?
        `;

        const params = [
            data.HoTen, 
            data.CCCD, 
            data.NamSinh,
            data.SDT, 
            data.ThuongTru, 
            data.AVT,
            id,
            data.MatKhau
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return this.getById(result.insertId);
    }

    static async resetpass(id) {
        const pool = await db();
        const nd = await NguoiDung.getById(id);

        const newpass = await Bcrypt.hash(nd.TenTK);

        const sql = `
            UPDATE NguoiDung
            SET MatKhau = ?
            WHERE MaND = ?
        `;

        const params = [
            newpass,
            id
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return this.getById(result.insertId);
    }
        static async updatepass(id, data) {
        const pool = await db();

        const sql = `
            UPDATE NguoiDung
            SET MatKhau = ?
            WHERE MaND = ? AND MatKhau = ?
        `;

        const params = [
            data.MatKhauMoi,
            id,
            data.MatKhauCu
        ];

        const [result] = await pool.query(sql, params);
        await pool.end();

        return this.getById(result.insertId);
    }

    // ----------- 3. XÓA NGƯỜI DÙNG (DELETE) -----------
    static async delete(id) {
        const pool = await db();

        const sql = `DELETE FROM NguoiDung WHERE MaND = ?`;

        await pool.query(sql, [id]);
        await pool.end();

        return this.getAll();
    }
}

module.exports = NguoiDung;
