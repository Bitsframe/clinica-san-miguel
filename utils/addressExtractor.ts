export interface ExtractedAddress {
  state: string;
  zip: string;
  streetAddress: string;
}

export function extractStateZip(address: string): ExtractedAddress | null {
  if (!address || typeof address !== 'string') {
    return null;
  }

  // Regex: Match state (2 letters) and zipcode (5 or 9 digits) at end
  const regex = /\b([A-Z]{2})\s(\d{5}(?:-\d{4})?)$/i;
  const match = address.trim().match(regex);

  if (!match) {
    return null;
  }

  // Extract clean street address (without state and zipcode)
  const streetAddress = address.trim().replace(regex, '').trim();

  return {
    state: match[1].toUpperCase(),
    zip: match[2],
    streetAddress: streetAddress
  };
}
