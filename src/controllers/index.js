const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const Joi = require("joi");
const data = async function (req, res) {
  try {
    return res.json({
      code: 200,
      data: null,
    });
  } catch (err) {
    return res.json({
      code: 400,
      message: "Some error occured",
      error: err,
    });
  }
};
const users = async function (req, res) {
  try {
    return res.json({
      code: 200,
      data: null,
    });
  } catch (err) {
    return res.json({
      code: 400,
      message: "Some error occured",
      error: err,
    });
  }
};
const register = async function (req, res) {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({
        code: 400,
        message: "Validation Error!",
        error: error.details,
      });

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(400)
        .send({ code: 400, message: "User already exists!" });

    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.save();

    return res.json({
      code: 200,
      // token: token,
      data: user.toJSON(),
    });
  } catch (err) {
    return res.json({
      code: 400,
      message: "Some error occured",
      error: err,
    });
  }
};
const login = async function (req, res) {
  try {
    const schema = Joi.object({
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required(),
    });
    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        code: 400,
        message: "Validation Error!",
        error: error.details,
      });

    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(400)
        .send({ code: 400, message: "User does not exist!" });

    const hash = await user.password;
    const result = await new Promise((resolve, reject) => {
      bcrypt.compare(req.body.password, hash, function (err, result) {
        if (err) resolve();
        resolve(result);
      });
    });
    if (!result) {
      return res
        .status(400)
        .send({ code: 400, message: "Incorrect Password!" });
    }
    const token = user.generateAuthToken();
    // return res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));

    return res.json({
      code: 200,
      token: token,
      data: user.toJSON(),
    });
  } catch (err) {
    console.log(err);
    return res.json({
      code: 400,
      message: "Some error occured",
      error: err,
    });
  }
};
module.exports = {
  data,
  users,
  register,
  login,
};
