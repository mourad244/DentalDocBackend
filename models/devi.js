const mongoose = require("mongoose");

const deviSchema = new mongoose.Schema({
  numOrdre: {
    type: Number,
    // required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  medecinId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medecin",
  },
  // cabinetId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Cabinet",
  // },
  dateDevi: {
    type: Date,
    default: Date.now,
  },
  montant: {
    type: Number,
  },
  acteEffectues: [
    {
      acteId: { type: mongoose.Schema.Types.ObjectId, ref: "ActeDentaire" },
      dentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dent" }],

      isPaye: {
        type: Boolean,
        default: false,
      },
    },
  ],
});
const Devi = mongoose.model("Devi", deviSchema);

exports.deviSchema = deviSchema;
exports.Devi = Devi;
