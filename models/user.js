const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    minlength: 2,
    maxlength: 50,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    unique: true,
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  avatar: String,
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  // createdAt:{
  //     type:Date
  // },
  // updatedAt:{
  //     type:Date
  // },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      nom: this.nom,
      roleId: this.roleId,
    },

    jwtPrivateKey
  );
  return token;
};

const User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;
exports.User = User;
