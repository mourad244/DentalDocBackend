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
  images: {
    type: Array,
  },
  rdvIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rdv" }],
  acteEffectues: [
    {
      acteId: { type: mongoose.Schema.Types.ObjectId, ref: "ActeDentaire" },
      dentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dent" }],
      prix: { type: Number },
      isPaye: {
        type: Boolean,
        default: false,
      },
      // est ce qu'on a déja rempli l'acte dans la mutuelle
    },
  ],
  articles: [
    {
      articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
      },
      quantite: {
        type: Number,
      },
    },
  ],
  isCoveredMutuelle: {
    type: Boolean,
    default: false,
  },
  mutuelle: {
    signatureDate: {
      type: Date,
    },
    signatureLieu: {
      type: String,
    },
    numBordereau: {
      type: String,
    },
    numDossier: {
      type: String,
    },
    nombrePieces: {
      type: Number,
    },
  },
});
const Devi = mongoose.model("Devi", deviSchema);

exports.deviSchema = deviSchema;
exports.Devi = Devi;
