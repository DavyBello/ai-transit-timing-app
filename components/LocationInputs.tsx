'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface LocationInputsProps {
  onSubmit: (origin: string, destination: string, maxWaitTime: number) => void;
  isLoading?: boolean;
}

export function LocationInputs({ onSubmit, isLoading = false }: LocationInputsProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [maxWaitTime, setMaxWaitTime] = useState(15);
  const [errors, setErrors] = useState<{
    origin?: string;
    destination?: string;
    maxWaitTime?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!origin.trim()) {
      newErrors.origin = 'Origin is required';
    }

    if (!destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (maxWaitTime < 1 || maxWaitTime > 120) {
      newErrors.maxWaitTime = 'Wait time must be between 1 and 120 minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(origin, destination, maxWaitTime);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Transit Timer</CardTitle>
        <p className="text-sm text-gray-600 text-center">
          Find the best time to leave for your transit journey
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="origin" className="text-sm font-medium text-gray-700">
              From
            </label>
            <Input
              id="origin"
              type="text"
              placeholder="Enter starting location"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className={errors.origin ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.origin && (
              <p className="text-sm text-red-500">{errors.origin}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="destination" className="text-sm font-medium text-gray-700">
              To
            </label>
            <Input
              id="destination"
              type="text"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={errors.destination ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.destination && (
              <p className="text-sm text-red-500">{errors.destination}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="maxWaitTime" className="text-sm font-medium text-gray-700">
              Maximum Wait Time (minutes)
            </label>
            <Input
              id="maxWaitTime"
              type="number"
              min="1"
              max="120"
              value={maxWaitTime}
              onChange={(e) => setMaxWaitTime(parseInt(e.target.value) || 15)}
              className={errors.maxWaitTime ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.maxWaitTime && (
              <p className="text-sm text-red-500">{errors.maxWaitTime}</p>
            )}
            <p className="text-xs text-gray-500">
              How long are you willing to wait for transit?
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Finding Routes...</span>
              </div>
            ) : (
              'Check Transit Times'
            )}
          </Button>
        </form>

        {/* Quick presets */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-medium text-gray-700 mb-2">Quick Examples:</p>
          <div className="space-y-1">
            <button
              type="button"
              className="text-xs text-blue-600 hover:text-blue-800 block"
              onClick={() => {
                setOrigin('Times Square, New York, NY');
                setDestination('Central Park, New York, NY');
              }}
              disabled={isLoading}
            >
              Times Square → Central Park
            </button>
            <button
              type="button"
              className="text-xs text-blue-600 hover:text-blue-800 block"
              onClick={() => {
                setOrigin('Union Station, Washington, DC');
                setDestination('White House, Washington, DC');
              }}
              disabled={isLoading}
            >
              Union Station → White House
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}