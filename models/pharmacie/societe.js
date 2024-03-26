const mongoose = require("mongoose");

const societeSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  telephone: String,
  adresse: String,
  ville: String,
  banque: String,
  lieuOuvertureBanque: String,
  RIB: String,
  numPatente: String,
  numRC: String,
  numIF: String,
  numCNSS: String,
  numICE: String,
  email: String,
  fax: String,
  site: String,
  taxPro: String,
  description: String,
  articleIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
  ],
});
const Societe = mongoose.model("Societe", societeSchema);

exports.societeSchema = societeSchema;
exports.Societe = Societe;
