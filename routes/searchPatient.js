const express = require("express");
const { Patient } = require("../models/patient");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();
router.get("/", async (req, res) => {
  const patients = await Patient.find({
    $or: [
      { cin: { $regex: req.query.search, $options: "i" } },
      { nom: { $regex: req.query.search, $options: "i" } },
      { numDossier: { $regex: req.query.search, $options: "i" } },
    ],
  })
    .populate("medecinId")
    .populate({
      path: "prochainRdv",
      populate: {
        path: "medecinId",
      },
    })
    .populate({
      path: "deviIds",
      populate: {
        path: "deviId",
        populate: {
          path: "acteEffectues",
          populate: {
            path: "acteId",
            populate: {
              path: "natureId",
              select: "nom",
            },
          },
        },
      },
    })
    .populate({
      path: "paiementIds",
      populate: {
        path: "paiementId",
      },
    });

  res.send(patients);
});
module.exports = router;
