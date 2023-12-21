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
  
});
const ActeDentaire = mongoose.model("ActeDentaire", acteDentaireSchema);

exports.acteDentaireSchema = acteDentaireSchema;
exports.ActeDentaire = ActeDentaire;
