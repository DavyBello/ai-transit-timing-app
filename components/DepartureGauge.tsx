'use client';

import dynamic from 'next/dynamic';
import { GaugeStatus } from '@/types/transit';
import { formatTime } from '@/lib/utils';

// Dynamic import to avoid SSR issues
const ReactSpeedometer = dynamic(
  () => import('react-d3-speedometer'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64 w-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }
);

interface DepartureGaugeProps {
  status: GaugeStatus;
  isLoading?: boolean;
}

export function DepartureGauge({ status, isLoading = false }: DepartureGaugeProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-pulse bg-gray-200 rounded-full h-64 w-64"></div>
        <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
      </div>
    );
  }

  // Map status to colors
  const getStatusColor = (status: GaugeStatus['status']) => {
    switch (status) {
      case 'green':
        return '#10b981'; // green-500
      case 'orange':
        return '#f59e0b'; // amber-500
      case 'red':
        return '#ef4444'; // red-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  const statusColor = getStatusColor(status.status);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <ReactSpeedometer
          value={status.value}
          minValue={0}
          maxValue={100}
          segments={3}
          customSegmentStops={[0, 33, 66, 100]}
          segmentColors={['#ef4444', '#f59e0b', '#10b981']}
          needleColor="#374151"
          textColor="#374151"
          width={280}
          height={200}
          currentValueText=""
          needleTransitionDuration={1000}
          ringWidth={47}
          paddingHorizontal={17}
          paddingVertical={17}
        />
        
        {/* Center text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div 
            className="text-lg font-semibold"
            style={{ color: statusColor }}
          >
            {status.message}
          </div>
          {status.nextDepartureTime && (
            <div className="text-sm text-gray-500 mt-1">
              Next: {formatTime(status.nextDepartureTime)}
            </div>
          )}
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center space-x-2">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: statusColor }}
          aria-label={`Status: ${status.status}`}
        />
        <span className="text-sm font-medium capitalize">
          {status.status === 'green' ? 'Good Time' : 
           status.status === 'orange' ? 'Moderate Wait' : 
           'Long Wait'}
        </span>
      </div>

      {/* Route details */}
      {status.route && (
        <div className="text-xs text-gray-500 text-center max-w-xs">
          <div>Duration: {Math.round(status.route.duration)} min</div>
          <div>
            {formatTime(status.route.departureTime)} → {formatTime(status.route.arrivalTime)}
          </div>
        </div>
      )}
    </div>
  );
}