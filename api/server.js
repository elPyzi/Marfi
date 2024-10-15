const { cookiesPars, cors, express } = require("./config");
const { connect} = require('./db');
const authorizationRouter = require('./authorization');
const catalogRouter = require('./catalog');
const loadRouter = require('./serverFunc');
const adminRouter = require('./backAdmin');
const basketRouter = require('./backBasket')
const purRouter = require('./backP')
const userRouter = require('./bacUser')

const app = express();
const port = 3000;

connect();

app.use(cookiesPars());
app.use(cors());
app.use(express.json());

app.use(loadRouter);
app.use(authorizationRouter)
app.use(catalogRouter)
app.use(adminRouter)
app.use(basketRouter)
app.use(purRouter)
app.use(userRouter)

app.listen(port, () => {
    console.log(`Сервер работает по порту: ${port}`);
});