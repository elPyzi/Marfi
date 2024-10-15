const urlParams = new URLSearchParams(window.location.search);
const tokenUrl = urlParams.get('token');


document.addEventListener('DOMContentLoaded', function(){
    if (tokenUrl) {
        document.cookie = `token='${tokenUrl}';path=/`;
        urlParams.delete('token');
        const newSearch = urlParams.toString();
        const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}${newSearch ? '?' + newSearch : ''}`;
        window.history.replaceState({}, document.title, newUrl);
    }
    const token = getCookie('token');
    if (!token) {
        return;
    }

    fetch('http://localhost:3000/getRole',{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({ token: token })
    })
    .then(response => response.json())
    .then(data => {
        const role = data.role;
        const loginLink = document.querySelector('nav.rights-side-bar a[href="signIn.html"]');
        
        if (loginLink) {
            const pageUrl = role === 'user' ? '/html/user/personalAccount.html' : '/html/admin/adminPage.html';
            loginLink.href=pageUrl;
        }

    })
    .catch(error => console.error('Ошибка при получении роли:', error));
});


function isAuthorizate(){
    const token = getCookie('token');
    if(!token){
        alert('Для добавления товара в корзину авторизуйтесь на сайте');
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

