const express = require("express");
const { Rdv } = require("../models/rdv");

const { Patient } = require("../models/patient");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  let query = {};
  const date = req.query.date;
  if (date) {
    // If a date is provided, construct the start and end of the day in UTC
    const startOfDay = new Date(date);

    const endOfDay = new Date(date);

    // Update the query to look for rdvs within the specified day
    query.datePrevu = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }
  const rdvs = await Rdv.find(query)
    .populate({
      path: "patientId",
      select: "nom prenom telephone",
    })
    .populate({
      path: "deviId",
      select: "numOrdre",
    })
    .populate({
      path: "acteId",
      select: "nom",
    })
    .sort("datePrevu");
  res.send(rdvs);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.rdv(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const {
    patientId,
    newPatient,
    datePrevu,
    description,
    isHonnore,
    heureDebut,
    heureFin,
    lastRdvId,
    natureId,
    acteId,
  } = req.body;
  let patient = {};
  if (patientId) {
    patient = await Patient.findById(patientId);
    if (!patient) return res.status(400).send("Patient Invalide.");
  }
  // compare newPatient with patient and update patient if newPatient is different
  if (newPatient) {
    if (patientId) {
      patient.cin = newPatient.cin;
      patient.nom = newPatient.nom;
      patient.prenom = newPatient.prenom;
      patient.isMasculin = newPatient.isMasculin;
      patient.telephone = newPatient.telephone;
      patient.regionId = newPatient.regionId ? newPatient.regionId : undefined;
      patient.provinceId = newPatient.provinceId
        ? newPatient.provinceId
        : undefined;
      patient.prochainRdv = {
        date: datePrevu,
      };
    } else {
      const { error } = validations.patient(newPatient);
      if (error) return res.status(400).send(error.details[0].message);
      patient = new Patient({
        cin: newPatient.cin,
        nom: newPatient.nom,
        prenom: newPatient.prenom,
        isMasculin: newPatient.isMasculin,
        telephone: newPatient.telephone,
        regionId: newPatient.regionId ? newPatient.regionId : patient.regionId,
        provinceId: newPatient.provinceId
          ? newPatient.provinceId
          : patient.provinceId,
        prochainRdv: {
          date: datePrevu,
        },
      });
    }
  }
  await patient.save();

  const rdv = new Rdv({
    patientId: patient._id,
    datePrevu,
    description,
    isHonnore: isHonnore === null ? undefined : isHonnore,
    heureDebut,
    heureFin,
    lastRdvId: !lastRdvId ? undefined : lastRdvId,
    natureId: !natureId ? undefined : natureId,
    acteId: !acteId ? undefined : acteId,
  });

  await rdv.save();
  res.send(rdv);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.rdv(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const {
    patientId,
    newPatient,
    datePrevu,
    description,
    isHonnore,
    isAnnule,
    lastRdvId,
    isReporte,
    heureFin,
    heureDebut,
    dateNouveauRdv,
    natureId,
    acteId,
  } = req.body;
  // validation to delete if sure they are called just before
  let patient = await Patient.findById(patientId);

  if (!patient) return res.status(400).send("Patient Invalide.");
  if (newPatient) {
    patient.cin = newPatient.cin;
    patient.nom = newPatient.nom;
    patient.prenom = newPatient.prenom;
    patient.isMasculin = newPatient.isMasculin;
    patient.telephone = newPatient.telephone;
    patient.regionId = newPatient.regionId ? newPatient.regionId : undefined;
    patient.provinceId = newPatient.provinceId
      ? newPatient.provinceId
      : undefined;
  }

  const rdv = await Rdv.findByIdAndUpdate(
    req.params.id,
    {
      patientId,
      datePrevu,
      description: description ? description : "",
      isHonnore,
      isAnnule,
      isReporte,
      lastRdvId: !lastRdvId ? undefined : lastRdvId,
      heureFin,
      heureDebut,
      dateNouveauRdv,
      natureId: !natureId ? undefined : natureId,
      acteId: !acteId ? undefined : acteId,
    },
    {
      new: true,
    }
  );
  if (
    (isAnnule || isReporte) &&
    new Date(patient.prochainRdv.date).getFullYear() ===
      new Date(rdv.datePrevu).getFullYear() &&
    new Date(patient.prochainRdv.date).getMonth() ===
      new Date(rdv.datePrevu).getMonth() &&
    new Date(patient.prochainRdv.date).getDate() ===
      new Date(rdv.datePrevu).getDate()
  )
    patient.prochainRdv = {
      date: "",
    };

  await patient.save();
  if (lastRdvId) {
    const lastRdv = await Rdv.findById(lastRdvId);
    if (
      new Date(lastRdv.datePrevu).getFullYear() !==
        new Date(rdv.datePrevu).getFullYear() ||
      new Date(lastRdv.datePrevu).getMonth() !==
        new Date(rdv.datePrevu).getMonth() ||
      new Date(lastRdv.datePrevu).getDate() !==
        new Date(rdv.datePrevu).getDate()
    ) {
      lastRdv.dateNouveauRdv = rdv.datePrevu;
      await lastRdv.save();
    }
  }
  if (!rdv) return res.status(404).send("le rdv avec cet id n'existe pas");

  res.send(rdv);
});

router.get("/:id", async (req, res) => {
  const rdv = await Rdv.findById(req.params.id).populate({
    path: "patientId",
    select: "nom prenom telephone cin isMasculin regionId provinceId",
  });
  if (!rdv) return res.status(404).send("le rdv avec cet id n'existe pas");
  res.send(rdv);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const rdv = await Rdv.findOneAndDelete({ _id: req.params.id });
  if (!rdv) return res.status(404).send("le rdv avec cet id n'existe pas");

  const patient = await Patient.findById(rdv.patientId);
  if (!patient) return res.status(400).send("Patient Invalide.");
  if (
    new Date(patient.prochainRdv.date).getFullYear() ===
      new Date(rdv.datePrevu).getFullYear() &&
    new Date(patient.prochainRdv.date).getMonth() ===
      new Date(rdv.datePrevu).getMonth() &&
    new Date(patient.prochainRdv.date).getDate() ===
      new Date(rdv.datePrevu).getDate()
  ) {
    patient.prochainRdv = {
      date: "",
      // medecinId: patient.prochainRdv.medecinId,
    };
    await patient.save();
  }
  res.send(rdv);
});

module.exports = router;
