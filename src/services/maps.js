export function regionFrom(lat, lng, delta = 0.01) {
  return {
    latitude: lat,
    longitude: lng,
    latitudeDelta: delta,
    longitudeDelta: delta
  };
}
