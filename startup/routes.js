const express = require("express");

const rdvs = require("../routes/rdvs");
const auth = require("../routes/auth");
const users = require("../routes/users");
const roles = require("../routes/roles");
const dents = require("../routes/dents");
const devis = require("../routes/devis");
const regions = require("../routes/regions");
const medecins = require("../routes/medecins");
const patients = require("../routes/patients");
const cabinets = require("../routes/cabinets");
const allergies = require("../routes/allergies");
const provinces = require("../routes/provinces");
const paiements = require("../routes/paiements");
const medicaments = require("../routes/medicaments");
const pathologies = require("../routes/pathologies");
const couvertures = require("../routes/couvertures");
const natureActes = require("../routes/natureActes");
const patientsList = require("../routes/patientsList");
const searchPatient = require("../routes/searchPatient");
const acteDentaires = require("../routes/acteDentaires");
const paiementsAccueil = require("../routes/paiementsAccueil");
const detailCouvertures = require("../routes/detailCouvertures");
const specialiteMedecins = require("../routes/specialiteMedecins");
const categorieMedicaments = require("../routes/categorieMedicaments");
const patientsListPaginate = require("../routes/patientsListPaginate");
const devisPaginate = require("../routes/devisPaginate");
const error = require("../middleware/error");
const cors = require("cors");

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());

  app.use("/dentaldoc/auth", auth);

  app.use("/dentaldoc/rdvs", rdvs);
  app.use("/dentaldoc/devis", devis);
  app.use("/dentaldoc/patients", patients);
  app.use("/dentaldoc/paiements", paiements);
  app.use("/dentaldoc/patientslist", patientsList);
  app.use("/dentaldoc/searchpatient", searchPatient);
  app.use("/dentaldoc/paiementsaccueil", paiementsAccueil);

  app.use("/dentaldoc/users", users);
  app.use("/dentaldoc/roles", roles);
  app.use("/dentaldoc/dents", dents);
  app.use("/dentaldoc/regions", regions);
  app.use("/dentaldoc/provinces", provinces);
  app.use("/dentaldoc/medecins", medecins);
  app.use("/dentaldoc/cabinets", cabinets);
  app.use("/dentaldoc/allergies", allergies);
  app.use("/dentaldoc/pathologies", pathologies);
  app.use("/dentaldoc/medicaments", medicaments);
  app.use("/dentaldoc/couvertures", couvertures);
  app.use("/dentaldoc/natureactes", natureActes);
  app.use("/dentaldoc/devispaginate", devisPaginate);
  app.use("/dentaldoc/actedentaires", acteDentaires);
  app.use("/dentaldoc/detailcouvertures", detailCouvertures);
  app.use("/dentaldoc/specialitemedecins", specialiteMedecins);
  app.use("/dentaldoc/categoriemedicaments", categorieMedicaments);
  app.use("/dentaldoc/patientslistpaginate", patientsListPaginate);
  app.use(error);
};
