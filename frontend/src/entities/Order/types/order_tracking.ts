export type OrderTracking = {
  id: number;
  geopoints: OrderTrackingGeoPoint[];
};

export type OrderTrackingGeoPoint = {
  id: number;
  latitude: number;
  longitude: number;
  created_at: string;
};
