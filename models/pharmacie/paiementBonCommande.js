/* 
bonCommandeId
montant
date
modePaiement
numCheque
banque
commentaire

*/

const mongoose = require("mongoose");

const paiementBonCommandeSchema = new mongoose.Schema({
  bonCommandeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BonCommande",
  },
  montant: {
    type: Number,
  },
  date: {
    type: Date,
  },
  modePaiement: {
    type: String,
  },
  numCheque: {
    type: String,
  },
  banque: {
    type: String,
  },
  commentaire: {
    type: String,
  },
  images: {
    type: Array,
  },
});
const PaiementBonCommande = mongoose.model(
  "PaiementBonCommande",
  paiementBonCommandeSchema
);

exports.paiementBonCommandeSchema = paiementBonCommandeSchema;
exports.PaiementBonCommande = PaiementBonCommande;
