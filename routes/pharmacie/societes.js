const express = require("express");
const { Societe } = require("../../models/pharmacie/societe");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

const validations = require("../../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const societes = await Societe.find().sort("nom");
  res.send(societes);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.societe(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    fax,
    nom,
    RIB,
    site,
    ville,
    numRC,
    numIF,
    email,
    banque,
    taxPro,
    numCNSS,
    numICE,
    adresse,
    telephone,
    articleIds,
    numPatente,
    description,
    lieuOuvertureBanque,
  } = req.body;
  const societe = new Societe({
    fax,
    nom,
    RIB,
    site,
    ville,
    numRC,
    numIF,
    email,
    banque,
    taxPro,
    numCNSS,
    numICE,
    adresse,
    telephone,
    numPatente,
    description,
    lieuOuvertureBanque,
    articleIds: articleIds ? articleIds : [],
  });
  await societe.save();
  res.send(societe);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.societe(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const {
    fax,
    nom,
    RIB,
    site,
    ville,
    numRC,
    numIF,
    email,
    banque,
    taxPro,
    numCNSS,
    numICE,
    adresse,
    telephone,
    articleIds,
    numPatente,
    description,
    lieuOuvertureBanque,
  } = req.body;
  const societe = await Societe.findByIdAndUpdate(
    req.params.id,
    {
      fax,
      nom,
      RIB,
      site,
      ville,
      numRC,
      numIF,
      email,
      banque,
      taxPro,
      numCNSS,
      numICE,
      adresse,
      telephone,
      numPatente,
      description,
      lieuOuvertureBanque,
      articleIds: articleIds ? articleIds : [],
    },
    {
      new: true,
    }
  );

  if (!societe)
    return res.status(404).send("la societe avec cet id n'existe pas");
  res.send(societe);
});

router.get("/:id", async (req, res) => {
  const societe = await Societe.findById(req.params.id);
  if (!societe)
    return res.status(404).send("la societe avec cet id n'existe pas");
  res.send(societe);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const societe = await Societe.findOneAndDelete({
    _id: req.params.id,
  });
  if (!societe)
    return res.status(404).send("la societe avec cet id n'existe pas");
  res.send(societe);
});

module.exports = router;
