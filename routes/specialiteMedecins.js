const express = require("express");
const { SpecialiteMedecin } = require("../models/specialiteMedecin");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const specialiteMedecins = await SpecialiteMedecin.find().sort("nom");
  res.send(specialiteMedecins);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.specialiteMedecin(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const specialiteMedecin = new SpecialiteMedecin({
    nom: req.body.nom,
  });
  await specialiteMedecin.save();
  res.send(specialiteMedecin);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.specialiteMedecin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const specialiteMedecin = await SpecialiteMedecin.findByIdAndUpdate(
    req.params.id,
    { nom: req.body.nom },
    {
      new: true,
    }
  );

  if (!specialiteMedecin)
    return res.status(404).send("la spécialité avec cet id n'existe pas");
  res.send(specialiteMedecin);
});

router.get("/:id", async (req, res) => {
  const specialiteMedecin = await SpecialiteMedecin.findById(req.params.id);
  if (!specialiteMedecin)
    return res.status(404).send("la spécialité avec cet id n'existe pas");
  res.send(specialiteMedecin);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const specialiteMedecin = await SpecialiteMedecin.findByIdAndRemove(
    req.params.id
  );
  if (!specialiteMedecin)
    return res.status(404).send("la spécialité avec cet id n'existe pas");
  res.send(specialiteMedecin);
});

module.exports = router;
