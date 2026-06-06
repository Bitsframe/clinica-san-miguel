/**
 * Zipcode Service - Uses Zippopotam.us API for free zipcode lookup
 * This service helps users search locations by entering a zipcode
 */

export interface ZipcodeData {
  zipcode: string;
  city: string;
  state: string;
  stateAbbr: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Fetches location information from a US zipcode using Zippopotam.us API
 * @param zipcode - 5-digit US zipcode
 * @returns Location data or null if not found
 */
export async function lookupZipcode(zipcode: string): Promise<ZipcodeData | null> {
  try {
    // Remove any non-digit characters
    const cleanZipcode = zipcode.replace(/\D/g, '');
    
    // Validate zipcode format (must be 5 digits)
    if (cleanZipcode.length !== 5) {
      return null;
    }

    const response = await fetch(`https://api.zippopotam.us/us/${cleanZipcode}`);
    
    if (!response.ok) {
      // Silently fail for invalid zipcodes
      return null;
    }

    const data = await response.json();
    
    if (data.places && data.places.length > 0) {
      const place = data.places[0];
      return {
        zipcode: data['post code'],
        city: place['place name'],
        state: place['state'],
        stateAbbr: place['state abbreviation'],
        latitude: parseFloat(place['latitude']),
        longitude: parseFloat(place['longitude']),
      };
    }
    
    return null;
  } catch (error) {
    // Silently fail - invalid zipcode
    return null;
  }
}

/**
 * First 5 digits for lookup. Supports ZIP+4; skips 10-digit strings (typical US phone).
 */
export function normalizeZip5(input: string): string | null {
  const d = input.replace(/\D/g, "");
  if (d.length < 5) return null;
  if (d.length === 10) return null;
  if (d.length > 10) return null;
  return d.slice(0, 5);
}

/**
 * True when input should run “nearest by ZIP” (5–9 digits after stripping non-digits, not a 10-digit phone).
 */
export function isZipcode(input: string): boolean {
  return normalizeZip5(input) !== null;
}

/**
 * Shorter debounce while typing digits (ZIP) so distances feel realtime; longer for name/address search.
 */
export function zipSearchDebounceMs(rawQuery: string): number {
  const t = rawQuery.trim();
  if (t.length === 0) return 300;
  if (/^\d+$/.test(t) && t.length <= 9) return 80;
  return 300;
}

/** True when the user is typing a numeric ZIP but has not entered 5 digits yet. */
export function isPartialNumericZipInput(q: string): boolean {
  const t = q.trim();
  return /^\d+$/.test(t) && t.length > 0 && t.length < 5;
}

/** Normalize distance from API / DB (number or numeric string). */
export function parseDistanceMiles(value: unknown): number | undefined {
  let n: number | undefined;
  if (typeof value === "number" && Number.isFinite(value)) {
    n = value;
  } else if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) n = parsed;
  }
  if (n === undefined) return undefined;
  return Math.round(n * 10) / 10;
}

export function formatDistanceMiles(miles: number): string {
  return miles < 10 ? miles.toFixed(1) : Math.round(miles).toString();
}

/**
 * Extract zipcode from address string
 * @param address - Full address string
 * @returns Zipcode or null
 */
export function extractZipcodeFromAddress(address: string | null): string | null {
  if (!address) return null;
  
  // Match 5-digit zipcode in address
  const match = address.match(/\b\d{5}\b/);
  return match ? match[0] : null;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of point 1
 * @param lon1 - Longitude of point 1
 * @param lat2 - Latitude of point 2
 * @param lon2 - Longitude of point 2
 * @returns Distance in miles
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Find nearest locations to a given zipcode
 * @param userZipcode - User's zipcode
 * @param locations - Array of locations
 * @param limit - Number of locations to return (default: 3)
 * @returns Array of nearest locations with distance
 */
export async function findNearestLocations(
  userZipcode: string,
  locations: any[],
  limit: number = 3
): Promise<Array<any & { distance: number }>> {
  try {
    const zip5 = normalizeZip5(userZipcode);
    if (!zip5) {
      return [];
    }

    // Get user's zipcode coordinates
    const userLocation = await lookupZipcode(zip5);
    
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      // User zipcode invalid - return empty
      return [];
    }

    // Calculate distance for each location (in parallel)
    const locationsWithDistance = await Promise.all(
      locations.map(async (location) => {
        try {
          // Extract zipcode from location address
          const locationZipcode = extractZipcodeFromAddress(location.address);
          
          if (!locationZipcode) {
            return null; // Skip this location
          }

          // Get location coordinates
          const locationData = await lookupZipcode(locationZipcode);
          
          if (!locationData || !locationData.latitude || !locationData.longitude) {
            return null; // Skip invalid zipcode
          }

          // Calculate distance
          const distance = calculateDistance(
            userLocation.latitude!,
            userLocation.longitude!,
            locationData.latitude!,
            locationData.longitude!
          );

          return { ...location, distance };
        } catch (error) {
          // Skip this location if any error
          return null;
        }
      })
    );

    // Filter out null values, sort by distance, and take top N
    const validLocations = locationsWithDistance
      .filter((loc): loc is any & { distance: number } => loc !== null)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    return validLocations;
  } catch (error) {
    // Silently fail
    return [];
  }
}

/**
 * Uses POST /api/locations/nearest-by-zip (OpenAI geocoding + haversine on the server).
 * Falls back to {@link findNearestLocations} if the request fails or returns no rows.
 */
export async function findNearestLocationsForZipSearch(
  userZipcode: string,
  locations: any[],
  limit: number = 9
): Promise<Array<any & { distance: number }>> {
  const zip = normalizeZip5(userZipcode);
  if (!zip) {
    return [];
  }

  const apiBase =
    typeof window !== "undefined" ? window.location.origin : "";

  try {
    const res = await fetch(`${apiBase}/api/locations/nearest-by-zip`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zip, limit, locations }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        return data.results;
      }
    }
  } catch {
    // use fallback below
  }

  return findNearestLocations(userZipcode, locations, limit);
}

