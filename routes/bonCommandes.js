const express = require("express");
const { BonCommande } = require("../models/bonCommande");
const { Societe } = require("../models/societe");
const validations = require("../startup/validations");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const getPathData = require("../middleware/getPathData");
const compressImage = require("../utils/compressImage");
const deleteImages = require("../middleware/deleteImages");
const uploadImages = require("../middleware/uploadImages");
const _ = require("lodash");
const deleteIndexedImages = require("../middleware/deleteIndexedImages");
const router = express.Router();

router.get("/", async (req, res) => {
  const bonCommandes = await BonCommande.find()
    .populate("societeRetenuId")
    .sort("nom");
  res.send(bonCommandes);
});

router.post("/", [auth, admin], async (req, res) => {
  try {
    await uploadImages(req, res);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${err}`,
    });
  }
  const { error } = validations.bonCommande(req.body);

  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }
  //search string in table
  let {
    numOrdre,
    date,
    objet,
    societeRetenuId,
    montantHT,
    tva,
    montantTTC,
    commentaire,
    articles,
  } = req.body;
  const { image: images } = getPathData(req.files);
  if (images) compressImage(images);

  if (numOrdre === "" || numOrdre === undefined) {
    const lastBonCommande = await BonCommande.findOne().sort({
      numOrdre: -1,
    });
    numOrdre = lastBonCommande ? lastBonCommande.numOrdre + 1 : 1;
  }

  const bonCommande = new BonCommande({
    numOrdre,
    date,
    objet,
    societeRetenuId: societeRetenuId ? societeRetenuId : null,
    montantHT,
    montantTTC,
    commentaire,
    articles,
    tva,
    images: images
      ? images.map(
          (image) => image.destination + "/compressed/" + image.filename
        )
      : [],
  });

  await bonCommande.save();
  res.send(bonCommande);
});

router.put("/:id", [auth, admin], async (req, res) => {
  try {
    await uploadImages(req, res);
  } catch (error) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${error}`,
    });
  }
  const { error } = validations.bonCommande(req.body);
  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }
  const bonCommande = await BonCommande.findOne({ _id: req.params.id });
  if (!bonCommande) {
    deleteImages(req.files);
    return res.status(404).send("le bonCommande avec cette id n'existe pas.");
  }
  let {
    numOrdre,
    date,
    objet,
    beneficiaires,
    besoinIds,
    concurrents,
    societeRetenuId,
    lettreCirculaireId,
    montantHT,
    montantTTC,
    destinataires,
    // auProfit,
    // naturePrestationId,
    commentaire,
    articles,
    tva,
    imagesDeletedIndex,
  } = req.body;
  const { image: images } = getPathData(req.files);
  if (numOrdre) bonCommande.numOrdre = numOrdre;
  if (date) bonCommande.date = date;
  if (objet) bonCommande.objet = objet;
  if (beneficiaires) bonCommande.beneficiaires = beneficiaires;
  if (!beneficiaires.length === 0) {
    beneficiaires.map(async (division) => {
      //add all beneficiaires to the array
      if (!division._id) {
        let newDivision = {};
        newDivision = new Division({
          nom: division.nom,
          acronyme: division.acronyme,
        });
        await newDivision.save();
      }
    });
  }
  if (imagesDeletedIndex && imagesDeletedIndex.length !== 0) {
    await deleteIndexedImages(bonCommande.images, imagesDeletedIndex);
    // delete it from database
    bonCommande.images = bonCommande.images.filter(
      (image, index) => !imagesDeletedIndex.includes(index)
    );
  }
  if (besoinIds) bonCommande.besoinIds = besoinIds;

  if (concurrents) bonCommande.concurrents = concurrents;
  if (concurrents && concurrents.length !== 0) {
    concurrents.map(async (societe) => {
      //add all concurrents to the array
      if (!societe._id) {
        let newSociete = {};
        newSociete = new Societe({
          nom: societe.nom,
          telephone: societe.telephone,
          adresse: societe.adresse,
          ville: societe.ville,
        });
        await newSociete.save();
      }
    });
  }

  if (societeRetenuId) bonCommande.societeRetenuId = societeRetenuId;
  if (montantHT) bonCommande.montantHT = montantHT;
  if (montantTTC) bonCommande.montantTTC = montantTTC;
  if (lettreCirculaireId) bonCommande.lettreCirculaireId = lettreCirculaireId;
  // // // if (auProfit) bonCommande.auProfit = auProfit;
  // // // if (naturePrestationId) bonCommande.naturePrestationId = naturePrestationId;
  if (commentaire) bonCommande.commentaire = commentaire;
  if (destinataires) bonCommande.destinataires = destinataires;
  if (articles) bonCommande.articles = articles;
  if (tva) bonCommande.tva = tva;

  if (images) {
    compressImage(images);
    bonCommande.images.push(
      ...images.map(
        (image) => image.destination + "/compressed/" + image.filename
      )
    );
  }
  await bonCommande.save();
  res.send(bonCommande);
});

router.get("/:id", async (req, res) => {
  const bonCommande = await BonCommande.findById(req.params.id)
    // .populate("naturePrestationIds")
    .populate("besoinIds")
    .populate("societeRetenuId");
  if (!bonCommande)
    return res.status(404).send("le bonCommande avec cet id n'existe pas");
  res.send(bonCommande);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const bonCommande = await BonCommande.findByIdAndRemove(req.params.id);
  if (!bonCommande)
    return res.status(404).send("le bonCommande avec cet id n'existe pas");
  if (bonCommande.images) deleteImages(bonCommande.images);
  if (bonCommande.besoinIds && bonCommande.besoinIds.length !== 0) {
    bonCommande.besoinIds.map(async (besoinId) => {
      const besoin = await Besoin.findById(besoinId);
      if (besoin) {
        const found = besoin.bonCommandes.find(
          // Language: javascript
          (lc) => lc._id.toString() === bonCommande._id.toString()
        );
        if (found) {
          besoin.bonCommandes.splice(besoin.bonCommandes.indexOf(found), 1);
          await besoin.save();
        }
      }
    });
  }
  res.send(bonCommande);
});

module.exports = router;
