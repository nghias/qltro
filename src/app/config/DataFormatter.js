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
    static parseDatevn(dateStr) {
        // Tách chuỗi dựa vào dấu gạch chéo /
        const [day, month, year] = dateStr.split('/');
        // Tạo Date mới (Lưu ý: tháng trong JS tính từ 0 nên phải trừ 1)
        return new Date(year, month - 1, day);
    }
    
}
module.exports={DateFormatter};