const express = require("express");
const { Cabinet } = require("../models/cabinet");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const cabinets = await Cabinet.find().sort("nom");
  res.send(cabinets);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.cabinet(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const cabinet = new Cabinet({
    nom: req.body.nom,
  });
  await cabinet.save();
  res.send(cabinet);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.cabinet(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const cabinet = await Cabinet.findByIdAndUpdate(
    req.params.id,
    { nom: req.body.nom },
    {
      new: true,
    }
  );

  if (!cabinet)
    return res.status(404).send("le cabinet avec cet id n'existe pas");
  res.send(cabinet);
});

router.get("/:id", async (req, res) => {
  const cabinet = await Cabinet.findById(req.params.id);
  if (!cabinet)
    return res.status(404).send("le cabinet avec cet id n'existe pas");
  res.send(cabinet);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const cabinet = await Cabinet.findByIdAndRemove(req.params.id);
  if (!cabinet)
    return res.status(404).send("le cabinet avec cet id n'existe pas");
  res.send(cabinet);
});

module.exports = router;
