const mongoose = require("mongoose");

const medicamentSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    maxlength: 50,
  },
  description: {
    type: String,
    maxlength: 255,
  },
  categorieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CategorieMedicament",
  },
});

const Medicament = mongoose.model("Medicament", medicamentSchema);

exports.medicamentSchema = medicamentSchema;
exports.Medicament = Medicament;
