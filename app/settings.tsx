import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/themeContext";
import { useStore } from "../store/states";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const resetAll = useStore((state) => state.resetAll);

  const handleReset = async () => {
    resetAll();
    await AsyncStorage.removeItem("theme");
  };

  const theme = isDark ? darkStyles : lightStyles;

  return (
    <View style={[theme.container, { paddingTop: insets.top + 30 }]}>
      <Text style={theme.text}>Settings</Text>
      <View style={styles.menuContainer}>
        <Link href='/themes' asChild>
          <TouchableOpacity style={theme.buttonBox}>
            <Text style={theme.optionText}>Themes</Text>
          </TouchableOpacity>
        </Link>
        <Link href='/times' asChild>
          <TouchableOpacity style={theme.buttonBox}>
            <Text style={theme.optionText}>Change pill times</Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity style={theme.buttonBox} onPress={handleReset}>
          <Text style={theme.optionText}>Reset App</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Pill Check v1.0.0</Text>
        <Text style={styles.footerSubText}>Made by Nathan Karan</Text>
      </View>
    </View>
  );
}

const lightStyles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "#fff" },
  text: { fontSize: 28, fontWeight: "bold", marginBottom: 10, color: "#000" },
  buttonBox: { width: '90%', backgroundColor: '#f0f0f0', borderWidth: 2, borderColor: '#000', borderRadius: 8, padding: 15, marginTop: 20, alignItems: 'center' },
  optionText: { fontSize: 20, fontWeight: '500', color: '#000' },
});

const darkStyles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "#121212" },
  text: { fontSize: 28, fontWeight: "bold", marginBottom: 10, color: "#fff" },
  buttonBox: { width: '90%', backgroundColor: '#2c2c2e', borderWidth: 2, borderColor: '#555', borderRadius: 8, padding: 15, marginTop: 20, alignItems: 'center' },
  optionText: { fontSize: 20, fontWeight: '500', color: '#fff' },
});

const styles = StyleSheet.create({
  menuContainer: { width: '100%', alignItems: 'center', paddingHorizontal: 20 },
  footerContainer: { marginTop: 'auto', alignItems: 'center', width: '100%' },
  footerText: { fontSize: 14, color: '#8e8e93', fontWeight: '600' },
  footerSubText: { fontSize: 12, color: '#c7c7cc', marginTop: 4, marginBottom: 8 },
});