// nom, description

const mongoose = require("mongoose");

const uniteMesureSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const UniteMesure = mongoose.model("UniteMesure", uniteMesureSchema);

exports.uniteMesureSchema = uniteMesureSchema;
exports.UniteMesure = UniteMesure;
