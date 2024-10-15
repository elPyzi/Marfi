document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product-id');

    if(productId) {
        fetch(`http://localhost:3000/product/information/${productId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayProductDetails(data);
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    } else {
        console.error('Product ID not found in URL');
    }
});
//addBasket
function displayProductDetails(data) {
    const image = document.getElementById('image');
    image.src= data.productData[0].image_path[0];
    const name = document.getElementById('name');
    name.textContent = data.productData[0].product_name;
    const price = document.getElementById('price');
    price.textContent = data.productData[0].price + ' $';
    const btn = document.getElementById("addBasket");
    
    if( Object.keys(data.basket).length > 0){
        btn.setAttribute(`onclick`,`removeBasket(${data.productData[0].id_product})`)
        btn.textContent = "Удалить из коризины"
    }else{
        btn.setAttribute(`onclick`,`addBasket(${data.productData[0].id_product})`)
        btn.textContent = "Добавить корзину" 
    }
}

async function addBasket(product_id){
    const token = getCookie('token');
    const size  = document.getElementById('size').value
    console.log(size)
    try {
      const awaitBasketData = await fetch(`http://localhost:3000/basket/add/${product_id}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: token, size:size })
      });
  
      if (!awaitBasketData.ok) {
        throw new Error('Network response was not ok');
      }
      const basketElemnent = document.getElementById("addBasket");
      basketElemnent.setAttribute('onclick', `removeBasket(${product_id})`);
      basketElemnent.textContent = 'Удалить из корзины';
    } catch (error) {
      console.error('Error fetching remove: ', error);
    }
}

async function removeBasket(product_id){
    const token = getCookie('token');
  try {
    const awaitBasketData = await fetch(`http://localhost:3000/basket/remove/${product_id}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token: token })
    });

    if (!awaitBasketData.ok) {
      throw new Error('Network response was not ok');
    }

    const basketElemnent = document.getElementById("addBasket");
    basketElemnent.setAttribute('onclick', `addBasket(${product_id})`);
    basketElemnent.textContent = 'Добавить в корзину';
  } catch (error) {
    console.error('Error fetching remove like: ', error);
  }

}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}