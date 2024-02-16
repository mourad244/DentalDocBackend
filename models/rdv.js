const mongoose = require("mongoose");

const rdvSchema = new mongoose.Schema({
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
  isAnnule: {
    type: Boolean,
    default: false,
  },
  isReporte: {
    type: Boolean,
    default: false,
  },
  lastRdvId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rdv",
  },
  dateNouveauRdv: {
    type: Date,
  },
  deviId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Devi",
  },
  natureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NatureActe",
  },
  acteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ActeDentaire",
  },
  heureDebut: {
    heure: {
      type: Number,
    },
    minute: {
      type: Number,
    },
  },
  heureFin: {
    heure: {
      type: Number,
    },
    minute: {
      type: Number,
    },
  },
});
const Rdv = mongoose.model("Rdv", rdvSchema);

exports.rdvSchema = rdvSchema;
exports.Rdv = Rdv;
