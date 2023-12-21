const mongoose = require("mongoose");

const specialiteMedecinSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
});
const SpecialiteMedecin = mongoose.model(
  "SpecialiteMedecin",
  specialiteMedecinSchema
);

exports.specialiteMedecinSchema = specialiteMedecinSchema;
exports.SpecialiteMedecin = SpecialiteMedecin;
