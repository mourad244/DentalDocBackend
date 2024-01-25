const express = require("express");
const { Patient } = require("../models/patient");

const { Devi } = require("../models/devi");
const { Medecin } = require("../models/medecin");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const { Couverture } = require("../models/couverture");
const { DetailCouverture } = require("../models/detailCouverture");
const { Allergie } = require("../models/allergie");
const { Pathologie } = require("../models/pathologie");
const { Medicament } = require("../models/medicament");
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
  const { error } = validations.patient(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    cin,
    nom,
    prenom,
    isMasculin,
    profession,
    regionId,
    provinceId,
    dateNaissance,
    telephone,
    ville,
    couvertureId,
    detailCouvertureId,
    medicamentIds,
    pathologieIds,
    allergieIds,
    dateCreation,
  } = req.body;
  // validation to delete if sure they are called just before
  if (couvertureId) {
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
  }
  const patient = new Patient({
    cin: cin ? cin : "",
    nom: nom ? nom : "",
    prenom: prenom ? prenom : "",
    isMasculin: isMasculin,
    profession: profession ? profession : "",
    dateNaissance: dateNaissance ? dateNaissance : undefined,
    telephone: telephone ? telephone : "",
    ville: ville ? ville : "",
    dateCreation: dateCreation ? dateCreation : undefined,
    regionId: regionId ? regionId : undefined,
    provinceId: provinceId ? provinceId : undefined,
    couvertureId: couvertureId ? couvertureId : null,
    detailCouvertureId: detailCouvertureId ? detailCouvertureId : null,
    medicamentIds: medicamentIds ? medicamentIds : [],
    pathologieIds: pathologieIds ? pathologieIds : [],
    allergieIds: allergieIds ? allergieIds : [],
  });
  await patient.save();
  res.send(patient);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.patient(req.body);
  if (error) return res.status(400).send(error.details[0].message);
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
    dateCreation,
    couvertureId,
    detailCouvertureId,
    medicamentIds,
    pathologieIds,
    allergieIds,
  } = req.body;

  if (couvertureId) {
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
  }

  const patient = await Patient.findByIdAndUpdate(req.params.id, {
    cin: cin ? cin : "",
    nom: nom ? nom : "",
    prenom: prenom ? prenom : "",
    isMasculin:
      isMasculin === true || isMasculin === false ? isMasculin : undefined,
    profession: profession ? profession : "",
    dateNaissance: dateNaissance ? dateNaissance : undefined,
    telephone: telephone ? telephone : "",
    ville: ville ? ville : "",
    dateCreation: dateCreation ? dateCreation : undefined,
    regionId: regionId ? regionId : undefined,
    provinceId: provinceId ? provinceId : undefined,
    couvertureId: couvertureId ? couvertureId : undefined,
    detailCouvertureId: detailCouvertureId ? detailCouvertureId : undefined,
    medicamentIds: medicamentIds ? medicamentIds : [],
    pathologieIds: pathologieIds ? pathologieIds : [],
    allergieIds: allergieIds ? allergieIds : [],
  });
  await patient.save();
  res.send(patient);
});

router.get("/:id", async (req, res) => {
  console.log("onde");
  console.log("id", req.params.id);
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
  const patient = await Patient.findByIdAndRemove(req.params.id);
  if (!patient)
    return res.status(404).send("le patient avec cet id n'existe pas");
  res.send(patient);
});

module.exports = router;
