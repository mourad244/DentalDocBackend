const mongoose = require("mongoose");

const paiementSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  numOrdre: {
    Type: Number,
  },
  numCheque: {
    type: String,
    maxlength: 100,
  },
  mode: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    // default: Date.now,
  },
  montant: {
    type: Number,
    required: true,
  },
});

const Paiement = mongoose.model("Paiement", paiementSchema);

exports.paiementSchema = paiementSchema;
exports.Paiement = Paiement;
