const Joi = require("joi");
const objectId = require("./joiObjectId");
module.exports = {
  user: (userObj) => {
    const schema = Joi.object({
      nom: Joi.string().min(2).max(50).required(),
      email: Joi.string().min(5).max(255).email(),
      password: Joi.string().min(5).max(255),
      roleId: objectId(),
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
      natureId: objectId().allow(""),
      code: Joi.number().allow(""),
      prix: Joi.number().allow(""),
      duree: Joi.number().allow(""),
      moments: Joi.array(),
      articles: Joi.array(),
      __v: Joi.number().allow(""),
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
  lot: (lot) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
    });
    return schema.validate(lot);
  },
  article: (article) => {
    const schema = Joi.object({
      lotId: objectId().allow("").allow(null),
      code: Joi.string().required(),
      nom: Joi.string().required(),
      stockInitial: Joi.number().allow(""),
      stockAlerte: Joi.number().allow(""),
      uniteMesureId: objectId().allow(""),
      uniteReglementaireId: objectId().allow(""),
      prixHT: Joi.number().allow(""),
      tauxTVA: Joi.number().allow(""),
      images: Joi.array(),
      imagesDeletedIndex: Joi.array(),
      prixTTC: Joi.number().allow(""),
      isExpiration: Joi.boolean().allow(""),
    });
    return schema.validate(article);
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
      documents: Joi.array(),
      imagesDeletedIndex: Joi.array(),
      documentsDeletedIndex: Joi.array(),
      telephone: Joi.string().allow(""),
      mutuelle: Joi.string().allow(""),
      observations: Joi.string().allow(""),
      telephones: Joi.array(),
      numMutuelle: Joi.string().allow(""),
      ville: Joi.string().allow("").allow(null),
      provinceId: objectId().allow("").allow(null),
      regionId: objectId().allow("").allow(null),
      prochainRdv: Joi.object(),
      couvertureId: objectId().allow("").allow(null),
      medicamentIds: Joi.array(),
      pathologieIds: Joi.array(),
      allergieIds: Joi.array(),
      detailCouvertureId: objectId().allow("").allow(null),
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
      patientId: objectId().allow("").allow(null),
      newPatient: Joi.object(),
      numOrdre: Joi.number().allow(null).allow(""),
      medecinId: objectId().required(),
      dateDevi: Joi.date(),
      images: Joi.array(),
      imagesDeletedIndex: Joi.array(),
      montant: Joi.number().allow("").allow(null),
      rdvIds: Joi.array(),
      articles: Joi.array(),
      acteEffectues: Joi.array(),
    });
    return schema.validate(devi);
  },
  paiement: (paiement) => {
    const schema = Joi.object({
      numOrdre: Joi.number().allow(null).allow(""),
      patientId: objectId().required(),
      mode: Joi.string().valid("Chèque", "Espèce"),
      numCheque: Joi.string().allow(""),
      date: Joi.date(),
      montant: Joi.number().required(),
    });
    return schema.validate(paiement);
  },
  uniteMesure: (uniteMesure) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
      description: Joi.string().allow(""),
    });
    return schema.validate(uniteMesure);
  },
  uniteReglementaire: (uniteReglementaire) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
      description: Joi.string().allow(""),
      normeApplicable: Joi.string().allow(""),
    });
    return schema.validate(uniteReglementaire);
  },
  societe: (societe) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
      telephone: Joi.string().allow(""),
      adresse: Joi.string().allow(""),
      ville: Joi.string().allow(""),
      banque: Joi.string().allow(""),
      lieuOuvertureBanque: Joi.string().allow(""),
      RIB: Joi.string().allow(""),
      numPatente: Joi.string().allow(""),
      numRC: Joi.string().allow(""),
      numIF: Joi.string().allow(""),
      numCNSS: Joi.string().allow(""),
      numICE: Joi.string().allow(""),
      email: Joi.string().allow(""),
      fax: Joi.string().allow(""),
      taxPro: Joi.string().allow(""),
      site: Joi.string().allow(""),
      description: Joi.string().allow(""),
      articleIds: Joi.array(),
    });
    return schema.validate(societe);
  },
  rdv: (rdv) => {
    const schema = Joi.object({
      patientId: objectId().allow("").allow(null),
      newPatient: Joi.object(),
      datePrevu: Joi.date().required(),
      description: Joi.string().allow(""),
      isHonnore: Joi.boolean().allow(null),
      isAnnule: Joi.boolean().allow(null),
      isReporte: Joi.boolean().allow(null),
      dateNouveauRdv: Joi.date().allow(null).allow(""),
      deviId: objectId().allow(null).allow(""),
      natureId: objectId().allow(null).allow(""),
      acteId: objectId().allow(null).allow(""),
      lastRdvId: objectId().allow(null).allow(""),
      heureDebut: Joi.object(),
      heureFin: Joi.object(),
      __v: Joi.number(),
    });
    return schema.validate(rdv);
  },
  bonCommande: (bonCommande) => {
    const schema = Joi.object({
      numOrdre: Joi.string().allow(""),
      date: Joi.date().allow(""),
      statut: Joi.string().allow(""),
      objet: Joi.string().allow(""),
      societeRetenuId: objectId().allow(""),
      montantHT: Joi.number().allow("").allow(null),
      tva: Joi.number().allow(""),
      montantTTC: Joi.number().allow("").allow(null),
      commentaire: Joi.string().allow(""),
      articles: Joi.array(),
      paiementIds: Joi.array(),
      isPayed: Joi.boolean().allow(""),
      images: Joi.array(),
      imagesDeletedIndex: Joi.array(),
    });
    return schema.validate(bonCommande);
  },
  paiementBonCommande: (paiementBonCommande) => {
    const schema = Joi.object({
      date: Joi.date().required(),
      montant: Joi.number().required(),
      bonCommandeId: objectId().required(),
      modePaiement: Joi.string().allow(""),
      numCheque: Joi.string().allow(""),
      banque: Joi.string().allow(""),
      commentaire: Joi.string().allow(""),
      images: Joi.array(),
      imagesDeletedIndex: Joi.array(),
    });
    return schema.validate(paiementBonCommande);
  },
  receptionBonCommande: (receptionBonCommande) => {
    const schema = Joi.object({
      date: Joi.date().allow(""),
      numOrdre: Joi.string().allow(""),
      bonCommandeId: objectId().required(),
      articles: Joi.array(),
      commentaire: Joi.string().allow(""),
      isLast: Joi.boolean().allow(""),
      images: Joi.array(),
      imagesDeletedIndex: Joi.array(),
    });
    return schema.validate(receptionBonCommande);
  },
  province: (province) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
      code: Joi.string().allow("").allow(null),
      regionId: objectId().allow("").allow(null),
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
      couvertureId: objectId().required(),
    });
    return schema.validate(detailCouverture);
  },
  medicament: (medicament) => {
    const schema = Joi.object({
      nom: Joi.string().required(),
      categorieId: objectId().allow(""),
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
