class DateFormatter {
    /**
     * Phương thức tĩnh để định dạng ngày tháng sang chuỗi "DD/MM/YYYY".
     * Có thể gọi trực tiếp bằng DateFormatter.formatToDDMMYYYY(...) mà không cần tạo đối tượng.
     *
     * @param {Date | string} dateInput - Đối tượng Date hoặc chuỗi ngày tháng đầu vào.
     * @returns {string} Chuỗi ngày tháng đã được định dạng.
     */
    static formatToDDMMYYYY(dateInput) {
        // 1. Chuyển đổi đầu vào thành đối tượng Date
        let date;
        if (typeof dateInput === 'string') {
            date = new Date(dateInput);
        } else if (dateInput instanceof Date) {
            date = dateInput;
        } else {
            // Mặc định là ngày hiện tại nếu đầu vào không hợp lệ
            date = new Date(); 
        }

        // Kiểm tra tính hợp lệ của ngày
        if (isNaN(date.getTime())) {
            return "Ngày không hợp lệ";
        }

        // 2. Lấy các thành phần ngày, tháng, năm
        const day = date.getDate();
        // getMonth() trả về 0-11, cần cộng 1.
        const month = date.getMonth() + 1; 
        const year = date.getFullYear();

        // 3. Sử dụng padStart() để đảm bảo DD và MM luôn có 2 chữ số
        const formattedDay = String(day).padStart(2, '0');
        const formattedMonth = String(month).padStart(2, '0');
        
        // 4. Trả về chuỗi kết quả
        return `${formattedDay}/${formattedMonth}/${year}`;
    }
    static parseDate(dateStr) {
        if (dateStr instanceof Date) {
            return dateStr;
        }
        
        if (!dateStr) return null;

        let year, month, day;

        if (dateStr.includes('-')) {
            [year, month, day] = dateStr.split('-');
        } else {
            [day, month, year] = dateStr.split('/');
        }
        return new Date(year, month - 1, day);
    }

    static checkSameMonthYear(dateStr1, dateStr2) {
        if (dateStr1.getMonth() === dateStr2.getMonth() && dateStr1.getFullYear() === dateStr2.getFullYear()) {
            return true; 
        } else {
            return false; 
        }
    }
}
module.exports={DateFormatter};