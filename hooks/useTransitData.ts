'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import { TransitApiResponse } from '@/types/transit';

// Helper function to parse date strings back to Date objects
function parseDatesInResponse(data: TransitApiResponse): TransitApiResponse {
  // Parse nextDepartureTime if it exists
  if (data.status.nextDepartureTime) {
    data.status.nextDepartureTime = new Date(data.status.nextDepartureTime);
  }
  
  // Parse route dates if they exist
  if (data.status.route) {
    data.status.route.departureTime = new Date(data.status.route.departureTime);
    data.status.route.arrivalTime = new Date(data.status.route.arrivalTime);
    
    // Parse step dates
    data.status.route.steps.forEach(step => {
      if (step.transitDetails) {
        if (step.transitDetails.departureTime) {
          step.transitDetails.departureTime = new Date(step.transitDetails.departureTime);
        }
        if (step.transitDetails.arrivalTime) {
          step.transitDetails.arrivalTime = new Date(step.transitDetails.arrivalTime);
        }
      }
    });
  }
  
  // Parse routes array dates
  data.routes.forEach(route => {
    route.departureTime = new Date(route.departureTime);
    route.arrivalTime = new Date(route.arrivalTime);
    
    route.steps.forEach(step => {
      if (step.transitDetails) {
        if (step.transitDetails.departureTime) {
          step.transitDetails.departureTime = new Date(step.transitDetails.departureTime);
        }
        if (step.transitDetails.arrivalTime) {
          step.transitDetails.arrivalTime = new Date(step.transitDetails.arrivalTime);
        }
      }
    });
  });
  
  return data;
}

interface UseTransitDataState {
  data: TransitApiResponse | null;
  isLoading: boolean;
  error: string | null;
}

export function useTransitData() {
  const [state, setState] = useState<UseTransitDataState>({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchTransitData = useCallback(async (
    origin: string,
    destination: string,
    maxWaitTime: number
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await axios.post<TransitApiResponse>('/api/routes/transit', {
        origin,
        destination,
        maxWaitTime,
      });

      // Parse date strings back to Date objects
      const parsedData = parseDatesInResponse(response.data);

      setState({
        data: parsedData,
        isLoading: false,
        error: null,
      });

      return parsedData;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || error.message
        : 'Failed to fetch transit data';

      setState({
        data: null,
        isLoading: false,
        error: errorMessage,
      });

      throw new Error(errorMessage);
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    fetchTransitData,
    reset,
  };
}