const mongoose = require("mongoose");

const pathologieSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    maxlength: 50,
  },
  description: {
    type: String,
    maxlength: 255,
  },
  considerationsSpeciales: {
    type: String,
    maxlength: 255,
  },
});

const Pathologie = mongoose.model("Pathologie", pathologieSchema);

exports.pathologieSchema = pathologieSchema;
exports.Pathologie = Pathologie;
