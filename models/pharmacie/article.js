const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  lotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lot",
  },
  code: {
    type: String,
    required: true,
  },
  nom: {
    type: String,
    required: true,
  },
  stockInitial: {
    type: Number,
  },
  stockAlerte: {
    type: Number,
  },
  stockActuel: {
    type: Number,
  },
  // unite [g, ml, mg, cp, sup, amp, fl, sachet, tube, boite, seringue, pot, autre]
  uniteMesureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UniteMesure",
  },
  uniteReglementaireId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UniteReglementaire",
  },
  prixHT: {
    type: Number,
  },
  tauxTVA: {
    type: Number,
  },
  prixTTC: {
    type: Number,
  },
  isExpiration: {
    type: Boolean,
  },
  images: {
    type: Array,
  },
  receptionBCIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReceptionBonCommande",
    },
  ],
});
// add a methode to update stockActuel after calcualting the total quantity of all receptionBCs

articleSchema.methods.updateStockActuel = async function () {
  const receptionBCs = await this.model("ReceptionBonCommande").find({
    _id: { $in: this.receptionBCIds },
  });
  let total = 0;
  receptionBCs.forEach((receptionBC) => {
    const article = receptionBC.articles.find(
      (article) => article.articleId.toString() === this._id.toString()
    );
    total += article.quantite;
  });
  this.stockActuel = total;
  await this.save();
};
const Article = mongoose.model("Article", articleSchema);

exports.articleSchema = articleSchema;
exports.Article = Article;
