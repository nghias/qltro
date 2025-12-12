const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('passwordInput');
const toggleIcon = document.getElementById('toggleIcon');

togglePassword.addEventListener('click', function () {
    // Kiểm tra loại input hiện tại
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    
    // Đổi loại input
    passwordInput.setAttribute('type', type);
    
    // Đổi icon
    if (type === 'text') {
        toggleIcon.classList.remove('bi-eye');
        toggleIcon.classList.add('bi-eye-slash'); // Đổi sang mắt gạch chéo
    } else {
        toggleIcon.classList.remove('bi-eye-slash');
        toggleIcon.classList.add('bi-eye'); // Đổi lại mắt thường
    }
});
function showErr(input, errEl, msg) {
    errEl.textContent = msg;
    errEl.classList.remove("d-none");
    input.classList.add("is-invalid");
}

function hideErr(input, errEl) {
    errEl.classList.add("d-none");
    input.classList.remove("is-invalid");
}
function validaUserName(name, idErr){
    document.getElementsByName(name)[0].addEventListener("blur", function () {
        let err = document.querySelector(idErr);
        let v = this.value.trim();
        let regex = /^[a-zA-Z0-9\s]+$/;
        if (v === "") {
            showErr(this, err,"Tài khoản không được để trống");
        }else if(!regex.test(v)) {
            showErr(this, err,"Tài khoản không được có ký tự đặc biệt");
        }else{
            hideErr(this, err);
        }
    });
}
function validaPassWord(name, idErr){
    document.getElementsByName(name)[0].addEventListener("blur", function () {
        let err = document.querySelector(idErr);
        let v = this.value.trim();
        if (v === "") {
            showErr(this, err,"Mật khẩu không được để trống");
        }else{
            hideErr(this, err);
        }
    });
}
validaUserName('username','#userNameError');
validaPassWord('password','#passWordError');

document.querySelector(".form-login").addEventListener("submit", function (e) {

    let hasError = false;

    // LẤY INPUT (ELEMENT)
    const userInput = document.getElementsByName("username")[0];
    const passInput = document.getElementsByName("password")[0];

    const user = userInput.value.trim();
    const pass = passInput.value.trim();

    
    // KIỂM TRA TÊN PHÒNG
    let regex = /^[a-zA-Z0-9\s]+$/;
    if (user === "") {
        showErr(userInput, document.querySelector("#userNameError"), "Tài khoản không được để trống");
        hasError = true;
    }
    if (!regex.test(user)) {
        showErr(userInput, document.querySelector("#userNameError"), "Tài khoản không được có kí tự đặc biệt");
        hasError = true;
    }

    // KIỂM TRA GIÁ
    if (pass === "") {
        showErr(passInput, document.querySelector("#passWordError"), "Mật khẩu không được để trống");
        hasError = true;
    }

    // NGĂN SUBMIT
    if (hasError) {
        e.preventDefault();
    }
});

// Hàm BẬT màn hình loading
function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
    document.body.style.overflow = "hidden";
}

// Hàm TẮT màn hình loading
function hideLoading() {
    const loader = document.getElementById('loading-overlay');
    if (loader) {
        loader.style.display = 'none';
    }
    document.body.style.overflow = "auto";
}

window.addEventListener('load', function() {
    hideLoading();
});

window.addEventListener('beforeunload', function () {
    showLoading();
});