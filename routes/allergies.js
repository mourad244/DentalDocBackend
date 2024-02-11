const express = require("express");
const { Allergie } = require("../models/allergie");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const allergies = await Allergie.find().sort("nom");
  res.send(allergies);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.allergie(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { nom } = req.body;
  const allergie = new Allergie({
    nom: nom,
  });
  await allergie.save();
  res.send(allergie);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.allergie(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { nom } = req.body;

  const allergie = await Allergie.findByIdAndUpdate(
    req.params.id,
    { nom: nom },
    {
      new: true,
    }
  );

  if (!allergie)
    return res.status(404).send("allergie avec cet id n'existe pas");
  res.send(allergie);
});

router.get("/:id", async (req, res) => {
  const allergie = await Allergie.findById(req.params.id);
  if (!allergie)
    return res.status(404).send("allergie avec cet id n'existe pas");
  res.send(allergie);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const allergie = await Allergie.findOneAndDelete(req.params.id);
  if (!allergie)
    return res.status(404).send("allergie avec cet id n'existe pas");

  res.send(allergie);
});

module.exports = router;
