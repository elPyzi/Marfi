const { express, bcrypt } = require('./config');
const { query } = require('./db');
const router = express.Router();

router.post('/users/change_password', async (req, res) => {
    const { new_password, password, token } = req.body;
    try {
        const arrayToken = token.split('.');
        const tokenPayload = JSON.parse(atob(arrayToken[1]));
        const user_password = await query(`SELECT password from users WHERE id_user = ${tokenPayload.id}`)
        const validPassword = await bcrypt.compare(
            password,
            user_password[0].password
        );

        if (!validPassword) {
            throw new Error('Неверный пароль');
        }
        
        const hashedPassword = await bcrypt.hash(new_password, 10);

        await query(`UPDATE users SET password = '${hashedPassword}' WHERE id_user = ${tokenPayload.id}`)
        return res.json({ message: 'Пароль был успешно сменен' });

    } catch (error) {
        console.error('Ошибка изменения пароля: ', error);
        res.status(400).json({ error: error.message });
    }
})

router.post('/users/change_email', async (req, res) => {
    const { password_email, email__user, token } = req.body;
    try {
        const arrayToken = token.split('.');
        const tokenPayload = JSON.parse(atob(arrayToken[1]));
        const user_password = await query(`SELECT password from users WHERE id_user = ${tokenPayload.id}`)
        const validPassword = await bcrypt.compare(
            password_email,
            user_password[0].password
        );

        if (!validPassword) {
            throw new Error('Неверный пароль');
        }

        await query(`UPDATE users SET email = '${email__user}' WHERE id_user = ${tokenPayload.id}`)
        return res.json({ message: 'Эмэил был успешно изменен' });
    } catch (error) {
        console.error('Ошибка изменения emeil: ', error);
        res.status(400).json({ error: error.message });
    }
})


router.get(`/users/display/order/:token`, async (req, res)=>{
    const token = req.params.token;
    const arrayToken = token.split('.');
    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    const information = await query(`SELECT * FROM "order" WHERE id_user = ${tokenPayload.id};`);
    if ((!information.length > 0)) {
        return res.json({ success: false })
    }
    return res.json({success: true, information: information})
})

module.exports = router