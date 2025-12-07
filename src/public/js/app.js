// -------------------------------------
//              Chung
// -------------------------------------

function close(className) {
    document.querySelector(className).classList.add('d-none');
}
function open(className) {
    document.querySelector(className).classList.remove('d-none');
}

function formatDateToInput(d) {
    const date = new Date(d);
    const year = date.getFullYear();
    // Tháng bắt đầu từ 0 nên phải +1, padStart(2, '0') để thêm số 0 đằng trước nếu < 10
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}
function formatDateToDDMMYYYY(d) {
    const date = new Date(d);
    const year = date.getFullYear();
    // Tháng bắt đầu từ 0 nên phải +1, padStart(2, '0') để thêm số 0 đằng trước nếu < 10
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${day}-${month}-${year}`;
}
// -------------------------------------
//              Form
// -------------------------------------

function openForm(className) {
    document.querySelector(className).classList.remove('d-none');
    document.querySelector(className).classList.add('d-flex');
    document.body.style.overflow = "hidden"; // khóa scroll
}

function closeForm(className) {
    document.querySelector(className).classList.remove('d-flex');
    document.querySelector(className).classList.add('d-none');
    document.body.style.overflow = "auto";
}

// -------------------------------------
//              Error
// -------------------------------------

function showErr(input, errEl, msg) {
    if(errEl) {
        errEl.textContent = msg;
        errEl.classList.remove('d-none'); // Hiện lỗi
        input.classList.add('is-invalid'); // Viền đỏ (nếu dùng Bootstrap)
    }
}

function hideErr(input, errEl) {
    if(errEl) {
        errEl.textContent = "";
        errEl.classList.add('d-none');
        input.classList.remove('is-invalid');
    }
}

// -------------------------------------
//              Validdation
// -------------------------------------

// Kiểm tra rỗng (An toàn)
function validaRong(name, idErr, desc) {
    const elements = document.getElementsByName(name);

    // Chỉ chạy nếu tìm thấy thẻ input
    if (elements.length > 0) {
        elements[0].addEventListener("blur", function () {
            let err = document.querySelector(idErr);
            if (this.value.trim() === "") {
                showErr(this, err, desc + " không thể để trống");
            } else {
                hideErr(this, err);
            }
        });
    }
}

// Kiểm tra chỉ nhập Chữ (An toàn)
function validaChu(name, idErr, desc) {
    const elements = document.getElementsByName(name);

    // Chỉ chạy nếu tìm thấy thẻ input
    if (elements.length > 0) {
        elements[0].addEventListener("blur", function () {
            let regex = /^[\p{L}\s]+$/u; // Regex hỗ trợ Tiếng Việt
            let err = document.querySelector(idErr);
            
            if (this.value.trim() === "") {
                showErr(this, err, desc + " không thể để trống");
            } else if (!regex.test(this.value)) {
                showErr(this, err, desc + " không có kí tự đặc biệt và số");
            } else {
                hideErr(this, err);
            }
        });
    }
}
//Chữ và số
function validaChuSo(name, idErr, desc) {
    // 1. Lấy danh sách thẻ
    const elements = document.getElementsByName(name);

    // 2. KIỂM TRA QUAN TRỌNG: Nếu tìm thấy ít nhất 1 thẻ thì mới làm tiếp
    if (elements.length > 0) {
        
        elements[0].addEventListener("blur", function () {
            let regex = /^[\p{L}\d\s]+$/u;
            let err = document.querySelector(idErr);
            
            if (this.value.trim() === "") {
                showErr(this, err, desc + " không thể để trống");
            } else if (!regex.test(this.value)) {
                showErr(this, err, desc + " không có kí tự đặc biệt");
            } else {
                hideErr(this, err);
            }
        });

    } else {
        // (Tuỳ chọn) Console log để biết trang này không có input đó
        // console.log("Không tìm thấy input có name: " + name);
    }
}
//Số
function validaSo(name, idErr, min, max, desc) {
    const elements = document.getElementsByName(name);

    // Chỉ chạy nếu tìm thấy thẻ input
    if (elements.length > 0) {
        elements[0].addEventListener("blur", function () {
            let err = document.querySelector(idErr);
            let v = this.value.trim();

            if (v === "") {
                showErr(this, err, desc + " không được để trống");
            } else if (isNaN(v)) {
                showErr(this, err, desc + " phải là số");
            } else if (Number(v) > max) { // Dùng parseFloat để so sánh chính xác hơn
                showErr(this, err, desc + " không thể lớn hơn " + max);
            } else if (Number(v) < min) {
                showErr(this, err, desc + " không thể nhỏ hơn " + min);
            } else {
                hideErr(this, err);
            }
        });
    }
}
// SDT, CMND
// Kiểm tra số lượng ký tự số (VD: CMND phải đủ 9 hoặc 12 số)
function validaSoLimit(name, idErr, limit, desc) {
    const elements = document.getElementsByName(name);

    // Chỉ chạy nếu tìm thấy thẻ
    if (elements.length > 0) {
        elements[0].addEventListener("blur", function () {
            let err = document.querySelector(idErr);
            let v = this.value.trim();
            const regex = new RegExp(`^\\d{${limit}}$`);

            if (v === "") {
                showErr(this, err, desc + " không được để trống");
            } else if (isNaN(v)) {
                showErr(this, err, desc + " phải là số");
            } else if (!regex.test(v)) {
                showErr(this, err, desc + " phải đủ " + limit + " số");
            } else {
                hideErr(this, err);
            }
        });
    }
}

// Kiểm tra file Ảnh (Có tham số index vì có thể có nhiều input file)
function vaidaAnh(name, idErr, index) {
    const elements = document.getElementsByName(name);

    // Kiểm tra xem thẻ tại vị trí [index] có tồn tại không
    if (elements[index]) {
        elements[index].addEventListener("blur", function () { // Hoặc dùng sự kiện 'change' sẽ tốt hơn cho file
            let err = document.querySelector(idErr);
            // Kiểm tra this.files có tồn tại không để tránh lỗi null
            let file = this.files && this.files[0] ? this.files[0] : null;

            // Cho phép bỏ trống (nếu không bắt buộc)
            if (!file) {
                hideErr(this, err);
                return;
            }

            // Kiểm tra định dạng ảnh
            const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];

            if (!validTypes.includes(file.type)) {
                showErr(this, err, "File phải là ảnh (jpg, png, jpeg, gif)");
                this.value = "";   // reset file
                return;            // KHÔNG hideErr()
            }

            // Hợp lệ → ẩn lỗi
            hideErr(this, err);
        });
    }
}

// Kiểm tra mật khẩu
function validaPassWord(name, idErr) {
    const elements = document.getElementsByName(name);

    // Chỉ chạy nếu tìm thấy thẻ
    if (elements.length > 0) {
        elements[0].addEventListener("blur", function () {
            let err = document.querySelector(idErr);
            let v = this.value.trim();
            if (v === "") {
                showErr(this, err, "Mật khẩu không được để trống");
            } else {
                hideErr(this, err);
            }
        });
    }
}

// -------------------------------------
//              PopUp
// -------------------------------------

const myModal = new bootstrap.Modal(document.getElementById('statusModal'));

// Lấy các phần tử DOM cần thiết
const modalContent = document.getElementById('modalContent');
const notifyIcon = document.getElementById('notifyIcon');
const notifyTitle = document.getElementById('notifyTitle');
const timerBar = document.getElementById('timerBar');

let closeTimeout; // Biến lưu ID của bộ đếm giờ

function showNotification(type, title) {
    // 1. Xóa bộ đếm giờ cũ nếu đang chạy (tránh xung đột khi bấm liên tục)
    clearTimeout(closeTimeout);

    // 2. Reset thanh thời gian (xóa class animation để chạy lại từ đầu)
    timerBar.classList.remove('running');
    // Force reflow: Dòng này "lừa" trình duyệt vẽ lại để animation có thể reset ngay lập tức
    void timerBar.offsetWidth; 

    // 3. Thiết lập nội dung và giao diện
    if (type === 'success') {
        // Giao diện thành công
        modalContent.className = 'modal-content success-theme';
        notifyIcon.className = 'status-icon bi bi-check-circle-fill d-block mb-3'; // Icon dấu tích
    } else {
        // Giao diện thất bại
        modalContent.className = 'modal-content failure-theme';
        notifyIcon.className = 'status-icon bi bi-x-circle-fill d-block mb-3'; // Icon dấu X
    }
    
    notifyTitle.textContent = title;

    // 4. Hiển thị Modal
    myModal.show();

    // 5. Bắt đầu chạy thanh thời gian
    timerBar.classList.add('running');

    // 6. Hẹn giờ đóng modal sau ms
    closeTimeout = setTimeout(() => {
        myModal.hide();
    }, 1000);
}

// -------------------------------------
//              Phòng Trọ
// -------------------------------------
async function ThemPhongTro() {
    try {
        document.getElementsByName("TenPhong")[0].value = "";
        document.getElementsByName("DienTich")[0].value = "";
        document.getElementsByName("Gia")[0].value = "";
        document.getElementsByName("HinhCu")[0].value = "";

        document.querySelector('.TenPhongTest').innerText = "Tên Phòng";
        document.querySelector('.DienTichTest').innerText = 0;
        document.querySelector('.GiaTest').innerText = 0;
        document.querySelector('.AnhPhongTest').src = "/img/logo.png";

        openForm('.form-phong-cover');
        document.querySelector('.form-phong-title').innerText = "Thêm Phòng";
    } catch (err) {
        console.error("Lỗi:", err);
    }
}
async function SuaPhongTro(id) {
    try {
        // 1. Gọi lên Server hỏi thông tin của ID này
        const response = await fetch(`/admin/phongtro/${id}`);
        
        if (!response.ok) {
            alert("Không lấy được dữ liệu!");
            return;
        }

        const data = await response.json(); 
        console.log("Dữ liệu nhận được:", data);

        const ten = data.Ten;
        const dt = data.DienTich;
        const giaCoDau = data.Gia; // ví dụ: "11.231.444"
        const gia = giaCoDau.replace(/\./g, "");
        const hinh = data.HinhAnh;

        document.getElementsByName("TenPhong")[0].value = ten;
        document.getElementsByName("DienTich")[0].value = dt;
        document.getElementsByName("Gia")[0].value = gia;
        document.getElementsByName("HinhCu")[0].value = hinh;

        document.querySelector('.TenPhongTest').innerText = ten;
        document.querySelector('.DienTichTest').innerText = Number(dt);
        document.querySelector('.GiaTest').innerText = Number(gia).toLocaleString('vi-VN');
        document.querySelector('.AnhPhongTest').src = "/img/"+hinh;

        document.querySelector('.form-phong').action=`/admin/phongtro/${id}?_method=PUT`;
       
        openForm('.form-phong-cover');
        document.querySelector('.form-phong-title').innerText = "Cập Nhật Phòng";
    } catch (err) {
        console.error("Lỗi:", err);
    }
}
async function XoaPhongTro(id, hinh) {
    try {
        document.getElementsByName("HinhXoa")[0].value = hinh;

        openForm('.form-phong-xoa-cover');

        document.querySelector('.form-phong-xoa').action=`/admin/phongtro/${id}?_method=DELETE`;
    } catch (err) {
        console.error("Lỗi:", err);
    }
}
validaChuSo('TenPhong','#tenPhongError', "Tên phòng");
validaSo('DienTich','#dienTichError',1,1000,"Diện tích");
validaSo('Gia','#giaPhongError',100000,100000000,"Giá phòng");
vaidaAnh('Hinh','#anhPhongError',0);

const formPhong = document.querySelector('.form-phong');
if(formPhong){
    formPhong.addEventListener("submit", function (e) {

        let hasError = false;

        // LẤY INPUT (ELEMENT)
        const tenInput = document.getElementsByName("TenPhong")[0];
        const giaInput = document.getElementsByName("Gia")[0];
        const dientichInput = document.getElementsByName("DienTich")[0];
        const hinhInput = document.getElementsByName("Hinh")[0];

        const ten = tenInput.value.trim();
        const gia = giaInput.value.trim();
        const dientich = dientichInput.value.trim();

        
        // KIỂM TRA TÊN PHÒNG
        let regex = /^[\p{L}\d\s]+$/u;
        if (ten === "" || !regex.test(ten)) {
            showErr(tenInput, document.querySelector("#tenPhongError"), "Tên phòng không hợp lệ");
            hasError = true;
        }

        // KIỂM TRA GIÁ
        if (gia === "" || Number(gia) < 100000 || Number(gia) > 100000000) {
            showErr(giaInput, document.querySelector("#giaPhongError"), "Giá không hợp lệ");
            hasError = true;
        }

        // KIỂM TRA DIỆN TÍCH
        if (dientich === "" || Number(dientich) < 1 || Number(dientich) > 500) {
            showErr(dientichInput, document.querySelector("#dienTichError"), "Diện tích không hợp lệ");
            hasError = true;
        }

        // KIỂM TRA HÌNH
        const file = hinhInput.files[0];
        const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];

        if (file && !validTypes.includes(file.type)) {
            showErr(hinhInput, document.querySelector("#anhPhongError"), "File phải là ảnh (jpg, png, jpeg, gif)");
            hasError = true;
            hinhInput.value = "";
        }

        // NGĂN SUBMIT
        if (hasError) {
            e.preventDefault();
        }
    });
}

// -------------------------------------
//              Người dùng
// -------------------------------------

function xemThuAnh(input, pic) {
    // Kiểm tra xem người dùng có chọn file không
    if (input.files && input.files[0]) {
        
        // 1. Tạo đối tượng đọc file
        const reader = new FileReader();

        // 2. Khi đọc xong thì gán vào src của thẻ img
        reader.onload = function(e) {
            const imgElement = document.querySelector(pic);
            imgElement.src = e.target.result; // Đây là chuỗi base64 của ảnh
        }

        // 3. Bắt đầu đọc file
        reader.readAsDataURL(input.files[0]);
    }
}

async function ThemNguoiDung() {
    try {
        const today = new Date();
        document.getElementsByName("MaND")[0].value = "";
        document.getElementsByName("HoTenND")[0].value = "";
        document.getElementsByName("CMNDND")[0].value = "";
        document.getElementsByName("NamSinhND").value = formatDateToInput(today);
        document.getElementsByName("SDTND")[0].value = "";
        document.getElementsByName("ThuongTruND")[0].value = "";
        document.getElementsByName("QuyenND")[0].value = "";
        document.getElementsByName("HinhNDCu")[0].value = "";

        openForm('.form-nguoidung-cover');
        document.querySelector('.form-nguoidung-title').innerText = "Thêm Người Dùng";

        close('.btnDatLaiMK');
        close('.btnXoaND');
    } catch (err) {
        console.error("Lỗi:", err);
    }
}

async function SuaNguoiDung(id) {
    try {
        // 1. Gọi lên Server hỏi thông tin của ID này
        const response = await fetch(`/admin/nguoidung/${id}`);
        
        if (!response.ok) {
            alert("Không lấy được dữ liệu!");
            return;
        }

        const data = await response.json(); 
        console.log("Dữ liệu nhận được:", data);

        document.getElementsByName("MaND")[0].value = data.MaND;
        document.getElementsByName("HoTenND")[0].value = data.HoTen;
        document.getElementsByName("CMNDND")[0].value = data.CCCD;
        document.getElementsByName("NamSinhND")[0].value = formatDateToInput(data.NamSinh);
        document.getElementsByName("SDTND")[0].value = data.SDT;
        document.getElementsByName("ThuongTruND")[0].value = data.ThuongTru;
        document.getElementsByName("QuyenND")[0].value = data.Quyen;
        document.getElementsByName("HinhNDCu")[0].value = data.AVT;
        
        // Xử lý ảnh (nếu có)
        if(data.AVT) {
            document.querySelector('.AVTND').src = '/img/'+data.AVT;
        }

        openForm('.form-nguoidung-cover');
        document.querySelector('.form-nguoidung-title').innerText = "Thông Tin Người Dùng";
        document.querySelector('.form-nguoidung').action=`/admin/nguoidung/${data.MaND}?_method=PUT`;

        open('.btnDatLaiMK');
        open('.btnXoaND');

        const btnXoa = document.querySelector('.btnXoaND');
        const btnDLMK = document.querySelector('.btnDatLaiMK');

        btnDLMK.dataset.id = data.MaND;

        btnXoa.dataset.id = data.MaND;
        btnXoa.dataset.hinh = data.AVT;
    } catch (err) {
        console.error("Lỗi:", err);
    }
}



function XoaNguoiDung(btn) {
    // mở form
    openForm('.form-nguoidung-xn-cover');
    document.querySelector('.form-nguoidung-xn-title').innerText = "Bạn có muốn xóa người dùng này không";


    // lấy dữ liệu từ data- attributes
    const id = btn.dataset.id;
    const hinh = btn.dataset.hinh;

    document.getElementsByName("HinhNDxn")[0].value = hinh;

    document.querySelector('.form-nguoidung-xn').action=`/admin/nguoidung/${id}?_method=DELETE`;
}
function DLMKNguoiDung(btn) {
    // mở form
    openForm('.form-nguoidung-xn-cover');
    document.querySelector('.form-nguoidung-xn-title').innerText = "Bạn có muốn đặt lại mật khẩu người dùng này không";

    // lấy dữ liệu từ data- attributes
    const id = btn.dataset.id;

    document.getElementsByName("HinhNDxn")[0].value = "";

    document.querySelector('.form-nguoidung-xn').action=`/admin/nguoidung/datlaimk/${id}?_method=POST`;
}

validaChu('HoTenND','#HoTenNDError', "Họ và tên");
validaSoLimit('CMNDND','#CMNDNDError',12,"CMND");
validaSoLimit('SDTND','#SDTNDError', 10,"Số điện thoại");
validaRong('ThuongTruND', 'ThuongTruNDError', 'Địa chỉ thường trú');
vaidaAnh('HinhND','#HinhNDError',0);

const formNguoiDung = document.querySelector('.form-nguoidung');
if(formNguoiDung) {
    formNguoiDung.addEventListener("submit", function (e) {

        let hasError = false;

        // LẤY INPUT (ELEMENT)
        const hoTenInput = document.getElementsByName("HoTenND")[0];
        const cmndInput = document.getElementsByName("CMNDND")[0];
        const sdtInput = document.getElementsByName("SDTND")[0];
        const ttInput  = document.getElementsByName("ThuongTruND")[0];
        const hinhInput = document.getElementsByName("HinhND")[0];
        const ngaySinhInput = document.getElementsByName("NamSinhND")[0];


        const hoTen = hoTenInput.value.trim();
        const cmnd = cmndInput.value.trim();
        const sdt = sdtInput.value.trim();
        const tt = ttInput.value.trim();

        let regex = /^[\p{L}\s]+$/u;
        if (hoTen === "" || !regex.test(hoTen)) {
            showErr(hoTenInput, document.querySelector("#HoTenNDError"), "Họ tên không hợp lệ");
            hasError = true;
        }

        if (cmnd === "" || !/^\d{12}$/.test(cmnd)) {
            showErr(cmndInput, document.querySelector("#CMNDNDError"), "CMND không hợp lệ");
            hasError = true;
        }

        if (sdt === "" || !/^\d{12}$/.test(sđt)) {
            showErr(sdtInput, document.querySelector("#SDTNDError"), "SĐT không hợp lệ");
            hasError = true;
        }

        if (tt === "" || !regex.test(tt)) {
            showErr(ttInput, document.querySelector("#ThuongTruNDError"), "Địa chỉ không hợp lệ");
            hasError = true;
        }

        // KIỂM TRA HÌNH
        const file = hinhInput.files[0];
        const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];

        if (file && !validTypes.includes(file.type)) {
            showErr(hinhInput, document.querySelector("#HinhNDError"), "File phải là ảnh (jpg, png, jpeg, gif)");
            hasError = true;
            hinhInput.value = "";
        }

        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

        if (typeof formatDateToInput === "function") {
            ngaySinhInput.setAttribute('max', formatDateToInput(eighteenYearsAgo));

            const ngaySinhValue = ngaySinhInput.value;
            
            if (ngaySinhValue) { 
                const birthDate = new Date(ngaySinhValue);
                if (birthDate > eighteenYearsAgo) {
                    showErr(ngaySinhInput, document.querySelector("#NamSinhNDError"), "Năm sinh phải đủ 18 tuổi trở lên.");
                    hasError = true;
                }
            }
        }

        // NGĂN SUBMIT
        if (hasError) {
            e.preventDefault();
        }
    });
}
// -------------------------------------
//              Thông tin tài khoản
// -------------------------------------

async function CapNhatThongTin(id, role) {
    try {
        // 1. Gọi lên Server hỏi thông tin của ID này
        const response = await fetch(`/${role}/acc/${id}`);
        
        if (!response.ok) {
            alert("Không lấy được dữ liệu!");
            return;
        }

        const data = await response.json(); 

        document.getElementsByName("HoTenTT")[0].value = data.HoTen;
        document.getElementsByName("CMNDTT")[0].value = data.CCCD;
        document.getElementsByName("NamSinhTT")[0].value = formatDateToInput(data.NamSinh);
        document.getElementsByName("SDTTT")[0].value = data.SDT;
        document.getElementsByName("ThuongTruTT")[0].value = data.ThuongTru;
        document.getElementsByName("HinhTTCu")[0].value = data.AVT;
        
        // Xử lý ảnh (nếu có)
        if(data.AVT) {
            document.querySelector('.AVTTT').src = '/img/'+data.AVT;
        }

        openForm('.form-thongtin-cover');
        document.querySelector('.form-thongtin-title').innerText = "Thông Tin Người Dùng";
        document.querySelector('.form-thongtin').action=`/${role}/accupdate/${id}?_method=PUT`;
    } catch (err) {
        console.error("Lỗi:", err);
    }
}

validaChu('HoTenTT','#HoTenTTError', "Họ và tên");
validaSoLimit('CMNDTT','#CMNDTTError',12,"CMND");
validaSoLimit('SDTTT','#SDTTTError', 10,"Số điện thoại");
validaRong('ThuongTruTT', 'ThuongTruTTError', 'Địa chỉ thường trú');
vaidaAnh('HinhTT','#HinhTTError',0);

const formThongTin = document.querySelector('.form-thongtin');

if(formThongTin){
    formThongTin.addEventListener("submit", function (e) {

        let hasError = false;

        // LẤY INPUT (ELEMENT)
        const hoTenInput = document.getElementsByName("HoTenTT")[0];
        const cmndInput = document.getElementsByName("CMNDTT")[0];
        const sdtInput = document.getElementsByName("SDTTT")[0];
        const ttInput  = document.getElementsByName("ThuongTruTT")[0];
        const hinhInput = document.getElementsByName("HinhTT")[0];

        const hoTen = hoTenInput.value.trim();
        const cmnd = cmndInput.value.trim();
        const sdt = sdtInput.value.trim();
        const tt = ttInput.value.trim();

        let regex = /^[\p{L}\s]+$/u;
        if (hoTen === "" || !regex.test(hoTen)) {
            showErr(hoTenInput, document.querySelector("#HoTenTTError"), "Họ tên không hợp lệ");
            hasError = true;
        }

        if (cmnd === "" || !/^\d{12}$/.test(cmnd)) {
            showErr(cmndInput, document.querySelector("#CMNDTTError"), "CMND không hợp lệ");
            hasError = true;
        }

        if (sdt === "" || !/^\d{12}$/.test(sđt)) {
            showErr(sdtInput, document.querySelector("#SDTTTError"), "SĐT không hợp lệ");
            hasError = true;
        }

        if (tt === "" || !regex.test(tt)) {
            showErr(ttInput, document.querySelector("#ThuongTruTTError"), "Địa chỉ không hợp lệ");
            hasError = true;
        }

        // KIỂM TRA HÌNH
        const file = hinhInput.files[0];
        const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];

        if (file && !validTypes.includes(file.type)) {
            showErr(hinhInput, document.querySelector("#HinhTTError"), "File phải là ảnh (jpg, png, jpeg, gif)");
            hasError = true;
            hinhInput.value = "";
        }

        const ngaySinhInput = document.getElementsByName("NamSinhTT")[0];
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

        if (typeof formatDateToInput === "function") {
            ngaySinhInput.setAttribute('max', formatDateToInput(eighteenYearsAgo));

            const ngaySinhValue = ngaySinhInput.value;
            
            if (ngaySinhValue) { 
                const birthDate = new Date(ngaySinhValue);
                if (birthDate > eighteenYearsAgo) {
                    showErr(ngaySinhInput, document.querySelector("#NamSinhTTError"), "Năm sinh phải đủ 18 tuổi trở lên.");
                    hasError = true;
                }
            }
        }

        // NGĂN SUBMIT
        if (hasError) {
            e.preventDefault();
        }
    });
}



// -------------------------------------
//              Đổi mật khẩu
// -------------------------------------

// Hàm xử lý ẩn hiện password
function setupPasswordToggle(inputId, toggleId, iconId) {
    const input = document.getElementById(inputId);
    const toggleBtn = document.getElementById(toggleId);
    const icon = document.getElementById(iconId);

    if(toggleBtn){
        toggleBtn.addEventListener('click', function () {
            // Kiểm tra trạng thái hiện tại
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            
            // Đổi type input
            input.setAttribute('type', type);
            
            // Đổi icon
            if (type === 'text') {
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    }
}

// Gọi hàm cho 3 ô input tương ứng
setupPasswordToggle('MKCInput', 'toggleMKC', 'iconMKC');       // Mật khẩu cũ
setupPasswordToggle('MKMInput', 'toggleMKM', 'iconMKM');       // Mật khẩu mới
setupPasswordToggle('XNMKMInput', 'toggleXNMKM', 'iconXNMKM'); // Xác nhận mật khẩu

validaPassWord('MKC','#MKCError');
validaPassWord('MKM','#MKMError');
validaPassWord('XNMKM','#XNMKMError');

const formDMK = document.querySelector('.form-doimk');

if(formDMK) {
    formDMK.addEventListener("submit", function (e) {

        let hasError = false;

        // LẤY INPUT (ELEMENT)
        const mkcInput = document.getElementsByName("MKC")[0];
        const mkmInput = document.getElementsByName("MKM")[0];
        const xnmkmInput = document.getElementsByName("XNMKM")[0];

        const mkc = mkcInput.value.trim();
        const mkm = mkmInput.value.trim();
        const xnmkm = xnmkmInput.value.trim();

        if (mkc === "") {
            showErr(passInput, document.querySelector("#MKCError"), "Mật khẩu không được để trống");
            hasError = true;
        }
        if (mkm === "") {
            showErr(passInput, document.querySelector("#MKMError"), "Mật khẩu không được để trống");
            hasError = true;
        }
        if (xnmkm === "") {
            showErr(passInput, document.querySelector("#XNMKMError"), "Mật khẩu không được để trống");
            hasError = true;
        }

        if (xnmkm !== mkm) {
            showErr(passInput, document.querySelector("#XNMKMError"), "Mật khẩu mới và xác nhận mật không phải giống nhau");
            showErr(passInput, document.querySelector("#MKMError"), "Mật khẩu mới và xác nhận mật không phải giống nhau");
            hasError = true;
        }

        // NGĂN SUBMIT
        if (hasError) {
            e.preventDefault();
        }
    });
}

// -------------------------------------
//              Hợp đồng thuê
// -------------------------------------
async function ThemHopDong() {
    try {
        const today = new Date();
        // 1. Gọi lên Server hỏi thông tin của ID này
        const response = await fetch(`/admin/hopdong/laydulieutao`);
        
        if (!response.ok) {
            alert("Không lấy được dữ liệu!");
            return;
        }

        const data = await response.json(); 

        const selectPhong = document.querySelector('.PhongHDT');
        selectPhong.innerHTML = '<option value="">-- Chọn phòng trọ --</option>';

        data.dsPhong.forEach(phong => {
            const option = document.createElement('option');
            option.value = phong.MaPhong;
            option.textContent = `${phong.Ten}`;
            selectPhong.appendChild(option);
        });

        const divContainer = document.querySelector('.containerNguoiThue');
        divContainer.innerHTML = ''; 

        data.dsNguoi.forEach(nguoi => {
            const htmlItem = `
                <div class="mb-2">
                        
                        <input class="form-check-input me-2" 
                            type="checkbox" 
                            name="NThue[]" 
                            value="${nguoi.MaND}" 
                            id="user-${nguoi.MaND}"
                            style="transform: scale(1.2);"> <label class="form-check-label" for="user-${nguoi.MaND}" style="cursor: pointer;">
                            <span class="fw-bold">${nguoi.HoTen}</span> <br>
                        </label>
                </div>
            `;

            // 4. Chèn vào khung
            divContainer.insertAdjacentHTML('beforeend', htmlItem);
        });
        document.getElementsByName("NgayBD")[0].setAttribute('min', formatDateToInput(today))
        document.getElementsByName("NgayBD")[0].value = formatDateToInput(today);
        document.getElementsByName("NgayKT")[0].value = formatDateToInput(today);
        document.getElementsByName("TienCoc")[0].value = "";
        // mở form
        openForm('.form-hdt-cover');
        document.querySelector('.form-hdt-title').innerText = "Tạo Hợp Đồng Thuê";

    } catch (err) {
        console.error("Lỗi:", err);
    }
}

async function SuaHopDong(id) {
    try {
        // 1. Gọi lên Server hỏi thông tin của ID này
        const response = await fetch(`/admin/hopdong/laydulieusua/${id}`);
        
        if (!response.ok) {
            alert("Không lấy được dữ liệu!");
            return;
        }

        const data = await response.json(); 

        const selectPhong = document.querySelector('.PhongHDT');
        selectPhong.innerHTML = '<option value="">-- Chọn phòng trọ --</option>';

        data.dsPhong.forEach(phong => {
            // Tạo thẻ option: <option value="1">Phòng 101 - 2tr</option>
            const option = document.createElement('option');
            option.value = phong.MaPhong;
            option.textContent = `${phong.Ten}`;
            if(phong.isSelected){
                option.selected = true;
            }
            selectPhong.appendChild(option);
        });

        const divContainer = document.querySelector('.containerNguoiThue');
        divContainer.innerHTML = ''; // Xóa sạch cũ

        data.dsNguoi.forEach(nguoi => {
            const checkedState = nguoi.isChecked ? 'checked' : '';
            const htmlItem = `
                <div class="mb-2">
                        <input class="form-check-input me-2" 
                            type="checkbox" 
                            name="NThue[]" 
                            value="${nguoi.MaND}" 
                            id="user-${nguoi.MaND}"
                            style="transform: scale(1.2);"
                            ${checkedState}> 
                            <label class="form-check-label" for="user-${nguoi.MaND}" style="cursor: pointer;">
                            <span class="fw-bold">${nguoi.HoTen}</span> <br>
                        </label>
                </div>
            `;
            // Chèn vào container
            divContainer.insertAdjacentHTML('beforeend', htmlItem);
        });

        document.getElementsByName("NgayBD")[0].value = formatDateToInput(data.HDT.NgayBD);
        document.getElementsByName("NgayKT")[0].value = formatDateToInput(data.HDT.NgayKT);
        document.getElementsByName("TienCoc")[0].value = data.HDT.TienCoc;

        document.querySelector('.form-hdt').action=`/admin/hopdong/${id}?_method=PUT`;

        openForm('.form-hdt-cover');
        document.querySelector('.form-hdt-title').innerText = "Sửa Hợp Đồng Thuê";

    } catch (err) {
        console.error("Lỗi:", err);
    }
}

function XoaHopDong(id) {

    openForm('.form-hopdong-xn-cover');
    document.querySelector('.form-hopdong-xn-title').innerText="Bạn có muốn xóa hợp đồng này không"
    document.querySelector('.form-hopdong-xn').action=`/admin/hopdong/${id}?_method=DELETE`;
}

function KTHopDong(id) {

    openForm('.form-hopdong-xn-cover');
    document.querySelector('.form-hopdong-xn-title').innerText="Bạn có muốn kết thúc hợp đồng này không"
    document.querySelector('.form-hopdong-xn').action=`/admin/hopdong/kthopdong/${id}?_method=PUT`;
}

validaSo('TienCoc','#TienCocError', 0, 10000000,"Tiền cọc");
const ngayBDInput = document.getElementsByName("NgayBD")[0];
if(ngayBDInput){
    ngayBDInput.addEventListener('change', function() {
        const startVal = this.value;
        const ngayKTInput = document.getElementsByName("NgayKT")[0];
        
        // Cập nhật 'min' của ngày kết thúc phải từ ngày bắt đầu trở đi
        ngayKTInput.setAttribute('min', startVal);

        // Nếu ngày kết thúc hiện tại lại nhỏ hơn ngày bắt đầu mới chọn -> Xóa ngày kết thúc để bắt chọn lại
        if (ngayKTInput.value && ngayKTInput.value < startVal) {
            ngayKTInput.value = "";
            showErr(ngayKTInput, document.querySelector("#NgayKTError"), "Vui lòng chọn lại ngày kết thúc");
        }else {
            hideErr(ngayKTInput, document.querySelector("#NgayKTError"));
        }
    });
}

const formHDT = document.querySelector('.form-hdt');

if(formHDT) {
    formHDT.addEventListener("submit", function (e) {
        e.preventDefault();
        
        let hasError = false;
        
        // --- LẤY INPUT ---
        const phongInput = document.getElementsByName("PhongHDT")[0];
        const ngayBDInput = document.getElementsByName("NgayBD")[0];
        const ngayKTInput = document.getElementsByName("NgayKT")[0];
        const tcInput  = document.getElementsByName("TienCoc")[0];
        
        const checkedBoxes = document.querySelectorAll('input[name="NThue[]"]:checked');
        const tc = tcInput.value.trim();
        
        if (tc === "" || Number(tc) < 0 || Number(tc) > 100000000) {
            showErr(tcInput, document.querySelector("#TienCocError"), "Tiền cọc không hợp lệ");
            hasError = true;
        }
        
        if (phongInput.value === "") { 
            showErr(phongInput, document.querySelector("#PhongHDTError"), "Vui lòng chọn phòng");
            hasError = true;
        }
        
        const today = new Date();
        if (typeof formatDateToInput === "function") {
                ngayBDInput.setAttribute('min', formatDateToInput(today));
                
                if (ngayBDInput.value < formatDateToInput(today)) {
                showErr(ngayBDInput, document.querySelector("#NgayBDError"), "Ngày bắt đầu không hợp lệ");
                hasError = true;
            }
        }
        
        if (ngayKTInput.value <= ngayBDInput.value) {
            showErr(ngayKTInput, document.querySelector("#NgayKTError"), "Ngày kết thúc phải lớn hơn ngày bắt đầu");
            hasError = true;
        }


        if (checkedBoxes.length === 0){

            const errNThue = document.querySelector("#NThueError");
        
            const containerNguoi = document.querySelector('.containerNguoiThue');
            
            showErr(containerNguoi, errNThue, "Vui lòng chọn ít nhất 1 người thuê");
            hasError = true;
        }

        if (!hasError) {
             console.log("Dữ liệu chuẩn, đang gửi...");
             e.currentTarget.submit(); 
        }
    });
}

// -------------------------------------
//              Phụ phí
// -------------------------------------

async function ThemPhuPhi() {
    try {
        const today = new Date();
        // 1. Gọi lên Server hỏi thông tin của ID này
        const response = await fetch(`/admin/phuphi/laydulieu`);
        
        if (!response.ok) {
            alert("Không lấy được dữ liệu!");
            return;
        }

        const data = await response.json(); 

        const divContainer = document.querySelector('.containerPhuPhi');
        divContainer.innerHTML = ''; 

        data.dsPhong.forEach(phong => {
            const htmlItem = `
                <div class="mb-2">
                        
                        <input class="form-check-input me-2" 
                            type="checkbox" 
                            name="PhongPP[]" 
                            value="${phong.MaPhong}" 
                            id="phong-${phong.MaPhong}"
                            style="transform: scale(1.2);"> <label class="form-check-label" for="user-${phong.MaPhong}" style="cursor: pointer;">
                            <span class="fw-bold">${phong.Ten}</span> <br>
                        </label>
                </div>
            `;

            // 4. Chèn vào khung
            divContainer.insertAdjacentHTML('beforeend', htmlItem);
        });

        document.getElementsByName("TenPP")[0].value = "";
        document.getElementsByName("GiaPP")[0].value = "";
        document.getElementsByName("GhiChuPP")[0].value = "";

        // mở form
        openForm('.form-phuphi-cover');
        document.querySelector('.form-phuphi-title').innerText = "Tạo Phụ Phí";

        close('.btnXoaPP');

    } catch (err) {
        console.error("Lỗi:", err);
    }
}
async function SuaPhuPhi(id) {
    try {
        // 1. Gọi lên Server hỏi thông tin của ID này
        const response = await fetch(`/admin/phuphi/laydulieusua/${id}`);
        
        if (!response.ok) {
            alert("Không lấy được dữ liệu!");
            return;
        }

        const data = await response.json(); 

        const divContainer = document.querySelector('.containerPhuPhi');
        divContainer.innerHTML = ''; 

        data.dsPhong.forEach(phong => {
            const checkedState = phong.isSelected ? 'checked' : '';
            const htmlItem = `
                <div class="mb-2">
                        
                        <input class="form-check-input me-2" 
                            type="checkbox" 
                            name="PhongPP[]" 
                            value="${phong.MaPhong}" 
                            id="phong-${phong.MaPhong}"
                            style="transform: scale(1.2);"
                            ${checkedState}> 
                            <label class="form-check-label" for="user-${phong.MaPhong}" style="cursor: pointer;">
                            <span class="fw-bold">${phong.Ten}</span> <br>
                        </label>
                </div>
            `;

            // 4. Chèn vào khung
            divContainer.insertAdjacentHTML('beforeend', htmlItem);
        });

        document.getElementsByName("TenPP")[0].value = data.PP.TenPP;
        document.getElementsByName("GiaPP")[0].value = data.PP.Gia;
        document.getElementsByName("GhiChuPP")[0].value = data.PP.GhiChu;

        // mở form
        openForm('.form-phuphi-cover');
        document.querySelector('.form-phuphi-title').innerText = "Sửa Phụ Phí";

        document.querySelector('.form-phuphi').action=`/admin/phuphi/${id}?_method=PUT`;

        open('.btnXoaPP');
        document.querySelector('.btnXoaPP').dataset.id=id;

    } catch (err) {
        console.error("Lỗi:", err);
    }
}
function XoaPhuPhi(btn) {
    const id = btn.dataset.id;
    openForm('.form-phuphi-xn-cover');
    document.querySelector('.form-phuphi-xn-title').innerText="Bạn có muốn xóa phụ phí này không"
    document.querySelector('.form-phuphi-xn').action=`/admin/phuphi/${id}?_method=DELETE`;
}

validaChu('TenPP','#TenPPError', 'Tên phụ phí');
validaChu('GhiChuPP','#GhiChuPPError', 'Ghi chú');
validaSo('GiaPP','#GiaPPError',0,1000000, 'Giá');

const formPhuPhi = document.querySelector('.form-hdt');
if(formPhuPhi) {
    fomPhuPhi.addEventListener("submit", function (e) {
        e.preventDefault();
        
        let hasError = false;

        // --- LẤY INPUT ---
        const tenInput = document.getElementsByName("TenPP")[0];
        const giaInput = document.getElementsByName("GiaPP")[0];
        const ghichuInput  = document.getElementsByName("GhiChuPP")[0];

        const ten = tenInput.value.trim();
        const gia = giaInput.value.trim();
        const ghichu = ghichuInput.value.trim();

        let regex = /^[\p{L}\s]+$/u;
        if (ten === "" || !regex.test(ten)) {
            showErr(tenInput, document.querySelector("#TenPPError"), "Tên phụ phí không hợp lệ");
            hasError = true;
        }

        if (gia === "" || Number(gia) < 0 || Number(gia) > 10000000) {
            showErr(giaInput, document.querySelector("#GiaPPError"), "Giá phụ phí không hợp lệ");
            hasError = true;
        }

        if (ghichu === "" || !regex.test(ghichu)) {
            showErr(ghichuInput, document.querySelector("#GhiChuPPError"), "Ghi chú không hợp lệ");
            hasError = true;
        }

        if (!hasError) {
             console.log("Dữ liệu chuẩn, đang gửi...");
             e.currentTarget.submit(); 
        }
    });
}

// -------------------------------------
//              Điện nước
// -------------------------------------

function moFormGhiDienNuoc() {
    const modal = document.getElementById('modalDienNuoc');
    // Bỏ class d-none, thêm d-flex để căn giữa
    modal.classList.remove('d-none');
    modal.classList.add('d-flex');
    const formTaoCS = document.getElementById('formWizard');
    if(formTaoCS){
        TaoFormChiSo();
    }
}

// Hàm đóng form
function dongFormGhiDienNuoc() {
    const modal = document.getElementById('modalDienNuoc');
    // Ẩn đi
    modal.classList.remove('d-flex');
    modal.classList.add('d-none');
}

const modalDN = document.getElementById('modalDienNuoc');
if(modalDN){
    modalDN.addEventListener('click', function(e) {
        if (e.target === this) {
            dongFormGhiDienNuoc();
        }
    });
}

function TaoFormChiSo() {
    const slides = document.querySelectorAll('.step-slide');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnSubmit = document.getElementById('btnSubmit');
    const stepIndicator = document.getElementById('stepIndicator');
    const dataJsonHidden = document.getElementById('dataJsonHidden');
    const formFinal = document.getElementById('formWizard');

    let currentIndex = 0;
    const totalSteps = slides.length;

    // Hàm cập nhật giao diện
    function updateUI() {
        // 1. Ẩn hiện các slide
        slides.forEach((slide, index) => {
            if (index === currentIndex) {
                slide.classList.remove('d-none');
            } else {
                slide.classList.add('d-none');
            }
        });

        // 2. Cập nhật nút bấm
        btnPrev.disabled = (currentIndex === 0);
        
        if (currentIndex === totalSteps - 1) {
            btnNext.classList.add('d-none');
            btnSubmit.classList.remove('d-none'); // Hiện nút Save ở bước cuối
        } else {
            btnNext.classList.remove('d-none');
            btnSubmit.classList.add('d-none');
        }

        // 3. Cập nhật tiến độ
        if(stepIndicator){
            stepIndicator.textContent = `Phòng ${currentIndex + 1} / ${totalSteps}`;
        }
    }

    // Sự kiện nút Next
    btnNext.addEventListener('click', async () => {
        // Validate: Không cho next nếu chưa nhập
        const currentSlide = slides[currentIndex];

        const dienInput = currentSlide.querySelector('.inp-dien');
        const nuocInput = currentSlide.querySelector('.inp-nuoc');

        const dienErr = currentSlide.querySelector('.CSDienError');
        const nuocErr = currentSlide.querySelector('.CSNuocError');

        const dien = dienInput.value;
        const nuoc = nuocInput.value;

        const id = currentSlide.querySelector('.inp-maphong').value;

        const response = await fetch(`/admin/diennuoc/kiemtra/${id}`);
        
        if (!response.ok) {
            alert("Không lấy được dữ liệu!");
            return;
        }

        const data = await response.json(); 

        // Xóa dấu chấm (nếu có) rồi mới chuyển thành số
        const SoDCu = Number((data.cs[0].SoDCu).replace(/\./g, ''));
        const SoNCu = Number((data.cs[0].SoNCu).replace(/\./g, ''));

        // Kiêm tra điện
        if(!dien) {
            showErr(dienInput,dienErr, 'Vui lòng nhập chỉ số điện')
            return;
        }else{
            hideErr(dienInput,dienErr);
        }
        if(Number(dien)<=SoDCu) {
            showErr(dienInput,dienErr, `Chỉ số điện mới phải lớn hơn ${data.cs[0].SoDCu}`)
            return;
        }else{
            hideErr(dienInput,dienErr);
        }
        // Kiêm tra nước
        if(!nuoc) {
            showErr(nuocInput,nuocErr, 'Vui lòng nhập chỉ số nước')
            return;
        }else{
            hideErr(nuocInput,nuocErr);
        }
        if(Number(nuoc)<=SoNCu) {
            showErr(nuocInput,nuocErr, `Chỉ số nước phải lớn hơn ${data.cs[0].SoNCu}`)
            return;
        }else{
            hideErr(nuocInput,nuocErr);
        }

        if (currentIndex < totalSteps - 1) {
            currentIndex++;
            updateUI();
        }
    });

    // Sự kiện nút Prev
    btnPrev.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateUI();
        }
    });

    // Sự kiện Submit Form
    if(formFinal){
        formFinal.addEventListener('submit', (e) => {
            // Ngăn form gửi ngay để mình xử lý data đã
            e.preventDefault();

            // Duyệt qua tất cả các slide để gom dữ liệu
            const dataArr = [];
            slides.forEach(slide => {
                const maPhong = slide.querySelector('.inp-maphong').value;
                const soDien = slide.querySelector('.inp-dien').value;
                const soNuoc = slide.querySelector('.inp-nuoc').value;

                // Chỉ đẩy vào mảng nếu có dữ liệu (hoặc bắt buộc hết tùy bạn)
                if(maPhong) {
                    dataArr.push({
                        MaPhong: maPhong,
                        SoDMoi: soDien,
                        SoNMoi: soNuoc
                    });
                }
            });

            // Chuyển mảng object thành chuỗi JSON
            const jsonString = JSON.stringify(dataArr);
            
            // Gán vào input hidden
            dataJsonHidden.value = jsonString;

            // Gửi form đi
            formFinal.submit();
        });
    }

    // Khởi chạy lần đầu
    updateUI();
}
async function SuaCSDN(id) {
    try {
        // 1. Gọi lên Server hỏi thông tin của ID này
        const response = await fetch(`/admin/diennuoc/laydulieusua/${id}`);
        
        if (!response.ok) {
            alert("Không lấy được dữ liệu!");
            return;
        }

        const data = await response.json(); 

        document.getElementsByName("CSDC")[0].value = data.cs[0].SoDCu;
        document.getElementsByName("CSNC")[0].value = data.cs[0].SoDCu;

        document.getElementsByName("CSDM")[0].value = data.cs[0].SoDMoi;
        document.getElementsByName("CSNM")[0].value = data.cs[0].SoDMoi;

        // mở form
        openForm('.form-csdn-cover');
        document.querySelector('.form-csdn-title').innerText = "Sửa Chỉ số";

        document.querySelector('.form-csdn').action=`/admin/diennuoc/${id}?_method=PUT`;

    } catch (err) {
        console.error("Lỗi:", err);
    }
}
function XoaCSDN(id) {
    openForm('.form-csdn-xn-cover');
    document.querySelector('.form-csdn-xn-title').innerText="Bạn có muốn xóa chỉ số này không"
    document.querySelector('.form-csdn-xn').action=`/admin/diennuoc/${id}?_method=DELETE`;
}
function XoaCSDNByNgay(id) {
    openForm('.form-csdn-xn-cover');
    document.querySelector('.form-csdn-xn-title').innerText="Bạn có muốn xóa chỉ số này không"
    document.querySelector('.form-csdn-xn').action=`/admin/diennuoc/xoatheongay/${id}?_method=DELETE`;
}

// -------------------------------------
//              Hóa đơn
// -------------------------------------
function ChuyenSo(input){
    const temp = parseInt(input.toString().replace(/\./g, ''));
    return Number(temp);
}
function ChuyenSoStr(input){
    return Number(input).toLocaleString('vi-VN');
}
const modalDetail = document.getElementById('invoiceModalDetail');

async function openInvoiceModal(id,user) {
    modalDetail.style.display = 'flex';
    setTimeout(() => { modalDetail.classList.add('show'); }, 10);
    document.body.style.overflow = 'hidden';

    const tenphong = document.querySelector('.hdTenPhong');
    const ngaytao = document.querySelector('.hdNgayTao');
    const csncu = document.querySelector('.csncu');
    const csnmoi = document.querySelector('.csnmoi');
    const tieuthunuoc = document.querySelector('.tieuthunuoc');
    const gianuoc = document.querySelector('.gianuoc');
    const tongtiennuoc = document.querySelector('.tongtiennuoc');
    const csdcu = document.querySelector('.csdcu');
    const csdmoi = document.querySelector('.csdmoi');
    const tieuthudien = document.querySelector('.tieuthudien');
    const giadien = document.querySelector('.giadien');
    const tongtiendien = document.querySelector('.tongtiendien');
    const tongdn = document.querySelector('.tongdn');
    const tienphong = document.querySelector('.tienphong');
    const tienpp = document.querySelector('.tienpp');
    const tiendn = document.querySelector('.tiendn');
    const thanhtien = document.querySelector('.thanhtien');

    const response = await fetch(`/${user}/hoadon/laychitiet/${id}`);
        
    if (!response.ok) {
        alert("Không lấy được dữ liệu!");
        return;
    }

    const data = await response.json(); 

    tenphong.innerText= data.Phong.Ten;
    ngaytao.innerText = formatDateToDDMMYYYY(data.HD.NgayTinh);

    csdcu.innerText  = data.CS.SoDCu;
    csdmoi.innerText = data.CS.SoDMoi;
    const ttd = ChuyenSo(data.CS.SoDMoi) - ChuyenSo(data.CS.SoDCu);
    tieuthudien.innerHTML = ChuyenSoStr(ttd)+" kWh";
    giadien.innerText= data.Gia.GiaDien+" VNĐ";
    tongtiendien.innerText = data.HD.TienDien+" VNĐ";

    csncu.innerText  = data.CS.SoNCu;
    csnmoi.innerText = data.CS.SoNMoi;
    const ttn = ChuyenSo(data.CS.SoNMoi) - ChuyenSo(data.CS.SoNCu);
    tieuthunuoc.innerHTML = ChuyenSoStr(ttn)+" m³";
    gianuoc.innerText= data.Gia.GiaNuoc+" VNĐ";
    tongtiennuoc.innerText = data.HD.TienNuoc+" VNĐ";

    const tongdiennuoc = ChuyenSo(data.HD.TienDien) + ChuyenSo(data.HD.TienNuoc);
    tongdn.innerText = ChuyenSoStr(tongdiennuoc)+" VNĐ";

    const phuphi = JSON.parse(data.PP);

    const listElement = document.getElementById('list-phu-phi');
    let htmlContent = '';
    let totalAmount = 0;
    
    listElement.innerHTML=``;

    // Duyệt qua từng item để tạo thẻ li
    phuphi.forEach(item => {
        totalAmount += ChuyenSo(item.Gia); // Cộng dồn tổng tiền
        
        htmlContent += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${item.TenPP}</span>
                <span>${item.Gia}</span>
            </li>
        `;
    });

    // Thêm dòng Tổng phụ phí (dùng class list-group-item-secondary như mẫu)
    htmlContent += `
        <li class="list-group-item list-group-item-secondary d-flex justify-content-between align-items-center fw-bold">
            <span>Tổng phụ phí</span>
            <span>${ChuyenSoStr(totalAmount)}</span>
        </li>
    `;

    // Gán HTML vào thẻ ul
    listElement.innerHTML = htmlContent;

    const trangthai = document.querySelector('.hdTrangThai');
    const trangThaiTe = data.HD.TrangThai ? data.HD.TrangThai.trim().normalize('NFC') : "";
    if(trangThaiTe=="Chờ thanh toán"){
        trangthai.innerHTML = `<span class="badge bg-warning text-dark fs-6">Chờ thanh toán</span>`
    }else if(trangThaiTe=="Chưa thanh toán"){
        trangthai.innerHTML = `<span class="badge bg-danger text-dark fs-6">Chưa thanh toán</span>`
    }else if(trangThaiTe=="Đã thanh toán"){
        trangthai.innerHTML = `<span class="badge bg-success text-dark fs-6">Đã thanh toán</span>`
    }

    tienphong.innerText = data.Phong.Gia+" VNĐ";
    tiendn.innerText = ChuyenSoStr(tongdiennuoc)+" VNĐ";
    tienpp.innerText = ChuyenSoStr(totalAmount);
    const tonghd = tongdiennuoc + ChuyenSo(data.Phong.Gia) + totalAmount;
    thanhtien.innerText = ChuyenSoStr(tonghd)+" VNĐ";
}

// Hàm đóng form
function closeInvoiceModal() {
    modalDetail.classList.remove('show');
    setTimeout(() => { modalDetail.style.display = 'none'; }, 300);
    document.body.style.overflow = 'auto';
}

function XoaHoaDon(id) {
    openForm('.form-hoadon-xn-cover');
    document.querySelector('.form-hoadon-xn-title').innerText="Bạn có muốn xóa hóa đơn này không"
    document.querySelector('.form-hoadon-xn').action=`/admin/hoadon/${id}?_method=DELETE`;
}
function XNTraHD(id) {
    openForm('.form-hoadon-xn-cover');
    document.querySelector('.form-hoadon-xn-title').innerText="Bạn có xác nhận trả hóa đơn này không"
    document.querySelector('.form-hoadon-xn').action=`/admin/hoadon/xntra/${id}?_method=POST`;
}
function xoaDauVaKhoangTrang(str) {
    if (!str) return "";

    // 1. Xóa dấu tiếng Việt
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    str = str.replace(/đ/g, "d").replace(/Đ/g, "D");
    str = str.replace(/\s+/g, "");

    return str;
}
async function MaQRHD(id) {
    const response = await fetch(`/user/hoadon/taocode/${id}`);
    
    if (!response.ok) {
        alert("Không lấy được dữ liệu!");
        return;
    }

    const data = await response.json(); 

    const noidungck = document.querySelector('.noidungck');

    noidungck.innerText= id+"-"+xoaDauVaKhoangTrang(data.TenPhong)+"-"+data.NgayTinh

    openForm('.form-hoadon-ma-cover');
    
}
function copyText(element) {
    // 1. Lấy nội dung chữ và cắt bỏ khoảng trắng thừa 2 đầu
    const textToCopy = element.innerText.trim();

    // 2. Copy vào clipboard
    navigator.clipboard.writeText(textToCopy);
    alert("Đã sao chép !!")
}

// -------------------------------------
//              Thông báo
// -------------------------------------
async function sendRequest(url, method, ids) {
    try {
        showLoading();
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: ids })
        });
        
        if (response.ok) {
            window.location.reload();
        } else {
            alert("Có lỗi xảy ra!");
        }
    } catch (error) {
        console.error(error);
    }finally{
        hideLoading();
    }
}
async function XoaNhieuTB(quyen, ma) {
    // Lấy danh sách ID
    const selectedIds = Array.from(document.querySelectorAll('.check-item:checked')).map(cb => cb.value);

    await sendRequest(`/${quyen}/thongbao/xoanhieu/${ma}`, 'DELETE', selectedIds);
}
async function DaDocNhieuTB(quyen, ma) {
    const selectedIds = Array.from(document.querySelectorAll('.check-item:checked')).map(cb => cb.value);
    
    // Gửi Fetch
    await sendRequest(`/${quyen}/thongbao/dadocnhieu/${ma}`, 'PUT', selectedIds);
}
async function SoanThongBao(quyen, ma) {
    const id = ma;

    const response = await fetch(`/${quyen}/thongbao/laydlsoan`);
    
    if (!response.ok) {
        alert("Không lấy được dữ liệu!");
        return;
    }

    const data = await response.json(); 

    const divContainer = document.querySelector('.containerNguoiNhan');
    divContainer.innerHTML = ''; // Xóa sạch cũ

    data.dsNN.forEach(nguoi => {
        const htmlItem = `
            <div class="mb-2">
                    <input class="form-check-input me-2" 
                        type="checkbox" 
                        name="NNhan[]" 
                        value="${nguoi.MaND}" 
                        id="${nguoi.MaND}"
                        style="transform: scale(1.2);"> 
                        <label class="form-check-label" for="${nguoi.MaND}" style="cursor: pointer;">
                        <span class="fw-bold">${nguoi.Ten}</span> <br>
                    </label>
            </div>
        `;
        // Chèn vào container
        divContainer.insertAdjacentHTML('beforeend', htmlItem);
    });

    openForm('.form-thongbao-cover');
    document.querySelector('.form-thongbao').action=`/${quyen}/thongbao/${id}?_method=POST`;
}
const formSoanTB = document.querySelector('.form-thongbao');
if(formSoanTB) {
    formSoanTB.addEventListener("submit", function (e) {
        e.preventDefault();
        
        let hasError = false;

        // --- LẤY INPUT ---
        const tdInput = document.getElementsByName("TieuDe")[0];
        const ndInput = document.getElementsByName("NoiDung")[0];
        const checkedBoxes = document.querySelectorAll('input[name="NNhan[]"]:checked');

        const td = tdInput.value.trim();
        const nd = ndInput.value.trim();

        if (td === "" ) {
            showErr(tdInput, document.querySelector("#TieuDeError"), "Tiêu đề không hợp lệ");
            hasError = true;
        }

        if (nd === "") {
            showErr(ndInput, document.querySelector("#NoiDungError"), "Nội dung không hợp lệ");
            hasError = true;
        }

        if (checkedBoxes.length === 0){

            const errNThue = document.querySelector("#NNhanError");
        
            const containerNguoi = document.querySelector('.containerNguoiNhan');
            
            showErr(containerNguoi, errNThue, "Vui lòng chọn ít nhất 1 người nhận");
            hasError = true;
        }

        if (!hasError) {
             e.currentTarget.submit(); 
        }
    });
}
async function TraLoiThongBao(quyen, ma, nn) {
    const MaNN = document.getElementsByName("MaNN")[0];
    MaNN.value = nn;

    openForm('.form-thongbao-traloi-cover');
    document.querySelector('.form-thongbao-traloi').action=`/${quyen}/thongbao/traloi/${ma}?_method=POST`;
}

const formTLTB = document.querySelector('.form-thongbao');
if(formTLTB) {
    formTLTB.addEventListener("submit", function (e) {
        e.preventDefault();
        
        let hasError = false;

        // --- LẤY INPUT ---
        const tdInput = document.getElementsByName("TieuDeTL")[0];
        const ndInput = document.getElementsByName("NoiDungTL")[0];

        const td = tdInput.value.trim();
        const nd = ndInput.value.trim();

        if (td === "" ) {
            showErr(tdInput, document.querySelector("#TieuDeTLError"), "Tiêu đề không hợp lệ");
            hasError = true;
        }

        if (nd === "") {
            showErr(ndInput, document.querySelector("#NoiDungTLError"), "Nội dung không hợp lệ");
            hasError = true;
        }

        if (!hasError) {
             e.currentTarget.submit(); 
        }
    });
}

// Hàm BẬT màn hình loading
function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

// Hàm TẮT màn hình loading
function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}
