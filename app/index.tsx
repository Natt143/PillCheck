import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OCRScanner } from "../components/scanner";
import { useTheme } from "../context/themeContext";
import { useStore } from "../store/states";

export default function Index() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  // 1. Connect global state variables from typed Zustand store
  const time1 = useStore((state) => state.time1);
  const time2 = useStore((state) => state.time2);
  const time1Stat = useStore((state) => state.time1Stat);
  const time2Stat = useStore((state) => state.time2Stat);
  
  // 2. Connect global state mutations from typed Zustand store
  const setTime1Stat = useStore((state) => state.setTime1Stat);
  const setTime2Stat = useStore((state) => state.setTime2Stat);
  const setLogs = useStore((state) => state.setLogs);

  const [bothLog, setBothLog] = useState(false);

  const displayTime1 = time1 || "8:00 AM";
  const displayTime2 = time2 || "8:00 PM";

  const minutes1 = timeToMinutes(displayTime1);
  const minutes2 = timeToMinutes(displayTime2);

  let soonerTime = "";

  if (time1Stat === "logged" && time2Stat === "logged") {
    soonerTime = "All caught up!";
  } else if (time1Stat === "logged") {
    soonerTime = displayTime2;
  } else if (time2Stat === "logged") {
    soonerTime = displayTime1;
  } else {
    soonerTime = minutes1 < minutes2 ? displayTime1 : displayTime2;
  }

  if (bothLog === true) {
    soonerTime = "All pills logged for today!";
  }

  const [statusText, setStatusText] = useState(`Next up: ${soonerTime}`);

  useEffect(() => {
    setStatusText(`Next up: ${soonerTime}`);
  }, [soonerTime]);

  useEffect(() => {
    if (time1Stat === "logged" && time2Stat === "logged") {
      setBothLog(true);
    } else {
      setBothLog(false);
    }
  }, [time1Stat, time2Stat]);

  useEffect(() => {
    const checkResetTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      if (hours === 23 && minutes === 59) {
        setTime1Stat("log");
        setTime2Stat("log");
        setBothLog(false);
        setLogs(0);
      }
    };
    const timerInterval = setInterval(checkResetTime, 30000);
    return () => clearInterval(timerInterval);
  }, [setTime1Stat, setTime2Stat, setLogs]);

  const handleAiDetection = (status: string) => {
    if (status === 'No Match') {
      setStatusText("AI Detected: No Match. Try again!");
      return;
    }
    if (status === 'Match') {
      if (time1Stat === "log" && isTimeWindowOpen(displayTime1)) {
        setStatusText(`AI Detected: Morning Pill Verified!`);
        showSuccess("morning");
        return;
      }
      if (time2Stat === "log" && isTimeWindowOpen(displayTime2)) {
        setStatusText(`AI Detected: Evening Pill Verified!`);
        showSuccess("evening");
        return;
      }
      setStatusText("Too early or too late! No pill window is open right now.");
    }
  };

  const showSuccess = (timeSlot?: string) => {
    setLogs((currentLogs: number) => {
      const nextLogsCount = currentLogs + 1;
      if (timeSlot === "morning") {
        setTime1Stat("logged");
        return nextLogsCount;
      } else if (timeSlot === "evening") {
        setTime2Stat("logged");
        return nextLogsCount;
      }
      if (time1Stat === "log") {
        setTime1Stat("logged");
      } else {
        setTime2Stat("logged");
      }
      return nextLogsCount;
    });
  };

  const theme = isDark ? darkStyles : lightStyles;

  return (
    <View style={[theme.container, { paddingTop: insets.top + 20 }]}>
      <Text style={theme.headerText}>Pill Tracker</Text>
      <Text style={theme.statusText}>{statusText}</Text>

      <View style={styles.cameraBox}>
        <OCRScanner
          onStatusChange={handleAiDetection}
          showSuccess={showSuccess}
        />
      </View>

      {/* Morning Button */}
      <View style={styles.buttonContainer}>
        <View style={[
          styles.logAt, 
          time1Stat === "logged" ? theme.logAtLogged : theme.logAtOpen
        ]}>
          <Text style={[
            styles.logAtText, 
            time1Stat === "logged" ? theme.logAtTextLogged : theme.logAtTextOpen
          ]}>
            {time1Stat} at {displayTime1}
          </Text>
        </View>
      </View>

      {/* Evening Button */}
      <View style={styles.buttonContainer}>
        <View style={[
          styles.logAt, 
          time2Stat === "logged" ? theme.logAtLogged : theme.logAtOpen
        ]}>
          <Text style={[
            styles.logAtText, 
            time2Stat === "logged" ? theme.logAtTextLogged : theme.logAtTextOpen
          ]}>
            {time2Stat} at {displayTime2}
          </Text>
        </View>
      </View>
    </View>
  );
}

function timeToMinutes(timeStr: string): number {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function isTimeWindowOpen(targetTimeStr: string): boolean {
  const now = new Date();
  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
  const targetTotalMinutes = timeToMinutes(targetTimeStr);
  return (
    currentTotalMinutes >= targetTotalMinutes - 60 &&
    currentTotalMinutes <= targetTotalMinutes + 180
  );
}

// Light theme specific variants
const lightStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  headerText: { fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 10 },
  statusText: { fontSize: 18, color: "#555", marginBottom: 30, fontWeight: "500" },
  logAtOpen: { backgroundColor: "#96e9ec" },
  logAtLogged: { backgroundColor: "#d3d3d3" },
  logAtTextOpen: { color: "#4a4a4a" },
  logAtTextLogged: { color: "#7c7c7c" },
});

// Dark theme specific variants
const darkStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", alignItems: "center", justifyContent: "center" },
  headerText: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  statusText: { fontSize: 18, color: "#aaa", marginBottom: 30, fontWeight: "500" },
  logAtOpen: { backgroundColor: "#205052" }, 
  logAtLogged: { backgroundColor: "#2a2a2a" }, 
  logAtTextOpen: { color: "#96e9ec" },
  logAtTextLogged: { color: "#555" },
});

// Structural layout styles shared by both themes
const styles = StyleSheet.create({
  cameraBox: { width: 320, height: 320, backgroundColor: "#e0e0e0", borderRadius: 20, justifyContent: "center", alignItems: "center", marginBottom: 30, overflow: "hidden" },
  buttonContainer: { flexDirection: "row", gap: 10, marginBottom: 10 },
  button: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  logAt: { paddingVertical: 12, width: "70%", maxWidth: 400, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  logAtText: { fontWeight: "bold", fontSize: 18, textTransform: "capitalize" },
});