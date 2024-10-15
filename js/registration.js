function registration(event) {
    event.preventDefault();
    const form = document.getElementById('registrationForm');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    const password = data['newPassword'];
    const confirmPassword = data['confirmPassword'];

    if (password !== confirmPassword) {
        alert('Пароль и подтверждение пароля не совпадают');
        return;   
    }

    fetch('http://localhost:3000/users/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            document.getElementById("registrationForm").reset();
            window.location.href = 'http://localhost:5500/html/helloMarfi.html'; 
        } else {
            return response.json().then(error => {
                throw new Error(error.error);
            });
        }
    })
    .catch(error => {
        alert(error.message);
    });
}

function login(event) {
    event.preventDefault();
    const form = document.getElementById('loginForm');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            console.log(1)
            return response.json();
        } else {
            return response.json().then(error => {
                throw new Error(error.error);
            });
        }
    })
    .then(data => {
        document.cookie = `token='${data.token}';path=/`;
        window.location.href = `${data.redirectUrl}?token=${data.token}`;
    })
    .catch(error => {
        alert(error.message);
    });
}


