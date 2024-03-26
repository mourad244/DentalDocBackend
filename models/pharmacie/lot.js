const mongoose = require("mongoose");

const lotSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
});
const Lot = mongoose.model("Lot", lotSchema);

exports.lotSchema = lotSchema;
exports.Lot = Lot;
