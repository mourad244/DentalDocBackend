const express = require("express");
const { Patient } = require("../models/patient");

const { Devi } = require("../models/devi");
const { Medecin } = require("../models/medecin");
const { Paiement } = require("../models/paiement");
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
const ActivityLog = require("../models/activityLog");

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

router.post("/", [auth /* admin */], async (req, res) => {
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
    isPatientAssure,
    nomAssure,
    prenomAssure,
    numAffiliationAssure,
    numImmatriculationAssure,
    numCINAssure,
    addresseAssure,
    isConjoint,
    cin,
    nom,
    adresse,
    prenom,
    regionId,
    telephone,
    observations,
    telephones,
    isMasculin,
    profession,
    provinceId,
    mutuelle,
    numMutuelle,
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
  const { image: images, document: documents } = getPathData(req.files);
  if (images) compressImage(images);
  const newImages = images
    ? images.map((image) => image.destination + "/compressed/" + image.filename)
    : [];
  /*  */
  const newDocuments = documents
    ? documents.map(
        (document) => document.destination + "/" + document.filename
      )
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
  console.log("isPatientAssure", isPatientAssure);
  const patient = new Patient({
    isPatientAssure:
      isPatientAssure === true || isPatientAssure === false
        ? isPatientAssure
        : undefined,
    nomAssure: nomAssure ? nomAssure : "",
    prenomAssure: prenomAssure ? prenomAssure : "",
    numAffiliationAssure: numAffiliationAssure ? numAffiliationAssure : "",
    numImmatriculationAssure: numImmatriculationAssure
      ? numImmatriculationAssure
      : "",
    addresseAssure: addresseAssure ? addresseAssure : "",
    numCINAssure: numCINAssure ? numCINAssure : "",
    isConjoint:
      isConjoint === true || isConjoint === false ? isConjoint : undefined,
    cin: cin ? cin : "",
    nom: nom ? nom : "",
    prenom: prenom ? prenom : "",
    isMasculin: isMasculinBoolean,
    profession: profession ? profession : "",
    dateNaissance: dateNaissance ? dateNaissance : undefined,
    telephone: telephone ? telephone : "",
    telephones: telephones ? telephones : [],
    adresse: adresse ? adresse : "",
    telephones: telephones ? telephones : [],
    observations: observations ? observations : "",
    mutuelle: mutuelle ? mutuelle : "",
    numMutuelle: numMutuelle ? numMutuelle : "",
    regionId: regionId ? regionId : undefined,
    provinceId: provinceId ? provinceId : undefined,
    couvertureId: couvertureId ? couvertureId : null,
    detailCouvertureId: detailCouvertureId ? detailCouvertureId : null,
    medicamentIds: medicamentIds ? medicamentIds : [],
    pathologieIds: pathologieIds ? pathologieIds : [],
    allergieIds: allergieIds ? allergieIds : [],
    images: newImages,
    documents: newDocuments,
  });
  await patient.save();
  res.send(patient);
});

router.put("/:id", [auth], async (req, res) => {
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
    isPatientAssure,
    nomAssure,
    prenomAssure,
    numAffiliationAssure,
    numImmatriculationAssure,
    numCINAssure,
    adresseAssure,
    isConjoint,
    cin,
    nom,
    adresse,
    prenom,
    regionId,
    telephone,
    provinceId,
    isMasculin,
    profession,
    mutuelle,
    numMutuelle,
    observations,
    telephones,
    allergieIds,
    couvertureId,
    dateNaissance,
    medicamentIds,
    pathologieIds,
    imagesDeletedIndex,
    documentsDeletedIndex,
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
  const { image: images, document: documents } = getPathData(req.files);
  if (images) compressImage(images);

  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    return res.status(404).send("Patient not found");
  }

  const newImages = images
    ? images.map((image) => image.destination + "/compressed/" + image.filename)
    : [];

  const newDocuments = documents
    ? documents.map(
        (document) => document.destination + "/" + document.filename
      )
    : [];

  // Merge old and new images, excluding deleted ones
  const updatedImages =
    imagesDeletedIndex && imagesDeletedIndex.length !== 0
      ? patient.images.filter((_, index) => !imagesDeletedIndex.includes(index))
      : patient.images;
  // delete images
  if (imagesDeletedIndex && imagesDeletedIndex.length !== 0)
    deleteImages(imagesDeletedIndex.map((index) => patient.images[index]));
  updatedImages.push(...newImages);
  const updatedDocuments =
    documentsDeletedIndex && documentsDeletedIndex.length !== 0
      ? patient.documents.filter(
          (_, index) => !documentsDeletedIndex.includes(index)
        )
      : patient.documents;
  updatedDocuments.push(...newDocuments);
  // delete documents
  if (documentsDeletedIndex && documentsDeletedIndex.length !== 0)
    deleteImages(
      documentsDeletedIndex.map((index) => patient.documents[index])
    );
  // Update patient record
  const updatedPatientData = {
    isPatientAssure:
      isPatientAssure === true || isPatientAssure === false
        ? isPatientAssure
        : undefined,
    nomAssure: nomAssure || "",
    prenomAssure: prenomAssure || "",
    numAffiliationAssure: numAffiliationAssure || "",
    numImmatriculationAssure: numImmatriculationAssure || "",
    numCINAssure: numCINAssure || "",
    adresseAssure: adresseAssure || "",
    isConjoint: isConjoint,
    cin: cin || "",
    nom: nom || "",
    adresse: adresse || "",
    prenom: prenom || "",
    images: updatedImages,
    documents: updatedDocuments,
    telephone: telephone || "",
    mutuelle: mutuelle || "",
    numMutuelle: numMutuelle || "",
    profession: profession || "",
    telephones: telephones || [],
    observations: observations || "",
    isMasculin: isMasculinBoolean,
    allergieIds: allergieIds || [],
    regionId: regionId || undefined,
    medicamentIds: medicamentIds || [],
    pathologieIds: pathologieIds || [],
    provinceId: provinceId || undefined,
    couvertureId: couvertureId || undefined,
    dateNaissance: dateNaissance || undefined,
    detailCouvertureId: detailCouvertureId || undefined,
  };

  const differences = getDifferences(patient.toObject(), updatedPatientData);
  if (differences) {
    await ActivityLog.create({
      userId: req.user._id,
      action: "update",
      collectionName: "Patient",
      documentId: patient._id,
      details: differences,
    });
  }
  await Patient.findByIdAndUpdate(req.params.id, updatedPatientData);
  res.send(patient);
});
function getDifferences(oldObj, newObj) {
  const differences = {};
  for (const key in oldObj) {
    if (
      (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key]) &&
        key === "nom") ||
      key === "prenom"
    ) {
      differences[key] = {
        oldValue: oldObj[key],
        newValue: newObj[key],
      };
    }
  }
  // if differences is empty return null
  if (Object.keys(differences).length === 0) return null;
  return differences;
}
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

router.delete("/:id", [auth /* admin */], async (req, res) => {
  const patient = await Patient.findOneAndDelete({ _id: req.params.id });
  await ActivityLog.create({
    userId: req.user._id,
    action: "delete",
    collectionName: "Patient",
    documentId: patient._id,
  });
  if (!patient)
    return res.status(404).send("le patient avec cet id n'existe pas");
  if (patient.images) deleteImages(patient.images);
  res.send(patient);
});

module.exports = router;
