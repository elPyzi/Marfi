document.addEventListener("DOMContentLoaded", function () {
  // смена цвета для лайка

  // --------------------

  var modal = document.getElementById("myModal");
  var btn = document.getElementById("myBtn");
  var span = document.getElementsByClassName("close")[0];
  btn.onclick = function () {
    modal.style.display = "block";
  };
  span.onclick = function () {
    modal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  const categoriesId = urlParams.get("categories-id");

  if (categoriesId) {
    printProductsByCategory(categoriesId);
    return;
  }
  printAllProductsUsers();
});

function printAllProductsUsers() {
  fetch("http://localhost:3000/catalog")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayProductsAllUser(data);
    })
    .catch((error) => {
      console.error("Error fetching catalog:", error);
    });
}

function printProductsByCategory(categoriesId) {
  fetch(`http://localhost:3000/product/categories/${categoriesId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayProductsAllUser(data);
    })
    .catch((error) => {
      console.error("Error fetching products by category:", error);
    });
}

function displayProductsAllUser(data) {
  const token = getCookie("token");
  const imagesContainer = document.getElementById("catalog-container");
  imagesContainer.innerHTML = "";

  if (Object.keys(data.information).length <= 0) {
    const noProductsMessage = `
          <div class='no-products'>
            <p>Нет товаров в наличии</p>
          </div>
        `;
    imagesContainer.insertAdjacentHTML("beforeend", noProductsMessage);
    return;
  }

  data.information.forEach((item) => {
    const html = `
        <a href="product.html?product-id=${item.id_product}" class="catalog-item"> 
                
          
          <img src="${item.image_path[0]}" alt="">
          <div class="info-item">
            <span class="info"> ${item.product_name}</span>
            <span class="info-collection">Новая колекция</span>
            <span class="price"> ${item.price} $</span>
          </div>                            
        </a>
        `;
    imagesContainer.insertAdjacentHTML("beforeend", html);
  });

  const prices = data.information.map((item) => item.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  document.getElementById(
    "minPriceInput"
  ).placeholder = `Мин. ${minPrice} руб.`;
  document.getElementById(
    "maxPriceInput"
  ).placeholder = `Макс. ${maxPrice} руб.`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// Функциииии для интерактива страницы
