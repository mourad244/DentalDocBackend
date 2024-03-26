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
      prixUnitaire: Number,
      quantiteTotal: Number,
      quantiteRestante: Number,
    },
  ],
  paiementIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaiementBonCommande",
    },
  ],
  /* 
  En attente,
  En cours,
  Livré, Annulé, Retourné, Partiellement livré, Partiellement retourné,
  Payé, Partiellement payé,
  */
  statut: {
    type: String,
    // required: true,
  },

  images: {
    type: Array,
  },
  receptionIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReceptionBonCommande",
    },
  ],
});
const BonCommande = mongoose.model("BonCommande", bonCommandeSchema);

exports.bonCommandeSchema = bonCommandeSchema;
exports.BonCommande = BonCommande;

/* 
status: [
    Non payé,
    Partiellement annulé,
    Partiellement en cours, Partiellement en attente, Partiellement payé et livré,
    Partiellement payé et en cours,
    Partiellement payé et annulé, 
    Partiellement payé et retourné,
    Partiellement en cours et livré,
    Partiellement en cours et annulé,
    Partiellement en cours et retourné,
    Partiellement en attente et livré,
    Partiellement en attente et annulé,
    Partiellement en attente et retourné,
    Partiellement livré et annulé,
    Partiellement livré et retourné,
    Partiellement annulé et retourné,
    Partiellement payé, livré et en cours,
    Partiellement payé, livré et annulé, 
    Partiellement payé, livré et retourné,
    Partiellement payé, en cours et annulé,
    Partiellement payé, en cours et retourné,
    Partiellement payé, annulé et retourné,
    Partiellement en cours, livré et annulé,
    Partiellement en cours, livré et retourné,
    Partiellement en cours, annulé et retourné,
    Partiellement en attente, livré et annulé,
    Partiellement en attente, livré et retourné,
    Partiellement en attente, annulé et retourné,
    Partiellement livré, annulé et retourné,
    Partiellement payé, livré, en cours et annulé,
    Partiellement payé, livré, en cours et retourné,
    Partiellement payé, livré, annulé et retourné,
    Partiellement payé, en cours, annulé et retourné,
    Partiellement en cours, livré, annulé et retourné,
    Partiellement en attente, livré, annulé et retourné,
    Partiellement payé, livré, en cours, annulé et retourné,
    Partiellement en cours, livré
  ]

*/
