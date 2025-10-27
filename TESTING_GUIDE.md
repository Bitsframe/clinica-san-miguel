# Testing Guide - Location Search Feature

## 🧪 How to Test

### Step 1: Start the Development Server
```bash
npm run dev
# or
yarn dev
```

### Step 2: Navigate to Locations Page
Open your browser and go to:
- Homepage locations section (scroll to locations)
- OR `/contact` page with location listings

### Step 3: Test the Search Functionality

## Test Scenarios

### ✅ Scenario 1: Search by Zipcode
1. Find the search input box
2. Type: `76010`
3. Wait 300ms (debounce delay)
4. **Expected Result**: 
   - API call to `https://api.zippopotam.us/us/76010`
   - Shows locations in Arlington, TX area

**Example Zipcodes to Test:**
- `76010` → Arlington, TX
- `77002` → Houston, TX
- `75201` → Dallas, TX
- `78201` → San Antonio, TX

---

### ✅ Scenario 2: Search by City Name
1. Type: `Dallas`
2. **Expected Result**: Shows all Dallas locations

**Try these:**
- `Dallas`
- `Houston`
- `San Antonio`
- `Arlington`

---

### ✅ Scenario 3: Search by Partial Address
1. Type: `Park Row`
2. **Expected Result**: Shows locations with "Park Row" in address

---

### ✅ Scenario 4: Combined Tab + Search
1. Click on "Houston" tab
2. Type: `77002`
3. **Expected Result**: Shows only Houston locations matching that zipcode

---

### ✅ Scenario 5: Invalid Zipcode
1. Type: `99999` (invalid zipcode)
2. **Expected Result**: 
   - API returns no data
   - Falls back to searching "99999" in address field
   - Shows no results (graceful handling)

---

### ✅ Scenario 6: Clear Search
1. Type something
2. Clear the input
3. **Expected Result**: Shows all locations again

---

### ✅ Scenario 7: Debounce Test
1. Type quickly: `7-6-0-1-0`
2. **Expected Result**: 
   - No API call until you stop typing for 300ms
   - Then makes ONE API call
   - Filters results

---

## 🔍 What to Check

### Visual Feedback
- [ ] Search input is visible
- [ ] Input accepts text
- [ ] Results update after typing stops (300ms)
- [ ] Loading skeleton shows while filtering (if loading state is shown)
- [ ] No results message appears if nothing matches (optional)

### Functionality
- [ ] Zipcode detection works (5 digits)
- [ ] API call is made for zipcodes
- [ ] City/state filtering works from API response
- [ ] Regular text search works
- [ ] Tab filters still work with search
- [ ] Clearing input resets to all locations
- [ ] Debouncing prevents excessive API calls

### Browser Console
Open DevTools (F12) and check:
- [ ] No console errors
- [ ] API calls visible in Network tab
- [ ] API response is correct
- [ ] No excessive API calls (should be debounced)

---

## 🐛 Common Issues & Solutions

### Issue: API call not happening
**Solution:** 
- Check internet connection
- Verify zipcode is exactly 5 digits
- Check browser console for errors

### Issue: No results shown
**Possible Reasons:**
1. No locations match the search
2. Database doesn't have address field populated
3. Zipcode is outside Texas (API returns data but no local locations)

**Debug:**
```javascript
console.log('Query:', query);
console.log('Zipcode Data:', zipcodeData);
console.log('Filtered:', filtered);
```

### Issue: Too many API calls
**Solution:** 
- Debounce should prevent this
- Check if debounce logic is working (300ms delay)
- Look for multiple re-renders

---

## 📸 Expected Behavior Screenshots

### Before Typing:
```
┌─────────────────────────────────────┐
│ Search by location or zipcode...   │ ← Empty input
└─────────────────────────────────────┘

[All] [Dallas] [Houston] [San Antonio]

📍 Clinica San Miguel - Dallas
📍 Clinica San Miguel - Houston  
📍 Clinica San Miguel - Arlington
... (all locations)
```

### After Typing "76010":
```
┌─────────────────────────────────────┐
│ 76010                               │ ← User typed
└─────────────────────────────────────┘

[All] [Dallas] [Houston] [San Antonio]

📍 Clinica San Miguel - Arlington
... (only Arlington locations)
```

---

## 🔬 Advanced Testing

### Test API Directly
Open browser console and run:
```javascript
// Test zipcode API
fetch('https://api.zippopotam.us/us/76010')
  .then(r => r.json())
  .then(data => console.log(data));

// Expected output:
// {
//   "post code": "76010",
//   "country": "United States",
//   "places": [{
//     "place name": "Arlington",
//     "state": "Texas",
//     "state abbreviation": "TX"
//   }]
// }
```

### Test Utility Functions
```javascript
import { isZipcode, lookupZipcode } from '@/utils/zipcodeService';

// Test zipcode detection
console.log(isZipcode("76010"));  // true
console.log(isZipcode("Dallas")); // false
console.log(isZipcode("1234"));   // false (too short)

// Test zipcode lookup
const data = await lookupZipcode("76010");
console.log(data);
// { zipcode: "76010", city: "Arlington", state: "Texas", stateAbbr: "TX" }
```

---

## ✅ Test Checklist

Print this and check off as you test:

- [ ] Search input is visible on locations page
- [ ] Search input is visible on contact page
- [ ] Can type in search input
- [ ] Typing triggers filtering (after 300ms)
- [ ] Zipcode "76010" shows Arlington locations
- [ ] Zipcode "77002" shows Houston locations
- [ ] City name "Dallas" shows Dallas locations
- [ ] Partial address search works
- [ ] Tab + Search combination works
- [ ] Invalid zipcode handled gracefully
- [ ] Clearing input resets to all locations
- [ ] No console errors
- [ ] API calls are debounced (max 1 per 300ms)
- [ ] Works on mobile view
- [ ] Works on tablet view
- [ ] Works on desktop view

---

## 📊 Performance Benchmarks

### Expected Metrics:
- **Debounce delay**: 300ms
- **API response time**: < 500ms
- **Filtering time**: < 50ms
- **Total time to results**: < 1 second

### How to Measure:
```javascript
// Add this temporarily in the filter effect
console.time('filterLocations');
// ... filtering code ...
console.timeEnd('filterLocations');
```

---

## 🎯 Success Criteria

The feature is working correctly if:
1. ✅ User can search by zipcode
2. ✅ API is called for zipcodes
3. ✅ Results are filtered correctly
4. ✅ Debouncing prevents excessive API calls
5. ✅ No errors in console
6. ✅ Works on all pages with locations

---

## 🚀 Ready to Test!

Follow the scenarios above and check off the test checklist. If all tests pass, the feature is production-ready! 🎉

