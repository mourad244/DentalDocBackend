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
    // required: true,
  },
  // num_cabinet ,
  cin: {
    type: String,
    // unique: true,
  },
  profession: {
    type: String,
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
    // required: true,
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
  // n°_autorisation,

  dateCreation: {
    type: Date,
    // default: Date.now,
  },

  // num_devis ,

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
    medecinId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medecin",
    },
  },
  report: {
    actes: Number,
    recettes: Number,
    isAJour: {
      type: Boolean,
      default: false,
    },
  },

  montantAPayer: {
    type: Number,
    default: 0,
  },
  montantPaye: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
});
/* patientSchema.methods.totalDevis = function () {
  let sumDevisProtheses = this.report.acteProtheses
    ? this.report.acteProtheses
    : 0;
  let sumDevisSoins = this.report.acteSoins ? this.report.acteSoins : 0;
  this.deviIds.map((deviItem) => {
    sumDevisProtheses += deviItem.montantProtheses;
    sumDevisSoins += deviItem.montantSoins;
  });
  this.montantAPayerProtheses = sumDevisProtheses;
  this.montantAPayerSoins = sumDevisSoins;
  this.montantAPaye = sumDevisProtheses + sumDevisSoins;
}; */

/* patientSchema.methods.totalPaiements = function () {
  let sumRecetteSoins = this.report.recetteSoins ? this.report.recetteSoins : 0;
  let sumRecetteProtheses = this.report.recetteProtheses
    ? this.report.recetteProtheses
    : 0;
  this.paiementIds.map((paiement) => {
    paiement.isSoins === true
      ? (sumRecetteSoins += paiement.montant)
      : (sumRecetteProtheses += paiement.montant);
  });
  this.montantPayeSoins = sumRecetteSoins;
  this.montantPayeProtheses = sumRecetteProtheses;
  this.montantPaye = sumRecetteSoins + sumRecetteProtheses;
}; */

patientSchema.methods.calculateBalance = function () {
  this.balance = this.montantAPayer - this.montantPaye;
};

const Patient = mongoose.model("Patient", patientSchema);
exports.patientSchema = patientSchema;
exports.Patient = Patient;
