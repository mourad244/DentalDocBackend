const express = require("express");
const {
  UniteReglementaire,
} = require("../../models/pharmacie/uniteReglementaire");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

const validations = require("../../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const uniteReglementaires = await UniteReglementaire.find().sort("nom");
  res.send(uniteReglementaires);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.uniteReglementaire(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const uniteReglementaire = new UniteReglementaire({
    nom: req.body.nom,
    description: req.body.description,
    normeApplicable: req.body.normeApplicable,
  });
  await uniteReglementaire.save();
  res.send(uniteReglementaire);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.uniteReglementaire(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const uniteReglementaire = await UniteReglementaire.findByIdAndUpdate(
    req.params.id,
    {
      nom: req.body.nom,
      description: req.body.description,
      normeApplicable: req.body.normeApplicable,
    },
    {
      new: true,
    }
  );

  if (!uniteReglementaire)
    return res.status(404).send("uniteReglementaire avec cet id n'existe pas");
  res.send(uniteReglementaire);
});

router.get("/:id", async (req, res) => {
  const uniteReglementaire = await UniteReglementaire.findById(req.params.id);
  if (!uniteReglementaire)
    return res.status(404).send("uniteReglementaire avec cet id n'existe pas");
  res.send(uniteReglementaire);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const uniteReglementaire = await UniteReglementaire.findOneAndDelete({
    _id: req.params.id,
  });
  if (!uniteReglementaire)
    return res.status(404).send("uniteReglementaire avec cet id n'existe pas");
  res.send(uniteReglementaire);
});

module.exports = router;
