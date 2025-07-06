export interface MapOptions {
  center: google.maps.LatLngLiteral;
  zoom: number;
  mapId?: string;
  disableDefaultUI?: boolean;
  zoomControl?: boolean;
  mapTypeControl?: boolean;
  streetViewControl?: boolean;
  fullscreenControl?: boolean;
}

export interface MarkerOptions {
  position: google.maps.LatLngLiteral;
  map: google.maps.Map;
  title?: string;
  icon?: string | google.maps.Icon;
  animation?: google.maps.Animation;
}

export interface PolylineOptions {
  path: google.maps.LatLngLiteral[];
  geodesic: boolean;
  strokeColor: string;
  strokeOpacity: number;
  strokeWeight: number;
  map: google.maps.Map;
}

export interface PlaceResult {
  place_id?: string;
  formatted_address?: string;
  geometry?: {
    location: google.maps.LatLng;
  };
  name?: string;
}

export interface AutocompleteOptions {
  types?: string[];
  componentRestrictions?: {
    country: string | string[];
  };
  bounds?: google.maps.LatLngBounds;
  fields?: string[];
}