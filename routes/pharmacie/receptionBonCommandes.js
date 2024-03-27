const express = require("express");

const {
  ReceptionBonCommande,
} = require("../../models/pharmacie/receptionBonCommande");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const validations = require("../../startup/validations");

const getPathData = require("../../middleware/getPathData");
const compressImage = require("../../utils/compressImage");
const uploadImages = require("../../middleware/uploadImages");
const deleteImages = require("../../middleware/deleteImages");
const router = express.Router();

router.get("/", async (req, res) => {
  const receptionBonCommandes = await ReceptionBonCommande.find()
    .populate("bonCommandeId")
    .sort("date");
  res.send(receptionBonCommandes);
});

router.post("/", [auth, admin], async (req, res) => {
  try {
    await uploadImages(req, res);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${err}`,
    });
  }
  const { error } = validations.receptionBonCommande(req.body);
  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }
  let { bonCommandeId, date, montant, articles, commentaire } = req.body;
  const { image: images } = getPathData(req.files);
  if (images) compressImage(images);
  const newImages = images
    ? images.map((image) => image.destination + "/compressed/" + image.filename)
    : [];
  const receptionBonCommande = new ReceptionBonCommande({
    bonCommandeId,
    date,
    montant,
    articles,
    commentaire,
    images: newImages,
  });
  await receptionBonCommande.save();
  res.send(receptionBonCommande);
});

router.put("/:id", [auth, admin], async (req, res) => {
  try {
    await uploadImages(req, res);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${err}`,
    });
  }
  const { error } = validations.receptionBonCommande(req.body);
  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }
  let { bonCommandeId, date, montant, articles, commentaire } = req.body;
  const { image: images } = getPathData(req.files);
  if (images) compressImage(images);

  const receptionBonCommande = await ReceptionBonCommande.findById(
    req.params.id
  );
  if (!receptionBonCommande) {
    deleteImages(req.files);
    return res.status(404).send("ReceptionBonCommande not found");
  }
  const newImages = images
    ? images.map((image) => image.destination + "/compressed/" + image.filename)
    : [];
  const updatedImages =
    imagesDeletedIndex && imagesDeletedIndex.length !== 0
      ? receptionBonCommande.images.filter((image, index) => {
          return !imagesDeletedIndex.includes(index);
        })
      : receptionBonCommande.images;
  updatedImages.push(...newImages);

  receptionBonCommande.date = date;
  receptionBonCommande.montant = montant;
  receptionBonCommande.bonCommandeId = bonCommandeId;
  receptionBonCommande.commentaire = commentaire;
  receptionBonCommande.images = updatedImages;
  await receptionBonCommande.save();
  res.send(receptionBonCommande);
});

router.get("/:id", async (req, res) => {
  const receptionBonCommande = await ReceptionBonCommande.findById(
    req.params.id
  );
  if (!receptionBonCommande)
    return res.status(404).send("ReceptionBonCommande not found");
  res.send(receptionBonCommande);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const receptionBonCommande = await ReceptionBonCommande.findByIdAndRemove(
    req.params.id
  );
  if (!receptionBonCommande)
    return res.status(404).send("ReceptionBonCommande not found");
  deleteImages(receptionBonCommande.images);
  res.send(receptionBonCommande);
});

module.exports = router;
