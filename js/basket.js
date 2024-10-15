document.addEventListener("DOMContentLoaded", function () {
  // смена цвета для лайка

  // --------------------
  
  printAllProducts();


});

let res = 0;
function printAllProducts() {
  const token = getCookie("token");
  fetch(`http://localhost:3000/basket/${token}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayProductsAll(data.information);
    })
    .catch((error) => {
      console.error("Error fetching basket:", error);
    });
}

async function removeBasket(product_id){
  const token = getCookie('token');
  try {
    const awaitBasketData = await fetch(`http://localhost:3000/pageBasket/remove/${product_id}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token: token })
    });

    if (!awaitBasketData.ok) {
      throw new Error('Network response was not ok');
    }
    location.reload();
    //printAllProducts()
    
  } catch (error) {
    console.error('Error fetching remove basket: ', error);
  }

}

function displayProductsAll(data) {
  const token = getCookie("token");
  const imagesContainer = document.getElementById("purchase");
  imagesContainer.innerHTML = "";

  if (data.length <= 0) {
    const noProductsMessage = `
          <div class='no-products'>
            <p>Нет товаров в корзине</p>
          </div>
        `;
    imagesContainer.insertAdjacentHTML("beforeend", noProductsMessage);
    return;
  }
  res = 0;
  data.forEach((item) => {
    res += Number(item.price);
    const html = `
        <div class="purchase-items">
            <img class="item-img" src="${item.image_path[0]}">
            <div class="item-info">
                <div class="product-info">
                    <span class="product-name">${item.product_name}</span>
                    <span class="product-size">Размер: ${item.size}</span>
                    <span class="quantity">Количество: ${item.quantity}</span>
                    <span class="product-price">${item.price} $</span>
                </div>
                <div class="bottom-bar">
                    <div class="delete">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    d="M4.99997 8H6.5M6.5 8V18C6.5 19.1046 7.39543 20 8.5 20H15.5C16.6046 20 17.5 19.1046 17.5 18V8M6.5 8H17.5M17.5 8H19M9 5H15M9.99997 11.5V16.5M14 11.5V16.5"
                                    stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></path>
                            </g>
                            <rect class="btn-delete" x="0" y="0" onclick="removeBasket(${item.id_product})"/>
                        </svg>
                    </div>
                    <span class="delivery">Доставка работает 2-3 дня</span>
                </div>
            </div>
        </div>
        `;

    imagesContainer.insertAdjacentHTML("beforeend", html);
  });
  const amount = document.getElementById("amount");
  amount.textContent = `${res} $`;
}
console.log(res)
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// для покупки
const amount = document.getElementById("amount");
amount.textContent = `${res} $`;