# Location Search Feature

## Overview
Is feature se users apni location ka **zipcode** ya **location name** daal kar clinics search kar sakte hain. Yeh feature third-party API (Zippopotam.us) use karta hai zipcode se city aur state information fetch karne ke liye.

## Features

### 1. **Real-time Search**
- User jaise hi search input mein type kare, locations automatically filter ho jati hain
- Search works on:
  - Location name (e.g., "Dallas", "Houston")
  - Full address
  - **Zipcode** (e.g., "76010", "77002")

### 2. **Smart Zipcode Detection**
- Jab user 5-digit zipcode enter kare, system automatically:
  1. Detect karta hai ke yeh zipcode hai
  2. Zippopotam.us API se city aur state information fetch karta hai
  3. Us city/state ke basis par locations filter karta hai

### 3. **City/Region Tabs**
- Pre-defined tabs for quick filtering:
  - All locations
  - Dallas
  - Houston
  - San Antonio

## Implementation Details

### Files Modified

1. **`sections/Locations/GroupedLocations.tsx`**
   - Main locations page with search
   - Zipcode API integration
   - Real-time filtering

2. **`app/[locale]/(root)/contact/constants.tsx`**
   - Contact page locations
   - Same search functionality

3. **`utils/zipcodeService.ts`** (NEW)
   - Zipcode lookup utility
   - Uses Zippopotam.us free API
   - Functions:
     - `lookupZipcode(zipcode)` - Returns city, state, zipcode data
     - `isZipcode(input)` - Checks if input is a valid 5-digit zipcode

### How It Works

#### Example 1: Zipcode Search
```
User types: "76010"
↓
System detects: This is a zipcode
↓
API call: https://api.zippopotam.us/us/76010
↓
API returns: { city: "Arlington", state: "Texas", stateAbbr: "TX" }
↓
Filter locations: Show all locations in Arlington or with TX in address
```

#### Example 2: Name Search
```
User types: "Dallas"
↓
System detects: This is NOT a zipcode
↓
Filter locations: Show all locations with "Dallas" in title or address
```

## Code Example

### Basic Usage
```typescript
import { lookupZipcode, isZipcode } from "@/utils/zipcodeService";

// Check if input is zipcode
if (isZipcode("76010")) {
  // Fetch zipcode data
  const data = await lookupZipcode("76010");
  console.log(data);
  // Output: { zipcode: "76010", city: "Arlington", state: "Texas", stateAbbr: "TX" }
}
```

### Filtering Logic
```typescript
// Filter locations based on query
if (isZipcode(query)) {
  const zipcodeData = await lookupZipcode(query);
  
  if (zipcodeData) {
    filtered = locations.filter((loc) =>
      loc.title?.toLowerCase().includes(zipcodeData.city.toLowerCase()) ||
      loc.address?.toLowerCase().includes(zipcodeData.city.toLowerCase()) ||
      loc.address?.includes(query) // exact zipcode match
    );
  }
} else {
  // Regular text search
  filtered = locations.filter((loc) =>
    loc.title?.toLowerCase().includes(query.toLowerCase()) ||
    loc.address?.toLowerCase().includes(query.toLowerCase())
  );
}
```

## API Details

### Zippopotam.us API
- **Free** and **no authentication** required
- Rate limit: Reasonable for production use
- Endpoint: `https://api.zippopotam.us/us/{zipcode}`
- Response format:
```json
{
  "post code": "76010",
  "country": "United States",
  "country abbreviation": "US",
  "places": [
    {
      "place name": "Arlington",
      "longitude": "-97.1081",
      "state": "Texas",
      "state abbreviation": "TX",
      "latitude": "32.7357"
    }
  ]
}
```

## Testing

### Test Cases

1. **Valid Zipcode**: Type "77002" → Should show Houston locations
2. **Invalid Zipcode**: Type "99999" → Should show no results or all locations
3. **City Name**: Type "Dallas" → Should show Dallas locations
4. **Partial Match**: Type "San" → Should show San Antonio locations
5. **Combined with Tabs**: Select "Houston" tab + type "77002" → Should show Houston locations only

## Future Enhancements

1. **Auto-complete**: Show suggestions as user types
2. **Geolocation**: Auto-detect user's location
3. **Distance sorting**: Sort by nearest location
4. **Map integration**: Show filtered results on map in real-time
5. **Multiple zipcodes**: Accept comma-separated zipcodes

## Troubleshooting

### Issue: API not responding
- Check internet connection
- API might be down temporarily
- Falls back to regular address search

### Issue: No results for valid zipcode
- Check if locations have proper address format in database
- Ensure address field includes city and state

## Dependencies

- No additional npm packages required
- Uses native `fetch` API
- Works on both client and server side (but called on client side in this implementation)

---

**Developer Notes:**
- API calls are cached by browser
- Search is debounced to prevent excessive API calls
- Graceful fallback if API fails

