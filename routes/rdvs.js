const express = require("express");
const { Rdv } = require("../models/rdv");

const { Patient } = require("../models/patient");
const { Medecin } = require("../models/medecin");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const rdvs = await Rdv.find()
    .populate({
      path: "patientId",
      select: "nom prenom telephone",
    })
    // .populate({
    //   path: "medecinId",
    //   select: "nom",
    // })

    .sort("datePrevu");
  res.send(rdvs);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.rdv(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { patientId, /* medecinId, */ datePrevu, description, isHonnore } =
    req.body;

  // validation to delete if sure they are called just before

  const patient = await Patient.findById(patientId);
  if (!patient) return res.status(400).send("Patient Invalide.");
  // const medecin = await Medecin.findById(medecinId);
  // if (!medecin) return res.status(400).send("Medecin Invalide.");
  const rdv = new Rdv({
    patientId: patientId,
    // medecinId: medecinId,
    datePrevu: datePrevu,
    description: description,
    isHonnore: isHonnore === null ? undefined : isHonnore,
  });
  patient.prochainRdv = {
    date: datePrevu,
    // medecinId: medecinId,
  };
  await rdv.save();
  await patient.save();
  res.send(rdv);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.rdv(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { patientId, /* medecinId, */ datePrevu, description, isHonnore } =
    req.body;
  // validation to delete if sure they are called just before
  const patient = await Patient.findById(patientId);
  if (!patient) return res.status(400).send("Patient Invalide.");
  // const medecin = await Medecin.findById(medecinId);
  // if (!medecin) return res.status(400).send("Medecin Invalide.");
  const rdv = await Rdv.findByIdAndUpdate(
    req.params.id,
    {
      patientId: patientId,
      // medecinId: medecinId,
      datePrevu: datePrevu,
      description: description ? description : "",
      isHonnore: isHonnore,
    },
    {
      new: true,
    }
  );

  if (!rdv) return res.status(404).send("le rdv avec cet id n'existe pas");

  res.send(rdv);
});

router.get("/:id", async (req, res) => {
  const rdv = await Rdv.findById(req.params.id).populate({
    path: "patientId",
    select: "nom prenom telephone",
  });
  if (!rdv) return res.status(404).send("le rdv avec cet id n'existe pas");
  res.send(rdv);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const rdv = await Rdv.findByIdAndRemove(req.params.id);
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
