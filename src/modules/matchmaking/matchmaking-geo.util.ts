export type Coordinates = {
  latitude: number;
  longitude: number;
};

export const getCoordinates = (profile: {
  latitude?: number | null;
  longitude?: number | null;
}): Coordinates | null => {
  if (
    profile.latitude === undefined ||
    profile.latitude === null ||
    profile.longitude === undefined ||
    profile.longitude === null
  ) {
    return null;
  }

  return {
    latitude: profile.latitude,
    longitude: profile.longitude,
  };
};

export const calculateDistanceKm = (
  origin: Coordinates,
  destination: Coordinates,
): number => {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(destination.latitude - origin.latitude);
  const longitudeDelta = toRadians(destination.longitude - origin.longitude);
  const originLatitude = toRadians(origin.latitude);
  const destinationLatitude = toRadians(destination.latitude);

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(originLatitude) *
      Math.cos(destinationLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};

const toRadians = (value: number): number => (value * Math.PI) / 180;
