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
  const page = parseInt(req.query.currentPage) || 1;
  const pageSize = parseInt(req.query.pageSize) || 15;
  const sortColumn = req.query.sortColumn || "nom";
  const order = req.query.order || "asc";
  const time = req.query.time || "journee";
  let date = req.query.date ? new Date(req.query.date) : new Date();

  let start, end;
  if (time === "journee") {
    start = new Date(date.setHours(0, 0, 0, 0));
    end = new Date(date.setHours(23, 59, 59, 999));
  } else if (time === "mois") {
    start = new Date(date.getFullYear(), date.getMonth(), 1);
    end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  } else if (time === "annee") {
    start = new Date(date.getFullYear(), 0, 1);
    end = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
  }
  const query = {
    date: {
      $gte: start,
      $lte: end,
    },
  };
  const skipIndex = (page - 1) * pageSize;

  try {
    const totalCount = await PaiementBonCommande.countDocuments(query);
    const paiementBonCommandes = await PaiementBonCommande.find(query)

      .populate({
        path: "bonCommandeId",
      })

      .sort({ [sortColumn]: order === "asc" ? 1 : -1 })
      .skip(skipIndex)
      .limit(pageSize);

    res.send({ data: paiementBonCommandes, totalCount });
  } catch (error) {
    res.status(500).send("Error fetching paiements data");
  }
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
  console.log(error);
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
