const navLinks = document.querySelectorAll(".header.nav-link"); // Hoặc selector bao gồm cả dropdown item của bạn

// Chuẩn hóa path
function normalize(path) {
    if (!path) return "/";
    try {
        const url = new URL(path, location.origin);
        let p = url.pathname.toLowerCase();
        p = p.replace(/\/index\.html$/, "");
        if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
        return p;
    } catch (e) {
        return path;
    }
}

// --- PREFIX ---
let prefix = "";
if (location.pathname.startsWith("/admin")) prefix = "/admin";
if (location.pathname.startsWith("/user")) prefix = "/user";

function addPrefix(href) {
    if (!href) return ""; 
    if (!href.startsWith("/")) href = "/" + href;
    if (href.startsWith("/admin") || href.startsWith("/user")) return href;
    return prefix + href;
}

// --- HIGHLIGHT LOGIC MỚI ---
const current = normalize(location.pathname);
let bestLength = -1;

// BƯỚC 1: Tìm ra độ dài khớp tốt nhất (Best Length)
// Chúng ta không lưu element nữa, chỉ lưu độ dài "chuẩn" nhất
navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const fullHref = addPrefix(href);
    const linkPath = normalize(fullHref);

    const exact = current === linkPath;
    const parent = current.startsWith(linkPath + "/");

    if (exact || parent) {
        if (linkPath.length > bestLength) {
            bestLength = linkPath.length;
        }
    }
});

// Clear old classes
navLinks.forEach(l => l.classList.remove("header-selected", "active"));

// BƯỚC 2: Highlight TẤT CẢ các link khớp với độ dài tốt nhất tìm được ở trên
if (bestLength > -1) {
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;

        const fullHref = addPrefix(href);
        const linkPath = normalize(fullHref);

        // Kiểm tra lại điều kiện khớp
        const exact = current === linkPath;
        const parent = current.startsWith(linkPath + "/");
        
        // MẤU CHỐT: Nếu link này khớp VÀ độ dài bằng đúng độ dài tốt nhất -> Highlight
        if ((exact || parent) && linkPath.length === bestLength) {
            
            link.classList.add("header-selected", "active");

            // Xử lý active cho menu cha (nếu nằm trong dropdown)
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                const parentToggle = parentDropdown.querySelector('[data-bs-toggle="dropdown"]');
                // Chỉ active cha nếu chưa active (tránh add nhiều lần)
                if (parentToggle && !parentToggle.classList.contains("active")) {
                    parentToggle.classList.add("header-selected", "active");
                }
            }
        }
    });
}