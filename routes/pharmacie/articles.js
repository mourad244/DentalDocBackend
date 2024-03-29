const express = require("express");

const { Article } = require("../../models/pharmacie/article");
const { Lot } = require("../../models/pharmacie/lot");

const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

const validations = require("../../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const articles = await Article.find().populate("lotId").sort("code");
  res.send(articles);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.article(req.body);
  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    lotId,
    code,
    nom,
    stockInitial,
    stockAlerte,
    uniteMesureId,
    uniteReglementairId,
    prixHT,
    tauxTVA,
    prixTTC,
    isExpiration,
  } = req.body;

  // validation to delete if sure they are called just before
  if (lotId) {
    const lot = await Lot.findById(lotId);
    if (!lot) return res.status(400).send("Lot Invalide.");
  }

  const article = new Article({
    lotId: lotId ? lotId : undefined,
    code,
    nom,
    stockInitial,
    stockAlerte,
    uniteMesureId: uniteMesureId ? uniteMesureId : undefined,
    uniteReglementairId: uniteReglementairId ? uniteReglementairId : undefined,
    prixHT,
    tauxTVA,
    prixTTC,
    isExpiration,
  });
  await article.save();
  res.send(article);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.article(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    lotId,
    code,
    nom,
    stockInitial,
    stockAlerte,
    uniteMesureId,
    uniteReglementairId,
    prixHT,
    tauxTVA,
    prixTTC,
    isExpiration,
  } = req.body;

  // validation to delete if sure they are called just before
  if (lotId && lotId !== "") {
    const lot = await Lot.findById(lotId);
    if (!lot) return res.status(400).send("Lot Invalide.");
  }

  const article = await Article.findByIdAndUpdate(
    req.params.id,
    {
      lotId: lotId ? lotId : undefined,
      code,
      nom,
      stockInitial,
      stockAlerte,
      uniteMesureId: uniteMesureId ? uniteMesureId : undefined,
      uniteReglementairId: uniteReglementairId
        ? uniteReglementairId
        : undefined,
      prixHT,
      tauxTVA,
      prixTTC,
      isExpiration,
    },
    {
      new: true,
    }
  );

  if (!article)
    return res.status(404).send("The article with the given ID was not found.");
  res.send(article);
});

router.get("/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article)
    return res.status(404).send("The article with the given ID was not found.");
  res.send(article);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const article = await Article.findOneAndDelete({ _id: req.params.id });
  if (!article)
    return res.status(404).send("The article with the given ID was not found.");
  res.send(article);
});

module.exports = router;
