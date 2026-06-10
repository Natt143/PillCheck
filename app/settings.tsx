import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DetailsScreen() {
  const insets = useSafeAreaInsets(); // FIXED: Added missing insets hook

  return (
    <View style={[styles.container, { paddingTop: insets.top + 30 }]}>
      <Text style={styles.text}>Settings</Text>
      
      <View style={styles.menuContainer}>

        {/* Option 1 */}
        <TouchableOpacity style={styles.buttonBox}>
          <Text style={styles.optionText}>Add/Remove Medication</Text>
        </TouchableOpacity>

        {/* Option 2 */}
        <TouchableOpacity style={styles.buttonBox}>
          <Text style={styles.optionText}>Change pill times</Text>
        </TouchableOpacity>

        {/* Option 3 */}
        <TouchableOpacity style={styles.buttonBox}>
          <Text style={styles.optionText}>Re-train OCR</Text>
        </TouchableOpacity>

        {/* Option 4 */}
        <TouchableOpacity style={styles.buttonBox}>
          <Text style={styles.optionText}>Themes</Text>
        </TouchableOpacity>

        {/* Option 5 */}
        <TouchableOpacity style={styles.buttonBox}>
          <Text style={styles.optionText}>Reset App</Text>
        </TouchableOpacity>

      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Pill Tracker v1.0.0</Text>
        <Text style={styles.footerSubText}>Made by Nathan Karan</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  menuContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonBox: {
    width: '90%',               
    backgroundColor: '#f0f0f0', 
    borderWidth: 2,
    borderColor: '#000000',     
    borderRadius: 8,
    padding: 15,                
    marginTop: 20,              
    alignItems: 'center',       
  },
  optionText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',              
  },

  footerContainer: {
    marginTop: 'auto',          
    alignItems: 'center',
    width: '100%',
  },
  footerText: {
    fontSize: 14,
    color: '#8e8e93',           
    fontWeight: '600',
  },
  footerSubText: {
    fontSize: 12,
    color: '#c7c7cc',
    marginTop: 4,
    marginBottom: 8,
  }
});