const mongoose = require("mongoose");

const dentSchema = new mongoose.Schema({
  numeroFDI: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});
const Dent = mongoose.model("Dent", dentSchema);

exports.dentSchema = dentSchema;
exports.Dent = Dent;
