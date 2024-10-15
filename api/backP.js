const {  express } = require('./config');
const { query } = require('./db');
const router = express.Router();

router.get('/purchase/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const arrayToken = token.split('.');
        const tokenPayload = JSON.parse(atob(arrayToken[1]));

        const information = await query(`
        SELECT product.price,product.id_product 
        FROM purchase 
        INNER JOIN product ON product.id_product=purchase.id_product
        where id_user = ${tokenPayload.id}
        `);
        return res.json({ information });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/purchase/remove/:productId', async (req, res) => {
    try {
        const token = req.body.token;
        const arrayToken = token.split('.');
        const tokenPayload = JSON.parse(atob(arrayToken[1]));
        const productId = req.params.productId;
        await query(`DELETE from purchase WHERE  id_user=${tokenPayload.id}
        `);
        return res.json();
    } catch (error) {
        console.error('Ошибка при удалении товара из корзины');
        res.status(500).json({ message: `${error}` });
    }
})



module.exports = router;