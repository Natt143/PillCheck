import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OCRScanner } from "../components/scanner";

export default function Index() {
  const insets = useSafeAreaInsets();

  var time1 = "8:30AM";
  var time2 = "8:00PM";

  const [logs, setLogs] = useState(0);
  const [bothLog, setBothLog] = useState(false);
  const [time1Stat, setTime1Stat] = useState("log");
  const [time2Stat, setTime2Stat] = useState("log");

  const minutes1 = timeToMinutes(time1);
  const minutes2 = timeToMinutes(time2);

  let soonerTime = "";

  if (time1Stat === "logged" && time2Stat === "logged") {
    soonerTime = "All caught up!";
  } else if (time1Stat === "logged") {
    soonerTime = time2;
  } else if (time2Stat === "logged") {
    soonerTime = time1;
  } else {
    soonerTime = minutes1 < minutes2 ? time1 : time2;
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
  }, []);

  const showAnalyzing = () => {
    setStatusText("Analyzing pill bottle...");
  };

  // Modified to handle the clean 'Match' / 'No Match' statuses from the scanner
const handleAiDetection = (status: string) => {
    if (status === 'No Match') {
      setStatusText("AI Detected: No Match. Try again!");
      return; 
    }

    if (status === 'Match') {
      if (time1Stat === "log" && isTimeWindowOpen(time1)) {
        setStatusText(`AI Detected: Morning Pill Verified!`);
        showSuccess("morning"); // <-- Tell it to log the morning slot
        return;
      } 
      
      if (time2Stat === "log" && isTimeWindowOpen(time2)) {
        setStatusText(`AI Detected: Evening Pill Verified!`);
        showSuccess("evening"); // <-- Tell it to log the evening slot
        return;
      }

      // If a window isn't open
      setStatusText("Too early or too late! No pill window is open right now.");
    }
  };

const showSuccess = (timeSlot?: string) => {
  setLogs((currentLogs) => {
    const nextLogsCount = currentLogs + 1;

    // If a specific slot was passed from the AI, log that exact one
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

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <Text style={styles.headerText}>Pill Tracker</Text>
      <Text style={styles.statusText}>{statusText}</Text>

      <View style={styles.cameraBox}>
        <OCRScanner 
          onStatusChange={handleAiDetection} 
          showSuccess={showSuccess} 
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#FFA500' }]} onPress={showAnalyzing}>
          <Text style={styles.buttonText}>Simulate Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#4CD964' }]} onPress={() => showSuccess()}>
          <Text style={styles.buttonText}>Simulate Success</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <View style={[styles.logAt, { backgroundColor: time1Stat === "logged" ? "#d3d3d3" : "#96e9ec" }]}>
          <Text style={styles.logAtText}>{time1Stat} at {time1}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <View style={[styles.logAt, { backgroundColor: time2Stat === "logged" ? "#d3d3d3" : "#96e9ec" }]}>
          <Text style={styles.logAtText}>{time2Stat} at {time2}</Text>
        </View>
      </View>
    </View>
  );
}

function timeToMinutes(timeStr: string): number {
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

  const START_ALLOWANCE = 60; 
  const END_ALLOWANCE = 180;  

  return (
    currentTotalMinutes >= targetTotalMinutes - START_ALLOWANCE &&
    currentTotalMinutes <= targetTotalMinutes + END_ALLOWANCE
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  headerText: { fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 10 },
  statusText: { fontSize: 18, color: "#555", marginBottom: 30, fontWeight: "500" },
  cameraBox: { width: 320, height: 320, backgroundColor: "#e0e0e0", borderRadius: 20, justifyContent: "center", alignItems: "center", marginBottom: 30, overflow: "hidden" },
  buttonContainer: { flexDirection: "row", gap: 10, marginBottom: 10 },
  button: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  logAt: { paddingVertical: 12, width: "70%", maxWidth: 400, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  logAtText: { color: "#4a4a4a", fontWeight: "bold", fontSize: 18, textTransform: "capitalize" }
});