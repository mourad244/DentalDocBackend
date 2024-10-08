const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const validations = require("../startup/validations");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validations.user(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ nom: req.body.nom });
  if (!user) return res.status(400).send("nom ou mot de pass invalid.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("nom ou mot de pass invalide.");

  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
