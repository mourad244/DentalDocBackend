const mongoose = require("mongoose");

const MedecinSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    // requried: true,
  },
});
const Medecin = mongoose.model("Medecin", MedecinSchema);

exports.MedecinSchema = MedecinSchema;
exports.Medecin = Medecin;
