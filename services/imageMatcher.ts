import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';

// 1. Initialize TensorFlow once when the app starts up
export const initTensorFlow = async (): Promise<void> => {
  try {
    await tf.ready();
    console.log('✅ TensorFlow.js is ready on-device!');
  } catch (error) {
    console.error('❌ Failed to initialize TensorFlow:', error);
  }
};

// Fix: Change how FileSystem reads the options object
const convertUriToTensor = async (fileUri: string): Promise<tf.Tensor4D> => {
  // Pass 'base64' directly as a string literal instead of FileSystem.EncodingType.Base64
  const base64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: 'base64', 
  });
  
  // Convert base64 string to a binary array buffer
  const rawData = tf.util.encodeString(base64, 'base64').buffer;
  const imageUint8Array = new Uint8Array(rawData);
  
  // Decode the raw JPEG data into a 3D Tensor [height, width, channels]
  const imageTensor = decodeJpeg(imageUint8Array);
  
  // Resize the image to 224x224 pixels (required input shape for MobileNet)
  const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
  const batched = resized.expandDims(0) as tf.Tensor4D;

  // Clean up intermediate tensor to free up memory
  tf.dispose(imageTensor);
  
  return batched;
};