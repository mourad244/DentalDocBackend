const mongoose = require("mongoose");

const rdvSchema = new mongoose.Schema({
  medecinId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medecin",
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  datePrevu: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    maxlength: 255,
  },
  isHonnore: {
    type: Boolean,
    default: false,
  },
});
const Rdv = mongoose.model("Rdv", rdvSchema);

exports.rdvSchema = rdvSchema;
exports.Rdv = Rdv;
