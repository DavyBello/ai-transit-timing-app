import { z } from 'zod';

// Zod schemas for request validation
export const TransitRequestSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  maxWaitTime: z.number().min(1).max(120).default(15),
});

export type TransitRequest = z.infer<typeof TransitRequestSchema>;

// Error types
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class ExternalApiError extends ApiError {
  constructor(message: string, public service: string) {
    super(message, 502, 'EXTERNAL_API_ERROR');
  }
}

// Utility types
export type AsyncReturnType<T extends (...args: unknown[]) => Promise<unknown>> =
  T extends (...args: unknown[]) => Promise<infer R> ? R : never;