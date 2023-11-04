const jwt = require('jsonwebtoken');
const { jwtPrivateKey } = require('../config');
const userMiddleware = async function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];
  if (!accessToken) {
    const err = new Error("Un-Authorized Access(Missing accessToken)");
    err.status = 401;
    next(err);
  }
  jwt.verify(accessToken,jwtPrivateKey,(err,user)=>{
    if(err){
    err = new Error("Un-Authorized Access(Missing accessToken)");
    err.status = 401;
    next(err);
    }
    else{
      req.decoded = user;
      next();
    }
  })
};
module.exports = {
  userMiddleware,
};
