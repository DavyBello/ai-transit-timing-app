import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Parse duration string from Google Routes API (e.g., "1234s" to minutes)
export function parseDurationToMinutes(duration: string | undefined): number {
  if (!duration) return 0;
  const seconds = parseInt(duration.replace('s', ''), 10);
  return Math.round(seconds / 60);
}

// Format date to local time string
export function formatTime(date: Date | string | undefined): string {
  if (!date) {
    return 'Invalid time';
  }
  
  // Convert to Date object if it's a string
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (!dateObj || isNaN(dateObj.getTime())) {
    return 'Invalid time';
  }
  
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(dateObj);
}

// Format duration in minutes to human-readable string
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${mins} min`;
}

// Parse RFC3339 timestamp to Date
export function parseRFC3339(timestamp: string): Date {
  if (!timestamp) {
    return new Date();
  }
  
  const date = new Date(timestamp);
  
  // If the date is invalid, return current time as fallback
  if (isNaN(date.getTime())) {
    console.warn('Invalid timestamp received:', timestamp);
    return new Date();
  }
  
  return date;
}

// Get current time rounded to nearest minute
export function getCurrentTime(): Date {
  const now = new Date();
  now.setSeconds(0, 0);
  return now;
}

// Calculate wait time between now and next departure
export function calculateWaitTime(departureTime: Date, currentTime: Date = new Date()): number {
  const diffMs = departureTime.getTime() - currentTime.getTime();
  return Math.max(0, Math.round(diffMs / 60000)); // Convert to minutes
}