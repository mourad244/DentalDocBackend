const mongoose = require("mongoose");

const couvertureSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    maxlength: 50,
  },
  detailCouvertureIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DetailCouverture",
    },
  ],
});

const Couverture = mongoose.model("Couverture", couvertureSchema);

exports.couvertureSchema = couvertureSchema;
exports.Couverture = Couverture;
