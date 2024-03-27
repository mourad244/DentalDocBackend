const express = require("express");

const {
  PaiementBonCommande,
} = require("../../models/pharmacie/paiementBonCommande");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const validations = require("../../startup/validations");

const getPathData = require("../../middleware/getPathData");
const compressImage = require("../../utils/compressImage");
const uploadImages = require("../../middleware/uploadImages");
const deleteImages = require("../../middleware/deleteImages");
const router = express.Router();

router.get("/", async (req, res) => {
  const paiementBonCommandes = await PaiementBonCommande.find()
    .populate("bonCommandeId")
    .sort("date");
  res.send(paiementBonCommandes);
});

router.post("/", [auth, admin], async (req, res) => {
  try {
    await uploadImages(req, res);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${err}`,
    });
  }
  const { error } = validations.paiementBonCommande(req.body);
  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }
  let {
    date,
    montant,
    bonCommandeId,
    modePaiement,
    numCheque,
    banque,
    commentaire,
  } = req.body;
  const { image: images } = getPathData(req.files);
  if (images) compressImage(images);
  const newImages = images
    ? images.map((image) => image.destination + "/compressed/" + image.filename)
    : [];
  const paiementBonCommande = new PaiementBonCommande({
    date,
    montant,
    bonCommandeId,
    modePaiement,
    numCheque,
    banque,
    commentaire,
    images: newImages,
  });
  await paiementBonCommande.save();
  res.send(paiementBonCommande);
});

router.put("/:id", [auth, admin], async (req, res) => {
  try {
    await uploadImages(req, res);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${err}`,
    });
  }
  const { error } = validations.paiementBonCommande(req.body);
  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }
  let {
    date,
    montant,
    bonCommandeId,
    modePaiement,
    numCheque,
    banque,
    commentaire,
  } = req.body;
  const { image: images } = getPathData(req.files);
  if (images) compressImage(images);

  const paiementBonCommande = await PaiementBonCommande.findById(req.params.id);
  if (!paiementBonCommande) {
    deleteImages(req.files);
    return res.status(404).send("PaiementBonCommande not found");
  }
  const newImages = images
    ? images.map((image) => image.destination + "/compressed/" + image.filename)
    : [];
  const updatedImages =
    imagesDeletedIndex && imagesDeletedIndex.length !== 0
      ? paiementBonCommande.images.filter((image, index) => {
          return !imagesDeletedIndex.includes(index);
        })
      : paiementBonCommande.images;
  updatedImages.push(...newImages);

  paiementBonCommande.date = date;
  paiementBonCommande.montant = montant;
  paiementBonCommande.bonCommandeId = bonCommandeId;
  paiementBonCommande.modePaiement = modePaiement;
  paiementBonCommande.numCheque = numCheque;
  paiementBonCommande.banque = banque;
  paiementBonCommande.commentaire = commentaire;
  paiementBonCommande.images = updatedImages;
  await paiementBonCommande.save();
  res.send(paiementBonCommande);
});

router.get("/:id", async (req, res) => {
  const paiementBonCommande = await PaiementBonCommande.findById(req.params.id);
  if (!paiementBonCommande)
    return res.status(404).send("PaiementBonCommande not found");
  res.send(paiementBonCommande);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const paiementBonCommande = await PaiementBonCommande.findByIdAndRemove(
    req.params.id
  );
  if (!paiementBonCommande)
    return res.status(404).send("PaiementBonCommande not found");
  deleteImages(paiementBonCommande.images);
  res.send(paiementBonCommande);
});

module.exports = router;
