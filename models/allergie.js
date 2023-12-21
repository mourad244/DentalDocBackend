const mongoose = require("mongoose");

const allergieSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    maxlength: 50,
  },
});

const Allergie = mongoose.model("Allergie", allergieSchema);

exports.allergieSchema = allergieSchema;
exports.Allergie = Allergie;
