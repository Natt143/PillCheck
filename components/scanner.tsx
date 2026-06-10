import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system/legacy';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../store/states'; // Adjust path if needed to match your store location

// Pointing directly to your newly added Teachable Machine files
const localModelJson = require('../assets/ocr_model/model.json');
const weights = require('../assets/ocr_model/weights.bin'); 

export function OCRScanner({ 
  onStatusChange, 
  showSuccess 
}: { 
  onStatusChange: (status: string) => void;
  showSuccess: () => void;
}) {
  // HOOK FIX: Store hook must be declared at the top level of the component body
  const setPillStatus = useStore((state) => state.setPillStatus);

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  
  const [isTfReady, setIsTfReady] = useState(false);
  const [model, setModel] = useState<tf.LayersModel | null>(null); 
  const [ocrResult, setOcrResult] = useState<string>('Awaiting scan...');
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize TensorFlow and Load your Custom Teachable Machine Model
  useEffect(() => {
    async function setupAI() {
      try {
        await tf.ready();
        
        // Teachable Machine exports are Layers Models
        const loadedModel = await tf.loadLayersModel(
          bundleResourceIO(localModelJson, [weights])
        );
        
        setModel(loadedModel);
        setIsTfReady(true);
        setOcrResult('AI Scanner Ready');
      } catch (error) {
        console.error("Failed to initialize custom AI model:", error);
        setOcrResult('Failed to load local AI.');
      }
    }
    setupAI();
  }, []);

  if (!permission || !isTfReady || !model) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loadingText}>Initializing Custom AI...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 10, textAlign: 'center', fontSize: 14 }}>Camera access required.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getRawFeatures = async (): Promise<Float32Array | null> => {
    if (!cameraRef.current) return null;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.4,
      skipProcessing: true,
    });

    if (!photo?.uri) return null;

    const base64Data = await FileSystem.readAsStringAsync(photo.uri, {
      encoding: 'base64',
    });

    const rawBuffer = tf.util.encodeString(base64Data, 'base64');
    const imageTensor = decodeJpeg(rawBuffer);

    // --- CENTER CROP PIPELINE ---
    const [height, width, channels] = imageTensor.shape;
    const cropSize = Math.min(height, width); 
    const startX = Math.floor((width - cropSize) / 2);
    const startY = Math.floor((height - cropSize) / 2);

    const croppedTensor = tf.slice(imageTensor, [startY, startX, 0], [cropSize, cropSize, 3]);
    const resizedTensor = tf.image.resizeBilinear(croppedTensor, [224, 224]);
    
    const normalizedTensor = resizedTensor.toFloat().sub(127.5).div(127.5);
    const batchedTensor = normalizedTensor.expandDims(0);

    let resultsArray: Float32Array;

    try {
      const prediction = model.predict(batchedTensor) as tf.Tensor;
      resultsArray = await prediction.data() as Float32Array;
      tf.dispose(prediction);
    } catch (err) {
      console.error("Prediction Error:", err);
      return null;
    }

    tf.dispose([imageTensor, croppedTensor, resizedTensor, normalizedTensor, batchedTensor]);
    return resultsArray;
  };

  const identifyShape = async () => {
    if (isProcessing || !cameraRef.current) return;

    setIsProcessing(true);
    setOcrResult('Scanning shape...');

    try {
      const currentFeatures = await getRawFeatures();
      if (!currentFeatures) {
        setOcrResult('Could not read camera output.');
        setIsProcessing(false);
        return;
      }

      // Index 0 tracks your 'pill_bottle' label from Teachable Machine
      const pillBottleConfidence = currentFeatures[0];
      
      // ROUNDING FIX: Calculate whole number integers first to avoid false-mismatch display discrepancies
      const displayScoreNum = Math.round(pillBottleConfidence * 100);
      const displayScore = displayScoreNum.toFixed(0);
      
      const MATCH_THRESHOLD_PCT = 30; // 75% Confidence Threshold

      if (displayScoreNum >= MATCH_THRESHOLD_PCT) {
        setOcrResult(`Match! Pill Bottle Verified (${displayScore}%)`);
        
        // Broadcast success states safely using pre-declared hooks/callbacks
        onStatusChange('Match');
        setPillStatus('Match');
      } else {
        setOcrResult(`No Match: Object not recognized (${displayScore}%)`);
        
        onStatusChange('No Match');
        setPillStatus('No Match');
      }

    } catch (err) {
      console.error(err);
      setOcrResult('Scan error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.inlineContainer}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.overlay}>
          <Text style={styles.ocrText}>{ocrResult}</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.captureButton, isProcessing && { backgroundColor: '#8E8E93' }]} 
              onPress={identifyShape} 
              disabled={isProcessing}
            >
              <Text style={styles.buttonText}>{isProcessing ? "Scanning..." : "Scan Pill Bottle"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  inlineContainer: { width: '100%', height: '100%', borderRadius: 20, overflow: 'hidden' },
  camera: { flex: 1 },
  center: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' },
  loadingText: { marginTop: 8, fontSize: 14, color: '#666' },
  overlay: { flex: 1, justifyContent: 'space-between', padding: 15, backgroundColor: 'rgba(0,0,0,0.1)' },
  ocrText: { color: '#fff', fontSize: 14, fontWeight: 'bold', backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 8, borderRadius: 6, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' },
  captureButton: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 25, alignItems: 'center', minWidth: 150 },
  permissionButton: { backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 6 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});