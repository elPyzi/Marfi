document.addEventListener('DOMContentLoaded', function(){
    const token = getCookie('token');
    if(!token){
        document.body.innerHTML = '';     
        const errorElement = document.createElement('div');
        errorElement.innerHTML = '<h1>404 Not Found</h1>';
        errorElement.style.textAlign = 'center';
        errorElement.style.marginTop = '20%';    
        document.body.appendChild(errorElement);    
        document.title = '404 Not Found';
        setTimeout(function() {
            window.location.href = 'http://localhost:5500/html/helloMarfi.html'; // Замените URL на нужный вам
        }, 5000);
    }
})

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function logout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '../../html/helloMarfi.html'
}

