import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import CustomHeader from '../Components/CustomHeader';
import ProgressIndicator from '../Components/ProgressIndicator';
import RadioGroup from '../Components/RadioGroup';
import CustomButton from '../Components/CustomButton';
import { useFormContext } from '../Context/FormContext';
import { AREA_UNITS, LAND_HOLDING_OPTIONS } from '../Utils/Constants';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

const LandDetailsScreen = ({ navigation }) => {
  const { formData, updateFormData } = useFormContext();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.areaUnit) {
      newErrors.areaUnit = 'Area unit is required';
    }

    if (!formData.plantationArea) {
      newErrors.plantationArea = 'Plantation area is required';
    } else if (
      isNaN(formData.plantationArea) ||
      parseFloat(formData.plantationArea) <= 0
    ) {
      newErrors.plantationArea = 'Enter valid area';
    }

    if (!formData.landHolding) {
      newErrors.landHolding = 'Land holding is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGeoTag = () => {
    updateFormData({ geoTagged: true });
  };

  const handleNext = () => {
    if (validate()) {
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Land details saved',
      });
      navigation.navigate('CropDetails');
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
          currentStep={2}
          totalSteps={5}
          stepName="Land Details"
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <View
            style={[
              styles.dropdownContainer,
              { width: Dimensions.get('screen').width },
            ]}
          >
            <Text style={styles.label}>
              1. Select unit for Area<Text style={styles.required}>*</Text>
            </Text>
            <Dropdown
              style={[styles.dropdown, errors.areaUnit && styles.dropdownError]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={AREA_UNITS}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select from list"
              value={formData.areaUnit}
              onChange={item => {
                updateFormData({ areaUnit: item.value });
              }}
            />
            {errors.areaUnit && (
              <Text style={styles.errorText}>{errors.areaUnit}</Text>
            )}
          </View>

          <View
            style={[
              styles.areaSection,
              { width: Dimensions.get('screen').width },
            ]}
          >
            <Text style={styles.label}>
              2. Area of Plantation<Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.areaInputContainer}>
              <TextInput
                style={[
                  styles.areaInput,
                  errors.plantationArea && styles.inputError,
                ]}
                value={formData.plantationArea}
                onChangeText={text => updateFormData({ plantationArea: text })}
                placeholder="Enter area of plantation"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
              />
              {formData.areaUnit && (
                <View style={styles.unitDisplay}>
                  <Text style={styles.unitText}>
                    {AREA_UNITS.find(u => u.value === formData.areaUnit)
                      ?.label || formData.areaUnit}
                  </Text>
                </View>
              )}
            </View>
            {errors.plantationArea && (
              <Text style={styles.errorText}>{errors.plantationArea}</Text>
            )}
          </View>

          <View
            style={[
              styles.geoTagSection,
              { width: Dimensions.get('screen').width },
            ]}
          >
            <Text style={styles.label}>3. Geo tag this plantation</Text>
            {formData.geoTagged ? (
              <View style={styles.geoTaggedContainer}>
                <Text style={styles.geoTaggedIcon}>✓</Text>
                <Text style={styles.geoTaggedText}>Geo-tagged</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.geoTagButton}
                onPress={handleGeoTag}
              >
                <Text style={styles.geoTagButtonText}>
                  Geotag the plantation
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <RadioGroup
            label="4. Land holding"
            options={LAND_HOLDING_OPTIONS}
            selectedValue={formData.landHolding}
            onSelect={value => updateFormData({ landHolding: value })}
            required
          />
        </ScrollView>

        <CustomButton title="Next" onPress={handleNext} />
      </View>
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
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
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
  areaSection: {
    marginBottom: 16,
    backgroundColor: '#ffff',
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
    paddingVertical: 14,
    fontSize: 14,
    backgroundColor: '#fff',
    paddingRight: 100,
  },
  inputError: {
    borderColor: '#E74C3C',
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

  areaInputWrapper: {
    flex: 1,
  },

  geoTagSection: {
    marginBottom: 16,
    backgroundColor: '#fff',
    alignSelf: 'center',
    padding: 10,
  },
  geoTagButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#DDD',
    paddingVertical: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  geoTagButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  geoTaggedContainer: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  geoTaggedIcon: {
    fontSize: 24,
    color: '#4CAF50',
    marginRight: 8,
  },
  geoTaggedText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LandDetailsScreen;
