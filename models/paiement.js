const mongoose = require("mongoose");
const paiementSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  dateRecu: {
    type: String,
  },
  numOrdre: {
    Type: Number,
  },
  medecinId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medecin",
  },
  // to be generated automatically
  numRecu: Number,
  numCheque: {
    type: String,
    maxlength: 100,
  },
  natureActeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NatureActe",
  },
  cabinetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cabinet",
  },
  modePaiement: {
    type: String,
    required: true,
  },
  datePaiement: {
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
