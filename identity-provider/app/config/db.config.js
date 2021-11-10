// module.exports = {
//   HOST: "db",
//   PORT: 27017,
//   DB: "sso_db"
// };
require("dotenv").config();

// const {
//     DB_USER,
//     DB_PASSWORD,
//     DB_HOST,
//     DB_PORT,
//     DB_NAME,
// } = process.env;

// const DB_HOST = 'mongodb';
const DB_HOST = 'localhost';
const DB_USER = 'root';
const DB_PASSWORD = '123456';
const DB_NAME = 'sso_db';
const DB_PORT = 7017;

module.exports = {
    url: `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`
};