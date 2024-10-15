var acc = document.getElementsByClassName("accordion-btn-reg");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}

var modal = document.getElementById("forgotModal");
var btn = document.getElementById("forgotBtn");
var span = document.getElementsByClassName("close")[0];
var spann = document.getElementsByClassName("closee")[0];

btn.onclick = function () {
  modal.style.display = "block";
  
  const form = document.getElementById('sendToEmail') 
  form.addEventListener('submit', formSend)
  async function formSend(e){
    e.preventDefault();
    let errror = formValidate(form)
    
  }


  function formValidate(){
    let errror =0
    let formreq = document.querySelectorAll('.req')
  }
};
span.onclick = function () {
  modal.style.display = "none";
};
spann.onclick = function () {
  modal.style.display = "none";
  const sCode = document.getElementById("checkNumbers")
  const sEmail = document.getElementById("sendToEmail")
  sEmail.style.display = "block";
  sCode.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
function sendEmail(){
  const sEmail = document.getElementById("sendToEmail")
  sEmail.style.display = "none";
  const sCode = document.getElementById("checkNumbers")
  sCode.style.display = "block";
}

function returnEmail(){
  const sCode = document.getElementById("checkNumbers")
  const sEmail = document.getElementById("sendToEmail")
  sEmail.style.display = "block";
  sCode.style.display = "none";
}




function generateCode(event) {
  event.preventDefault();
  const email = document.getElementById("forgotEmail").value;
  fetch("http://localhost:3000/code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Пользователя нет с таким email`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Code generated and sent to email", data);
    })
    .catch((error) => {
      console.error(error);
      alert(error);
    });
}

function verifyCode(event) {
  event.preventDefault();
  const code = document.getElementById("verificationCode").value;
  fetch("http://localhost:3000/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error response");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Code verified set", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  const form = document.getElementById("checkNumbers");
  form.reset();
}


/* let randomToEmail = " "
  for (let i = 0; i < 4; i++) {
    randomToEmail += String(Math.floor(Math.random() * 10)) 
  }
  numEmail = Number(randomToEmail)
  return numEmail*/