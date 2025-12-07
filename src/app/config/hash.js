const bcrypt = require('bcrypt');

class Bcrypt {

    // Mã hoá mật khẩu
    static async hash(password) {
        return await bcrypt.hash(password, 12);
    }

    // So khớp mật khẩu
    static async compare(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

module.exports = Bcrypt;
