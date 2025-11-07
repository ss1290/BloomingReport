import Realm from 'realm';

export class BloomingReport extends Realm.Object {
  static schema = {
    name: 'BloomingReport',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      createdAt: 'date',
      
      fullName: 'string',
      contactNumber: 'string',
      gender: 'string',
      state: 'string',
      blockName: 'string',
      village: 'string',
      
      areaUnit: { type: 'string', optional: true },
      plantationArea: { type: 'double', optional: true },
      landHolding: { type: 'string', optional: true },
      geoTagged: { type: 'bool', default: false },
      geoCoordinates: { type: 'string', optional: true },
      
      flowers: { type: 'string', optional: true },
      cropVariety: { type: 'string', optional: true },
      hybridVarietyName: { type: 'string', optional: true },
      bloomStartDate: { type: 'date', optional: true },
      bloomEndDate: { type: 'date', optional: true },
      bloomingCycles: { type: 'string', optional: true },
      floweringArea: { type: 'double', optional: true },
      plantationPhotos: { type: 'string', optional: true },
      
      beePollinationAware: { type: 'string', optional: true },
      usingBeePollination: { type: 'string', optional: true },
      platformAware: { type: 'string', optional: true },
      experience: { type: 'string', optional: true },
      willingToPay: { type: 'string', optional: true },
      negativeReasons: { type: 'string', optional: true },
      
      useChemicalFertilizers: { type: 'string', optional: true },
      fertilizerClasses: { type: 'string', optional: true },
      useChemicalPesticides: { type: 'string', optional: true },
      pesticideClasses: { type: 'string', optional: true },
      potentialRisks: { type: 'string', optional: true },
      beeBoxPhotos: { type: 'string', optional: true },
      sendConsentForm: { type: 'bool', default: false },
    },
  };
}