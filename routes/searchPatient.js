const express = require("express");
const { Patient } = require("../models/patient");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();
router.get("/", async (req, res) => {
  const searchString = req.query.search;

  if (!searchString) {
    return res.status(400).send("Search string is required");
  }
  const patients = await Patient.find({
    $or: [
      { cin: { $regex: searchString, $options: "i" } },
      { nom: { $regex: searchString, $options: "i" } },
      { prenom: { $regex: searchString, $options: "i" } },
    ],
  }).select("nom prenom cin dateNaissance");

  res.send(patients);
});
module.exports = router;
