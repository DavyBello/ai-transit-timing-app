export interface LocationInput {
  address: string;
  placeId?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface TransitPreferences {
  origin: LocationInput;
  destination: LocationInput;
  maxWaitTime: number; // in minutes
}

export interface TransitRoute {
  departureTime: Date;
  arrivalTime: Date;
  duration: number; // in minutes
  waitTime: number; // in minutes
  steps: TransitStep[];
  polyline?: string; // Encoded polyline for map display
}

export interface TransitStep {
  mode: 'WALK' | 'TRANSIT';
  duration: number; // in seconds
  distance?: number; // in meters
  instructions?: string;
  polyline?: string;
  transitDetails?: {
    stopName: string;
    departureStop: {
      name: string;
      location: {
        lat: number;
        lng: number;
      };
    };
    arrivalStop: {
      name: string;
      location: {
        lat: number;
        lng: number;
      };
    };
    lineName: string;
    lineShortName?: string;
    vehicleType: string;
    departureTime: Date;
    arrivalTime: Date;
    numStops: number;
    agencyName?: string;
    lineColor?: string;
  };
}

export interface GaugeStatus {
  value: number; // 0-100
  status: 'green' | 'orange' | 'red';
  message: string;
  nextDepartureTime?: Date;
  route?: TransitRoute;
}

export interface TransitApiRequest {
  origin: string;
  destination: string;
  maxWaitTime: number;
}

export interface TransitApiResponse {
  status: GaugeStatus;
  routes: TransitRoute[];
  error?: string;
}

// Google Routes API types
export interface GoogleRoutesRequest {
  origin: {
    address?: string;
    placeId?: string;
    location?: {
      latLng: {
        latitude: number;
        longitude: number;
      };
    };
  };
  destination: {
    address?: string;
    placeId?: string;
    location?: {
      latLng: {
        latitude: number;
        longitude: number;
      };
    };
  };
  travelMode: string;
  departureTime?: string;
  arrivalTime?: string;
  computeAlternativeRoutes?: boolean;
  transitPreferences?: {
    allowedTravelModes?: string[];
    routingPreference?: string;
  };
  languageCode?: string;
  units?: string;
}

export interface GoogleRoutesResponse {
  routes: Array<{
    legs: Array<{
      steps: Array<{
        distanceMeters?: number;
        duration?: string;
        staticDuration?: string;
        polyline?: {
          encodedPolyline: string;
        };
        transitDetails?: {
          stopDetails?: {
            arrivalStop?: {
              name: string;
              location: {
                latLng: {
                  latitude: number;
                  longitude: number;
                };
              };
            };
            departureStop?: {
              name: string;
              location: {
                latLng: {
                  latitude: number;
                  longitude: number;
                };
              };
            };
            arrivalTime?: string;
            departureTime?: string;
          };
          transitLine?: {
            name: string;
            nameShort?: string;
            color?: string;
            agencies?: Array<{
              name: string;
            }>;
            vehicle?: {
              type: string;
            };
          };
          stopCount?: number;
        };
      }>;
      duration?: string;
      startTime?: string;
      endTime?: string;
      polyline?: {
        encodedPolyline: string;
      };
    }>;
    polyline?: {
      encodedPolyline: string;
    };
  }>;
  error?: {
    code: number;
    message: string;
  };
}