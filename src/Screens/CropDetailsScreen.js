import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomHeader from '../Components/CustomHeader';
import ProgressIndicator from '../Components/ProgressIndicator';
import RadioGroup from '../Components/RadioGroup';
import CustomButton from '../Components/CustomButton';
import { useFormContext } from '../Context/FormContext';
import { FLOWERS, HYBRID_VARIETIES } from '../Utils/Constants';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

const CropDetailsScreen = ({ navigation }) => {
  const { formData, updateFormData } = useFormContext();
  const [errors, setErrors] = useState({});
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [currentDateRangeIndex, setCurrentDateRangeIndex] = useState(0);
  const [bloomingCycles, setBloomingCycles] = useState([
    { startDate: null, endDate: null },
  ]);
  const [flowerSections, setFlowerSections] = useState([
    { id: 1, value: '' }
  ]);

  const validate = () => {
    const newErrors = {};

    const hasFlower = flowerSections.some(section => section.value);
    if (!hasFlower) {
      newErrors.flowers = 'At least one flower is required';
    }

    if (!formData.cropVariety) {
      newErrors.cropVariety = 'Crop variety is required';
    }

    if (formData.cropVariety === 'hybrid' && !formData.hybridVarietyName) {
      newErrors.hybridVarietyName = 'Hybrid variety name is required';
    }

    if (!bloomingCycles[0].startDate) {
      newErrors.bloomStartDate = 'Start date is required';
    }

    if (!bloomingCycles[0].endDate) {
      newErrors.bloomEndDate = 'End date is required';
    }

    if (
      bloomingCycles[0].startDate &&
      bloomingCycles[0].endDate &&
      bloomingCycles[0].startDate > bloomingCycles[0].endDate
    ) {
      newErrors.bloomEndDate = 'End date must be after start date';
    }

    if (!formData.floweringArea) {
      newErrors.floweringArea = 'Flowering area is required';
    } else if (
      isNaN(formData.floweringArea) ||
      parseFloat(formData.floweringArea) <= 0
    ) {
      newErrors.floweringArea = 'Enter valid area';
    }

    if (formData.plantationPhotos.length === 0) {
      newErrors.plantationPhotos = 'At least one photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddFlowerSection = () => {
    const newId = flowerSections.length + 1;
    setFlowerSections([...flowerSections, { id: newId, value: '' }]);
    Toast.show({
      type: 'success',
      text1: 'Flower section added',
      text2: `You can now select Flower ${newId}`,
      visibilityTime: 2000,
    });
  };

  const handleRemoveFlowerSection = (id) => {
    if (flowerSections.length > 1) {
      setFlowerSections(flowerSections.filter(section => section.id !== id));
      Toast.show({
        type: 'info',
        text1: 'Flower section removed',
        visibilityTime: 1500,
      });
    }
  };

  const handleFlowerChange = (id, value) => {
    const updatedSections = flowerSections.map(section =>
      section.id === id ? { ...section, value } : section
    );
    setFlowerSections(updatedSections);
  };

  const handlePickImages = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets) {
        const newPhotos = response.assets.map(asset => ({
          uri: asset.uri,
          fileName: asset.fileName,
          type: asset.type,
        }));
        updateFormData({
          plantationPhotos: [...formData.plantationPhotos, ...newPhotos],
        });
      }
    });
  };

  const removePhoto = index => {
    const newPhotos = formData.plantationPhotos.filter((_, i) => i !== index);
    updateFormData({ plantationPhotos: newPhotos });
  };

  const handleAddMoreCycle = () => {
    setBloomingCycles([...bloomingCycles, { startDate: null, endDate: null }]);
    Toast.show({
      type: 'success',
      text1: 'Bloom cycle added',
      text2: 'Add dates for the new cycle',
      visibilityTime: 2000,
    });
  };

  const handleRemoveCycle = index => {
    if (bloomingCycles.length > 1) {
      const newCycles = bloomingCycles.filter((_, i) => i !== index);
      setBloomingCycles(newCycles);
    }
  };

  const updateCycleDate = (index, field, date) => {
    const newCycles = [...bloomingCycles];
    newCycles[index][field] = date;
    setBloomingCycles(newCycles);

    if (index === 0) {
      updateFormData({
        bloomStartDate: newCycles[0].startDate,
        bloomEndDate: newCycles[0].endDate,
      });
    }
  };

  const handleNext = () => {
    if (validate()) {
      const selectedFlowers = flowerSections
        .filter(section => section.value)
        .map(section => section.value);

      updateFormData({
        flowers: selectedFlowers,
        bloomingCycles: JSON.stringify(bloomingCycles),
      });
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Crop details saved',
      });
      navigation.navigate('FloweringDetails');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill all required fields',
      });
    }
  };

  const formatDate = date => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB');
  };

  const getQuestionNumber = () => {
    return flowerSections.length + 1;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CustomHeader
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <ProgressIndicator
          currentStep={3}
          totalSteps={5}
          stepName="Flowering Details"
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          {flowerSections.map((section, index) => (
            <View 
              key={section.id} 
              style={[
                styles.dropdownContainer,
                { width: Dimensions.get('screen').width },
              ]}
            >
              <View style={styles.flowerHeaderRow}>
                <Text style={styles.label}>
                  {index + 1}. Flower {index + 1}<Text style={styles.required}>*</Text>
                </Text>
                {index > 0 && (
                  <TouchableOpacity onPress={() => handleRemoveFlowerSection(section.id)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Dropdown
                style={[styles.dropdown, index === 0 && errors.flowers && styles.dropdownError]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                iconStyle={styles.iconStyle}
                data={FLOWERS}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select from list"
                value={section.value}
                onChange={item => {
                  handleFlowerChange(section.id, item.value);
                }}
              />
              {index === 0 && errors.flowers && (
                <Text style={styles.errorText}>{errors.flowers}</Text>
              )}
            </View>
          ))}

          <View
            style={[
              styles.radioGroupContainer,
              { width: Dimensions.get('screen').width },
            ]}
          >
            <RadioGroup
              label={`${getQuestionNumber()}. Select the crop variety`}
              options={[
                { label: 'Local/Desi', value: 'local' },
                { label: 'Hybrid', value: 'hybrid' },
              ]}
              selectedValue={formData.cropVariety}
              onSelect={value => updateFormData({ cropVariety: value })}
              required
            />
            {errors.cropVariety && (
              <Text style={styles.errorText}>{errors.cropVariety}</Text>
            )}
          </View>

          {formData.cropVariety === 'hybrid' && (
            <View
              style={[
                styles.dropdownContainer,
                { width: Dimensions.get('screen').width },
              ]}
            >
              <Text style={styles.label}>
                {getQuestionNumber() + 1}. Name the hybrid crop variety
                <Text style={styles.required}>*</Text>
              </Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  errors.hybridVarietyName && styles.dropdownError,
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                iconStyle={styles.iconStyle}
                data={HYBRID_VARIETIES}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select from list"
                value={formData.hybridVarietyName}
                onChange={item => {
                  updateFormData({ hybridVarietyName: item.value });
                }}
              />
              {errors.hybridVarietyName && (
                <Text style={styles.errorText}>{errors.hybridVarietyName}</Text>
              )}
            </View>
          )}

          <View
            style={[
              styles.dateSection,
              { width: Dimensions.get('screen').width },
            ]}
          >
            <Text style={styles.label}>
              {formData.cropVariety === 'hybrid' ? getQuestionNumber() + 2 : getQuestionNumber() + 1}. Blooming duration
              <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.subLabel}>(Select month and week)</Text>

            {bloomingCycles.map((cycle, cycleIndex) => (
              <View key={cycleIndex} style={styles.cycleContainer}>
                {cycleIndex > 0 && (
                  <View style={styles.cycleHeader}>
                    <Text style={styles.cycleTitle}>
                      Bloom Cycle {cycleIndex + 1}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveCycle(cycleIndex)}
                    >
                      <Text style={styles.removeCycleText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.dateRow}>
                  <View style={styles.dateField}>
                    <Text style={styles.dateLabel}>Started on</Text>
                    <TouchableOpacity
                      style={[
                        styles.dateInput,
                        cycleIndex === 0 &&
                          errors.bloomStartDate &&
                          styles.inputError,
                      ]}
                      onPress={() => {
                        setCurrentDateRangeIndex(cycleIndex);
                        setShowStartDatePicker(true);
                      }}
                    >
                      <Text
                        style={[
                          styles.dateText,
                          !cycle.startDate && styles.placeholderText,
                        ]}
                      >
                        {cycle.startDate
                          ? formatDate(cycle.startDate)
                          : 'Select Date'}
                      </Text>
                      <Text style={styles.calendarIcon}>📅</Text>
                    </TouchableOpacity>
                    {cycleIndex === 0 && errors.bloomStartDate && (
                      <Text style={styles.errorText}>
                        {errors.bloomStartDate}
                      </Text>
                    )}
                  </View>

                  <View style={styles.dateField}>
                    <Text style={styles.dateLabel}>Ends on</Text>
                    <TouchableOpacity
                      style={[
                        styles.dateInput,
                        cycleIndex === 0 &&
                          errors.bloomEndDate &&
                          styles.inputError,
                      ]}
                      onPress={() => {
                        setCurrentDateRangeIndex(cycleIndex);
                        setShowEndDatePicker(true);
                      }}
                    >
                      <Text
                        style={[
                          styles.dateText,
                          !cycle.endDate && styles.placeholderText,
                        ]}
                      >
                        {cycle.endDate
                          ? formatDate(cycle.endDate)
                          : 'Select Date'}
                      </Text>
                      <Text style={styles.calendarIcon}>📅</Text>
                    </TouchableOpacity>
                    {cycleIndex === 0 && errors.bloomEndDate && (
                      <Text style={styles.errorText}>
                        {errors.bloomEndDate}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.durationNote}>
              <Text style={styles.durationText}>
                If it blooms more than once, please add all the bloom dates
              </Text>
              <TouchableOpacity
                style={styles.addMoreButtonInside}
                onPress={handleAddMoreCycle}
              >
                <Text style={styles.addMoreButtonText}>Add More</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[
              styles.areaSection,
              { width: Dimensions.get('screen').width },
            ]}
          >
            <Text style={styles.label}>
              {formData.cropVariety === 'hybrid' ? getQuestionNumber() + 3 : getQuestionNumber() + 2}. What is the
              current area of flowering?<Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.subLabel}>
              Plantation area cannot exceed the total farming area of {formData.plantationArea || 'x'} acres
            </Text>
            <View style={styles.areaInputContainer}>
              <TextInput
                style={[
                  styles.areaInput,
                  errors.floweringArea && styles.inputError,
                ]}
                value={formData.floweringArea}
                onChangeText={text => updateFormData({ floweringArea: text })}
                placeholder="Enter area here"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
              />
              <View style={styles.unitDisplay}>
                <Text style={styles.unitText}>acres</Text>
              </View>
            </View>
            {errors.floweringArea && (
              <Text style={styles.errorText}>{errors.floweringArea}</Text>
            )}
          </View>

          <View
            style={[
              styles.photoSection,
              { width: Dimensions.get('screen').width },
            ]}
          >
            <Text style={styles.label}>
              {formData.cropVariety === 'hybrid' ? getQuestionNumber() + 4 : getQuestionNumber() + 3}. Add photo of the
              Plantation<Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.subLabel}>
              Make sure to use pin and take in front view
            </Text>

            {formData.plantationPhotos.length > 0 && (
              <View style={styles.photosGrid}>
                {formData.plantationPhotos.map((photo, index) => (
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
            {errors.plantationPhotos && (
              <Text style={styles.errorText}>{errors.plantationPhotos}</Text>
            )}
          </View>

          <View style={styles.noteSection}>
            <Text style={styles.noteText}>
              Log all flowerings — current and upcoming
            </Text>
            <TouchableOpacity 
              style={styles.addMoreButtonInside}
              onPress={handleAddFlowerSection}
            >
              <Text style={styles.addMoreButtonText}>Add More</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.orText}>OR</Text>
        </ScrollView>

        <CustomButton title="Complete" onPress={handleNext} />
      </View>

      {showStartDatePicker && (
        <DateTimePicker
          value={bloomingCycles[currentDateRangeIndex].startDate || new Date()}
          mode="date"
          display="default"
          maximumDate={bloomingCycles[currentDateRangeIndex].endDate || null}
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) {
              updateCycleDate(currentDateRangeIndex, 'startDate', selectedDate);
            }
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={bloomingCycles[currentDateRangeIndex].endDate || new Date()}
          mode="date"
          display="default"
          minimumDate={bloomingCycles[currentDateRangeIndex].startDate || null}
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) {
              updateCycleDate(currentDateRangeIndex, 'endDate', selectedDate);
            }
          }}
        />
      )}
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
  dropdownContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    alignSelf: 'center',
    padding: 10,
  },
  flowerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeText: {
    fontSize: 12,
    color: '#E74C3C',
    textDecorationLine: 'underline',
  },
  radioGroupContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    alignSelf: 'center',
    padding: 10,
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
  },
  required: {
    color: '#E74C3C',
  },
  dropdown: {
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  dropdownError: {
    borderColor: '#E74C3C',
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#333',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 4,
  },
  dateSection: {
    marginBottom: 16,
    backgroundColor: '#fff',
    alignSelf: 'center',
    padding: 10,
  },
  cycleContainer: {
    marginBottom: 12,
  },
  cycleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cycleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  removeCycleText: {
    fontSize: 12,
    color: '#E74C3C',
    textDecorationLine: 'underline',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateField: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  dateText: {
    fontSize: 13,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  calendarIcon: {
    fontSize: 14,
  },
  durationNote: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  durationText: {
    fontSize: 12,
    color: '#F57C00',
    lineHeight: 16,
    marginBottom: 8,
  },
  addMoreButtonInside: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F57C00',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addMoreButtonText: {
    fontSize: 13,
    color: '#F57C00',
    fontWeight: '600',
  },
  areaSection: {
    marginBottom: 16,
    backgroundColor: '#fff',
    alignSelf: 'center',
    padding: 10,
  },
  areaInputContainer: {
    position: 'relative',
    backgroundColor: '#fff',
  },
  areaInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#fff',
    paddingRight: 100,
  },
  unitDisplay: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFF3F3',
    paddingHorizontal: 16,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0E0',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  unitText: {
    color: '#E74C3C',
    fontSize: 14,
    fontWeight: '600',
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
    color: '#DDD',
    marginBottom: 6,
  },
  addPhotoText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  noteSection: {
    backgroundColor: '#FFF9F0',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  orText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default CropDetailsScreen;