const { query } = require("./db");
const { checkUserExists } = require("./someFunc.js");
const { secret, express, bcrypt, jwt } = require("./config");
const nodemailer = require('nodemailer');

const router = express.Router();


let verificationCode = '';
let useremail = '';

async function generatePassword() {
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    
    const firstChar = uppercaseLetters.charAt(Math.floor(Math.random() * uppercaseLetters.length));

    let password = firstChar;
    for (let i = 1; i < 8; i++) {
        const characters = uppercaseLetters + lowercaseLetters + digits;
        const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
        password += randomChar;
    }

    password = password.split('').sort(() => Math.random() - 0.5).join('');
    return password;
}

async function generateCode() {
    verificationCode = '';
    for (let i = 0; i < 4; i++) {
        verificationCode += String(Math.floor(Math.random() * 10));
    }
    return verificationCode;
}

const transporter = nodemailer.createTransport({
    host: 'host',
    port: 465,
    secure: true,
    auth: {
        user: 'mail',
        pass: 'pass'
    }
});

router.post("/code", async (req, res) => {
    const { email } = req.body;
    useremail = email;
    try {
        const userExists = await checkUserExists(email);
        if (!(userExists.length > 0)) {
            throw new Error('Пользователя нет с таким email');
        }
        let code = await generateCode(); 
        await transporter.sendMail({
            from: "officalmarfi@mail.ru",
            to: email,
            subject: 'Код подтверждения',
            text: `Ваш код подтверждения: ${code}`
        });
        res.status(200).json({ message: 'Код подтверждения успешно отправлен на ваш email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error:  `${error}` });
    }
});

router.post('/verify', async (req, res) => {
    const { code } = req.body;
    if (code === verificationCode) {
        const password = await generatePassword();
        const newPassword = await bcrypt.hash(password, 10);
        await query(`UPDATE users SET password='${newPassword}' WHERE email='${useremail}'`)
        await transporter.sendMail({
            from: "officalmarfi@mail.ru",
            to: useremail,
            subject: 'Код подтверждения',
            text: `Ваш пароль: ${password}`
        });
        res.status(200).json({ message: 'Новый пароль успешно отправлен на ваш email.' });
    } else {
        res.status(400).json({ error: 'Неверный код подтверждения.' });
    }
});



router.post("/users/create", async (req, res) => {
  const { newUsername, newEmail, newPassword } = req.body;
  const userExists = await checkUserExists(newEmail);
  if (userExists.length > 0) {
    return res
      .status(400)
      .json({ error: "Пользователь с таким email уже существует" });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    const sql = `INSERT INTO users (user_name, password, email, type_user) 
                   VALUES ('${newUsername}', '${hashedPassword}', '${newEmail}', 'user')`;
    await query(sql);
    res.sendStatus(200);
  } catch (err) {
    console.error("Ошибка добавления пользователя в бд", err);
    res.status(500).json({ error: "Ошибка добавления пользователя в бд" });
  }
});

router.post("/users/login", async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const userExists = await checkUserExists(username);
    if (!(userExists.length > 0)) {
      return res.status(400).json({ error: "Пользователя нет с таким email" });
    }
    if (userExists[0].type_user === "ban") {
      return res.json({
        redirectUrl: "http://localhost:5501/html/banPage.html",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      userExists[0].password
    );
    if (!validPassword) {
      return res.status(400).json({ error: "Неверный пароль" });
    }

    let redirectUrl;
    console.log(1)
    if (userExists[0].type_user === "admin") {
      redirectUrl = "http://localhost:5501/html/admin/adminPage.html";
    } else if (userExists[0].type_user === "user") {
      console.log(2)
      redirectUrl = "http://localhost:5501/html/user/personalAccount.html";
    }
    const token = jwt.sign({ id: userExists[0].id_user }, secret, {
      expiresIn: "24h",
    });
    return res.json({ token, redirectUrl });
  } catch (err) {
    console.error("Ошибка авторизации пользователя", err);
    res.status(500).json({ error: "Ошибка авторизации" });
  }
});

module.exports = router;
