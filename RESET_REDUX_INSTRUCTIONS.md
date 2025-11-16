# Reset Redux Persisted State

If you're not seeing dummy data in Completed/Expired job offers, it might be because Redux Persist is loading old cached data.

## Option 1: Clear App Data (Recommended)

### On iOS Simulator:
1. Device → Erase All Content and Settings
2. Or: Delete the app and reinstall

### On Android Emulator:
1. Long press the app icon
2. Select "App info"
3. Select "Storage"
4. Tap "Clear Data"

### On Physical Device:
- **iOS**: Delete and reinstall the app
- **Android**: Settings → Apps → SquadGoo → Storage → Clear Data

## Option 2: Add Clear Data Button (Developer Mode)

You can add a button in the app settings or developer menu to clear persisted state programmatically:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistor } from '@/store/store';

const clearReduxCache = async () => {
  await persistor.purge();
  await AsyncStorage.clear();
  // Then restart app or reload
};
```

## Option 3: Reload the App

After implementing the seedDummyData feature:
1. Completely close the app (swipe away from recent apps)
2. Reopen the app
3. Navigate to Completed/Expired offers tabs
4. Data should load automatically

## What Was Fixed

The app now automatically seeds dummy data when you navigate to Completed or Expired offers tabs if they're empty. The data includes:

### Completed Jobs (5 jobs):
- Commercial Kitchen Deep Clean
- Warehouse Inventory Management
- Garden Landscaping Project
- Office Renovation
- Event Setup & Cleanup

### Expired Jobs (4 jobs):
- Construction Site Laborer
- Retail Store Assistant
- Delivery Driver
- Hotel Housekeeping

Each job has full details, candidates, and realistic data!

