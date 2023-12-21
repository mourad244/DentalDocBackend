const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  }
});
const Role = mongoose.model('Role', roleSchema);

exports.roleSchema = roleSchema;
exports.Role = Role;
