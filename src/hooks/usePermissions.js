import { useEffect, useState } from 'react';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

export default function usePermissions() {
  const [cameraGranted, setCameraGranted] = useState(null);
  const [locationGranted, setLocationGranted] = useState(null);

  useEffect(() => {
    (async () => {
      const { status: cst } = await Camera.requestCameraPermissionsAsync();
      setCameraGranted(cst === 'granted');

      const { status: lst } = await Location.requestForegroundPermissionsAsync();
      setLocationGranted(lst === 'granted');
    })();
  }, []);

  return { cameraGranted, locationGranted };
}
