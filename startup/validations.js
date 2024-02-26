const Joi = require("joi");

module.exports = {
  user: (userObj) => {
    const schema = Joi.object({
      nom: Joi.string().min(2).max(50),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255),
      roleId: Joi.objectId(),
    });
    return schema.validate(userObj);
  },

  cabinet: (cabinet) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
    });
    return schema.validate(cabinet);
  },
  specialiteMedecin: (specialiteMedecin) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
    });
    return schema.validate(specialiteMedecin);
  },
  medecin: (medecin) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
      prenom: Joi.string().allow(""),
    });
    return schema.validate(medecin);
  },
  natureActe: (natureActe) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
    });
    return schema.validate(natureActe);
  },
  acteDentaire: (acteDentaire) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
      natureId: Joi.objectId().allow(""),
      code: Joi.number().allow(""),
      prix: Joi.number().allow(""),
      duree: Joi.number().allow(""),
      moments: Joi.array(),
    });
    return schema.validate(acteDentaire);
  },
  dent: (dent) => {
    const schema = Joi.object({
      numeroFDI: Joi.string().required(),
      description: Joi.string().allow(""),
    });
    return schema.validate(dent);
  },
  role: (role) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
    });
    return schema.validate(role);
  },
  patient: (patient) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
      prenom: Joi.string().required(),
      cin: Joi.string().allow("").allow(null),
      isMasculin: Joi.boolean().allow("").allow(null),
      dateRecu: Joi.date().allow(""),
      numOrdre: Joi.number().allow(""),
      historiqueMedecins: Joi.array(),
      numDossier: Joi.string(),
      profession: Joi.string().allow(""),
      dateNaissance: Joi.date().allow("").allow(null),
      images: Joi.array(),
      imagesDeletedIndex: Joi.array(),
      telephone: Joi.string().allow(""),
      ville: Joi.string().allow("").allow(null),
      provinceId: Joi.objectId().allow("").allow(null),
      regionId: Joi.objectId().allow("").allow(null),
      prochainRdv: Joi.object(),
      couvertureId: Joi.objectId().allow("").allow(null),
      medicamentIds: Joi.array(),
      pathologieIds: Joi.array(),
      allergieIds: Joi.array(),
      detailCouvertureId: Joi.objectId().allow("").allow(null),
      dateDerniereVisite: Joi.date().allow("").allow(null),
      deviIds: Joi.array(),
      paiementIds: Joi.array(),
      report: Joi.object(),
      montantAPayer: Joi.number().allow(null),
      montantPaye: Joi.number().allow(null),
      balance: Joi.number().allow(null),
    });

    return schema.validate(patient);
  },
  devi: (devi) => {
    const schema = Joi.object({
      patientId: Joi.objectId().allow("").allow(null),
      newPatient: Joi.object(),
      numOrdre: Joi.number().allow(null).allow(""),
      medecinId: Joi.objectId().required(),
      dateDevi: Joi.date(),
      images: Joi.array(),
      imagesDeletedIndex: Joi.array(),
      montant: Joi.number().allow("").allow(null),
      rdvIds: Joi.array(),
      acteEffectues: Joi.array(),
    });
    return schema.validate(devi);
  },
  paiement: (paiement) => {
    const schema = Joi.object({
      numOrdre: Joi.number().allow(null).allow(""),
      patientId: Joi.objectId().required(),
      mode: Joi.string().valid("Chèque", "Espèce"),
      numCheque: Joi.string().allow(""),
      date: Joi.date(),
      montant: Joi.number().required(),
    });
    return schema.validate(paiement);
  },
  rdv: (rdv) => {
    const schema = Joi.object({
      patientId: Joi.objectId().allow("").allow(null),
      newPatient: Joi.object(),
      datePrevu: Joi.date().required(),
      description: Joi.string().allow(""),
      isHonnore: Joi.boolean().allow(null),
      isAnnule: Joi.boolean().allow(null),
      isReporte: Joi.boolean().allow(null),
      dateNouveauRdv: Joi.date().allow(null).allow(""),
      deviId: Joi.objectId().allow(null).allow(""),
      natureId: Joi.objectId().allow(null).allow(""),
      acteId: Joi.objectId().allow(null).allow(""),
      lastRdvId: Joi.objectId().allow(null).allow(""),
      heureDebut: Joi.object(),
      heureFin: Joi.object(),
      __v: Joi.number(),
    });
    return schema.validate(rdv);
  },
  province: (province) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
      code: Joi.string().allow("").allow(null),
      regionId: Joi.objectId().allow("").allow(null),
    });
    return schema.validate(province);
  },
  region: (region) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
      code: Joi.number().allow("").allow(null),
    });
    return schema.validate(region);
  },
  couverture: (couverture) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
      detailCouvertureIds: Joi.array(),
    });
    return schema.validate(couverture);
  },
  detailCouverture: (detailCouverture) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
      couvertureId: Joi.objectId().required(),
    });
    return schema.validate(detailCouverture);
  },
  medicament: (medicament) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
      categorieId: Joi.objectId().allow(""),
      description: Joi.string().allow(""),
    });
    return schema.validate(medicament);
  },
  categorieMedicament: (categorieMedicament) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
    });
    return schema.validate(categorieMedicament);
  },
  allergie: (allergie) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
    });
    return schema.validate(allergie);
  },
  pathologie: (pathologie) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
      description: Joi.string().allow(""),
      considerationsSpeciales: Joi.string().allow(""),
    });
    return schema.validate(pathologie);
  },
};
