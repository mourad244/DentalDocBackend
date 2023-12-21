const mongoose = require("mongoose");

const natureActeSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
});
const NatureActe = mongoose.model("NatureActe", natureActeSchema);

exports.natureActeSchema = natureActeSchema;
exports.NatureActe = NatureActe;
