'use client';

import React, { useState } from 'react';
import { TransitRoute } from '@/types/transit';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { formatTime, formatDuration } from '@/lib/utils';

interface RouteMapProps {
  route: TransitRoute | null;
  origin: string;
  destination: string;
}

export function RouteMap({ route, origin, destination }: RouteMapProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!route) {
    return null;
  }

  return (
    <div className="w-full max-w-md">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="outline"
        className="w-full mb-4"
      >
        {isExpanded ? 'Hide Route Details' : 'Show Route Details'}
      </Button>

      {isExpanded && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Route Overview</CardTitle>
            <div className="text-sm text-gray-600">
              <div>{origin}</div>
              <div className="text-center my-1">↓</div>
              <div>{destination}</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Route Summary */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium">Departure</div>
                <div>{formatTime(route.departureTime)}</div>
              </div>
              <div>
                <div className="font-medium">Arrival</div>
                <div>{formatTime(route.arrivalTime)}</div>
              </div>
              <div>
                <div className="font-medium">Duration</div>
                <div>{formatDuration(route.duration)}</div>
              </div>
              <div>
                <div className="font-medium">Wait Time</div>
                <div>{route.waitTime} min</div>
              </div>
            </div>

            {/* Step-by-step directions */}
            <div>
              <h4 className="font-medium mb-2">Directions</h4>
              <div className="space-y-2">
                {route.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3 text-sm">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${
                      step.mode === 'TRANSIT' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}>
                      {step.mode === 'TRANSIT' ? '🚌' : '🚶'}
                    </div>
                    <div className="flex-1">
                      {step.mode === 'TRANSIT' && step.transitDetails ? (
                        <div>
                          <div className="font-medium">
                            {step.transitDetails.lineName} {step.transitDetails.lineShortName}
                          </div>
                          <div className="text-gray-600">
                            {step.transitDetails.vehicleType} • {step.transitDetails.numStops} stops
                          </div>
                          <div className="text-xs text-gray-500">
                            {step.transitDetails.departureStop.name} → {step.transitDetails.arrivalStop.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatTime(step.transitDetails.departureTime)} - {formatTime(step.transitDetails.arrivalTime)}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium">Walk</div>
                          <div className="text-gray-600">
                            {Math.round(step.duration / 60)} min • {step.distance ? `${Math.round(step.distance)}m` : ''}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Placeholder for future map integration */}
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="text-gray-500 text-sm">
                🗺️ Interactive map view coming soon
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Will show route visualization with transit stops
              </div>
            </div>

            {/* Alternative routes hint */}
            <div className="text-xs text-gray-500 text-center">
              Showing the recommended route. Multiple routes may be available.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}