const express = require("express");
const { DetailCouverture } = require("../models/detailCouverture");
const auth = require("../middleware/auth");
const { Couverture } = require("../models/couverture");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const detailCouvertures = await DetailCouverture.find()
    .populate("couvertureId")
    .sort("nom");
  res.send(detailCouvertures);
});

router.post("/", [auth /* admin */], async (req, res) => {
  const { error } = validations.detailCouverture(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { nom, couvertureId } = req.body;
  const detailCouverture = new DetailCouverture({
    nom: nom,
    couvertureId: couvertureId,
  });

  await detailCouverture.save();
  res.send(detailCouverture);
});

router.put("/:id", [auth /* admin */], async (req, res) => {
  const { error } = validations.detailCouverture(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { nom, couvertureId } = req.body;

  const detailCouverture = await DetailCouverture.findByIdAndUpdate(
    req.params.id,
    { nom: nom, couvertureId: couvertureId },
    {
      new: true,
    }
  );

  if (!detailCouverture)
    return res.status(404).send("detailCouverture avec cet id n'existe pas");
  res.send(detailCouverture);
});

router.get("/:id", async (req, res) => {
  const detailCouverture = await DetailCouverture.findById(req.params.id);
  if (!detailCouverture)
    return res.status(404).send("detailCouverture avec cet id n'existe pas");
  res.send(detailCouverture);
});

router.delete("/:id", [auth /* admin */], async (req, res) => {
  const detailCouverture = await DetailCouverture.findOneAndDelete(
    req.params.id
  );
  if (!detailCouverture)
    return res.status(404).send("detailCouverture avec cet id n'existe pas");
  // delete detailCouverture from couverture.detailCouvertureIds

  await Couverture.updateMany(
    { detailCouvertureIds: detailCouverture._id },
    { $pull: { detailCouvertureIds: detailCouverture._id } }
  );

  res.send(detailCouverture);
});

module.exports = router;
