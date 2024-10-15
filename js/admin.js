function insertUsers(event) {
  event.preventDefault();
  const form = document.getElementById("insertUserForm");
  const formData = new FormData(form);
  const userEmail = formData.get("name");
  const insert = formData.get("insertWith");

  switch (insert) {
    case "watchUser": {
      watchUser(userEmail);
      break;
    }
    case "banUser": {
      banUser(userEmail);
      break;
    }
    case "unbanUser": {
      unbanUser(userEmail);
      break;
    }
    case "giveAdmin": {
      giveAdmin(userEmail);
      break;
    }
    case "removeAdmin": {
      removeAdmin(userEmail);
      break;
    }
    default: {
      console.log("Черт");
      break;
    }
  }
}

function watchUser(user) {
  fetch("http://localhost:3000/admin/watchUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: user }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((error) => {
          const outPutData = document.getElementById("result");
          outPutData.innerHTML = " ";
          const html = `
        <div class="result">
            <div class="inf">
                <div class="userName">${error.error}</div>
            </div>
        </div>   
        `;
          outPutData.insertAdjacentHTML("beforeend", html);
          return Promise.reject(error);
        });
      }
    })
    .then((data) => {
      const outPutData = document.getElementById("result");
      outPutData.innerHTML = " ";
      const html = `
        <div class="result">
            <h1>Резльтат</h1>
            <div class="inf">
                <div class="userName">${data.name}</div>
                <div class="userEmail">${data.email}</div>
                <div class="status">${
                  data.role === "ban" ? "заблокирован" : data.role
                }</div>
            </div>
        
        </div>
            
        `;
      outPutData.insertAdjacentHTML("beforeend", html);
    })
    .catch((error) => {
      console.error("Ошибка в поиске пользователя ", error);
    });
}

function banUser(user) {
  fetch(`http://localhost:3000/admin/banUser/${user}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching");
      }
      return response.json();
    })
    .then((data) => {
      const outPutData = document.getElementById("result");
      outPutData.innerHTML = " ";
      const html = `
        <div class="result">
            <h1>Резльтат</h1>
            <div class="inf">
                <div class="userName">${data.message}</div>
            </div>
        </div>
            
        `;
      outPutData.insertAdjacentHTML("beforeend", html);
    })
    .catch((error) => {
      console.error("Ошибка в поиске пользователя ", error);
    });
}

function unbanUser(user) {
  fetch(`http://localhost:3000/admin/unbanUser/${user}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching");
      }
      return response.json();
    })
    .then((data) => {
      const outPutData = document.getElementById("result");
      outPutData.innerHTML = " ";
      const html = `
        <div class="result">
            <h1>Резльтат</h1>
            <div class="inf">
                <div class="userName">${data.message}</div>
            </div>
        </div>     
        `;
      outPutData.insertAdjacentHTML("beforeend", html);
    })
    .catch((error) => {
      console.error("Ошибка в поиске пользователя ", error);
    });
}

function giveAdmin(user) {
    fetch(`http://localhost:3000/admin/giveAdmin/${user}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching");
      }
      return response.json();
    })
    .then((data) => {
      const outPutData = document.getElementById("result");
      outPutData.innerHTML = " ";
      const html = `
        <div class="result">
            <h1>Резльтат</h1>
            <div class="inf">
                <div class="userName">${data.message}</div>
            </div>
        </div>     
        `;
      outPutData.insertAdjacentHTML("beforeend", html);
    })
    .catch((error) => {
      console.error("Ошибка в поиске пользователя ", error);
    });
}

function removeAdmin(user) {
    fetch(`http://localhost:3000/admin/removeAdmin/${user}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching");
      }
      return response.json();
    })
    .then((data) => {
      const outPutData = document.getElementById("result");
      outPutData.innerHTML = " ";
      const html = `
        <div class="result">
            <h1>Резльтат</h1>
            <div class="inf">
                <div class="userName">${data.message}</div>
            </div>
        </div>     
        `;
      outPutData.insertAdjacentHTML("beforeend", html);
    })
    .catch((error) => {
      console.error("Ошибка в поиске пользователя ", error);
    });
}

function uploadImages(event) {
  event.preventDefault();
    const form = document.getElementById("addProduct");
    const formData = new FormData(form);
    const item = document.getElementById('itemSelect').value;
    let category = document.getElementById('genderSelect').value;
    if (category === '1' && item === 'Coat') {
        category = 3;
    } else if (category === '1' && item === 'Glass') {
        category = 4;
    } else if (category === '2' && item === 'Coat') {
        category = 5;
    } else if (category === '2' && item === 'Glass') {
        category = 6;
    }

    formData.set('category', category);
    let jsonArray = [];
    for (const [key, value] of formData.entries()) {
        jsonArray.push(value);
    }
    console.log(jsonArray);
fetch(`http://localhost:3000/add/catalog/product/${jsonArray}`, {
    method: "POST",
    body: formData
  })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Ошибка добавления товара в каталог");
        }
        return response.json();
    })
    .then((data) => {
        if (data.success) {
            alert("Товар успешно добавлен в каталог");
        } else {
            throw new Error(data.message || "Произошла ошибка");
        }
    })
    .catch((error) => {
        console.error("Ошибка:", error.message);
        alert(`Произошла ошибка при добавлении товара в каталог: ${error.message}`);
    });
}

function deleteProductCatalog(event) {
  event.preventDefault();
  const form = document.getElementById("removeProduct");
  const product_name = document.getElementById('product__for_delete').value;
  deleteFromCatalog(product_name);
  form.reset()
}

function deleteFromCatalog(product_name) {
  fetch(`http://localhost:3000/admin/removeCatalog/${product_name}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching");
      }
      return response.json();
    })
    .then((data) => {
      alert(data.message)
    })
    .catch((error) => {
      console.error("Ошибка в поиске пользователя ", error);
    });
}




(function fetchUserCount() {
  document.getElementById('quantityUsers').innerHTML = ''
  fetch("http://localhost:3000/admin/qUsers")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error response network`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.count) {
        document.getElementById("quantityUsers").textContent = data.count;
      } else {
        document.getElementById("quantityUsers").textContent =
          "Данные не найдены";
      }
    })
    .catch((error) => {
      console.error("Ошибка при получении количества пользователей:", error);
      document.getElementById("quantityUsers").innerText = "Ошибка";
    }); 
})()


function fetchAdminCount() {
  document.getElementById("quantityAdm").innerHTML = "";
  fetch("http://localhost:3000/admin/qAdmin")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error response network`);
      }

      return response.json();
    })
    .then((data) => {
      if (data.count) {
        document.getElementById("quantityAdm").textContent = data.count;
      } else {
        document.getElementById("quantityAdm").textContent =
          "Данные не найдены";
      }
    })
    .catch((error) => {
      console.error("Ошибка при получении количества админов:", error);
      document.getElementById("quantityAdm").innerText = "Ошибка";
    });
}

function fetchProductCount() {
  document.getElementById("quantityProd").innerHTML = "";
  fetch("http://localhost:3000/admin/qProducts")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error response network`);
      }

      return response.json();
    })
    .then((data) => {
      if (data.count) {
        document.getElementById("quantityProd").textContent = data.count;
      } else {
        document.getElementById("quantityProd").textContent =
          "Данные не найдены";
      }
    })
    .catch((error) => {
      console.error("Ошибка при получении количества админов:", error);
      document.getElementById("quantityProd").innerText = "Ошибка";
    });
}

fetchProductCount()
fetchAdminCount()