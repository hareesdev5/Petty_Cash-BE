const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// password hashing
const hashPassword = async (Password) => {
  let salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  let hash = await bcrypt.hash(Password, salt);

  return hash;
};

// compare password and hashPassword
const hashCompare = async (Password, hash) => {
  return await bcrypt.compare(Password, hash);
};

// create token for user
const createToken = async (payload) => {
  let token = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  console.log(token);
  return token;
};

//decode token
const decodeToken = async (token) => {
  let payload = await jwt.decode(token);
  return payload;
};

//validat of user
const validate = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (token) {
    let payload = await decodeToken(token);
    req.headers.userId = payload.id;
    console.log(req.headers.userId);
    let currentTime = new Date() / 1000;
    if (currentTime < payload.exp) {
      next();
    } else {
      res.status(400).send({
        message: "Token Expired",
      });
    }
  } else {
    res.status(400).send({
      message: "No Token Found",
    });
  }
};

module.exports = {
  hashPassword,
  hashCompare,
  createToken,
  validate,
};
