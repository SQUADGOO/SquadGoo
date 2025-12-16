import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { colors, hp, wp } from '@/theme';
import PoolHeader from '../../../../core/PoolHeader';
import WorkerCard from '@/components/Recruiter/LaborPool/WorkerCard';
import { screenNames } from '@/navigation/screenNames';
import { DUMMY_SQUADS } from '@/utilities/dummySquads';

const SquadPoolScreen = ({ navigation }) => {
  // Transform dummy squads data to match WorkerCard props
  const squads = useMemo(() => {
    return DUMMY_SQUADS.map((squad) => ({
      id: squad.id,
      name: squad.name,
      role: `${squad.memberCount} member${squad.memberCount > 1 ? 's' : ''} • ${squad.preferredJobs?.[0] || 'General'}`,
      location: `${squad.suburb}, ${squad.location}${squad.radiusKm ? ` (${squad.radiusKm}km radius)` : ''}`,
      availability: squad.availability?.summary || 'Flexible',
      rate: `$${squad.payPreference?.min || 0}–${squad.payPreference?.max || 0}/hour`,
      rating: (squad.averageRating / 10).toFixed(1), // Convert to 0-10 scale
      // Keep original data for navigation
      originalData: squad,
    }));
  }, []);

  const handleView = (squad) => {
    // Navigate to profile with squad information
    navigation.navigate(screenNames.QUICK_SEARCH_CANDIDATE_PROFILE, {
      squadId: squad.id,
      candidateId: squad.originalData?.memberIds?.[0] || null, // First member as fallback
      jobId: null,
      source: 'squad_pool',
    });
  };

  const handleOffer = (squad) => {
    // TODO: Implement offer creation for squad
    console.log('Offer to squad:', squad);
  };

  return (
    <View style={styles.container}>
      <PoolHeader
        title="Squad Pool"
        leftIcon={{ name: 'Feather', iconName: 'arrow-left', onPress: () => navigation.goBack() }}
        containerStyle={{ backgroundColor: 'transparent' }}
        titleStyle={{ color: '#fff' }}
      />

      <FlatList
        data={squads}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <WorkerCard
            name={item.name}
            role={item.role}
            location={item.location}
            availability={item.availability}
            rate={item.rate}
            rating={item.rating}
            onView={() => handleView(item)}
            onOffer={() => handleOffer(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SquadPoolScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  listContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
    paddingTop: hp(1),
  },
});
