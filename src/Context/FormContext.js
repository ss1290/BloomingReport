import React, { createContext, useState, useContext } from 'react';

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    gender: '',
    state: '',
    blockName: '',
    village: '',
    
    areaUnit: '',
    plantationArea: '',
    landHolding: '',
    geoTagged: false,
    geoCoordinates: '',
    
    flowers: [],
    cropVariety: '',
    hybridVarietyName: '',
    bloomStartDate: null,
    bloomEndDate: null,
    bloomingCycles: '',
    floweringArea: '',
    plantationPhotos: [],
    
    beePollinationAware: '',
    usingBeePollination: '',
    platformAware: '',
    experience: '',
    willingToPay: '',
    negativeReasons: [],
    
    useChemicalFertilizers: '',
    fertilizerClasses: [],
    useChemicalPesticides: '',
    pesticideClasses: [],
    potentialRisks: [],
    beeBoxPhotos: [],
    sendConsentForm: false,
  });

  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetFormData = () => {
    setFormData({
      fullName: '',
      contactNumber: '',
      gender: '',
      state: '',
      blockName: '',
      village: '',
      areaUnit: '',
      plantationArea: '',
      landHolding: '',
      geoTagged: false,
      geoCoordinates: '',
      flowers: [],
      cropVariety: '',
      hybridVarietyName: '',
      bloomStartDate: null,
      bloomEndDate: null,
      bloomingCycles: '',
      floweringArea: '',
      plantationPhotos: [],
      beePollinationAware: '',
      usingBeePollination: '',
      platformAware: '',
      experience: '',
      willingToPay: '',
      negativeReasons: [],
      useChemicalFertilizers: '',
      fertilizerClasses: [],
      useChemicalPesticides: '',
      pesticideClasses: [],
      potentialRisks: [],
      beeBoxPhotos: [],
      sendConsentForm: false,
    });
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, resetFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return context;
};