const mongoose = require("mongoose");

const bonCommandeSchema = new mongoose.Schema({
  // N°,
  numOrdre: {
    type: String,
    // required: true,
  },
  //  date,
  date: {
    type: Date,
    // default: Date.now,
  },
  //  objet,
  objet: {
    type: String,
  },

  // titulaire,
  societeRetenuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Societe",
  },
  // montant,
  montantHT: {
    type: Number,
  },
  tva: Number,
  montantTTC: {
    type: Number,
  },

  commentaire: {
    type: String,
  },

  articles: [
    {
      articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
      },
      quantite: Number,
      prixUnitaire: Number,
    },
  ],
  paiementIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paiement",
    },
  ],
  isPayed: {
    type: Boolean,
  },
  images: {
    type: Array,
  },
});
const BonCommande = mongoose.model("BonCommande", bonCommandeSchema);

exports.bonCommandeSchema = bonCommandeSchema;
exports.BonCommande = BonCommande;
