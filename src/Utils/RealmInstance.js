import Realm from 'realm';
import { BloomingReport } from '../Models/BloomingReportSchema';

let realmInstance = null;

export const getRealm = async () => {
  if (realmInstance) {
    return realmInstance;
  }

  try {
    realmInstance = await Realm.open({
      schema: [BloomingReport],
      schemaVersion: 2,
    });
    return realmInstance;
  } catch (error) {
    console.error('Error opening Realm:', error);
    throw error;
  }
};

export const saveBloomingReport = async (data) => {
  try {
    const realm = await getRealm();
    
    realm.write(() => {
      realm.create('BloomingReport', {
        _id: new Realm.BSON.ObjectId(),
        createdAt: new Date(),
        
        fullName: data.fullName,
        contactNumber: data.contactNumber,
        gender: data.gender,
        state: data.state,
        blockName: data.blockName,
        village: data.village,
        
        areaUnit: data.areaUnit || null,
        plantationArea: data.plantationArea ? parseFloat(data.plantationArea) : null,
        landHolding: data.landHolding || null,
        geoTagged: data.geoTagged || false,
        geoCoordinates: data.geoCoordinates || null,
        
        flowers: data.flowers ? JSON.stringify(data.flowers) : null,
        cropVariety: data.cropVariety || null,
        hybridVarietyName: data.hybridVarietyName || null,
        bloomStartDate: data.bloomStartDate || null,
        bloomEndDate: data.bloomEndDate || null,
        bloomingCycles: data.bloomingCycles || null,
        floweringArea: data.floweringArea ? parseFloat(data.floweringArea) : null,
        plantationPhotos: data.plantationPhotos ? JSON.stringify(data.plantationPhotos) : null,
        
        beePollinationAware: data.beePollinationAware || null,
        usingBeePollination: data.usingBeePollination || null,
        platformAware: data.platformAware || null,
        experience: data.experience || null,
        willingToPay: data.willingToPay || null,
        negativeReasons: data.negativeReasons ? JSON.stringify(data.negativeReasons) : null,
        
        useChemicalFertilizers: data.useChemicalFertilizers || null,
        fertilizerClasses: data.fertilizerClasses ? JSON.stringify(data.fertilizerClasses) : null,
        useChemicalPesticides: data.useChemicalPesticides || null,
        pesticideClasses: data.pesticideClasses ? JSON.stringify(data.pesticideClasses) : null,
        potentialRisks: data.potentialRisks ? JSON.stringify(data.potentialRisks) : null,
        beeBoxPhotos: data.beeBoxPhotos ? JSON.stringify(data.beeBoxPhotos) : null,
        sendConsentForm: data.sendConsentForm || false,
      });
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving report:', error);
    return { success: false, error: error.message };
  }
};

export const getAllReports = async () => {
  try {
    const realm = await getRealm();
    const reports = realm.objects('BloomingReport').sorted('createdAt', true);
    return Array.from(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

export const closeRealm = () => {
  if (realmInstance && !realmInstance.isClosed) {
    realmInstance.close();
    realmInstance = null;
  }
};