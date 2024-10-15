function newEmail(event) {
    event.preventDefault();

    const token = getCookie('token');
    const form = document.getElementById('new__email');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    data['token'] = token;

    fetch('http://localhost:3000/users/change_email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(error => {
                    throw new Error(error.error);
                });
            }
        })
        .then(data => {
            form.reset();
            alert(data.message);
            window.location.reload();
        })
        .catch(error => {
            alert(error.message);
        });
}

function newPassword(event) {
    event.preventDefault();
    
    const token = getCookie('token');
    
    const form = document.getElementById('new__password');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    const password = data['new_password'];
    const confirmPassword = data['confirm_password'];

    if (password !== confirmPassword) {
        alert('Пароль и подтверждение пароля не совпадают');
        return;
    }

    data['token'] = token;

    fetch('http://localhost:3000/users/change_password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(error => {
                    throw new Error(error.error);
                });
            }
        })
        .then(data => {
            form.reset();
            alert(data.message);
        })
        .catch(error => {
            alert(error.message);
        });
}


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}