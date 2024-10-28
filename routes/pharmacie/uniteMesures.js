const express = require("express");
const { UniteMesure } = require("../../models/pharmacie/uniteMesure");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

const validations = require("../../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const uniteMesures = await UniteMesure.find().sort("nom");
  res.send(uniteMesures);
});

router.post("/", [auth /* admin */], async (req, res) => {
  const { error } = validations.uniteMesure(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const uniteMesure = new UniteMesure({
    nom: req.body.nom,
    description: req.body.description,
  });
  await uniteMesure.save();
  res.send(uniteMesure);
});

router.put("/:id", [auth /* admin */], async (req, res) => {
  const { error } = validations.uniteMesure(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const uniteMesure = await UniteMesure.findByIdAndUpdate(
    req.params.id,
    { nom: req.body.nom, description: req.body.description },
    {
      new: true,
    }
  );

  if (!uniteMesure)
    return res.status(404).send("uniteMesure avec cet id n'existe pas");
  res.send(uniteMesure);
});

router.get("/:id", async (req, res) => {
  const uniteMesure = await UniteMesure.findById(req.params.id);
  if (!uniteMesure)
    return res.status(404).send("uniteMesure avec cet id n'existe pas");
  res.send(uniteMesure);
});

router.delete("/:id", [auth /* admin */], async (req, res) => {
  const uniteMesure = await UniteMesure.findOneAndDelete({
    _id: req.params.id,
  });
  if (!uniteMesure)
    return res.status(404).send("uniteMesure avec cet id n'existe pas");
  res.send(uniteMesure);
});

module.exports = router;
