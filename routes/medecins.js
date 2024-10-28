const express = require("express");
const { Medecin } = require("../models/medecin");
const { SpecialiteMedecin } = require("../models/specialiteMedecin");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const medecins = await Medecin.find().sort("nom");
  res.send(medecins);
});

router.post("/", [auth /* admin */], async (req, res) => {
  const { error } = validations.medecin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { nom, prenom, specialiteId } = req.body;

  // validation to delete if sure they are called just before

  if (specialiteId) {
    const specialiteMedecin = await SpecialiteMedecin.findById(specialiteId);
    if (!specialiteMedecin) return res.status(400).send("Specialite Invalide.");
  }

  const medecin = new Medecin({
    nom: nom,
    prenom: prenom,
  });
  await medecin.save();
  res.send(medecin);
});

router.put("/:id", [auth /* admin */], async (req, res) => {
  const { error } = validations.medecin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { nom, prenom, specialiteId } = req.body;
  // validation to delete if sure they are called just before

  if (specialiteId && specialiteId != "") {
    const specialiteMedecin = await SpecialiteMedecin.findById(specialiteId);
    if (!specialiteMedecin) return res.status(400).send("Specialite Invalide.");
  }

  const medecin = await Medecin.findByIdAndUpdate(
    req.params.id,
    {
      nom: nom,
      prenom: prenom,
    },
    {
      new: true,
    }
  );

  if (!medecin)
    return res.status(404).send("le medecin avec cet id n'existe pas");
  res.send(medecin);
});

router.get("/:id", async (req, res) => {
  const medecin = await Medecin.findById(req.params.id);
  if (!medecin)
    return res.status(404).send("le medecin avec cet id n'existe pas");
  res.send(medecin);
});

router.delete("/:id", [auth /* admin */], async (req, res) => {
  const medecin = await Medecin.findOneAndDelete({ _id: req.params.id });
  if (!medecin)
    return res.status(404).send("le medecin avec cet id n'existe pas");
  res.send(medecin);
});

module.exports = router;
