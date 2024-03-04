const express = require("express");
const { Role } = require("../models/role");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const roles = await Role.find().sort("nom");
  res.send(roles);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.role(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const role = new Role({
    nom: req.body.nom,
  });
  await role.save();
  res.send(role);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.role(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const role = await Role.findByIdAndUpdate(
    req.params.id,
    { nom: req.body.nom },
    {
      new: true,
    }
  );

  if (!role) return res.status(404).send("role avec cet id n'existe pas");
  res.send(role);
});

router.get("/:id", async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (!role) return res.status(404).send("role avec cet id n'existe pas");
  res.send(role);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const role = await Role.findOneAndDelete({ _id: req.params.id });
  if (!role) return res.status(404).send("role avec cet id n'existe pas");
  res.send(role);
});

module.exports = router;
