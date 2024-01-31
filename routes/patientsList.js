const jwt = require("jsonwebtoken");
const express = require("express");
const config = require("config");

const { Patient } = require("../models/patient");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();

router.get("/", async (req, res) => {
  const patients = await Patient.find().select(
    " dateNaissance isMasculin  profession cin prochainRdv  nom numOrdre prenom telephone regionId provinceId "
  );

  res.send(patients);
});

module.exports = router;
