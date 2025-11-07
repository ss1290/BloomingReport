import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,useWindowDimensions} from 'react-native';

const RadioGroup = ({ label, options, selectedValue, onSelect, required = false }) => {
  return (
    <View style={[styles.container, {width:useWindowDimensions().width}]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}>*</Text>}
      </Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.radioOption}
          onPress={() => onSelect(option.value)}
          activeOpacity={0.7}
        >
          <View style={styles.radioCircle}>
            {selectedValue === option.value && <View style={styles.selectedCircle} />}
          </View>
          <Text style={styles.radioLabel}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex:1,
    marginBottom: 16,
    width:"100%",
    backgroundColor:"#fff",
    alignSelf:"center",
    padding:10
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
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E74C3C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E74C3C',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
});

export default RadioGroup;