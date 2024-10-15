const {express} = require('./config');
const {checkUserID}=require('./someFunc')

const router = express.Router();

router.post('/getRole', async (req, res) => {
    const token = req.body.token;
    const arrayToken = token.split('.');
    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    checkUserID(tokenPayload.id)
        .then(dataUser => {
            if (!(dataUser.length > 0)) {
                return res.status(400).json({ error: 'Пользователя нет с таким id' });
            }
            return res.json({ role: dataUser[0].type_user});
        })
        .catch(error => {
            console.error('Ошибка при проверке пользователя: ', error);
            return res.status(500).json({ error: 'Ошибка при проверке пользователя' });
        });
});

module.exports = router;