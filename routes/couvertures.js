const express = require("express");
const { Couverture } = require("../models/couverture");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const { DetailCouverture } = require("../models/detailCouverture");
const router = express.Router();

router.get("/", async (req, res) => {
  const couvertures = await Couverture.find().sort("nom");
  res.send(couvertures);
});

router.post("/", [auth /* admin */], async (req, res) => {
  const { error } = validations.couverture(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { nom, detailCouvertureIds } = req.body;
  const couverture = new Couverture({
    nom: nom,
    detailCouvertureIds: detailCouvertureIds ? detailCouvertureIds : [],
  });
  await couverture.save();
  res.send(couverture);
});

router.put("/:id", [auth /* admin */], async (req, res) => {
  const { error } = validations.couverture(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { nom, detailCouvertureIds } = req.body;

  const couverture = await Couverture.findByIdAndUpdate(
    req.params.id,
    { nom: nom, detailCouvertureIds: detailCouvertureIds },
    {
      new: true,
    }
  );

  if (!couverture)
    return res.status(404).send("couverture avec cet id n'existe pas");
  res.send(couverture);
});

router.get("/:id", async (req, res) => {
  const couverture = await Couverture.findById(req.params.id);
  if (!couverture)
    return res.status(404).send("couverture avec cet id n'existe pas");
  res.send(couverture);
});

router.delete("/:id", [auth /* admin */], async (req, res) => {
  const couverture = await Couverture.findOneAndDelete({ _id: req.params.id });
  if (!couverture)
    return res.status(404).send("couverture avec cet id n'existe pas");
  // delete detailCouverture having couvertureId = couverture._id
  await DetailCouverture.deleteMany({ couvertureId: couverture._id });

  res.send(couverture);
});

module.exports = router;
