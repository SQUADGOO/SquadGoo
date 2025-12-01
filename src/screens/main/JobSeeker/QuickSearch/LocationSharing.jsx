import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, AppState } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import AppButton from '@/core/AppButton';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { 
  selectActiveQuickJobById,
  updateLocationTracking,
} from '@/store/quickSearchSlice';
import { 
  startLocationTracking, 
  stopLocationTracking,
  getCurrentLocation,
  LOCATION_STAGES,
  formatStageName,
  calculateETA,
} from '@/services/locationTrackingService';
import { requestLocationPermission } from '@/permissions/LocationPermission';

const LocationSharing = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { jobId } = route.params || {};
  const activeJob = useSelector(state => selectActiveQuickJobById(state, jobId));
  
  const [currentStage, setCurrentStage] = useState(LOCATION_STAGES.ACCEPTED);
  const [location, setLocation] = useState(null);
  const [distanceFromHome, setDistanceFromHome] = useState(0);
  const [distanceFromWorkplace, setDistanceFromWorkplace] = useState(0);
  const [eta, setEta] = useState(null);
  const [preparationTimeRemaining, setPreparationTimeRemaining] = useState(1800); // 30 minutes
  const [isTracking, setIsTracking] = useState(false);
  
  const watchIdRef = useRef(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!activeJob) {
      Alert.alert('Error', 'Job not found');
      navigation.goBack();
      return;
    }

    // Initialize location tracking
    initializeTracking();

    // Handle app state changes
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground, restart tracking if needed
        if (isTracking) {
          initializeTracking();
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      if (watchIdRef.current) {
        stopLocationTracking(watchIdRef.current);
      }
      subscription?.remove();
    };
  }, []);

  const initializeTracking = async () => {
    // Request location permission
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Location Permission Required',
        'Please enable location permissions to use location sharing.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Get initial location
    try {
      const currentLoc = await getCurrentLocation();
      setLocation(currentLoc);
      
      // Start tracking
      startLocationTrackingForJob(currentLoc);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location. Please try again.');
    }
  };

  const startLocationTrackingForJob = (initialLocation) => {
    const homeLocation = activeJob.locationTracking?.homeLocation || {
      latitude: -33.8688, // Default Sydney coordinates
      longitude: 151.2093,
    };
    
    const workplaceLocation = {
      latitude: activeJob.locationTracking?.workplaceLocation?.latitude || -33.8688,
      longitude: activeJob.locationTracking?.workplaceLocation?.longitude || 151.2093,
    };

    const watchId = startLocationTracking(
      {
        homeLocation,
        workplaceLocation,
        updateInterval: 30000, // 30 seconds
        preparationTime: 1800, // 30 minutes
      },
      (update) => {
        setLocation(update.location);
        setCurrentStage(update.stage);
        setDistanceFromHome(update.distanceFromHome);
        setDistanceFromWorkplace(update.distanceFromWorkplace);
        setPreparationTimeRemaining(update.preparationTimeRemaining);

        // Calculate ETA
        if (update.stage === LOCATION_STAGES.EN_ROUTE || update.stage === LOCATION_STAGES.APPROACHING) {
          const calculatedETA = calculateETA(update.location, workplaceLocation);
          setEta(calculatedETA);
        }

        // Update Redux
        dispatch(updateLocationTracking({
          jobId: activeJob.id,
          location: update.location,
          stage: update.stage,
          distanceFromHome: update.distanceFromHome,
          distanceFromWorkplace: update.distanceFromWorkplace,
        }));
      },
      (stageChange) => {
        // Handle stage changes (notifications, etc.)
        console.log('Stage changed:', stageChange);
        if (stageChange.currentStage === LOCATION_STAGES.ARRIVED) {
          Alert.alert('Arrived!', 'You have arrived at the workplace. Location sharing will stop.');
        }
      }
    );

    watchIdRef.current = watchId;
    setIsTracking(true);
  };

  const handleStopSharing = () => {
    Alert.alert(
      'Stop Location Sharing',
      'Are you sure you want to stop sharing your location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Stop',
          style: 'destructive',
          onPress: () => {
            if (watchIdRef.current) {
              stopLocationTracking(watchIdRef.current);
              watchIdRef.current = null;
              setIsTracking(false);
            }
            navigation.goBack();
          },
        },
      ]
    );
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  const getStageIcon = (stage) => {
    const icons = {
      [LOCATION_STAGES.ACCEPTED]: 'checkmark-circle',
      [LOCATION_STAGES.PREPARING]: 'time-outline',
      [LOCATION_STAGES.EN_ROUTE]: 'car-outline',
      [LOCATION_STAGES.APPROACHING]: 'navigate-outline',
      [LOCATION_STAGES.ARRIVED]: 'location',
    };
    return icons[stage] || 'location-outline';
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Location Sharing" showTopIcons={false} />
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Current Stage */}
        <View style={styles.stageContainer}>
          <View style={[styles.stageBadge, getStageBadgeStyle(currentStage)]}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName={getStageIcon(currentStage)}
              size={32}
              color={getStageColor(currentStage)}
            />
          </View>
          <AppText variant={Variant.subTitle} style={styles.stageTitle}>
            {formatStageName(currentStage)}
          </AppText>
        </View>

        {/* Preparation Timer */}
        {currentStage === LOCATION_STAGES.PREPARING && preparationTimeRemaining > 0 && (
          <View style={styles.timerContainer}>
            <AppText variant={Variant.body} style={styles.timerLabel}>
              Preparation Time Remaining
            </AppText>
            <AppText variant={Variant.subTitle} style={styles.timerValue}>
              {formatTime(preparationTimeRemaining)}
            </AppText>
          </View>
        )}

        {/* Distance Information */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="home-outline"
              size={20}
              color={colors.primary}
            />
            <AppText variant={Variant.body} style={styles.infoText}>
              Distance from home: {distanceFromHome.toFixed(2)} km
            </AppText>
          </View>
          <View style={styles.infoRow}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="business-outline"
              size={20}
              color={colors.primary}
            />
            <AppText variant={Variant.body} style={styles.infoText}>
              Distance to workplace: {distanceFromWorkplace.toFixed(2)} km
            </AppText>
          </View>
          {eta && (
            <View style={styles.infoRow}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="time-outline"
                size={20}
                color={colors.primary}
              />
              <AppText variant={Variant.body} style={styles.infoText}>
                Estimated arrival: {eta} minutes
              </AppText>
            </View>
          )}
        </View>

        {/* Location Status */}
        <View style={styles.statusContainer}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, isTracking && styles.statusDotActive]} />
            <AppText variant={Variant.body} style={styles.statusText}>
              {isTracking ? 'Location sharing active' : 'Location sharing stopped'}
            </AppText>
          </View>
        </View>

        {/* Stop Sharing Button */}
        {currentStage === LOCATION_STAGES.ARRIVED && (
          <AppButton
            text="Stop Location Sharing"
            onPress={handleStopSharing}
            bgColor={colors.grayE8 || '#E5E7EB'}
            textColor={colors.secondary}
            style={styles.stopButton}
          />
        )}
      </ScrollView>
    </View>
  );
};

const getStageBadgeStyle = (stage) => {
  const stylesMap = {
    [LOCATION_STAGES.ACCEPTED]: { backgroundColor: '#E0D9E9' },
    [LOCATION_STAGES.PREPARING]: { backgroundColor: '#FEF3C7' },
    [LOCATION_STAGES.EN_ROUTE]: { backgroundColor: '#DBEAFE' },
    [LOCATION_STAGES.APPROACHING]: { backgroundColor: '#D1FAE5' },
    [LOCATION_STAGES.ARRIVED]: { backgroundColor: '#D1FAE5' },
  };
  return stylesMap[stage] || stylesMap[LOCATION_STAGES.ACCEPTED];
};

const getStageColor = (stage) => {
  const colorsMap = {
    [LOCATION_STAGES.ACCEPTED]: colors.primary,
    [LOCATION_STAGES.PREPARING]: '#F59E0B',
    [LOCATION_STAGES.EN_ROUTE]: '#3B82F6',
    [LOCATION_STAGES.APPROACHING]: '#10B981',
    [LOCATION_STAGES.ARRIVED]: '#10B981',
  };
  return colorsMap[stage] || colors.primary;
};

export default LocationSharing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: wp(5),
    paddingBottom: hp(4),
  },
  stageContainer: {
    alignItems: 'center',
    marginBottom: hp(3),
    paddingVertical: hp(3),
  },
  stageBadge: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1.5),
  },
  stageTitle: {
    color: colors.secondary,
    fontSize: getFontSize(20),
    fontWeight: 'bold',
  },
  timerContainer: {
    backgroundColor: colors.grayE8 || '#F3F4F6',
    borderRadius: 12,
    padding: wp(4),
    alignItems: 'center',
    marginBottom: hp(2),
  },
  timerLabel: {
    color: colors.gray,
    fontSize: getFontSize(14),
    marginBottom: hp(0.5),
  },
  timerValue: {
    color: colors.primary,
    fontSize: getFontSize(32),
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  infoText: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    marginLeft: wp(3),
  },
  statusContainer: {
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.gray,
    marginRight: wp(2),
  },
  statusDotActive: {
    backgroundColor: '#10B981',
  },
  statusText: {
    color: colors.gray,
    fontSize: getFontSize(14),
  },
  stopButton: {
    marginTop: hp(2),
  },
});

