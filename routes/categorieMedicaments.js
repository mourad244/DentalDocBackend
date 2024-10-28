const express = require("express");
const { CategorieMedicament } = require("../models/categorieMedicament");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const categorieMedicaments = await CategorieMedicament.find().sort("nom");
  res.send(categorieMedicaments);
});

router.post("/", [auth /* admin */], async (req, res) => {
  const { error } = validations.categorieMedicament(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const categorieMedicament = new CategorieMedicament({
    nom: req.body.nom,
  });
  await categorieMedicament.save();
  res.send(categorieMedicament);
});

router.put("/:id", [auth /* admin */], async (req, res) => {
  const { error } = validations.categorieMedicament(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const categorieMedicament = await CategorieMedicament.findByIdAndUpdate(
    req.params.id,
    { nom: req.body.nom },
    {
      new: true,
    }
  );

  if (!categorieMedicament)
    return res
      .status(404)
      .send("Categorie CategorieMedicament avec cet id n'existe pas");
  res.send(categorieMedicament);
});

router.get("/:id", async (req, res) => {
  const categorieMedicament = await CategorieMedicament.findById(req.params.id);
  if (!categorieMedicament)
    return res
      .status(404)
      .send("Categorie CategorieMedicament avec cet id n'existe pas");
  res.send(categorieMedicament);
});

router.delete("/:id", [auth /* admin */], async (req, res) => {
  const categorieMedicament = await CategorieMedicament.findOneAndDelete(
    req.params.id
  );
  if (!categorieMedicament)
    return res
      .status(404)
      .send("Categorie medicament avec cet id n'existe pas");
  res.send(categorieMedicament);
});

module.exports = router;
