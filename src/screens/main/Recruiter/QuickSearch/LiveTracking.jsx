import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { selectActiveQuickJobById } from '@/store/quickSearchSlice';
import { LOCATION_STAGES, formatStageName, calculateETA } from '@/services/locationTrackingService';

const LiveTracking = ({ navigation, route }) => {
  const { jobId } = route.params || {};
  const activeJob = useSelector(state => selectActiveQuickJobById(state, jobId));
  
  const [location, setLocation] = useState(null);
  const [stage, setStage] = useState(LOCATION_STAGES.ACCEPTED);

  useEffect(() => {
    if (activeJob) {
      setLocation(activeJob.locationTracking?.currentLocation);
      setStage(activeJob.currentStage || activeJob.locationTracking?.stage || LOCATION_STAGES.ACCEPTED);
    }
  }, [activeJob]);

  if (!activeJob) {
    return (
      <View style={styles.container}>
        <AppHeader title="Live Tracking" showTopIcons={false} />
        <View style={styles.errorContainer}>
          <AppText variant={Variant.body} style={styles.errorText}>
            Job not found
          </AppText>
        </View>
      </View>
    );
  }

  const locationTracking = activeJob.locationTracking || {};
  const distanceFromHome = locationTracking.distanceFromHome || 0;
  const distanceFromWorkplace = locationTracking.distanceFromWorkplace || 0;
  
  // Calculate ETA if en route or approaching
  let eta = null;
  if ((stage === LOCATION_STAGES.EN_ROUTE || stage === LOCATION_STAGES.APPROACHING) && location) {
    const workplaceLocation = locationTracking.workplaceLocation;
    if (workplaceLocation) {
      eta = calculateETA(location, workplaceLocation);
    }
  }

  const getStageIcon = (currentStage) => {
    const icons = {
      [LOCATION_STAGES.ACCEPTED]: 'checkmark-circle',
      [LOCATION_STAGES.PREPARING]: 'time-outline',
      [LOCATION_STAGES.EN_ROUTE]: 'car-outline',
      [LOCATION_STAGES.APPROACHING]: 'navigate-outline',
      [LOCATION_STAGES.ARRIVED]: 'location',
    };
    return icons[currentStage] || 'location-outline';
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Live Location Tracking" showTopIcons={false} />
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Current Stage */}
        <View style={styles.stageContainer}>
          <View style={[styles.stageBadge, getStageBadgeStyle(stage)]}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName={getStageIcon(stage)}
              size={48}
              color={getStageColor(stage)}
            />
          </View>
          <AppText variant={Variant.subTitle} style={styles.stageTitle}>
            {formatStageName(stage)}
          </AppText>
          <AppText variant={Variant.body} style={styles.candidateName}>
            {activeJob.candidateName}
          </AppText>
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="map-outline"
              size={64}
              color={colors.gray}
            />
            <AppText variant={Variant.body} style={styles.mapText}>
              Map View
            </AppText>
            <AppText variant={Variant.caption} style={styles.mapSubText}>
              {location ? 'Location tracking active' : 'Waiting for location update...'}
            </AppText>
          </View>
        </View>

        {/* Location Information */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="home-outline"
              size={24}
              color={colors.primary}
            />
            <View style={styles.infoContent}>
              <AppText variant={Variant.caption} style={styles.infoLabel}>
                Distance from Home
              </AppText>
              <AppText variant={Variant.bodyMedium} style={styles.infoValue}>
                {distanceFromHome.toFixed(2)} km
              </AppText>
            </View>
          </View>

          <View style={styles.infoCard}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="business-outline"
              size={24}
              color={colors.primary}
            />
            <View style={styles.infoContent}>
              <AppText variant={Variant.caption} style={styles.infoLabel}>
                Distance to Workplace
              </AppText>
              <AppText variant={Variant.bodyMedium} style={styles.infoValue}>
                {distanceFromWorkplace.toFixed(2)} km
              </AppText>
            </View>
          </View>

          {eta && (
            <View style={styles.infoCard}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="time-outline"
                size={24}
                color={colors.primary}
              />
              <View style={styles.infoContent}>
                <AppText variant={Variant.caption} style={styles.infoLabel}>
                  Estimated Arrival
                </AppText>
                <AppText variant={Variant.bodyMedium} style={styles.infoValue}>
                  {eta} minutes
                </AppText>
              </View>
            </View>
          )}
        </View>

        {/* Status Info */}
        <View style={styles.statusContainer}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, styles.statusDotActive]} />
            <AppText variant={Variant.body} style={styles.statusText}>
              Location sharing active
            </AppText>
          </View>
          <AppText variant={Variant.caption} style={styles.statusSubText}>
            Updates every 30 seconds
          </AppText>
        </View>
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

export default LiveTracking;

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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: colors.gray,
  },
  stageContainer: {
    alignItems: 'center',
    marginBottom: hp(3),
    paddingVertical: hp(2),
  },
  stageBadge: {
    width: wp(24),
    height: wp(24),
    borderRadius: wp(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1.5),
  },
  stageTitle: {
    color: colors.secondary,
    fontSize: getFontSize(20),
    fontWeight: 'bold',
    marginBottom: hp(0.5),
  },
  candidateName: {
    color: colors.gray,
    fontSize: getFontSize(14),
  },
  mapContainer: {
    marginBottom: hp(3),
  },
  mapPlaceholder: {
    height: hp(30),
    backgroundColor: colors.grayE8 || '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
  },
  mapText: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '600',
    marginTop: hp(1),
  },
  mapSubText: {
    color: colors.gray,
    fontSize: getFontSize(12),
    marginTop: hp(0.5),
  },
  infoContainer: {
    marginBottom: hp(2),
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: wp(4),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
  },
  infoContent: {
    marginLeft: wp(3),
    flex: 1,
  },
  infoLabel: {
    color: colors.gray,
    fontSize: getFontSize(12),
    marginBottom: hp(0.3),
  },
  infoValue: {
    color: colors.secondary,
    fontSize: getFontSize(18),
    fontWeight: 'bold',
  },
  statusContainer: {
    marginTop: hp(2),
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
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
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  statusSubText: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
});

