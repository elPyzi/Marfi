"use strict"


// document.addEventListener("DOMContentLoaded", function() {
//     const form = document.getElementById("sendToEmail");

//     form.addEventListener("submit", function(event) {
//         event.preventDefault(); // Предотвращаем отправку формы по умолчанию

//         const formData = new FormData(form); // Получаем данные формы

//         // Формируем текст письма
//         let emailBody = "Данные формы:\n\n";
//         formData.forEach(function(value, key) {
//             emailBody += key + ": " + value + "\n";
//         });

//         // Отправляем запрос на почту
//         fetch("https://api.mailjet.com/v3.1/send", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": "Basic YOUR_API_KEY"
//             },
//             body: JSON.stringify({
//                 "Messages": [{
//                     "From": {
//                         "Email": "your@email.com",
//                         "Name": "Your Name"
//                     },
//                     "To": [{
//                         "Email": "leo.pyzhikov@gmail.com",
//                         "Name": "Leo Pyzhikov"
//                     }],
//                     "Subject": "Обратная связь с клиентом",
//                     "TextPart": emailBody
//                 }]
//             })
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error("Ошибка при отправке формы.");
//             }
//             alert("Форма успешно отправлена!");
//             form.reset(); // Очищаем поля формы
//         })
//         .catch(error => {
//             console.error("Ошибка:", error);
//             alert("Произошла ошибка при отправке формы.");
//         });
//     });
// });
