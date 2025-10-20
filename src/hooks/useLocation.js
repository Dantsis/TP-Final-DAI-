import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export default function useLocation(watch = true) {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let sub;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permiso de ubicación denegado');
          return;
        }
        if (watch) {
          sub = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.Balanced, timeInterval: 3000, distanceInterval: 5 },
            (pos) => setCoords(pos.coords)
          );
        } else {
          const pos = await Location.getCurrentPositionAsync({});
          setCoords(pos.coords);
        }
      } catch (e) {
        setError(String(e));
      }
    })();
    return () => sub && sub.remove();
  }, [watch]);

  return { coords, error };
}
