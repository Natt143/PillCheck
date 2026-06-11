import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/themeContext";

export default function DetailsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, toggleTheme } = useTheme();

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <View style={[theme.container, { paddingTop: insets.top + 30 }]}>
      <Text style={theme.text}>Themes</Text>
      <View style={styles.menuContainer}>

        <TouchableOpacity
          style={[styles.buttonBox, isDark ? null : styles.activeButton]}
          onPress={() => toggleTheme(false)}
        >
          <Text style={theme.optionText}>Light</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonBox, isDark ? styles.activeButton : null]}
          onPress={() => toggleTheme(true)}
        >
          <Text style={theme.optionText}>Dark</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  menuContainer: { width: "100%", alignItems: "center", paddingHorizontal: 20 },
  buttonBox: { width: "90%", borderWidth: 2, borderColor: "#000", borderRadius: 8, padding: 15, marginTop: 20, alignItems: "center" },
  activeButton: { borderColor: "#007AFF",},
});

const lightTheme = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "#fff" },
  text: { fontSize: 28, fontWeight: "bold", marginBottom: 10, color: "#000" },
  optionText: { fontSize: 20, fontWeight: "500", color: "#000" },
});

const darkTheme = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "#121212" },
  text: { fontSize: 28, fontWeight: "bold", marginBottom: 10, color: "#fff" },
  optionText: { fontSize: 20, fontWeight: "500", color: "#fff" },
});