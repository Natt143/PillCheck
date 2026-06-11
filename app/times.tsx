import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from '../context/themeContext';
import { useStore } from '../store/states';

export default function ChangeTimesScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  const time1 = useStore((state: any) => state.time1);
  const time2 = useStore((state: any) => state.time2);
  const setTime1 = useStore((state: any) => state.setTime1);
  const setTime2 = useStore((state: any) => state.setTime2);
  
  const [showPicker, setShowPicker] = useState(false);
  const [activeSlot, setActiveSlot] = useState<'morning' | 'evening' | null>(null);

  const getPickerDate = () => {
    const currentString = activeSlot === 'morning' 
      ? time1 || "8:00 AM" 
      : time2 || "8:00 PM";
      
    const match = currentString.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    const date = new Date();
    if (!match) return date;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();

    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    return date;
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Keep picker open on iOS to behave like an inline element, hide on Android close
    setShowPicker(Platform.OS === 'ios'); 
    
    if (event.type === 'set' && selectedDate) {
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const timeString = `${displayHours}:${displayMinutes} ${ampm}`;

      if (activeSlot === 'morning' && setTime1) setTime1(timeString);
      else if (activeSlot === 'evening' && setTime2) setTime2(timeString);
      
      if (Platform.OS === 'android') setShowPicker(false);
    } else {
      setShowPicker(false);
    }
  };

  const openPicker = (slot: 'morning' | 'evening') => {
    setActiveSlot(slot);
    setShowPicker(true);
  };

  const theme = isDark ? darkStyles : lightStyles;

  return (
    <View style={theme.container}>
      <Text style={theme.title}>Adjust Pill Times</Text>
      
      <TouchableOpacity style={theme.timeCard} onPress={() => openPicker('morning')}>
        <Text style={theme.label}>Morning Dose</Text>
        <Text style={styles.timeValue}>{time1 || "8:00 AM"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={theme.timeCard} onPress={() => openPicker('evening')}>
        <Text style={theme.label}>Evening Dose</Text>
        <Text style={styles.timeValue}>{time2 || "8:00 PM"}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={getPickerDate()} 
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onTimeChange}
          themeVariant={isDark ? 'dark' : 'light'}
          textColor={isDark ? '#ffffff' : '#000000'}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={() => router.back()}>
        <Text style={styles.saveButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const lightStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", paddingTop: 60 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30, color: "#000" },
  timeCard: { width: '85%', backgroundColor: '#f9f9f9', padding: 20, borderRadius: 15, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  label: { fontSize: 16, color: '#666' },
});

const darkStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", alignItems: "center", paddingTop: 60 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30, color: "#fff" },
  timeCard: { width: '85%', backgroundColor: '#2c2c2e', padding: 20, borderRadius: 15, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#444' },
  label: { fontSize: 16, color: '#aaa' },
});

const styles = StyleSheet.create({
  timeValue: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  saveButton: { marginTop: 'auto', marginBottom: 50, backgroundColor: '#007AFF', paddingVertical: 15, paddingHorizontal: 60, borderRadius: 10 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});