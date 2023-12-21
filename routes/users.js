const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const validations = require("../startup/validations");

const express = require("express");
const router = express.Router();

// router.get("/me", auth, async (req, res) => {
//   const user = await User.findById(req.user._id).select("-password");
//   res.send(user);
// });
router.get("/", async (req, res) => {
  const users = await User.find().populate("roleId").sort("nom");
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validations.user(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["nom", "email", "password", "roleId"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "email", "roleId"]));
});

router.put("/:id", async (req, res) => {
  const { error } = validations.user(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      nom: req.body.nom,
      email: req.body.email,
      roleId: req.body.roleId,
    },
    {
      new: true,
    }
  );

  if (!user) return res.status(404).send("user avec cet id n'existe pas");
  res.send(user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("user avec cet id n'existe pas");
  res.send(user);
});
router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) return res.status(404).send("user avec cet id n'existe pas");
  res.send(user);
});

module.exports = router;
