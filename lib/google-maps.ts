import { GoogleRoutesRequest, GoogleRoutesResponse } from '@/types/transit';
import { ExternalApiError } from './types';

const ROUTES_API_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes';

export class GoogleMapsClient {
  private apiKey: string;

  constructor() {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_MAPS_API_KEY environment variable is not set');
    }
    this.apiKey = apiKey;
  }

  async computeRoutes(request: GoogleRoutesRequest): Promise<GoogleRoutesResponse> {
    try {
      const response = await fetch(ROUTES_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': 'routes.legs.steps.transitDetails,routes.legs.duration',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      // Log the full response for debugging
      console.log('Google Routes API Response:', JSON.stringify({
        status: response.status,
        ok: response.ok,
        data: data
      }, null, 2));

      // Check for API errors
      if (!response.ok || data.error) {
        const errorMessage = data.error?.message || 
          data.error?.details?.[0]?.message ||
          `Google Routes API error: ${response.status} - ${response.statusText}`;
        
        console.error('Google Routes API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          error: data.error,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        throw new ExternalApiError(errorMessage, 'google-routes');
      }

      return data as GoogleRoutesResponse;
    } catch (error) {
      if (error instanceof ExternalApiError) {
        throw error;
      }
      
      throw new ExternalApiError(
        `Failed to fetch routes: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'google-routes'
      );
    }
  }

  // Helper method to validate API key
  static validateApiKey(): boolean {
    return !!process.env.GOOGLE_MAPS_API_KEY;
  }

  // Helper method to get public API key for client-side Maps JavaScript API
  static getPublicApiKey(): string | undefined {
    // Note: For Maps JavaScript API, we need a different approach
    // This should be configured in the environment
    return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  }
}

// Singleton instance
let client: GoogleMapsClient | null = null;

export function getGoogleMapsClient(): GoogleMapsClient {
  if (!client) {
    client = new GoogleMapsClient();
  }
  return client;
}