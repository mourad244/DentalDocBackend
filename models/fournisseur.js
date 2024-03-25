const mongoose = require("mongoose");
const fournisseurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    maxlength: 50,
  },
  adresse: {
    type: String,
    maxlength: 255,
  },
  telephone: {
    type: String,
    maxlength: 50,
  },
  fax: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    maxlength: 50,
  },
  contact: {
    type: String,
    maxlength: 50,
  },
  siteWeb: {
    type: String,
    maxlength: 50,
  },
  articleIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
  ],
});

const Fournisseur = mongoose.model("Fournisseur", fournisseurSchema);

module.exports.Fournisseur = Fournisseur;
module.exports.fournisseurSchema = fournisseurSchema;
