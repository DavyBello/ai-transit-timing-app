# Transit Timer 🚌

A Next.js application that helps users find the optimal time to leave their house to minimize waiting for public transport. Built with real-time transit data from Google Maps Routes API and featuring an intuitive departure gauge visualization.

## 🚀 Features

- **Smart Departure Timing**: Visual gauge showing optimal departure windows
- **Real-time Transit Data**: Live updates from Google Maps Routes API
- **Interactive UI**: Clean, responsive design with loading states
- **Route Visualization**: Detailed transit information with step-by-step directions
- **Mobile-First**: Fully responsive design for all devices
- **TypeScript**: Type-safe development with comprehensive error handling

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with react-d3-speedometer
- **API Integration**: Google Maps Routes API
- **State Management**: React hooks with real-time updates
- **Validation**: Zod for request validation
- **Date Handling**: date-fns for time calculations

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd transit-timing-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Google Maps API**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - Routes API
     - Maps JavaScript API (for future map integration)
     - Places API (for autocomplete enhancement)
   - Create an API key with the appropriate restrictions
   - Add your API key to `.env.local`:
     ```
     GOOGLE_MAPS_API_KEY=your_api_key_here
     ```

## 🚀 Getting Started

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Test the application**
   - Enter origin and destination locations
   - Set your maximum wait time preference
   - View the departure gauge and route details

## 📁 Project Structure

```
├── app/
│   ├── api/routes/transit/     # Transit API route handler
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main page component
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── DepartureGauge.tsx      # Circular gauge visualization
│   ├── LocationInputs.tsx      # Input form component
│   └── RouteMap.tsx            # Route details component
├── hooks/
│   ├── useTransitData.ts       # Transit data management
│   └── useRealTimeUpdates.ts   # Real-time polling logic
├── lib/
│   ├── google-maps.ts          # Google Maps API client
│   ├── transit-calculator.ts   # Transit timing calculations
│   ├── utils.ts                # Utility functions
│   └── types.ts                # Validation schemas
├── types/
│   ├── transit.ts              # Transit-specific types
│   └── google-maps.ts          # Google Maps API types
└── __tests__/                  # Test files (planned)
```

## 🎯 How It Works

1. **User Input**: Enter origin, destination, and maximum acceptable wait time
2. **API Call**: Server-side route handler calls Google Routes API for transit data
3. **Calculation**: Algorithm calculates optimal departure timing based on real-time schedules
4. **Visualization**: Gauge displays color-coded recommendations:
   - 🟢 **Green**: Good time to leave (minimal wait)
   - 🟡 **Orange**: Moderate wait time (acceptable)
   - 🔴 **Red**: Long wait time (consider waiting)
5. **Real-time Updates**: Automatic polling for schedule changes

## 🔧 Configuration

### Environment Variables

```bash
# Required
GOOGLE_MAPS_API_KEY=your_api_key_here

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_MAX_WAIT=15
```

### Google Cloud Setup

1. **Enable APIs**:
   - Routes API (required)
   - Maps JavaScript API (future enhancement)
   - Places API (future enhancement)

2. **API Key Restrictions** (recommended):
   - HTTP referrers: `localhost:3000/*`, `yourdomain.com/*`
   - API restrictions: Limit to enabled APIs only

## 📱 Usage Examples

### Basic Usage
```typescript
// Input examples that work well:
Origin: "Times Square, New York, NY"
Destination: "Central Park, New York, NY"
Max Wait Time: 10 minutes
```

### API Usage
```bash
curl -X POST http://localhost:3000/api/routes/transit \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Union Station, Washington, DC",
    "destination": "White House, Washington, DC", 
    "maxWaitTime": 15
  }'
```

## 🧪 Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Next.js recommended configuration
- **Prettier**: Code formatting (configured via ESLint)

## 🚧 Future Enhancements

- [ ] Google Places autocomplete integration
- [ ] Interactive map visualization
- [ ] Favorite routes and locations
- [ ] Push notifications for departure alerts
- [ ] Multiple transportation modes
- [ ] Accessibility improvements
- [ ] Offline support with cached routes
- [ ] User authentication and preferences

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Maps Platform](https://developers.google.com/maps) for transit data
- [react-d3-speedometer](https://github.com/palerdot/react-d3-speedometer) for gauge visualization
- [Next.js](https://nextjs.org/) for the application framework
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

If you encounter any issues or have questions:

1. Check the [GitHub Issues](../../issues) for existing solutions
2. Create a new issue with detailed information
3. For API-related issues, verify your Google Cloud setup

---

**Built with ❤️ using Next.js, TypeScript, and the Google Maps Platform**
