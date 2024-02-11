const express = require("express");
const { Region } = require("../models/region");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const regions = await Region.find().sort("code");
  res.send(regions);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.region(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { nom, code } = req.body;
  const region = new Region({
    nom,
    code,
  });
  await region.save();
  res.send(region);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.region(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { nom, code } = req.body;
  const region = await Region.findByIdAndUpdate(
    req.params.id,
    {
      nom,
      code: code,
    },
    {
      new: true,
    }
  );

  if (!region) return res.status(404).send("l'region avec cet id n'existe pas");
  res.send(region);
});

router.get("/:id", async (req, res) => {
  const region = await Region.findById(req.params.id);
  if (!region) return res.status(404).send("l'étage avec cet id n'existe pas");
  res.send(region);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const region = await Region.findOneAndDelete(req.params.id);
  if (!region) return res.status(404).send("l'region avec cet id n'existe pas");
  res.send(region);
});

module.exports = router;
