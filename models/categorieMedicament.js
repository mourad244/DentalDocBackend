const mongoose = require("mongoose");

const categorieMedicamentSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
});
const CategorieMedicament = mongoose.model(
  "CategorieMedicament",
  categorieMedicamentSchema
);

exports.categorieMedicamentSchema = categorieMedicamentSchema;
exports.CategorieMedicament = CategorieMedicament;
