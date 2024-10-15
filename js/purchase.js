
amount();

let res = 0;
function amount() {
  const token = getCookie("token");
  fetch(`http://localhost:3000/purchase/${token}`)
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



function displayProductsAll(data) {
  const token = getCookie("token");
  res = 0;
  data.forEach((item) => {
    res += Number(item.price);
  });
  const amount = document.getElementById("amount");
  if(res == 0){
    amount.textContent = `0 $`;
  }else{
    amount.textContent = `${res} $`;
  }

}
console.log(res)



async function purchase(event){
    event.preventDefault();
    const token = getCookie('token');
    try {
      const awaitBasketData = await fetch(`http://localhost:3000/purchase/remove/}`, {
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
      alert("Спасибо за покупку")
      
    } catch (error) {
      console.error('Error fetching remove basket: ', error);
    }
}


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }