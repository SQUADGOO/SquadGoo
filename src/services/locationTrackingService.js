import Geolocation from '@react-native-community/geolocation';
import { calculateDistance } from './quickSearchMatching';

// Location tracking stages
export const LOCATION_STAGES = {
  ACCEPTED: 'accepted',
  PREPARING: 'preparing',
  EN_ROUTE: 'en_route',
  APPROACHING: 'approaching',
  ARRIVED: 'arrived',
};

/**
 * Calculate distance between two coordinates
 * @param {Object} coord1 - { latitude, longitude }
 * @param {Object} coord2 - { latitude, longitude }
 * @returns {number} Distance in kilometers
 */
const getDistance = (coord1, coord2) => {
  if (!coord1 || !coord2 || !coord1.latitude || !coord2.latitude) {
    return Infinity;
  }
  return calculateDistance(coord1, coord2);
};

/**
 * Determine current location stage
 * @param {Object} currentLocation - Current GPS coordinates
 * @param {Object} homeLocation - Home coordinates
 * @param {Object} workplaceLocation - Workplace coordinates
 * @param {string} currentStage - Current stage
 * @param {number} preparationTimeRemaining - Time remaining for preparation (seconds)
 * @returns {string} Current stage
 */
export const determineLocationStage = (
  currentLocation,
  homeLocation,
  workplaceLocation,
  currentStage = LOCATION_STAGES.ACCEPTED,
  preparationTimeRemaining = 0
) => {
  if (!currentLocation || !currentLocation.latitude) {
    return currentStage;
  }

  // If already arrived, stay at arrived
  if (currentStage === LOCATION_STAGES.ARRIVED) {
    return LOCATION_STAGES.ARRIVED;
  }

  // Calculate distances
  const distanceFromHome = homeLocation ? getDistance(currentLocation, homeLocation) : Infinity;
  const distanceFromWorkplace = workplaceLocation ? getDistance(currentLocation, workplaceLocation) : Infinity;

  // Stage 5: Arrived (within 100m of workplace)
  if (distanceFromWorkplace <= 0.1) {
    return LOCATION_STAGES.ARRIVED;
  }

  // Stage 4: Approaching (within 5km of workplace)
  if (distanceFromWorkplace <= 5 && currentStage !== LOCATION_STAGES.ACCEPTED && currentStage !== LOCATION_STAGES.PREPARING) {
    return LOCATION_STAGES.APPROACHING;
  }

  // Stage 3: En route (5km+ from home)
  if (distanceFromHome >= 5 && currentStage !== LOCATION_STAGES.ACCEPTED && currentStage !== LOCATION_STAGES.PREPARING) {
    return LOCATION_STAGES.EN_ROUTE;
  }

  // Stage 2: Preparing (still at home, within preparation time)
  if (distanceFromHome < 1 && preparationTimeRemaining > 0) {
    return LOCATION_STAGES.PREPARING;
  }

  // Stage 1: Accepted (default)
  return LOCATION_STAGES.ACCEPTED;
};

/**
 * Get current location
 * @returns {Promise<Object>} { latitude, longitude } or null
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  });
};

/**
 * Start location tracking
 * @param {Object} options - Tracking options
 * @param {Function} onLocationUpdate - Callback for location updates
 * @param {Function} onStageChange - Callback for stage changes
 * @returns {number} Watch ID for stopping
 */
export const startLocationTracking = (
  options = {},
  onLocationUpdate,
  onStageChange
) => {
  const {
    homeLocation,
    workplaceLocation,
    updateInterval = 30000, // 30 seconds
    preparationTime = 1800, // 30 minutes in seconds
  } = options;

  let watchId = null;
  let startTime = Date.now();
  let lastStage = LOCATION_STAGES.ACCEPTED;
  let lastLocation = null;

  const watchOptions = {
    enableHighAccuracy: true,
    distanceFilter: 10, // Update every 10 meters
    interval: updateInterval,
  };

  watchId = Geolocation.watchPosition(
    (position) => {
      const currentLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      };

      lastLocation = currentLocation;

      // Calculate time remaining for preparation
      const elapsed = (Date.now() - startTime) / 1000;
      const preparationTimeRemaining = Math.max(0, preparationTime - elapsed);

      // Determine current stage
      const currentStage = determineLocationStage(
        currentLocation,
        homeLocation,
        workplaceLocation,
        lastStage,
        preparationTimeRemaining
      );

      // Calculate distances
      const distanceFromHome = homeLocation ? getDistance(currentLocation, homeLocation) : 0;
      const distanceFromWorkplace = workplaceLocation ? getDistance(currentLocation, workplaceLocation) : 0;

      // Call update callback
      if (onLocationUpdate) {
        onLocationUpdate({
          location: currentLocation,
          stage: currentStage,
          distanceFromHome,
          distanceFromWorkplace,
          preparationTimeRemaining,
        });
      }

      // Call stage change callback if stage changed
      if (currentStage !== lastStage && onStageChange) {
        onStageChange({
          previousStage: lastStage,
          currentStage,
          location: currentLocation,
          distanceFromHome,
          distanceFromWorkplace,
        });
      }

      lastStage = currentStage;
    },
    (error) => {
      console.error('Location tracking error:', error);
    },
    watchOptions
  );

  return watchId;
};

/**
 * Stop location tracking
 * @param {number} watchId - Watch ID from startLocationTracking
 */
export const stopLocationTracking = (watchId) => {
  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
  }
};

/**
 * Calculate ETA to workplace
 * @param {Object} currentLocation - Current coordinates
 * @param {Object} workplaceLocation - Workplace coordinates
 * @param {number} averageSpeed - Average speed in km/h (default: 50)
 * @returns {number} ETA in minutes
 */
export const calculateETA = (currentLocation, workplaceLocation, averageSpeed = 50) => {
  if (!currentLocation || !workplaceLocation) {
    return null;
  }

  const distance = getDistance(currentLocation, workplaceLocation);
  if (distance === Infinity || distance === 0) {
    return null;
  }

  // Calculate time in hours, then convert to minutes
  const timeInHours = distance / averageSpeed;
  return Math.ceil(timeInHours * 60);
};

/**
 * Format stage name for display
 * @param {string} stage - Stage constant
 * @returns {string} Formatted stage name
 */
export const formatStageName = (stage) => {
  const stageNames = {
    [LOCATION_STAGES.ACCEPTED]: 'Offer Accepted',
    [LOCATION_STAGES.PREPARING]: 'Preparing',
    [LOCATION_STAGES.EN_ROUTE]: 'En Route',
    [LOCATION_STAGES.APPROACHING]: 'Approaching Workplace',
    [LOCATION_STAGES.ARRIVED]: 'Arrived at Workplace',
  };
  return stageNames[stage] || stage;
};

// Export stage constants for use in components
export { LOCATION_STAGES };

