const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  dateRecu: {
    type: String,
  },
  numOrdre: {
    type: Number,
  },
  nom: {
    type: String,
    required: true,
    maxlength: 50,
  },
  prenom: {
    type: String,
    required: true,
    maxlength: 50,
  },
  dateNaissance: {
    type: Date,
  },
  cin: {
    type: String,
  },
  profession: {
    type: String,
  },
  images: {
    type: Array,
  },
  couvertureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Couverture",
  },
  detailCouvertureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DetailCouverture",
  },
  medicamentIds: [
    {
      medicamentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicament",
      },
      dateDebut: Date,
      dateFin: Date,
    },
  ],
  pathologieIds: [
    {
      pathologieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pathologie",
      },
    },
  ],
  allergieIds: [
    {
      allergieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Allergie",
      },
    },
  ],
  historiqueMedecins: [
    {
      medecinId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medecin",
      },
      dateDebut: Date,
      dateFin: Date,
    },
  ],
  isMasculin: {
    type: Boolean,
  },
  regionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
  },
  provinceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Province",
  },
  telephone: {
    type: String,
    maxlength: 50,
  },
  ville: {
    type: String,
    maxlength: 255,
  },
  deviIds: [
    {
      deviId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Devi",
      },
      montant: Number,
    },
  ],
  paiementIds: [
    {
      paiementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Paiement",
      },
      montant: Number,
    },
  ],
  prochainRdv: {
    date: {
      type: Date,
    },
  },

  totalDevis: {
    type: Number,
    default: 0,
  },
  totalPaiements: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
});
patientSchema.methods.calculateTotalDevis = function () {
  let total = 0;
  this.deviIds.forEach((devi) => {
    console.log("devi", devi);
    total += devi.montant;
  });
  this.totalDevis = total;
};

patientSchema.methods.calculateTotalPaiements = function () {
  let total = 0;
  this.paiementIds.forEach((paiement) => {
    console.log("paiement", paiement);
    total += paiement.montant;
  });
  this.totalPaiements = total;
};

patientSchema.methods.calculateBalance = function () {
  this.balance = this.totalDevis - this.totalPaiements;
};

const Patient = mongoose.model("Patient", patientSchema);
exports.patientSchema = patientSchema;
exports.Patient = Patient;
