import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PharmacyList from '../components/pharmacy.js'; // Correctly points to your component folder
import { useTheme } from "../context/themeContext";

export default function PharmacyScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getDeviceLocation = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg("Location permission was denied.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setCoords({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      setErrorMsg('Could not fetch GPS coordinates.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDeviceLocation();
  }, []);

  // Pick the active stylesheet mapping based on current theme state
  const theme = isDark ? darkStyles : lightStyles;

  if (loading) {
    return (
      <View style={theme.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={theme.text}>Finding your location...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={theme.centered}>
        <Text style={styles.errorText}>📍 {errorMsg}</Text>
        <Button title="Try Again" onPress={getDeviceLocation} color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={[theme.container, { paddingTop: insets.top + 30 }]}>
      {coords && <PharmacyList latitude={coords.latitude} longitude={coords.longitude} />}
    </View>
  );
}

// Replicating your setting styles to align background and text properties exactly
const lightStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: "#fff" },
  text: { marginTop: 12, color: "#000", fontSize: 14, fontWeight: "500" },
});

const darkStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: "#121212" },
  text: { marginTop: 12, color: "#fff", fontSize: 14, fontWeight: "500" },
});

const styles = StyleSheet.create({
  errorText: { color: '#dc2626', marginBottom: 16, fontSize: 15, textAlign: 'center' },
});