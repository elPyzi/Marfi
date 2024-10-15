module.exports = {
    name_database: "Marfi",
    password: "pass",
    secret: "secretpass",
    bcrypt: require('bcryptjs'),
    path: require('path'),
    cookiesPars: require('cookie-parser'),
    jwt: require('jsonwebtoken'),
    cors: require('cors'),
    express: require('express'),
    multer: require('multer')
}