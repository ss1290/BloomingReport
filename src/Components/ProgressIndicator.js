import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

const ProgressIndicator = ({ currentStep, totalSteps, stepName }) => {
  return (
    <View style={[styles.container, {width: useWindowDimensions().width}]}>
      <View style={styles.progressBar}>
        {[...Array(totalSteps)].map((_, index) => (
          <View key={index} style={styles.stepWrapper}>
            <View style={styles.stepContainer}>
                <View style={styles.stepBox}>
                    <View
                style={[
                  styles.circle,
                  index + 1 <= currentStep ? styles.activeCircle : styles.inactiveCircle
                ]}
              />
               <Text
              style={[
                styles.stepNumber,
                index + 1 <= currentStep ? styles.activeText : styles.inactiveText
              ]}
            >
              {index + 1}
            </Text>
                </View>
              
              {index < totalSteps - 1 && (
                <View
                  style={[
                    styles.line,
                    index + 1 < currentStep ? styles.activeLine : styles.inactiveLine
                  ]}
                />
              )}
            </View>
           
          </View>
        ))}
      </View>
      <Text style={styles.stepName}>{stepName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignSelf:"center",
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stepWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 4,
  },
  stepBox:{
    justifyContent:"center",
    flexDirection:"column",
    alignItems:"center"
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  activeCircle: {
    backgroundColor: '#E74C3C',
  },
  inactiveCircle: {
    backgroundColor: '#E0E0E0',
  },
  line: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
  },
  activeLine: {
    backgroundColor: '#E74C3C',
  },
  inactiveLine: {
    backgroundColor: '#E0E0E0',
  },
  stepNumber: {
    fontSize: 12,
    marginTop: 4,
  },
  activeText: {
    color: '#E74C3C',
    fontWeight: '600',
  },
  inactiveText: {
    color: '#999999',
    fontWeight: '400',
  },
  stepName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    textAlign: 'center',
  },
});

export default ProgressIndicator;
