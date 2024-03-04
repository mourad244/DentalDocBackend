const express = require("express");
const { Pathologie } = require("../models/pathologie");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const pathologies = await Pathologie.find().sort("nom");
  res.send(pathologies);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.pathologie(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { nom } = req.body;
  const pathologie = new Pathologie({
    nom: nom,
    description: req.body.description,
    considerationsSpeciales: req.body.considerationsSpeciales,
  });
  await pathologie.save();
  res.send(pathologie);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.pathologie(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { nom } = req.body;

  const pathologie = await Pathologie.findByIdAndUpdate(
    req.params.id,
    {
      nom: nom,
      description: req.body.description,
      considerationsSpeciales: req.body.considerationsSpeciales,
    },
    {
      new: true,
    }
  );

  if (!pathologie)
    return res.status(404).send("pathologie avec cet id n'existe pas");
  res.send(pathologie);
});

router.get("/:id", async (req, res) => {
  const pathologie = await Pathologie.findById(req.params.id);
  if (!pathologie)
    return res.status(404).send("pathologie avec cet id n'existe pas");
  res.send(pathologie);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const pathologie = await Pathologie.findOneAndDelete({ _id: req.params.id });
  if (!pathologie)
    return res.status(404).send("pathologie avec cet id n'existe pas");

  res.send(pathologie);
});

module.exports = router;
