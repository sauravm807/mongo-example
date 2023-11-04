const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  // endpoint: process.env.API_URL,
  // masterKey: process.env.API_KEY,
  port: process.env.PORT,
  jwtPrivateKey: "niu32y489yhn)&(*%^fjhv",
  cryptoKey: "niu32y489yhn)&(*%^fjhv",
  db: "mongodb+srv://imran7860:pzyqPugDC0JK52hD@cluster0.0wjbodd.mongodb.net/mongoose",
};
