import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CheckboxGroup = ({ label, options, selectedValues = [], onToggle, required = false }) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.checkboxOption}
          onPress={() => onToggle(option.value)}
          activeOpacity={0.7}
        >
          <View style={styles.checkboxSquare}>
            {selectedValues.includes(option.value) && (
              <View style={styles.checkedSquare} />
            )}
          </View>
          <Text style={styles.checkboxLabel}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#E74C3C',
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
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
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
});

export default CheckboxGroup;