import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomHeader from '../Components/CustomHeader';
import ProgressIndicator from '../Components/ProgressIndicator';
import RadioGroup from '../Components/RadioGroup';
import CheckboxGroup from '../Components/CheckboxGroup';
import CustomButton from '../Components/CustomButton';
import { useFormContext } from '../Context/FormContext';
import {
  FERTILIZER_CLASSES,
  PESTICIDE_CLASSES,
  POTENTIAL_RISKS,
} from '../Utils/Constants';
import { saveBloomingReport } from '../Utils/RealmInstance';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

const BeekeepingScoreScreen = ({ navigation }) => {
  const { formData, updateFormData, resetFormData } = useFormContext();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showFertilizerModal, setShowFertilizerModal] = useState(false);
  const [showPesticideModal, setShowPesticideModal] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.useChemicalFertilizers) {
      newErrors.useChemicalFertilizers = 'This field is required';
    }

    if (
      formData.useChemicalFertilizers === 'yes' &&
      formData.fertilizerClasses.length === 0
    ) {
      newErrors.fertilizerClasses =
        'Please select at least one fertilizer class';
    }

    if (!formData.useChemicalPesticides) {
      newErrors.useChemicalPesticides = 'This field is required';
    }

    if (
      formData.useChemicalPesticides === 'yes' &&
      formData.pesticideClasses.length === 0
    ) {
      newErrors.pesticideClasses = 'Please select at least one pesticide class';
    }

    if (formData.beeBoxPhotos.length === 0) {
      newErrors.beeBoxPhotos = 'Please add at least one photo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleFertilizer = fertilizer => {
    const current = formData.fertilizerClasses || [];
    if (current.includes(fertilizer)) {
      updateFormData({
        fertilizerClasses: current.filter(f => f !== fertilizer),
      });
    } else {
      updateFormData({ fertilizerClasses: [...current, fertilizer] });
    }
  };

  const togglePesticide = pesticide => {
    const current = formData.pesticideClasses || [];
    if (current.includes(pesticide)) {
      updateFormData({
        pesticideClasses: current.filter(p => p !== pesticide),
      });
    } else {
      updateFormData({ pesticideClasses: [...current, pesticide] });
    }
  };

  const toggleRisk = risk => {
    const current = formData.potentialRisks || [];
    if (current.includes(risk)) {
      updateFormData({ potentialRisks: current.filter(r => r !== risk) });
    } else {
      updateFormData({ potentialRisks: [...current, risk] });
    }
  };

  const handlePickImages = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets) {
        const newPhotos = response.assets.map(asset => ({
          uri: asset.uri,
          fileName: asset.fileName,
          type: asset.type,
        }));
        updateFormData({
          beeBoxPhotos: [...formData.beeBoxPhotos, ...newPhotos],
        });
      }
    });
  };

  const removePhoto = index => {
    const newPhotos = formData.beeBoxPhotos.filter((_, i) => i !== index);
    updateFormData({ beeBoxPhotos: newPhotos });
  };

  const handleComplete = async () => {
    if (validate()) {
      setLoading(true);
      try {
        const dataToSave = {
          ...formData,
          flowers: formData.flowers,
          plantationPhotos: formData.plantationPhotos,
          negativeReasons: formData.negativeReasons,
          fertilizerClasses: formData.fertilizerClasses,
          pesticideClasses: formData.pesticideClasses,
          potentialRisks: formData.potentialRisks,
          beeBoxPhotos: formData.beeBoxPhotos,
        };

        const result = await saveBloomingReport(dataToSave);

        if (result.success) {
          Toast.show({
            type: 'success',
            text1: 'Success!',
            text2: 'Blooming report saved successfully',
            visibilityTime: 3000,
          });

          resetFormData();

          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'FarmerProfile' }],
            });
          }, 1000);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to save report',
        });
        console.error('Error saving:', error);
      } finally {
        setLoading(false);
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill all required fields',
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CustomHeader
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <ProgressIndicator
          currentStep={5}
          totalSteps={5}
          stepName="Beekeeping Score"
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <RadioGroup
            label="1. Do you use chemical Fertilizers?"
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            selectedValue={formData.useChemicalFertilizers}
            onSelect={value =>
              updateFormData({ useChemicalFertilizers: value })
            }
            required
          />
          {errors.useChemicalFertilizers && (
            <Text style={styles.errorText}>
              {errors.useChemicalFertilizers}
            </Text>
          )}

          {formData.useChemicalFertilizers === 'yes' && (
            <View
              style={[
                styles.selectContainer,
                { width: Dimensions.get('screen').width },
              ]}
            >
              <Text style={styles.label}>
                Select the class of Fertilizer
                <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowFertilizerModal(true)}
              >
                <Text style={styles.selectButtonText}>Select from list</Text>
                <Text style={styles.plusIcon}>+</Text>
              </TouchableOpacity>
              {formData.fertilizerClasses.length > 0 && (
                <View style={styles.selectedItems}>
                  {formData.fertilizerClasses.map((fert, index) => (
                    <View key={index} style={styles.selectedChip}>
                      <Text style={styles.selectedChipText}>
                        {FERTILIZER_CLASSES.find(f => f.value === fert)
                          ?.label.split('-')[0]
                          .trim() || fert}
                      </Text>
                      <TouchableOpacity onPress={() => toggleFertilizer(fert)}>
                        <Text style={styles.removeChip}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              {errors.fertilizerClasses && (
                <Text style={styles.errorText}>{errors.fertilizerClasses}</Text>
              )}
            </View>
          )}

          <RadioGroup
            label="2. Do you use chemical Pesticides?"
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            selectedValue={formData.useChemicalPesticides}
            onSelect={value => updateFormData({ useChemicalPesticides: value })}
            required
          />
          {errors.useChemicalPesticides && (
            <Text style={styles.errorText}>{errors.useChemicalPesticides}</Text>
          )}

          {formData.useChemicalPesticides === 'yes' && (
            <View
              style={[
                styles.selectContainer,
                { width: Dimensions.get('screen').width },
              ]}
            >
              <Text style={styles.label}>
                Select the class of Pesticide
                <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowPesticideModal(true)}
              >
                <Text style={styles.selectButtonText}>Select from list</Text>
                <Text style={styles.plusIcon}>+</Text>
              </TouchableOpacity>
              {formData.pesticideClasses.length > 0 && (
                <View style={styles.selectedItems}>
                  {formData.pesticideClasses.map((pest, index) => (
                    <View key={index} style={styles.selectedChip}>
                      <Text style={styles.selectedChipText}>
                        {PESTICIDE_CLASSES.find(p => p.value === pest)
                          ?.label.split('/')[0]
                          .trim() || pest}
                      </Text>
                      <TouchableOpacity onPress={() => togglePesticide(pest)}>
                        <Text style={styles.removeChip}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              {errors.pesticideClasses && (
                <Text style={styles.errorText}>{errors.pesticideClasses}</Text>
              )}
            </View>
          )}

          <View
            style={[
              styles.checkboxSection,
              { width: Dimensions.get('screen').width },
            ]}
          >
            <Text style={styles.label}>3. Select potential risks if any</Text>
            <CheckboxGroup
              options={POTENTIAL_RISKS}
              selectedValues={formData.potentialRisks}
              onToggle={toggleRisk}
            />
          </View>

          <View
            style={[
              styles.photoSection,
              { width: Dimensions.get('screen').width },
            ]}
          >
            <Text style={styles.label}>
              4. What could be a suitable place to place bee boxes?
              <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.subLabel}>
              Make sure to include access roads, clear photos of surroundings,
              and the location coordinates
            </Text>

            {formData.beeBoxPhotos.length > 0 && (
              <View style={styles.photosGrid}>
                {formData.beeBoxPhotos.map((photo, index) => (
                  <View key={index} style={styles.photoItem}>
                    <Image
                      source={{ uri: photo.uri }}
                      style={styles.photoImage}
                    />
                    <TouchableOpacity
                      style={styles.removePhotoButton}
                      onPress={() => removePhoto(index)}
                    >
                      <Text style={styles.removePhotoText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={handlePickImages}
            >
              <Text style={styles.addPhotoIcon}>+</Text>
              <Text style={styles.addPhotoText}>Add Photos</Text>
            </TouchableOpacity>
            {errors.beeBoxPhotos && (
              <Text style={styles.errorText}>{errors.beeBoxPhotos}</Text>
            )}
          </View>

          <View
            style={[
              styles.consentSection,
              { width: Dimensions.get('screen').width },
            ]}
          >
            <TouchableOpacity
              style={styles.consentRow}
              onPress={() =>
                updateFormData({ sendConsentForm: !formData.sendConsentForm })
              }
            >
              <View style={styles.checkboxSquare}>
                {formData.sendConsentForm && (
                  <View style={styles.checkedSquare} />
                )}
              </View>
              <Text style={styles.consentText}>
                Send consent form to farmer on the registered number on
                completion
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <CustomButton
          title="Complete"
          onPress={handleComplete}
          loading={loading}
        />
      </View>

      <Modal
        isVisible={showFertilizerModal}
        onBackdropPress={() => setShowFertilizerModal(false)}
        onBackButtonPress={() => setShowFertilizerModal(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Fertilizer Class</Text>
            <TouchableOpacity onPress={() => setShowFertilizerModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScrollView}>
            <CheckboxGroup
              options={FERTILIZER_CLASSES}
              selectedValues={formData.fertilizerClasses}
              onToggle={toggleFertilizer}
            />
          </ScrollView>

          <TouchableOpacity
            style={styles.selectModalButton}
            onPress={() => setShowFertilizerModal(false)}
          >
            <Text style={styles.selectModalButtonText}>Select</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        isVisible={showPesticideModal}
        onBackdropPress={() => setShowPesticideModal(false)}
        onBackButtonPress={() => setShowPesticideModal(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Pesticide Class</Text>
            <TouchableOpacity onPress={() => setShowPesticideModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScrollView}>
            <CheckboxGroup
              options={PESTICIDE_CLASSES}
              selectedValues={formData.pesticideClasses}
              onToggle={togglePesticide}
            />
          </ScrollView>

          <TouchableOpacity
            style={styles.selectModalButton}
            onPress={() => setShowPesticideModal(false)}
          >
            <Text style={styles.selectModalButtonText}>Select</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  required: {
    color: '#E74C3C',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
  },
  selectContainer: {
    marginBottom: 16,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 10,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  selectButtonText: {
    fontSize: 14,
    color: '#999',
  },
  plusIcon: {
    fontSize: 20,
    color: '#E74C3C',
    fontWeight: '600',
  },
  selectedItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  selectedChipText: {
    fontSize: 12,
    color: '#4CAF50',
    marginRight: 6,
    maxWidth: 200,
  },
  removeChip: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
  },
  checkboxSection: {
    marginBottom: 16,
    backgroundColor: '#fff',
    alignSelf: 'center',
    padding: 10,
  },
  photoSection: {
    marginBottom: 16,
    backgroundColor: '#fff',
    alignSelf: 'center',
    padding: 10,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  photoItem: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#E74C3C',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  addPhotoButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#DDD',
    borderRadius: 12,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoIcon: {
    fontSize: 36,
    color: '#E74C3C',
    marginBottom: 6,
  },
  addPhotoText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  consentSection: {
    marginBottom: 16,
    alignSelf: 'center',
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  checkboxSquare: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E74C3C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkedSquare: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#E74C3C',
  },
  consentText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  modalScrollView: {
    padding: 16,
    maxHeight: 400,
  },
  selectModalButton: {
    backgroundColor: '#E74C3C',
    margin: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BeekeepingScoreScreen;
