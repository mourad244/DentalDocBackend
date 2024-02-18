const express = require("express");
const { Paiement } = require("../models/paiement");
const auth = require("../middleware/auth");
const role = require("../permissions/paiementsAccueil");
const admin = require("../middleware/admin");

const router = express.Router();
router.get(
  "/",
  /*  [auth], */ async (req, res) => {
    const paiements = await Paiement.find()
      .select("medecinId montant natureActeId patientId datePaiement -_id")

      .populate({
        path: "natureActeId",
        select: "nom -_id",
      });
    res.send(paiements);
  }
);
module.exports = router;
