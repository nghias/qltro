function stripHtmlTagsDOM(inputString) {
    if (!inputString) return "";
    
    // Tạo một thẻ div ảo
    let tempDiv = document.createElement("div");
    // Gán chuỗi HTML vào thẻ div
    tempDiv.innerHTML = inputString;
    // Chỉ lấy phần text, bỏ qua các thẻ HTML
    return tempDiv.textContent || tempDiv.innerText || "";
}
const forms = document.querySelectorAll('form'); 

forms.forEach(form => {
    form.addEventListener('submit', function(event) {
        const inputs = form.querySelectorAll('input[type="text"],input[type="password"],input[type="email"],input[type="hidden"], input[type="search"], tarea');
        
        inputs.forEach(input => {
            const rawValue = input.value;

            const cleanValue = stripHtmlTagsDOM(rawValue);

            input.value = cleanValue;

        });

    });
});

