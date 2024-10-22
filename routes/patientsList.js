const express = require("express");

const { Patient } = require("../models/patient");

const router = express.Router();

router.get("/", async (req, res) => {
  const patients = await Patient.find().select(
    "dateNaissance isMasculin profession cin prochainRdv nom numOrdre prenom telephone telephones regionId provinceId"
  );

  res.send(patients);
});

module.exports = router;
