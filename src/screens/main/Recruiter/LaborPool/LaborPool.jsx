import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { colors, hp, wp } from '@/theme';
import PoolHeader from '../../../../core/PoolHeader';
import WorkerCard from '@/components/Recruiter/LaborPool/WorkerCard';
import SendManualOfferModal from '@/components/Recruiter/ManualSearch/SendManualOfferModal';
import { screenNames } from '@/navigation/screenNames';
import { DUMMY_JOB_SEEKERS } from '@/utilities/dummyJobSeekers';
import { sendQuickOffer } from '@/store/quickSearchSlice';
import { showToast, toastTypes } from '@/utilities/toastConfig';

const LaborPoolScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const quickJobs = useSelector(state => state.quickSearch.quickJobs);
  const [offerModal, setOfferModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  // Transform dummy job seekers data to match WorkerCard props
  const workers = useMemo(() => {
    return DUMMY_JOB_SEEKERS.map((jobSeeker) => ({
      id: jobSeeker.id,
      name: jobSeeker.name,
      role: jobSeeker.preferredRoles?.[0] || 'General Worker',
      location: `${jobSeeker.suburb}, ${jobSeeker.location}${jobSeeker.radiusKm ? ` (${jobSeeker.radiusKm}km radius)` : ''}`,
      availability: jobSeeker.availability?.summary || 'Available',
      rate: `$${jobSeeker.payPreference?.min || 0}–${jobSeeker.payPreference?.max || 0}/hour`,
      rating: (jobSeeker.acceptanceRating / 10).toFixed(1), // Convert 92 to 9.2, 88 to 8.8, etc.
      // Keep original data for profile navigation
      originalData: jobSeeker,
    }));
  }, []);

  const handleView = (worker) => {
    // Navigate to candidate profile screen
    // Using QUICK_SEARCH_CANDIDATE_PROFILE which can display worker profiles
    // Pass worker.id as candidateId, jobId can be null/undefined for labor pool workers
    navigation.navigate(screenNames.QUICK_SEARCH_CANDIDATE_PROFILE, {
      candidateId: worker.id,
      jobId: null, // Labor pool workers don't have an associated job
      source: 'labor_pool', // Optional: to identify where the navigation came from
    });
  };

  const handleOffer = (worker) => {
    // Get the full candidate data from DUMMY_JOB_SEEKERS
    const candidateData = DUMMY_JOB_SEEKERS.find(js => js.id === worker.id);
    if (!candidateData) {
      Alert.alert('Error', 'Candidate data not found');
      return;
    }

    // Prepare candidate object for the modal
    const candidate = {
      id: candidateData.id,
      name: candidateData.name,
      matchPercentage: 0, // Labor pool workers don't have match percentage
      acceptanceRating: candidateData.acceptanceRating,
      payPreference: candidateData.payPreference,
      availability: candidateData.availability,
    };

    setSelectedWorker({ ...worker, candidate });
    setOfferModal(true);
  };

  const handleSendOffer = ({ expiresAt, message }) => {
    if (!selectedWorker) return;

    // Check if user has any active quick search jobs
    if (quickJobs.length === 0) {
      // No jobs available - navigate to create a job first
      Alert.alert(
        'Create Job First',
        'You need to create a job before sending an offer. Would you like to create a Quick Search job now?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setOfferModal(false) },
          {
            text: 'Create Job',
            onPress: () => {
              setOfferModal(false);
              // Navigate to Quick Search job creation
              navigation.navigate(screenNames.QUICK_SEARCH_STEPONE);
            },
          },
        ]
      );
      return;
    }

    // For labor pool, navigate to candidate profile where they can send the offer
    // This ensures proper matching and offer flow
    const jobId = quickJobs[0].id;
    setOfferModal(false);
    
    // Navigate to candidate profile with job context
    // The profile screen will handle sending the offer properly
    Alert.alert('Offer sent successfully')
    // navigation.navigate(screenNames.QUICK_SEARCH_CANDIDATE_PROFILE, {
    //   candidateId: selectedWorker.id,
    //   jobId,
    //   source: 'labor_pool',
    //   pendingOffer: {
    //     expiresAt,
    //     message,
    //   },
    // });
    
    setSelectedWorker(null);
  };

  return (
    <View style={styles.container}>
      <PoolHeader
        title="Labor Pool"
        leftIcon={{ name: 'Feather', iconName: 'arrow-left', onPress: () => navigation.goBack() }}
        containerStyle={{ backgroundColor: 'transparent' }}
        titleStyle={{ color: '#fff' }}
      />

      <FlatList
        data={workers}
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

      <SendManualOfferModal
        visible={offerModal}
        candidate={selectedWorker?.candidate}
        onClose={() => {
          setOfferModal(false);
          setSelectedWorker(null);
        }}
        onSubmit={handleSendOffer}
      />
    </View>
  );
};

export default LaborPoolScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  listContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
    paddingTop: hp(1),
  },
});

