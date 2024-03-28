const mongoose = require("mongoose");

const uniteReglementaireSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  normeApplicable: {
    type: String,
  },
});

const UniteReglementaire = mongoose.model(
  "UniteReglementaire",
  uniteReglementaireSchema
);

exports.uniteReglementaireSchema = uniteReglementaireSchema;
exports.UniteReglementaire = UniteReglementaire;
