const mongoose = require("mongoose");

const acteDentaireSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  natureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NatureActe",
  },
  code: {
    type: Number,
    required: true,
    maxlength: 50,
  },
  prix: {
    type: Number,
    required: true,

    maxlength: 50,
  },
  // donne moi une variable qui signifie le temps nécéssaire pour faire cet acte
  duree: {
    type: Number,
    // required: true,
  },
  // donne moi une variable qui signifie les moments préférables pour faire cet acte, matin, après midi,
  moments: {
    type: [String],
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
});
const ActeDentaire = mongoose.model("ActeDentaire", acteDentaireSchema);

exports.acteDentaireSchema = acteDentaireSchema;
exports.ActeDentaire = ActeDentaire;
