'use client';

import React, { useState, useCallback } from 'react';
import { LocationInputs } from '@/components/LocationInputs';
import { DepartureGauge } from '@/components/DepartureGauge';
import { RouteMap } from '@/components/RouteMap';
import { useTransitData } from '@/hooks/useTransitData';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';

export default function Home() {
  const [currentSearch, setCurrentSearch] = useState<{
    origin: string;
    destination: string;
    maxWaitTime: number;
  } | null>(null);

  const { data, isLoading, error, fetchTransitData } = useTransitData();

  // Real-time updates
  const handleRealTimeUpdate = useCallback(() => {
    if (currentSearch) {
      fetchTransitData(
        currentSearch.origin,
        currentSearch.destination,
        currentSearch.maxWaitTime
      ).catch(error => {
        console.error('Real-time update failed:', error);
      });
    }
  }, [currentSearch, fetchTransitData]);

  useRealTimeUpdates({
    enabled: !!data && !isLoading,
    onUpdate: handleRealTimeUpdate,
    nextDepartureTime: data?.status?.nextDepartureTime,
    baseInterval: 60,
  });

  const handleSubmit = useCallback(async (
    origin: string,
    destination: string,
    maxWaitTime: number
  ) => {
    setCurrentSearch({ origin, destination, maxWaitTime });
    
    try {
      await fetchTransitData(origin, destination, maxWaitTime);
    } catch (error) {
      // Error is handled by the hook
      console.error('Transit data fetch failed:', error);
    }
  }, [fetchTransitData]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Transit Timer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find the perfect time to leave your house and minimize waiting for public transport. 
            Get real-time guidance with our smart departure gauge.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Left Panel - Input Form */}
          <div className="w-full lg:w-auto flex-shrink-0">
            <LocationInputs 
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
            
            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-sm text-red-600">
                  <strong>Error:</strong> {error}
                </div>
                <div className="text-xs text-red-500 mt-1">
                  Please check your locations and try again.
                </div>
              </div>
            )}
          </div>

          {/* Center Panel - Gauge */}
          {(data || isLoading) && (
            <div className="flex-1 flex flex-col items-center space-y-6">
              <DepartureGauge
                status={data?.status || {
                  value: 0,
                  status: 'red',
                  message: 'Loading...',
                }}
                isLoading={isLoading}
              />

              {/* Last updated indicator */}
              {data && !isLoading && (
                <div className="text-xs text-gray-500 text-center">
                  Last updated: {new Date().toLocaleTimeString()}
                  <br />
                  <span className="text-green-600">● Live updates enabled</span>
                </div>
              )}
            </div>
          )}

          {/* Right Panel - Route Details */}
          {data && currentSearch && (
            <div className="w-full lg:w-auto flex-shrink-0">
              <RouteMap
                route={data.status.route || null}
                origin={currentSearch.origin}
                destination={currentSearch.destination}
              />
            </div>
          )}
        </div>

        {/* Instructions */}
        {!data && !isLoading && !error && (
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                How It Works
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="text-center">
                  <div className="text-2xl mb-2">📍</div>
                  <div className="font-medium">Enter Locations</div>
                  <div>Set your origin, destination, and maximum wait time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-medium">Check the Gauge</div>
                  <div>Green means good time to leave, red means long wait</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🚌</div>
                  <div className="font-medium">View Route</div>
                  <div>See detailed transit information and timing</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <div>
            Powered by Google Maps Routes API • Real-time transit data
          </div>
          <div className="mt-1">
            Built with Next.js, TypeScript, and Tailwind CSS
          </div>
        </footer>
      </div>
    </main>
  );
}
