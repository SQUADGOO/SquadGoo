import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { colors, hp, wp } from '@/theme';
import PoolHeader from '../../../../core/PoolHeader';
import WorkerCard from '@/components/Recruiter/LaborPool/WorkerCard';
import SendManualOfferModal from '@/components/Recruiter/ManualSearch/SendManualOfferModal';
import { screenNames } from '@/navigation/screenNames';
import { DUMMY_EMPLOYEES } from '@/utilities/dummyEmployees';
import { sendQuickOffer } from '@/store/quickSearchSlice';
import { showToast, toastTypes } from '@/utilities/toastConfig';

const Employees = ({ navigation }) => {
  const dispatch = useDispatch();
  const quickJobs = useSelector(state => state.quickSearch.quickJobs);
  const [offerModal, setOfferModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Transform dummy employees data to match WorkerCard props
  const employees = useMemo(() => {
    return DUMMY_EMPLOYEES.map((employee) => ({
      id: employee.id,
      name: employee.name,
      role: employee.preferredRoles?.[0] || 'Employee',
      location: `${employee.suburb}, ${employee.location}${employee.radiusKm ? ` (${employee.radiusKm}km radius)` : ''}`,
      availability: employee.availability?.summary || 'Available',
      rate: `$${employee.payPreference?.min || 0}–${employee.payPreference?.max || 0}/hour`,
      rating: (employee.acceptanceRating / 10).toFixed(1), // Convert 92 to 9.2, 88 to 8.8, etc.
      // Keep original data for profile navigation
      originalData: employee,
    }));
  }, []);

  const handleView = (employee) => {
    // Navigate to candidate profile screen
    navigation.navigate(screenNames.QUICK_SEARCH_CANDIDATE_PROFILE, {
      candidateId: employee.id,
      jobId: null, // Employees don't have an associated job
      source: 'employees_pool', // To identify where the navigation came from
    });
  };

  const handleOffer = (employee) => {
    // Get the full candidate data from DUMMY_EMPLOYEES
    const candidateData = DUMMY_EMPLOYEES.find(e => e.id === employee.id);
    if (!candidateData) {
      Alert.alert('Error', 'Employee data not found');
      return;
    }

    // Prepare candidate object for the modal
    const candidate = {
      id: candidateData.id,
      name: candidateData.name,
      matchPercentage: 0, // Employees don't have match percentage
      acceptanceRating: candidateData.acceptanceRating,
      payPreference: candidateData.payPreference,
      availability: candidateData.availability,
    };

    setSelectedEmployee({ ...employee, candidate });
    setOfferModal(true);
  };

  const handleSendOffer = ({ expiresAt, message }) => {
    if (!selectedEmployee) return;

    // Check if user has any active quick search jobs
    if (quickJobs.length === 0) {
      // No jobs available - navigate to create a job first
      Alert.alert(
        'Create Job First',
        'You need to create a job before sending an offer. Would you like to create a Quick Search job now?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Create Job',
            onPress: () => {
              setOfferModal(false);
              navigation.navigate(screenNames.QUICK_SEARCH_STEPONE, {
                pendingOffer: {
                  candidateId: selectedEmployee.id,
                  candidateName: selectedEmployee.name,
                  expiresAt,
                  message,
                },
              });
            },
          },
        ]
      );
      return;
    }

    const jobId = quickJobs[0].id;

    dispatch(
      sendQuickOffer({
        jobId,
        candidateId: selectedEmployee.id,
        expiresAt,
        message,
        autoSent: false,
      })
    );

    showToast('Offer sent successfully', 'Success', toastTypes.success);
    setOfferModal(false);
    setSelectedEmployee(null);

    navigation.navigate(screenNames.QUICK_SEARCH_ACTIVE_OFFERS_RECRUITER, {
      jobId,
    });
  };

  return (
    <View style={styles.container}>
      <PoolHeader
        title="Employees"
        leftIcon={{ name: 'Feather', iconName: 'arrow-left', onPress: () => navigation.goBack() }}
        containerStyle={{ backgroundColor: 'transparent' }}
        titleStyle={{ color: '#fff' }}
      />

      <FlatList
        data={employees}
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
        candidate={selectedEmployee?.candidate}
        onClose={() => {
          setOfferModal(false);
          setSelectedEmployee(null);
        }}
        onSubmit={handleSendOffer}
      />
    </View>
  );
};

export default Employees;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  listContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
    paddingTop: hp(1),
  },
});

