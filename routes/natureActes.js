const express = require("express");
const { NatureActe } = require("../models/natureActe");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const natureActes = await NatureActe.find().sort("nom");
  res.send(natureActes);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.natureActe(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const natureActe = new NatureActe({
    nom: req.body.nom,
  });
  await natureActe.save();
  res.send(natureActe);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.natureActe(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const natureActe = await NatureActe.findByIdAndUpdate(
    req.params.id,
    { nom: req.body.nom },
    {
      new: true,
    }
  );

  if (!natureActe)
    return res.status(404).send("la nature de l'acte avec cet id n'existe pas");
  res.send(natureActe);
});

router.get("/:id", async (req, res) => {
  const natureActe = await NatureActe.findById(req.params.id);
  if (!natureActe)
    return res.status(404).send("la nature de l'acte avec cet id n'existe pas");
  res.send(natureActe);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const natureActe = await NatureActe.findOneAndDelete({ _id: req.params.id });
  if (!natureActe)
    return res.status(404).send("la nature de l'acte avec cet id n'existe pas");
  res.send(natureActe);
});

module.exports = router;
