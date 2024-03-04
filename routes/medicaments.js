const express = require("express");
const { Medicament } = require("../models/medicament");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const medicaments = await Medicament.find()
    .populate("categorieId")
    .sort("nom");
  res.send(medicaments);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.medicament(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { nom } = req.body;
  const medicament = new Medicament({
    nom: nom,
    description: req.body.description,
    categorieId: req.body.categorieId,
  });
  await medicament.save();
  res.send(medicament);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.medicament(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { nom } = req.body;

  const medicament = await Medicament.findByIdAndUpdate(
    req.params.id,
    {
      nom: nom,
      description: req.body.description,
      categorieId: req.body.categorieId,
    },
    {
      new: true,
    }
  );

  if (!medicament)
    return res.status(404).send("medicament avec cet id n'existe pas");
  res.send(medicament);
});

router.get("/:id", async (req, res) => {
  const medicament = await Medicament.findById(req.params.id);
  if (!medicament)
    return res.status(404).send("medicament avec cet id n'existe pas");
  res.send(medicament);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const medicament = await Medicament.findOneAndDelete({ _id: req.params.id });
  if (!medicament)
    return res.status(404).send("medicament avec cet id n'existe pas");

  res.send(medicament);
});

module.exports = router;
