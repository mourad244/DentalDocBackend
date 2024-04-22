const mongoose = require("mongoose");
const { ReceptionBonCommande } = require("./receptionBonCommande");

const bonCommandeSchema = new mongoose.Schema({
  // N°,
  numOrdre: {
    type: String,
    // required: true,
  },
  date: {
    type: Date,
    // default: Date.now,
  },
  objet: {
    type: String,
  },
  societeRetenuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Societe",
  },
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
      prixTTC: Number,
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
// create a function that i will call after updating reception bonCommande to update quantite restante in articles
//  quantite restante is the difference between quantite total and the sum of all quantite in reception bonCommande stored in receptionIds
bonCommandeSchema.methods.updateQuantiteRestante = async function () {
  let articles = this.articles;
  for (let i = 0; i < articles.length; i++) {
    let article = articles[i];
    let receptionIds = this.receptionIds;
    let total = article.quantiteTotal;
    let sum = 0;
    for (let j = 0; j < receptionIds.length; j++) {
      let receptionBonCommande = await ReceptionBonCommande.findById(
        receptionIds[j]
      );
      let articleIndex = receptionBonCommande.articles.findIndex(
        (a) => a.articleId.toString() === article.articleId.toString()
      );
      if (articleIndex !== -1) {
        sum += receptionBonCommande.articles[articleIndex].quantite;
      }
    }
    article.quantiteRestante = total - sum;
  }
  await this.save();
};
// ajouter une fonction qui définie le statut du bon de commande.
// 1. chercher dans receptionIds si un paramètre boolean isLast qui determine si la reception de la bon de commande est terminé ou nn
// 2. si isLast est true est sum quantite reçu = quantite total alors statut = Livré sinon Partiellement livré
//3 . si isLast est false alors statut = En cours
bonCommandeSchema.methods.updateStatut = async function () {
  let receptionIds = this.receptionIds;
  let articles = this.articles;
  let sum = 0;
  let total = 0;
  let isLast = false;
  for (let i = 0; i < articles.length; i++) {
    total += articles[i].quantiteTotal;
  }
  for (let i = 0; i < receptionIds.length; i++) {
    let receptionBonCommande = await ReceptionBonCommande.findById(
      receptionIds[i]
    );
    if (receptionBonCommande.isLast) {
      isLast = true;
    }
    for (let j = 0; j < articles.length; j++) {
      let articleIndex = receptionBonCommande.articles.findIndex(
        (a) => a.articleId.toString() === articles[j].articleId.toString()
      );
      if (articleIndex !== -1) {
        sum += receptionBonCommande.articles[articleIndex].quantite;
      }
    }
  }
  if (isLast) {
    if (sum === total) {
      this.statut = "Livré";
    } else {
      this.statut = "Partiellement livré";
    }
  } else if (sum === 0) {
    this.statut = "En attente";
  } else if (sum >= total) {
    this.statut = "Livré";
  } else {
    this.statut = "Partiellement en cours";
  }
  await this.save();
};

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
