const express = require("express");

const { Fournisseur } = require("../models/fournisseur");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const fournisseurs = await Fournisseur.find().sort("nom");
  res.send(fournisseurs);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.fournisseur(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { nom, adresse, telephone, fax, email, contact, siteWeb, articleIds } =
    req.body;

  const fournisseur = new Fournisseur({
    nom,
    adresse,
    telephone,
    fax,
    email,
    contact,
    siteWeb,
    articleIds: articleIds ? articleIds : [],
  });
  await fournisseur.save();
  res.send(fournisseur);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.fournisseur(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { nom, adresse, telephone, fax, email, contact, siteWeb, articleIds } =
    req.body;

  const fournisseur = await Fournisseur.findByIdAndUpdate(
    req.params.id,
    {
      nom,
      adresse,
      telephone,
      fax,
      email,
      contact,
      siteWeb,
      articleIds,
    },
    { new: true }
  );

  if (!fournisseur) return res.status(404).send("Fournisseur Introuvable.");
  res.send(fournisseur);
});

router.get("/:id", async (req, res) => {
  const fournisseur = await Fournisseur.findById(req.params.id);
  if (!fournisseur) return res.status(404).send("Fournisseur Introuvable.");
  res.send(fournisseur);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const fournisseur = await Fournisseur.findOneAndDelete({
    _id: req.params.id,
  });
  if (!fournisseur) return res.status(404).send("Fournisseur Introuvable.");

  res.send(fournisseur);
});

module.exports = router;
