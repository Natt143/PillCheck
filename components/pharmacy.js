import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchPharmaciesByCoords } from '../api/pharmacy';
import { useTheme } from "../context/themeContext"; // <-- Connects the theme engine

export default function PharmacyList({ latitude, longitude }) {
  const { isDark } = useTheme(); // <-- Checks current active state
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    setError(null);

    fetchPharmaciesByCoords(latitude, longitude)
      .then((data) => {
        if (isActive) setPharmacies(data || []);
      })
      .catch((err) => {
        if (isActive) setError(err.message || 'Error pulling local map data.');
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => { isActive = false; };
  }, [latitude, longitude]);

  // Pick styles based on active theme choice
  const theme = isDark ? darkStyles : lightStyles;

  if (loading) {
    return (
      <View style={theme.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={theme.loadingText}>Searching for nearby pharmacies...</Text>
      </View>
    );
  }

  if (error) return <View style={theme.centered}><Text style={theme.error}>{error}</Text></View>;
  if (pharmacies.length === 0) return <View style={theme.centered}><Text style={theme.empty}>No pharmacies found within 3km.</Text></View>;

  return (
    <View style={theme.container}>
      <View style={theme.headerContainer}>
        <Text style={theme.headerTitle}>Nearest Pharmacies</Text>
        <Text style={theme.headerSubtitle}>Locations closest to your current Canadian GPS spot</Text>
      </View>

      <FlatList
        data={pharmacies}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={theme.card}>
            <View style={styles.infoContainer}>
              <Text style={theme.name}>{item.name}</Text>
              <Text style={theme.text}>{item.address}</Text>
            </View>
            
            <View style={styles.actionsRow}>
              {item.phone ? (
                <TouchableOpacity 
                  style={[styles.actionButton, theme.callButton]} 
                  onPress={() => Linking.openURL(`tel:${item.phone.replace(/\s+/g, '')}`)}
                >
                  <Text style={theme.callButtonText}>📞 Call</Text>
                </TouchableOpacity>
              ) : null}
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.mapButton]} 
                onPress={() => Linking.openURL(`maps://maps.apple.com/?q=${encodeURIComponent(item.name)}&ll=${item.loc}`)}
              >
                <Text style={styles.mapButtonText}>📍 Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// Styles specific to Light Mode
const lightStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f8fafc' },
  headerContainer: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', marginBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  headerSubtitle: { fontSize: 14, color: '#64748b', marginTop: 2 },
  loadingText: { marginTop: 12, fontSize: 14, color: '#64748b' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  name: { fontSize: 17, fontWeight: '700', marginBottom: 4, color: '#1e293b' },
  text: { fontSize: 14, color: '#475569', lineHeight: 20 },
  callButton: { backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1' },
  callButtonText: { color: '#334155', fontWeight: '600' },
  error: { textAlign: 'center', color: '#dc2626', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#64748b', fontWeight: '500' },
});

// Styles specific to Dark Mode (Matches your settings layout values)
const darkStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#121212' },
  headerContainer: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#1e1e1e', borderBottomWidth: 1, borderBottomColor: '#2c2c2e', marginBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: '#8e8e93', marginTop: 2 },
  loadingText: { marginTop: 12, fontSize: 14, color: '#8e8e93' },
  card: { backgroundColor: '#2c2c2e', borderRadius: 12, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#444' },
  name: { fontSize: 17, fontWeight: '700', marginBottom: 4, color: '#fff' },
  text: { fontSize: 14, color: '#c7c7cc', lineHeight: 20 },
  callButton: { backgroundColor: '#3a3a3c', borderWidth: 1, borderColor: '#555' },
  callButtonText: { color: '#fff', fontWeight: '600' },
  error: { textAlign: 'center', color: '#ff453a', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#8e8e93', fontWeight: '500' },
});

// Structural layout styles shared across both layouts
const styles = StyleSheet.create({
  infoContainer: { marginBottom: 14 },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  mapButton: { backgroundColor: '#2563eb' },
  mapButtonText: { color: '#fff', fontWeight: '600' },
});