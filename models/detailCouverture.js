const mongoose = require("mongoose");

const detailCouvertureSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    maxlength: 50,
  },
  couvertureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Couverture",
  },
});

const DetailCouverture = mongoose.model(
  "DetailCouverture",
  detailCouvertureSchema
);

exports.detailCouvertureSchema = detailCouvertureSchema;
exports.DetailCouverture = DetailCouverture;
