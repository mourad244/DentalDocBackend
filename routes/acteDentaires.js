const express = require("express");
const { ActeDentaire } = require("../models/acteDentaire");

const { NatureActe } = require("../models/natureActe");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const acteDentaires = await ActeDentaire.find()
    .populate("natureId")
    .sort("code");
  res.send(acteDentaires);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.acteDentaire(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { nom, natureId, code, prix, duree, moments } = req.body;

  // validation to delete if sure they are called just before
  if (natureId) {
    const natureActe = await NatureActe.findById(natureId);
    if (!natureActe) return res.status(400).send("NatureActe Invalide.");
  }

  const acteDentaire = new ActeDentaire({
    nom,
    natureId,
    code,
    prix,
    duree,
    moments,
  });
  await acteDentaire.save();
  res.send(acteDentaire);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.acteDentaire(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { nom, natureId, code, prix, duree, moments } = req.body;
  // validation to delete if sure they are called just before
  if (natureId && natureId != "") {
    const natureActe = await NatureActe.findById(natureId);
    if (!natureActe) return res.status(400).send("NatureActe Invalide.");
  }

  const acteDentaire = await ActeDentaire.findByIdAndUpdate(
    req.params.id,
    {
      nom,
      natureId: natureId != "" ? natureId : undefined,
      code,
      prix,
      duree,
      moments,
    },
    {
      new: true,
    }
  );

  if (!acteDentaire)
    return res.status(404).send("le acteDentaire avec cet id n'existe pas");
  res.send(acteDentaire);
});

router.get("/:id", async (req, res) => {
  const acteDentaire = await ActeDentaire.findById(req.params.id);
  if (!acteDentaire)
    return res.status(404).send("le acteDentaire avec cet id n'existe pas");
  res.send(acteDentaire);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const acteDentaire = await ActeDentaire.findOneAndDelete({
    _id: req.params.id,
  });
  if (!acteDentaire)
    return res.status(404).send("le acteDentaire avec cet id n'existe pas");
  res.send(acteDentaire);
});

module.exports = router;
