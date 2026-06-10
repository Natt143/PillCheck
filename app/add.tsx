import { StyleSheet, Text, TouchableOpacity, View } from "react-native";



export default function App() {
  return (
    <View style={styles.container}>
       <TouchableOpacity style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Reset App</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});