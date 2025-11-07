import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getAllReports } from '../Utils/RealmInstance';
import { SafeAreaView } from 'react-native-safe-area-context';

const SavedReportsScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadReports();
    const focusHandler = navigation.addListener('focus', loadReports);
    return focusHandler;
  }, []);

  const loadReports = async () => {
    const data = await getAllReports();
    setReports(data);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ReportDetail', { report: item })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.fullName || 'Unnamed Farmer'}</Text>
        <Text style={styles.subtext}>📍 {item.village || item.blockName || 'Unknown Location'}</Text>
        <Text style={styles.date}>🗓️ {new Date(item.createdAt).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Saved Blooming Reports</Text>
      {reports.length === 0 ? (
        <Text style={styles.empty}>No reports found.</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
};

export default SavedReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  subtext: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#777',
    marginTop: 6,
  },
  empty: {
    textAlign: 'center',
    color: '#777',
    marginTop: 40,
  },
});
