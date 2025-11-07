import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import CustomHeader from '../Components/CustomHeader';
import ProgressIndicator from '../Components/ProgressIndicator';
import RadioGroup from '../Components/RadioGroup';
import CheckboxGroup from '../Components/CheckboxGroup';
import CustomButton from '../Components/CustomButton';
import { useFormContext } from '../Context/FormContext';
import { NEGATIVE_REASONS } from '../Utils/Constants';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

const FloweringDetailsScreen = ({ navigation }) => {
  const { formData, updateFormData } = useFormContext();
  const [errors, setErrors] = useState({});
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [otherReason, setOtherReason] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!formData.beePollinationAware) {
      newErrors.beePollinationAware = 'This field is required';
    }

    if (formData.beePollinationAware === 'yes' && !formData.usingBeePollination) {
      newErrors.usingBeePollination = 'This field is required';
    }

    if (!formData.platformAware) {
      newErrors.platformAware = 'This field is required';
    }

    if (!formData.experience) {
      newErrors.experience = 'This field is required';
    }

    if (formData.experience === 'negative' && formData.negativeReasons.length === 0) {
      newErrors.negativeReasons = 'Please select at least one reason';
    }

    if (!formData.willingToPay) {
      newErrors.willingToPay = 'This field is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleReason = (reason) => {
    const currentReasons = formData.negativeReasons || [];
    if (currentReasons.includes(reason)) {
      updateFormData({
        negativeReasons: currentReasons.filter(r => r !== reason)
      });
    } else {
      updateFormData({
        negativeReasons: [...currentReasons, reason]
      });
    }
  };

  const handleReasonModalClose = () => {
    setShowReasonModal(false);
    if (formData.negativeReasons.includes('other') && otherReason.trim()) {
      const filteredReasons = formData.negativeReasons.filter(r => r !== 'other' && !r.startsWith('other:'));
      updateFormData({
        negativeReasons: [...filteredReasons, `other: ${otherReason}`]
      });
    }
  };

  const handleNext = () => {
    if (validate()) {
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Flowering details saved',
      });
      navigation.navigate('BeekeepingScore');
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
        <ProgressIndicator currentStep={4} totalSteps={5} stepName="Flowering Details" />
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <RadioGroup
            label="1. Are you aware of bee pollination services?"
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            selectedValue={formData.beePollinationAware}
            onSelect={(value) => updateFormData({ beePollinationAware: value })}
            required
          />
          {errors.beePollinationAware && (
            <Text style={styles.errorText}>{errors.beePollinationAware}</Text>
          )}

          {(
            <>
              <RadioGroup
                label="2. Are you currently using bee pollination for your farm?"
                options={[
                  { label: 'Yes, I would be', value: 'yes' },
                  { label: 'Not sure, maybe', value: 'maybe' },
                ]}
                selectedValue={formData.usingBeePollination}
                onSelect={(value) => updateFormData({ usingBeePollination: value })}
                required
              />
              {errors.usingBeePollination && (
                <Text style={styles.errorText}>{errors.usingBeePollination}</Text>
              )}
            </>
          )}

          <RadioGroup
            label={formData.beePollinationAware === 'yes' ? "3. Have you heard about our platform for bee pollination services?" : "2. Have you heard about our platform for bee pollination services?"}
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            selectedValue={formData.platformAware}
            onSelect={(value) => updateFormData({ platformAware: value })}
            required
          />
          {errors.platformAware && (
            <Text style={styles.errorText}>{errors.platformAware}</Text>
          )}

          <RadioGroup
            label={`${formData.beePollinationAware === 'yes' ? "4" : "3"}. How was your experience?`}
            options={[
              { label: 'Positive', value: 'positive' },
              { label: 'Negative', value: 'negative' },
            ]}
            selectedValue={formData.experience}
            onSelect={(value) => {
              updateFormData({ experience: value });
              if (value === 'negative') {
                setShowReasonModal(true);
              }
            }}
            required
          />
          {errors.experience && (
            <Text style={styles.errorText}>{errors.experience}</Text>
          )}

          {formData.experience === 'negative' && formData.negativeReasons.length > 0 && (
            <View style={styles.selectedReasonsCard}>
              <View style={styles.selectedReasonsHeader}>
                <Text style={styles.selectedReasonsTitle}>What made the experience negative?</Text>
                <TouchableOpacity onPress={() => setShowReasonModal(true)}>
                  <Text style={styles.editReasonText}>Edit</Text>
                </TouchableOpacity>
              </View>
              {formData.negativeReasons.map((reason, index) => (
                <View key={index} style={styles.reasonItem}>
                  <Text style={styles.reasonBullet}>•</Text>
                  <Text style={styles.reasonText}>
                    {reason.startsWith('other:') 
                      ? reason 
                      : NEGATIVE_REASONS.find(r => r.value === reason)?.label || reason}
                  </Text>
                </View>
              ))}
              {errors.negativeReasons && (
                <Text style={styles.errorText}>{errors.negativeReasons}</Text>
              )}
            </View>
          )}

          <RadioGroup
            label={`${formData.beePollinationAware === 'yes' ? "5" : "4"}. Are you willing to pay to avail this service?`}
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            selectedValue={formData.willingToPay}
            onSelect={(value) => updateFormData({ willingToPay: value })}
            required
          />
          {errors.willingToPay && (
            <Text style={styles.errorText}>{errors.willingToPay}</Text>
          )}
        </ScrollView>

        <CustomButton
          title="Complete"
          onPress={handleNext}
        />
      </View>

      <Modal
        isVisible={showReasonModal}
        onBackdropPress={handleReasonModalClose}
        onBackButtonPress={handleReasonModalClose}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Reason</Text>
            <TouchableOpacity onPress={handleReasonModalClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScrollView}>
            <CheckboxGroup
              options={NEGATIVE_REASONS}
              selectedValues={formData.negativeReasons}
              onToggle={toggleReason}
            />

            {formData.negativeReasons.includes('other') && (
              <View style={styles.otherInputContainer}>
                <Text style={styles.otherLabel}>Please specify:</Text>
                <TextInput
                  style={styles.otherInput}
                  value={otherReason}
                  onChangeText={setOtherReason}
                  placeholder="Write here"
                  placeholderTextColor="#999"
                  multiline
                />
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.selectButton}
            onPress={handleReasonModalClose}
          >
            <Text style={styles.selectButtonText}>Select</Text>
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
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
  },
  selectedReasonsCard: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#E74C3C',
    borderRadius: 8,
    padding: 12,
    marginTop: -8,
    marginBottom: 16,
  },
  selectedReasonsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedReasonsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  editReasonText: {
    fontSize: 13,
    color: '#E74C3C',
    textDecorationLine: 'underline',
  },
  reasonItem: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  reasonBullet: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  reasonText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
    lineHeight: 18,
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
  otherInputContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  otherLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  otherInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  selectButton: {
    backgroundColor: '#E74C3C',
    margin: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FloweringDetailsScreen;