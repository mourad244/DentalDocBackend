const express = require("express");
const { Lot } = require("../../models/pharmacie/lot");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

const validations = require("../../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const lots = await Lot.find().sort("nom");
  res.send(lots);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.lot(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const lot = new Lot({
    nom: req.body.nom,
  });
  await lot.save();
  res.send(lot);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.lot(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const lot = await Lot.findByIdAndUpdate(
    req.params.id,
    { nom: req.body.nom },
    {
      new: true,
    }
  );

  if (!lot) return res.status(404).send("lot avec cet id n'existe pas");
  res.send(lot);
});

router.get("/:id", async (req, res) => {
  const lot = await Lot.findById(req.params.id);
  if (!lot) return res.status(404).send("lot avec cet id n'existe pas");
  res.send(lot);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const lot = await Lot.findOneAndDelete({ _id: req.params.id });
  if (!lot) return res.status(404).send("lot avec cet id n'existe pas");
  res.send(lot);
});

module.exports = router;
