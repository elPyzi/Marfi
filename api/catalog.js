const {  express } = require('./config');
const { query } = require('./db');
const router = express.Router();

router.get('/catalog', async (req, res) => {
    try {
        const information = await query(`SELECT image_path, price, product_name, id_product FROM product`);
        return res.json({ information });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/product/information/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const productData = await query(`SELECT image_path, price, product_name, id_product FROM product WHERE id_product = ${productId};`);
        const basket = await query(`SELECT id_product FROM purchase where id_product = ${productId}; `)
        return res.json({productData:productData,basket:basket});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/product/categories/:categoriesId', async (req, res) => {
    try {
        const categoriesId = req.params.categoriesId;
        const information = await query(`SELECT image_path, price, product_name, id_product FROM product WHERE id_category = ${categoriesId};`);
        return res.json({ information });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/basket/add/:productId', async (req, res) => {
    try {
        const size = req.body.size;
        const token = req.body.token;
        const arrayToken = token.split('.');
        const tokenPayload = JSON.parse(atob(arrayToken[1]));
        const productId = req.params.productId;
        await query(`INSERT INTO purchase (id_user, id_product, quantity, size) VALUES (${tokenPayload.id}, ${productId}, 1, '${size}')`);
        return res.json();
    } catch (error) {
        console.error('Ошибка при удалении товара из понравившихся');
        res.status(500).json({ message: `${error}` });
    }
})

router.post('/basket/remove/:productId', async (req, res) => {
    try {
        const token = req.body.token;
        const arrayToken = token.split('.');
        const tokenPayload = JSON.parse(atob(arrayToken[1]));
        const productId = req.params.productId;
        await query(`DELETE from purchase WHERE id_product=${productId} and id_user=${tokenPayload.id}`);
        return res.json();
    } catch (error) {
        console.error('Ошибка при удалении товара из понравившихся');
        res.status(500).json({ message: `${error}` });
    }
})



module.exports = router;
