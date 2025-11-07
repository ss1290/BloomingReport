import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomHeader = ({ onBackPress, showBackButton = true }) => {
  return (
    <View style={styles.container}>
      {showBackButton ? (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBackPress}
        >
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.title}>Blooming Report</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.backButton}>
          <Text style={styles.title}>Blooming Report</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    justifyContent:"center"
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: '#333',
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default CustomHeader;