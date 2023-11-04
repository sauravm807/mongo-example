const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { jwtPrivateKey } = require("../config");

const userSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 5, maxlength: 50 },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    age: { type: Date },
    password: { type: String, required: true, minlength: 5, maxlength: 1024 },
    is_admin: Boolean,
  },
  { timestamps: true }
);
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, is_admin: this.is_admin },
    jwtPrivateKey
  );
  return token;
};

const User = model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(user);
}

module.exports = {
  User: User,
  validate: validateUser,
};
