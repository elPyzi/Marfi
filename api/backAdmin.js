const {path, multer, express } = require('./config');
const { query } = require('./db');
const router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../media/productImage'));
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});


const upload = multer({ storage: storage }).array('images', 10);




router.get("/admin/qUsers", async (req, res) => {
  try {
    const user_name = await query(
      `select count(id_user) from users where type_user = 'user';`
    );

    if (!(user_name.length > 0)) {
      return res.json({
        message: "Пользователь не найден или является администратором",
      });
    }
    const userCount = user_name[0].count;
    return res.json({ count: userCount });
  } catch (error) {
    console.error("Ошибка в поиске пользователей ", error);
    res.status(500).json({ error: `Ошибка в поиске пользователя ${error}` });
  }
});

router.get("/admin/qAdmin", async (req, res) => {
  try {
    const user_name = await query(
      `select count(id_user) from users where type_user = 'admin';`
    );

    if (!(user_name.length > 0)) {
      return res.json({
        message: "Админ не найден или является администратором",
      });
    }

    const userCount = user_name[0].count;
    return res.json({ count: userCount });
  } catch (error) {
    console.error("Ошибка в поиске пользователей ", error);
    res.status(500).json({ error: `Ошибка в поиске пользователя ${error}` });
  }
});

router.get("/admin/qProducts", async (req, res) => {
  try {
    const user_name = await query(
      `select count(id_product) from product`
    );

    if (!(user_name.length > 0)) {
      return res.json({
        message: "Админ не найден или является администратором",
      });
    }

    const userCount = user_name[0].count;
    return res.json({ count: userCount });
  } catch (error) {
    console.error("Ошибка в поиске пользователей ", error);
    res.status(500).json({ error: `Ошибка в поиске пользователя ${error}` });
  }
});




router.get('/admin/removeCatalog/:product_name', async (req, res) => {
  const product_name = req.params.product_name;
  const product = await query(`select image_path from product where product_name='${product_name}';`)
  if (!(product.length > 0)) {
      return res.json({ message: 'Товар не найден' })
  }
  const filePaths = product[0].image_path;
  await query(`DELETE FROM product WHERE product_name='${product_name}';`);
  const rootPath = path.resolve(__dirname, '../');
  filePaths.forEach(filePath => {
      const fullPath = path.join(rootPath, filePath);
      fs.unlink(fullPath, (err) => {
          if (err) {
              console.error('Ошибка при удалении файла:', err);
          } else {
              console.log('Файл успешно удален:', fullPath);
          }
      });
  });
  return res.json({message : 'Товар успешно удален'})
});





router.post('/admin/watchUser', async(req,res)=>{
    try{
        const email = req.body.user
        const information = await query(`select user_name, email, type_user from users where email='${email}';`)
        if((!information.length>0)){
            throw new Error('Пользователя нет с таким email');
        }
        return res.json({name:information[0].user_name,email:information[0].email,role:information[0].type_user})
    }
    catch(error){
        console.error("Ошибка в поиске пользователя ",error);
        res.status(500).json({error: `${error}`})
    }
})

router.get('/admin/banUser/:email', async(req,res)=>{
    try{
        const email = req.params.email
        const user_name = await query(`select user_name from users where email='${email}' and type_user != 'admin';`)
        if(!(user_name.length > 0)){
            return res.json({message:'Пользователь не найден или является администратором'})
        }
        await query(`
        UPDATE users SET type_user='ban' where email='${email}' and type_user != 'admin'; 
        `)
        return res.json({message : `Пользователь ${user_name[0].user_name} заблокирован`})
    }
    catch(error){
        console.error("Ошибка в поиске пользователя ",error);
        res.status(500).json({error: `Ошибка в поиске пользователя ${error}`})
    }
})

router.get('/admin/unbanUser/:email', async(req,res)=>{
    try{
        const email = req.params.email
        const user_name = await query(`select user_name from users where email='${email}' and type_user='ban';`)
        if(!(user_name.length > 0)){
            return res.json({message: 'Пользователь не найден или не в бане'})
        }
        await query(`
        UPDATE users SET type_user='user' where email='${email}'; 
        `)
        return res.json({message : `Пользователь ${user_name[0].user_name} разблокирован`})
    }
    catch(error){
        console.error("Ошибка в поиске пользователя ",error);
        res.status(500).json({error: `Ошибка в поиске пользователя, ${error}`})
    }
})



router.get('/admin/giveAdmin/:email', async(req,res)=>{
    try{
        const email = req.params.email
        const user_name = await query(`select user_name from users where email='${email}' and type_user != 'ban';`)
        if(!(user_name.length > 0)){
            return res.json({ message: 'Пользователь не найден или заблокирован'})
        }
        await query(`
        UPDATE users SET type_user='admin' where email='${email}'; 
        `)
        return res.json({message : `Пользователь ${user_name[0].user_name} наделен админ правами`})
    }
    catch(error){
        console.error("Ошибка в поиске пользователя ",error);
        res.status(500).json({error: `Ошибка в поиске пользователя, ${error}`})
    }
})

router.get('/admin/removeAdmin/:email', async(req,res)=>{
    try{
        const email = req.params.email
        const user_name = await query(`select user_name from users where email='${email}' and type_user = 'admin';`)
        if(!(user_name.length > 0)){
            return res.json({message : 'Пользователь не найден или не является администратором'})
        }
        await query(`
        UPDATE users SET type_user='user' where email='${email}'; 
        `)
        return res.json({message : `Пользователь ${user_name[0].user_name} снят с должности админа`})
    }
    catch(error){
        console.error("Ошибка в поиске пользователя ",error);
        res.status(500).json({error: `Ошибка в поиске пользователя, ${error}`})
    }
})

router.post('/add/catalog/product/:jsonObject', (req, res) => {
    let tempArray = req.params.jsonObject.split(",")
   
    const data = {'name': tempArray[0], 'price': tempArray[1], 'category': tempArray[3]}
    
    upload(req, res, async function (err) { 
              if (err instanceof multer.MulterError) {
            return res.status(500).json({ success: false, message: 'Ошибка при загрузке файла' });
        } else if (err) {
            return res.status(500).json({ success: false, message: 'Произошла ошибка' });
        }
        try {
            const serverDirectory = "/media/productImage/";
            const relativeFilePaths = req.files.map(file => {
                return serverDirectory + file.filename;
            });
            const images = relativeFilePaths.map(path => `('${path}')`).join(', ');
            console.log(images)
            await query(`INSERT INTO product (price, product_name, image_path, id_category) 
            VALUES
            (${data.price}, '${data.name}', array[${images}], ${data.category});`);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Ошибка при сохранении путей в базу данных:', error);
            res.status(500).json({ success: false, message: 'Произошла ошибка при сохранении путей в базе данных' });
        }
    });

});


// router.post('/remove/catalog/product/:jsonObject', (req, res) => {
   
//     const data = {'name': tempArray[0]}
    
//     upload(req, res, async function (err) { 
//               if (err instanceof multer.MulterError) {
//             return res.status(500).json({ success: false, message: 'Ошибка при загрузке файла' });
//         } else if (err) {
//             return res.status(500).json({ success: false, message: 'Произошла ошибка' });
//         }
//         try {
//             const serverDirectory = "/media/productImage/";
//             const relativeFilePaths = req.files.map(file => {
//                 return serverDirectory + file.filename;
//             });
//             const images = relativeFilePaths.map(path => `('${path}')`).join(', ');
//             console.log(images)
//             await query(`INSERT INTO product (price, product_name, image_path, id_category) 
//             VALUES
//             (${data.price}, '${data.name}', array[${images}], ${data.category});`);
//             res.status(200).json({ success: true });
//         } catch (error) {
//             console.error('Ошибка при сохранении путей в базу данных:', error);
//             res.status(500).json({ success: false, message: 'Произошла ошибка при сохранении путей в базе данных' });
//         }
//     });

// });


module.exports = router