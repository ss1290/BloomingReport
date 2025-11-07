import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import CustomHeader from '../Components/CustomHeader';
import ProgressIndicator from '../Components/ProgressIndicator';
import CustomInput from '../Components/CustomInput';
import RadioGroup from '../Components/RadioGroup';
import CustomButton from '../Components/CustomButton';
import { useFormContext } from '../Context/FormContext';
import { STATES } from '../Utils/Constants';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

const VILLAGES = [
  { label: 'Village 1', value: 'Village 1' },
  { label: 'Village 2', value: 'Village 2' },
  { label: 'Village 3', value: 'Village 3' },
];

const FarmerProfileScreen = ({ navigation }) => {
  const { formData, updateFormData} = useFormContext();
  const [errors, setErrors] = useState({});

  const stateData = STATES.map(state => ({ label: state, value: state }));

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Enter valid 10-digit number';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.state) {
      newErrors.state = 'State is required';
    }

    if (!formData.blockName.trim()) {
      newErrors.blockName = 'Block name is required';
    }

    if (!formData.village) {
      newErrors.village = 'Village is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Farmer profile saved',
      });
      navigation.navigate('LandDetails');
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
        <CustomHeader showBackButton={false} />
        <ProgressIndicator
          currentStep={1}
          totalSteps={5}
          stepName="Farmer Profile"
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <CustomInput
            label="1. Enter full name"
            value={formData.fullName}
            onChangeText={text => updateFormData({ fullName: text })}
            placeholder="Enter name"
            required
            error={errors.fullName}
          />

          <CustomInput
            label="2. Contact number"
            value={formData.contactNumber}
            onChangeText={text => updateFormData({ contactNumber: text })}
            placeholder="Enter mobile number"
            keyboardType="phone-pad"
            required
            error={errors.contactNumber}
            maxLength={10}
          />

          <RadioGroup
            label="3. Select Gender"
            options={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
            ]}
            selectedValue={formData.gender}
            onSelect={value => updateFormData({ gender: value })}
            required
          />

          <View
            style={[
              styles.dropdownContainer,
              { width: useWindowDimensions().width, alignSelf: 'center' },
            ]}
          >
            <Text style={styles.label}>4. Location</Text>
            <View style={styles.dropdownInnerContainer}>
              <Text style={styles.label}>
                Select State<Text style={styles.required}>*</Text>
              </Text>
              <Dropdown
                style={[styles.dropdown, errors.state && styles.dropdownError]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={stateData}
                search
                dropdownPosition={'top'}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select from list"
                searchPlaceholder="Search..."
                value={formData.state}
                onChange={item => {
                  updateFormData({ state: item.value });
                }}
              />
              {errors.state && (
                <Text style={styles.errorText}>{errors.state}</Text>
              )}
            </View>

            <CustomInput
              label="Enter Block name"
              value={formData.blockName}
              onChangeText={text => updateFormData({ blockName: text })}
              placeholder="Enter block name"
              required
              error={errors.blockName}
            />

            <View style={styles.dropdownInnerContainer}>
              <Text style={styles.label}>
                Select Village<Text style={styles.required}>*</Text>
              </Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  errors.village && styles.dropdownError,
                ]}
                dropdownPosition={'top'}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                iconStyle={styles.iconStyle}
                data={VILLAGES}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select from list"
                value={formData.village}
                onChange={item => {
                  updateFormData({ village: item.value });
                }}
              />
              {errors.village && (
                <Text style={styles.errorText}>{errors.village}</Text>
              )}
            </View>
          </View>
        </ScrollView>

        <CustomButton
          title="Create Farmer Profile"
          onPress={handleSubmit}
        />
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
    backgroundColor: '#FFF',
    padding: 10,
  },
  dropdownInnerContainer: {},
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
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    borderRadius: 8,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 4,
  },
});

export default FarmerProfileScreen;
