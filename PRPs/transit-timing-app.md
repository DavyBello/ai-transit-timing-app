name: "Next.js Transit Timing App - Optimal Departure Time Visualization"
description: |

## Purpose
Build a Next.js app that helps users minimize wait time for public transportation by visualizing the optimal departure time using a circular gauge, with real-time transit data from Google Maps Routes API.

## Core Principles
1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Follow all rules in CLAUDE.md for Next.js development

---

## Goal
Create a production-ready Next.js application that shows users the optimal time to leave their house to minimize downtime waiting for public transport (trains/metro/bus) using a visual circular gauge with green, orange, and red sections.

## Why
- **Business value**: Reduces commute stress and wasted time waiting at transit stops
- **User impact**: Visual, real-time guidance for optimal departure timing
- **Problems solved**: Eliminates guesswork in departure planning, reduces wait times

## What
A Next.js application with:
- Location inputs for origin and destination
- Maximum wait time preference setting
- Circular gauge showing departure timing (green = good time, orange = tight, red = long wait)
- Collapsible map view showing route and transit stations
- Real-time updates based on current transit schedules

### Success Criteria
- [ ] User can input origin, destination, and max wait time
- [ ] Gauge accurately reflects optimal departure times based on real transit data
- [ ] Map shows the complete route with transit stops
- [ ] App updates in real-time as transit schedules change
- [ ] Responsive design works on mobile and desktop
- [ ] All tests pass and code meets quality standards

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://nextjs.org/docs/app/getting-started
  why: Next.js 13+ App Router patterns and structure
  
- url: https://developers.google.com/maps/documentation/routes/transit-route
  why: Transit route requests, response format, time specifications
  
- url: https://developers.google.com/maps/documentation/routes/reference/rest/v2/TopLevel/computeRoutes
  why: Complete API reference for computeRoutes method
  
- url: https://github.com/palerdot/react-d3-speedometer
  why: Gauge component documentation and examples
  
- url: https://developers.google.com/maps/documentation/javascript/react-map
  why: Google Maps React integration patterns
  
- url: https://nextjs.org/docs/app/building-your-application/rendering/server-components
  why: Server vs client component patterns for API key security
  
- url: https://tailwindcss.com/docs/responsive-design
  why: Mobile-first responsive design patterns
```

### Current Codebase tree
```bash
.
├── CLAUDE.md
├── INITIAL.md
├── LICENSE
├── README.md
├── PRPs/
│   ├── EXAMPLE_multi_agent_prp.md
│   ├── templates/
│   │   └── prp_base.md
│   └── transit-timing-app.md
└── examples/
```

### Desired Codebase tree with files to be added
```bash
.
├── app/
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page with main UI
│   ├── api/
│   │   ├── routes/
│   │   │   └── transit/
│   │   │       └── route.ts     # API endpoint for Google Routes
│   │   └── maps/
│   │       └── route.ts         # API endpoint for map data
│   └── globals.css              # Global styles with Tailwind
├── components/
│   ├── DepartureGauge.tsx       # Circular gauge visualization
│   ├── LocationInputs.tsx       # Origin/destination form
│   ├── RouteMap.tsx            # Collapsible map component
│   ├── ui/
│   │   ├── button.tsx          # Reusable button component
│   │   ├── input.tsx           # Reusable input component
│   │   └── card.tsx            # Reusable card component
│   └── providers/
│       └── MapProvider.tsx      # Google Maps context provider
├── lib/
│   ├── google-maps.ts          # Google Maps API client
│   ├── transit-calculator.ts   # Transit timing calculations
│   ├── utils.ts                # Utility functions
│   └── types.ts                # TypeScript type definitions
├── hooks/
│   ├── useTransitData.ts       # Custom hook for transit data
│   └── useRealTimeUpdates.ts  # Hook for real-time updates
├── types/
│   ├── transit.ts              # Transit-specific types
│   └── google-maps.ts          # Google Maps API types
├── __tests__/
│   ├── components/
│   │   ├── DepartureGauge.test.tsx
│   │   └── LocationInputs.test.tsx
│   ├── api/
│   │   └── transit.test.ts
│   └── lib/
│       └── transit-calculator.test.ts
├── public/
│   └── (static assets)
├── .env.example                # Environment variables template
├── .env.local                  # Local environment variables
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
├── README.md                   # Updated documentation
└── jest.config.js              # Jest configuration

```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Google Maps API keys must be server-side only - never expose with NEXT_PUBLIC_
// CRITICAL: react-d3-speedometer requires dynamic imports in Next.js to avoid SSR issues
// CRITICAL: Routes API has rate limits - implement caching and throttling
// CRITICAL: Transit data can change frequently - implement smart polling intervals
// CRITICAL: Map components must be wrapped in "use client" directive
// CRITICAL: Routes API requires departure time within 7 days prior to 100 days after current time
// CRITICAL: Always validate API responses as transit data may be unavailable for some routes
```

## Implementation Blueprint

### Data models and structure

```typescript
// types/transit.ts - Core data structures
export interface LocationInput {
  address: string;
  placeId?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface TransitPreferences {
  origin: LocationInput;
  destination: LocationInput;
  maxWaitTime: number; // in minutes
}

export interface TransitRoute {
  departureTime: Date;
  arrivalTime: Date;
  duration: number; // in minutes
  waitTime: number; // in minutes
  steps: TransitStep[];
}

export interface TransitStep {
  mode: 'WALK' | 'TRANSIT';
  duration: number;
  distance?: number;
  transitDetails?: {
    stopName: string;
    lineName: string;
    vehicleType: string;
    departureTime: Date;
    arrivalTime: Date;
    numStops: number;
  };
}

export interface GaugeStatus {
  value: number; // 0-100
  status: 'green' | 'orange' | 'red';
  message: string;
  nextDepartureTime?: Date;
}
```

### List of tasks to be completed

```yaml
Task 1: Setup Next.js Project and Dependencies
CREATE next.config.js:
  - Configure environment variables (not NEXT_PUBLIC for API keys)
  - Add transpilePackages for react-d3-speedometer
  - Configure image domains for Google Maps

INSTALL dependencies:
  - npm create next-app@latest . --typescript --tailwind --app
  - npm install react-d3-speedometer @react-google-maps/api
  - npm install date-fns axios zod
  - npm install --save-dev @testing-library/react jest

Task 2: Create Environment Configuration
CREATE .env.example:
  - GOOGLE_MAPS_API_KEY=your_api_key_here
  - NEXT_PUBLIC_APP_URL=http://localhost:3000

CREATE lib/google-maps.ts:
  - Server-side Google Maps client setup
  - API key validation
  - Error handling for API failures

Task 3: Implement Transit API Route
CREATE app/api/routes/transit/route.ts:
  - PATTERN: Next.js 13+ route handlers
  - Accept POST with origin, destination, maxWaitTime
  - Call Google Routes API with proper headers
  - Calculate optimal departure times
  - Return structured transit data

Task 4: Create Location Input Component
CREATE components/LocationInputs.tsx:
  - PATTERN: Client component with "use client"
  - Google Places Autocomplete integration
  - Form validation with error states
  - Responsive design with Tailwind

Task 5: Implement Departure Gauge Component
CREATE components/DepartureGauge.tsx:
  - PATTERN: Dynamic import for SSR compatibility
  - Configure gauge with green/orange/red segments
  - Real-time value updates with smooth transitions
  - Accessible labels and ARIA attributes

Task 6: Build Route Map Component
CREATE components/RouteMap.tsx:
  - PATTERN: Client component with map provider
  - Display route polyline
  - Show transit stops with markers
  - Collapsible UI with smooth animations

Task 7: Create Transit Calculator Logic
CREATE lib/transit-calculator.ts:
  - Calculate wait times based on schedule
  - Determine gauge status (green/orange/red)
  - Find optimal departure windows
  - Handle edge cases (no transit available)

Task 8: Implement Real-time Updates
CREATE hooks/useRealTimeUpdates.ts:
  - Smart polling intervals (more frequent near departure)
  - WebSocket fallback for real-time data
  - Automatic retry with exponential backoff
  - Cleanup on unmount

Task 9: Add Comprehensive Tests
CREATE __tests__/:
  - Unit tests for calculator logic
  - Component tests with React Testing Library
  - API route tests with MSW
  - Integration tests for user flows

Task 10: Create Documentation and Polish
UPDATE README.md:
  - Setup instructions with API key guide
  - Architecture overview
  - Deployment instructions
  - Usage examples
```

### Per task pseudocode

```typescript
// Task 3: Transit API Route
// app/api/routes/transit/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // PATTERN: Validate request body with Zod
  const body = await request.json();
  const validated = transitRequestSchema.parse(body);
  
  // CRITICAL: Use server-side API key
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }
  
  // PATTERN: Call Routes API with proper error handling
  try {
    const routesResponse = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'routes.legs.steps.transitDetails,routes.legs.duration,routes.legs.startTime'
      },
      body: JSON.stringify({
        origin: { address: validated.origin },
        destination: { address: validated.destination },
        travelMode: 'TRANSIT',
        departureTime: new Date().toISOString(),
        computeAlternativeRoutes: true
      })
    });
    
    // GOTCHA: Routes API may return 200 with error in body
    const data = await routesResponse.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    // Calculate optimal departure based on max wait time
    const optimalDeparture = calculateOptimalDeparture(
      data.routes,
      validated.maxWaitTime
    );
    
    return NextResponse.json(optimalDeparture);
  } catch (error) {
    // PATTERN: Structured error responses
    return NextResponse.json(
      { error: 'Failed to fetch transit data' },
      { status: 500 }
    );
  }
}

// Task 5: Gauge Component with Dynamic Import
// components/DepartureGauge.tsx
'use client';

import dynamic from 'next/dynamic';
import { GaugeStatus } from '@/types/transit';

// CRITICAL: Dynamic import to avoid SSR issues
const ReactSpeedometer = dynamic(
  () => import('react-d3-speedometer'),
  { ssr: false }
);

export function DepartureGauge({ status }: { status: GaugeStatus }) {
  // PATTERN: Map status to gauge segments
  const segments = [
    { start: 0, end: 33, color: '#ef4444' },    // red
    { start: 33, end: 66, color: '#f59e0b' },   // orange
    { start: 66, end: 100, color: '#10b981' }   // green
  ];
  
  return (
    <div className="relative">
      <ReactSpeedometer
        value={status.value}
        minValue={0}
        maxValue={100}
        segments={3}
        customSegmentStops={[0, 33, 66, 100]}
        segmentColors={['#ef4444', '#f59e0b', '#10b981']}
        needleColor="#374151"
        currentValueText={status.message}
        // ACCESSIBILITY: Add ARIA labels
        aria-label={`Departure timing gauge showing ${status.status} status`}
      />
    </div>
  );
}

// Task 7: Transit Calculator
// lib/transit-calculator.ts
export function calculateOptimalDeparture(
  routes: TransitRoute[],
  maxWaitTime: number
): GaugeStatus {
  // Find next departure times from transit data
  const upcomingDepartures = extractDepartureTimes(routes);
  
  // Calculate wait time for leaving now
  const now = new Date();
  const nextDeparture = upcomingDepartures[0];
  const waitTime = differenceInMinutes(nextDeparture, now);
  
  // PATTERN: Determine gauge status based on wait time
  let status: GaugeStatus['status'];
  let value: number;
  
  if (waitTime <= maxWaitTime * 0.3) {
    status = 'green';
    value = 80; // Good time to leave
  } else if (waitTime <= maxWaitTime * 0.7) {
    status = 'orange';
    value = 50; // Tight but manageable
  } else {
    status = 'red';
    value = 20; // Long wait ahead
  }
  
  return {
    value,
    status,
    message: `${waitTime} min wait`,
    nextDepartureTime: nextDeparture
  };
}
```

### Integration Points
```yaml
ENVIRONMENT:
  - add to: .env.local
  - vars: |
      # Google Maps API (never use NEXT_PUBLIC_ for API keys)
      GOOGLE_MAPS_API_KEY=AIza...
      
      # App Configuration
      NEXT_PUBLIC_APP_URL=http://localhost:3000
      NEXT_PUBLIC_DEFAULT_MAX_WAIT=15
      
CONFIG:
  - next.config.js: |
      transpilePackages: ['react-d3-speedometer']
      images.domains: ['maps.googleapis.com']
  
  - tailwind.config.ts: |
      Extend colors for gauge status colors
      Add custom animations for smooth transitions
  
DEPENDENCIES:
  - Update package.json with:
    - "react-d3-speedometer": "^3.0.0"
    - "@react-google-maps/api": "^2.19.0"
    - "date-fns": "^3.0.0"
    - "zod": "^3.22.0"
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
npm run lint                    # ESLint checks
npm run type-check             # TypeScript validation

# Expected: No errors. If errors, READ and fix.
```

### Level 2: Unit Tests
```typescript
// __tests__/lib/transit-calculator.test.ts
describe('Transit Calculator', () => {
  it('returns green status for short wait times', () => {
    const result = calculateOptimalDeparture(mockRoutes, 15);
    expect(result.status).toBe('green');
    expect(result.value).toBeGreaterThan(66);
  });

  it('returns orange status for moderate wait times', () => {
    const result = calculateOptimalDeparture(mockRoutesModerate, 15);
    expect(result.status).toBe('orange');
    expect(result.value).toBeBetween(33, 66);
  });

  it('handles no available transit gracefully', () => {
    const result = calculateOptimalDeparture([], 15);
    expect(result.status).toBe('red');
    expect(result.message).toContain('No transit available');
  });
});

// __tests__/components/DepartureGauge.test.tsx
describe('DepartureGauge', () => {
  it('renders with correct color for status', () => {
    const { container } = render(
      <DepartureGauge status={{ value: 80, status: 'green', message: '3 min wait' }} />
    );
    expect(container.querySelector('[fill="#10b981"]')).toBeInTheDocument();
  });
});
```

```bash
# Run tests iteratively until passing:
npm test -- --coverage
# If failing: Debug specific test, fix code, re-run
```

### Level 3: Integration Test
```bash
# Start development server
npm run dev

# Test the app flow:
# 1. Enter origin: "Times Square, New York"
# 2. Enter destination: "Central Park, New York"
# 3. Set max wait time: 10 minutes
# 4. Verify gauge shows appropriate status
# 5. Click to expand map view
# 6. Verify route and stops are displayed

# Test API endpoint directly:
curl -X POST http://localhost:3000/api/routes/transit \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Times Square, New York",
    "destination": "Central Park, New York",
    "maxWaitTime": 10
  }'

# Expected: JSON response with transit data and gauge status
```

## Final Validation Checklist
- [ ] All tests pass: `npm test`
- [ ] No linting errors: `npm run lint`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Google Maps API key properly configured (server-side only)
- [ ] Gauge updates smoothly with real-time data
- [ ] Map shows correct route and transit stops
- [ ] Mobile responsive design works correctly
- [ ] Error states handled gracefully (no transit, API failures)
- [ ] Loading states provide good UX
- [ ] README includes clear setup instructions
- [ ] .env.example has all required variables

---

## Anti-Patterns to Avoid
- ❌ Don't expose Google Maps API key with NEXT_PUBLIC_
- ❌ Don't use sync imports for react-d3-speedometer
- ❌ Don't make API calls from client components
- ❌ Don't poll APIs too frequently (respect rate limits)
- ❌ Don't ignore TypeScript errors or use 'any'
- ❌ Don't forget error boundaries for graceful failures
- ❌ Don't hardcode transit schedules - use real-time data
- ❌ Don't skip accessibility attributes on interactive elements

## Confidence Score: 8/10

High confidence due to:
- Clear documentation for all required APIs
- Well-established Next.js patterns
- Popular gauge component with Next.js compatibility
- Comprehensive validation gates

Minor uncertainty:
- Specific transit schedule parsing may vary by region
- Real-time update frequency optimization requires testing

The implementation should successfully create a functional transit timing app with proper visualization and real-time updates following Next.js best practices.