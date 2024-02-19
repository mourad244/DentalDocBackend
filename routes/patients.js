const express = require("express");
const { Patient } = require("../models/patient");

const { Devi } = require("../models/devi");
const { Medecin } = require("../models/medecin");

const { Couverture } = require("../models/couverture");
const { Allergie } = require("../models/allergie");
const { Pathologie } = require("../models/pathologie");
const { Medicament } = require("../models/medicament");
const { DetailCouverture } = require("../models/detailCouverture");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validations = require("../startup/validations");

const getPathData = require("../middleware/getPathData");
const compressImage = require("../utils/compressImage");
const uploadImages = require("../middleware/uploadImages");
const deleteImages = require("../middleware/deleteImages");

const router = express.Router();

router.get("/", async (req, res) => {
  const patients = await Patient.find()
    .populate({
      path: "prochainRdv",
      // populate: {
      //   path: "medecinId",
      // },
    })
    .populate({
      path: "deviIds",
      populate: {
        path: "deviId",
        populate: {
          path: "acteEffectues",
          populate: {
            path: "acteId",
            populate: {
              path: "natureId",
              select: "nom",
            },
          },
        },
      },
    })
    .populate({
      path: "paiementIds",
      populate: {
        path: "paiementId",
      },
    })
    .sort("cin");
  res.send(patients);
});

router.post("/", [auth, admin], async (req, res) => {
  try {
    await uploadImages(req, res);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${err}`,
    });
  }
  const { error } = validations.patient(req.body);
  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }

  const {
    cin,
    nom,
    ville,
    prenom,
    regionId,
    telephone,
    isMasculin,
    profession,
    provinceId,
    allergieIds,
    couvertureId,
    dateNaissance,
    medicamentIds,
    pathologieIds,
    detailCouvertureId,
  } = req.body;
  let isMasculinBoolean = undefined;
  if (typeof isMasculin === "string") {
    isMasculinBoolean = isMasculin === "true" ? true : false;
  } else if (typeof isMasculin === "boolean") {
    isMasculinBoolean = isMasculin;
  } else {
    isMasculinBoolean = undefined;
  }
  const { image: images } = getPathData(req.files);
  if (images) compressImage(images);
  const newImages = images
    ? images.map((image) => image.destination + "/compressed/" + image.filename)
    : [];
  // validation to delete if sure they are called just before
  /*   if (couvertureId) {
    const couverture = await Couverture.findById(couvertureId);
    if (!couverture) return res.status(400).send("Couverture invalide");
  }
  if (detailCouvertureId) {
    const detailCouverture = await DetailCouverture.findById(
      detailCouvertureId
    );
    if (!detailCouverture)
      return res.status(400).send("DetailCouverture invalide");
  }
  if (medicamentIds) {
    medicamentIds.map(async (medicamentId) => {
      const medicament = await Medicament.findById(medicamentId);
      if (!medicament) return res.status(400).send("Medicament invalide");
    });
  }
  if (pathologieIds) {
    pathologieIds.map(async (pathologieId) => {
      const pathologie = await Pathologie.findById(pathologieId);
      if (!pathologie) return res.status(400).send("Pathologie invalide");
    });
  }
  if (allergieIds) {
    allergieIds.map(async (allergieId) => {
      const allergie = await Allergie.findById(allergieId);
      if (!allergie) return res.status(400).send("Allergie invalide");
    });
  } */
  const patient = new Patient({
    cin: cin ? cin : "",
    nom: nom ? nom : "",
    prenom: prenom ? prenom : "",
    isMasculin: isMasculinBoolean,
    profession: profession ? profession : "",
    dateNaissance: dateNaissance ? dateNaissance : undefined,
    telephone: telephone ? telephone : "",
    ville: ville ? ville : "",
    regionId: regionId ? regionId : undefined,
    provinceId: provinceId ? provinceId : undefined,
    couvertureId: couvertureId ? couvertureId : null,
    detailCouvertureId: detailCouvertureId ? detailCouvertureId : null,
    medicamentIds: medicamentIds ? medicamentIds : [],
    pathologieIds: pathologieIds ? pathologieIds : [],
    allergieIds: allergieIds ? allergieIds : [],
    images: newImages,
  });
  await patient.save();
  res.send(patient);
});

router.put("/:id", [auth, admin], async (req, res) => {
  try {
    await uploadImages(req, res);
  } catch (error) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${error}`,
    });
  }
  const { error } = validations.patient(req.body);
  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }
  const {
    cin,
    nom,
    prenom,
    isMasculin,
    profession,
    dateNaissance,
    regionId,
    provinceId,
    telephone,
    ville,
    couvertureId,
    detailCouvertureId,
    medicamentIds,
    pathologieIds,
    allergieIds,
    imagesDeletedIndex,
  } = req.body;
  let isMasculinBoolean = undefined;
  if (typeof isMasculin === "string") {
    isMasculinBoolean = isMasculin === "true" ? true : false;
  } else if (typeof isMasculin === "boolean") {
    isMasculinBoolean = isMasculin;
  } else {
    isMasculinBoolean = undefined;
  }

  const { image: images } = getPathData(req.files);
  if (images) compressImage(images);

  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    return res.status(404).send("Patient not found");
  }
  const newImages = images
    ? images.map((image) => image.destination + "/compressed/" + image.filename)
    : [];

  // Merge old and new images, excluding deleted ones
  const updatedImages =
    imagesDeletedIndex && imagesDeletedIndex.length !== 0
      ? patient.images.filter((_, index) => !imagesDeletedIndex.includes(index))
      : patient.images;

  updatedImages.push(...newImages);

  // Update patient record
  const updatedPatientData = {
    cin: cin || "",
    nom: nom || "",
    prenom: prenom || "",
    isMasculin: isMasculinBoolean,
    profession: profession || "",
    dateNaissance: dateNaissance || undefined,
    telephone: telephone || "",
    ville: ville || "",
    regionId: regionId || undefined,
    provinceId: provinceId || undefined,
    couvertureId: couvertureId || undefined,
    detailCouvertureId: detailCouvertureId || undefined,
    medicamentIds: medicamentIds || [],
    pathologieIds: pathologieIds || [],
    allergieIds: allergieIds || [],
    images: updatedImages,
  };
  await Patient.findByIdAndUpdate(req.params.id, updatedPatientData);

  res.send(patient);
});

router.get("/:id", async (req, res) => {
  const patient = await Patient.findById(req.params.id)
    .populate({
      path: "deviIds",
      populate: {
        path: "deviId",
        populate: {
          path: "acteEffectues",
          populate: {
            path: "acteId",
            populate: {
              path: "natureId",
              select: "nom",
            },
          },
        },
      },
    })
    .populate({
      path: "paiementIds",
      populate: {
        path: "paiementId",
      },
    });
  if (!patient)
    return res.status(404).send("le patient avec cet id n'existe pas");
  res.send(patient);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const patient = await Patient.findOneAndDelete(req.params.id);
  if (!patient)
    return res.status(404).send("le patient avec cet id n'existe pas");
  if (patient.images) deleteImages(patient.images);
  res.send(patient);
});

module.exports = router;
