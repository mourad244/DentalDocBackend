/* 
bonCommandeId
date
montant
articles
commentaire
images

*/

const mongoose = require("mongoose");

const receptionBonCommandeSchema = new mongoose.Schema({
  bonCommandeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BonCommande",
  },
  date: {
    type: Date,
  },
  montant: {
    type: Number,
  },
  articles: [
    {
      articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
      },
      quantite: Number,
    },
  ],
  commentaire: {
    type: String,
  },
  images: {
    type: Array,
  },
});
const ReceptionBonCommande = mongoose.model(
  "ReceptionBonCommande",
  receptionBonCommandeSchema
);

exports.receptionBonCommandeSchema = receptionBonCommandeSchema;
exports.ReceptionBonCommande = ReceptionBonCommande;
