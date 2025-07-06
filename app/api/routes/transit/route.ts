import { NextRequest, NextResponse } from 'next/server';
import { getGoogleMapsClient } from '@/lib/google-maps';
import { TransitRequestSchema, ApiError, ValidationError } from '@/lib/types';
import { 
  extractTransitRoutes, 
  calculateOptimalDeparture,
  analyzeTransitFrequency 
} from '@/lib/transit-calculator';
import { TransitApiResponse } from '@/types/transit';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = TransitRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { origin, destination, maxWaitTime } = validation.data;

    // Prepare Google Routes API request
    const routesRequest = {
      origin: {
        address: origin,
      },
      destination: {
        address: destination,
      },
      travelMode: 'TRANSIT',
    };

    console.log('Routes API Request:', JSON.stringify(routesRequest, null, 2));

    // Get Google Maps client and compute routes
    const client = getGoogleMapsClient();
    const routesResponse = await client.computeRoutes(routesRequest);

    // Extract transit routes from response
    const routes = extractTransitRoutes(routesResponse);

    if (routes.length === 0) {
      return NextResponse.json<TransitApiResponse>({
        status: {
          value: 0,
          status: 'red',
          message: 'No transit routes available',
        },
        routes: [],
      });
    }

    // Calculate optimal departure status
    const status = calculateOptimalDeparture(routes, maxWaitTime);

    // Analyze transit frequency for additional insights
    const frequency = analyzeTransitFrequency(routes);

    // Prepare response
    const response: TransitApiResponse = {
      status,
      routes: routes.slice(0, 5), // Return top 5 routes
    };

    // Add frequency data to response headers for client use
    const headers = new Headers();
    headers.set('X-Transit-Frequency', frequency.averageFrequency.toString());
    headers.set('X-Transit-Peak-Hours', frequency.peakHours.toString());

    return NextResponse.json(response, { headers });

  } catch (error) {
    console.error('Transit API error:', error);

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Failed to fetch transit data' },
      { status: 500 }
    );
  }
}

// OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}