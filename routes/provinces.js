const express = require("express");
const { Province } = require("../models/province");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const provinces = await Province.find().populate("regionId").sort("code");
  res.send(provinces);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.province(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { code, nom, regionId } = req.body;
  const province = new Province({
    nom,
    code,
    regionId: regionId ? regionId : null,
  });
  await province.save();
  res.send(province);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.province(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { code, nom, regionId } = req.body;

  const province = await Province.findByIdAndUpdate(
    req.params.id,
    {
      nom,
      code,
      regionId: regionId ? regionId : null,
    },
    {
      new: true,
    }
  );

  if (!province)
    return res.status(404).send("la province avec cet id n'existe pas");
  res.send(province);
});

router.get("/:id", async (req, res) => {
  const province = await Province.findById(req.params.id);
  if (!province)
    return res.status(404).send("la province avec cet id n'existe pas");
  res.send(province);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const province = await Province.findOneAndDelete({ _id: req.params.id });
  if (!province)
    return res.status(404).send("la province avec cet id n'existe pas");
  res.send(province);
});

module.exports = router;
