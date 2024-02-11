const express = require("express");
const { Dent } = require("../models/dent");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const dents = await Dent.find().sort("numeroFDI");
  res.send(dents);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.dent(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const dent = new Dent({
    numeroFDI: req.body.numeroFDI,
    description: req.body.description,
  });
  await dent.save();
  res.send(dent);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.dent(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const dent = await Dent.findByIdAndUpdate(
    req.params.id,
    { numeroFDI: req.body.numeroFDI, description: req.body.description },
    {
      new: true,
    }
  );

  if (!dent) return res.status(404).send("dent avec cet id n'existe pas");
  res.send(dent);
});

router.get("/:id", async (req, res) => {
  const dent = await Dent.findById(req.params.id);
  if (!dent) return res.status(404).send("dent avec cet id n'existe pas");
  res.send(dent);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const dent = await Dent.findOneAndDelete(req.params.id);
  if (!dent) return res.status(404).send("dent avec cet id n'existe pas");
  res.send(dent);
});

module.exports = router;
