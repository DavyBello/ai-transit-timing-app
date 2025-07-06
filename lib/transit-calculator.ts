import { differenceInMinutes } from 'date-fns';
import { 
  TransitRoute, 
  TransitStep, 
  GaugeStatus, 
  GoogleRoutesResponse 
} from '@/types/transit';
import { 
  parseDurationToMinutes, 
  parseRFC3339, 
  calculateWaitTime,
  getCurrentTime 
} from './utils';

export function extractTransitRoutes(response: GoogleRoutesResponse): TransitRoute[] {
  if (!response.routes || response.routes.length === 0) {
    return [];
  }

  return response.routes.map(route => {
    const leg = route.legs[0]; // For now, we only support single-leg journeys
    console.log('Processing leg:', leg);
    
    // Find the first transit step to get actual departure time
    const firstTransitStep = leg.steps.find(step => step.transitDetails);
    const lastTransitStep = leg.steps.reverse().find(step => step.transitDetails);
    leg.steps.reverse(); // restore original order
    
    // Parse start and end times from transit details or use current time as fallback
    console.log('First transit step:', firstTransitStep);
    console.log('Last transit step:', lastTransitStep);
    
    const departureTime = firstTransitStep?.transitDetails?.stopDetails?.departureTime 
      ? parseRFC3339(firstTransitStep.transitDetails.stopDetails.departureTime)
      : new Date();
    
    const arrivalTime = lastTransitStep?.transitDetails?.stopDetails?.arrivalTime
      ? parseRFC3339(lastTransitStep.transitDetails.stopDetails.arrivalTime)
      : new Date(departureTime.getTime() + parseDurationToMinutes(leg.duration) * 60000);
    
    console.log('Parsed departure time:', departureTime);
    console.log('Parsed arrival time:', arrivalTime);
    
    // Calculate duration and wait time
    const duration = parseDurationToMinutes(leg.duration);
    const waitTime = calculateWaitTime(departureTime);

    // Process steps
    const steps: TransitStep[] = leg.steps.map(step => {
      const baseStep: TransitStep = {
        mode: step.transitDetails ? 'TRANSIT' : 'WALK',
        duration: parseDurationToMinutes(step.staticDuration || step.duration) * 60, // Convert back to seconds
        distance: step.distanceMeters,
        polyline: step.polyline?.encodedPolyline,
      };

      if (step.transitDetails) {
        const details = step.transitDetails;
        baseStep.transitDetails = {
          stopName: details.stopDetails?.departureStop?.name || '',
          departureStop: {
            name: details.stopDetails?.departureStop?.name || '',
            location: {
              lat: details.stopDetails?.departureStop?.location.latLng.latitude || 0,
              lng: details.stopDetails?.departureStop?.location.latLng.longitude || 0,
            },
          },
          arrivalStop: {
            name: details.stopDetails?.arrivalStop?.name || '',
            location: {
              lat: details.stopDetails?.arrivalStop?.location.latLng.latitude || 0,
              lng: details.stopDetails?.arrivalStop?.location.latLng.longitude || 0,
            },
          },
          lineName: details.transitLine?.name || '',
          lineShortName: details.transitLine?.nameShort,
          vehicleType: details.transitLine?.vehicle?.type || 'UNKNOWN',
          departureTime: parseRFC3339(details.stopDetails?.departureTime || ''),
          arrivalTime: parseRFC3339(details.stopDetails?.arrivalTime || ''),
          numStops: details.stopCount || 0,
          agencyName: details.transitLine?.agencies?.[0]?.name,
          lineColor: details.transitLine?.color,
        };
      }

      return baseStep;
    });

    return {
      departureTime,
      arrivalTime,
      duration,
      waitTime,
      steps,
      polyline: route.polyline?.encodedPolyline || leg.polyline?.encodedPolyline,
    };
  });
}

export function calculateOptimalDeparture(
  routes: TransitRoute[],
  maxWaitTime: number
): GaugeStatus {
  if (!routes || routes.length === 0) {
    return {
      value: 0,
      status: 'red',
      message: 'No transit available',
    };
  }

  // Sort routes by departure time
  const sortedRoutes = [...routes].sort((a, b) => 
    a.departureTime.getTime() - b.departureTime.getTime()
  );

  // Find the next available route
  const now = getCurrentTime();
  const nextRoute = sortedRoutes.find(route => 
    route.departureTime.getTime() > now.getTime()
  );

  if (!nextRoute) {
    return {
      value: 0,
      status: 'red',
      message: 'No upcoming departures',
    };
  }

  // Calculate wait time
  const waitTime = calculateWaitTime(nextRoute.departureTime, now);

  // Determine gauge status based on wait time
  let status: GaugeStatus['status'];
  let value: number;
  let message: string;

  if (waitTime <= maxWaitTime * 0.3) {
    // Green zone: 0-30% of max wait time
    status = 'green';
    value = 85 + (15 * (1 - waitTime / (maxWaitTime * 0.3))); // 85-100
    message = waitTime === 0 ? 'Leave now!' : `Good time to leave (${waitTime} min wait)`;
  } else if (waitTime <= maxWaitTime * 0.7) {
    // Orange zone: 30-70% of max wait time
    status = 'orange';
    const orangeProgress = (waitTime - maxWaitTime * 0.3) / (maxWaitTime * 0.4);
    value = 40 + (45 * (1 - orangeProgress)); // 40-85
    message = `Moderate wait (${waitTime} min)`;
  } else if (waitTime <= maxWaitTime) {
    // Red zone (acceptable): 70-100% of max wait time
    status = 'red';
    const redProgress = (waitTime - maxWaitTime * 0.7) / (maxWaitTime * 0.3);
    value = 20 + (20 * (1 - redProgress)); // 20-40
    message = `Long wait (${waitTime} min)`;
  } else {
    // Red zone (unacceptable): > max wait time
    status = 'red';
    value = Math.max(0, 20 - (waitTime - maxWaitTime)); // 0-20
    message = `Very long wait (${waitTime} min)`;
  }

  return {
    value,
    status,
    message,
    nextDepartureTime: nextRoute.departureTime,
    route: nextRoute,
  };
}

// Find optimal departure windows based on frequency of transit
export function findOptimalWindows(
  routes: TransitRoute[],
  maxWaitTime: number,
  windowSize: number = 120 // 2 hours
): Array<{ start: Date; end: Date; avgWaitTime: number }> {
  const windows: Array<{ start: Date; end: Date; avgWaitTime: number }> = [];
  const now = getCurrentTime();
  
  // Group routes by departure time windows
  for (let i = 0; i < windowSize; i += 15) { // Check every 15 minutes
    const windowStart = new Date(now.getTime() + i * 60000);
    const windowEnd = new Date(windowStart.getTime() + 15 * 60000);
    
    // Find routes departing within this window
    const windowRoutes = routes.filter(route => {
      const depTime = route.departureTime.getTime();
      return depTime >= windowStart.getTime() && depTime < windowEnd.getTime();
    });
    
    if (windowRoutes.length > 0) {
      // Calculate average wait time for this window
      const avgWaitTime = windowRoutes.reduce((sum, route) => 
        sum + calculateWaitTime(route.departureTime, windowStart), 0
      ) / windowRoutes.length;
      
      if (avgWaitTime <= maxWaitTime) {
        windows.push({ start: windowStart, end: windowEnd, avgWaitTime });
      }
    }
  }
  
  return windows;
}

// Get transit frequency analysis
export function analyzeTransitFrequency(routes: TransitRoute[]): {
  averageFrequency: number; // minutes between departures
  peakHours: boolean;
  nextThreeDepartures: Date[];
} {
  if (routes.length < 2) {
    return {
      averageFrequency: 0,
      peakHours: false,
      nextThreeDepartures: routes.map(r => r.departureTime),
    };
  }

  // Sort by departure time
  const sorted = [...routes].sort((a, b) => 
    a.departureTime.getTime() - b.departureTime.getTime()
  );

  // Calculate average frequency
  let totalGap = 0;
  let gapCount = 0;
  
  for (let i = 1; i < sorted.length; i++) {
    const gap = differenceInMinutes(sorted[i].departureTime, sorted[i - 1].departureTime);
    if (gap > 0 && gap < 120) { // Ignore gaps larger than 2 hours
      totalGap += gap;
      gapCount++;
    }
  }

  const averageFrequency = gapCount > 0 ? totalGap / gapCount : 60;

  // Determine if it's peak hours (frequency < 15 minutes)
  const peakHours = averageFrequency < 15;

  // Get next three departures
  const now = getCurrentTime();
  const nextThreeDepartures = sorted
    .filter(route => route.departureTime.getTime() > now.getTime())
    .slice(0, 3)
    .map(route => route.departureTime);

  return {
    averageFrequency,
    peakHours,
    nextThreeDepartures,
  };
}