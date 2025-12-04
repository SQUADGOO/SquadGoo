import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { applyToOffer, declineActiveOffer, initializeDummyData as initializeOffersData } from '@/store/jobSeekerOffersSlice';
import { addCandidateToJob, clearDummyJobs, updateJobStatus } from '@/store/jobsSlice';
import { addNotification } from '@/store/notificationsSlice';
import RbSheetComponent from '@/core/RbSheetComponent';
import AppText from '@/core/AppText';
import AppInputField from '@/core/AppInputField';
import AppDropDown from '@/core/AppDropDown';
import { colors, hp, wp, getFontSize } from '@/theme';
import Pressable from '@/core/Pressable';
import ReactNative from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { screenNames } from '@/navigation/screenNames';
import JobSeekerJobCard from '@/components/JobSeeker/JobCard';
import { showToast, toastTypes } from '@/utilities/toastConfig';

const JobSeekerActiveJob = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation()
  const route = useRoute()

  const { type } = route?.params || {}
  const isCompleted = type === 'completed';
  
  // Get current user info for candidate creation
  const userInfo = useSelector(state => state?.auth?.userInfo || {});
  
  // Fetch jobs based on type
  const recruiterJobs = useSelector(state => state?.jobs?.activeJobs || []);
  const completedOffers = useSelector(state => state?.jobSeekerOffers?.completedOffers || []);
  const acceptedOffers = useSelector(state => state?.jobSeekerOffers?.acceptedOffers || []);
  const declinedOffers = useSelector(state => state?.jobSeekerOffers?.declinedOffers || []);
  
  // Clear any existing dummy jobs and only show real jobs posted by recruiters
  React.useEffect(() => {
    // Remove dummy jobs on mount to ensure clean state
    dispatch(clearDummyJobs());
    
    // Initialize dummy data only for completed offers if needed
    if (completedOffers.length === 0 && isCompleted) {
      dispatch(initializeOffersData());
    }
  }, []);

  // Debug logs
  React.useEffect(() => {
    console.log('=== Job Seeker Active Job Debug ===');
    console.log('isCompleted:', isCompleted);
    console.log('recruiterJobs count:', recruiterJobs.length);
    console.log('completedOffers count:', completedOffers.length);
    console.log('recruiterJobs:', recruiterJobs);
    console.log('completedOffers:', completedOffers);
  }, [isCompleted, recruiterJobs, completedOffers]);
  
  // Transform jobs to match job seeker UI format
  const jobOffers = React.useMemo(() => {
    const sourceJobs = isCompleted ? completedOffers : recruiterJobs;
    console.log('sourceJobs count:', sourceJobs.length);
    const transformed = sourceJobs.map(job => ({
      ...job,
      // Map jobDescription to description for UI compatibility
      description: job.jobDescription || job.description || 'No description provided',
      // Add default image if missing
      image: job.image || null,
    }));
    console.log('transformed jobOffers count:', transformed.length);
    return transformed;
  }, [recruiterJobs, completedOffers, isCompleted]);
  const [filters, setFilters] = React.useState({
    minSalary: '',
    maxSalary: '',
    minExp: '',
    maxExp: '',
    city: '',
  });
  const [isCityOpen, setIsCityOpen] = React.useState(false);
  const [postRange, setPostRange] = React.useState('all');
  const [isPostOpen, setIsPostOpen] = React.useState(false);
  const sheetRef = React.useRef(null);

  const onAccept = (job) => {
    const isQuickOffer = job?.searchType?.toLowerCase?.() === 'quick';
    const actionLabel = isQuickOffer ? 'Accept' : 'Apply';
    const alertTitle = isQuickOffer ? 'Accept Job Offer' : 'Apply to Job';
    const alertMessage = isQuickOffer
      ? `Are you sure you want to accept "${job.title}"?`
      : `Are you sure you want to apply for "${job.title}"?`;

    Alert.alert(
      alertTitle,
      alertMessage,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: actionLabel,
          onPress: () => {
            // Create candidate object from current user
            const currentCandidateId = userInfo?.candidateId || userInfo?._id || `candidate-${job.id}-${Date.now()}`;
            const candidate = {
              id: currentCandidateId,
              name: userInfo.name || (userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : 'Job Seeker'),
              email: userInfo.email || '',
              phone: userInfo.phone || '',
              experience: userInfo.experience || 'Not specified',
              location: userInfo.location || userInfo.address || 'Not specified',
              status: 'accepted', // Job seeker accepted
              appliedAt: new Date().toISOString(),
            };
            
            // Add candidate to recruiter's job with autoAccept flag
            dispatch(addCandidateToJob({ jobId: job.id, candidate, autoAccept: true }));
            
            // Update job status to matched (match making is complete)
            dispatch(updateJobStatus({ jobId: job.id, status: 'matched' }));
            
            // Add to job seeker's accepted offers
            dispatch(applyToOffer(job));
            
            // Create notification for recruiter (if recruiter is logged in, they'll see it)
            dispatch(addNotification({
              type: isQuickOffer ? 'offer_accepted' : 'application_received',
              title: isQuickOffer ? 'Offer Accepted' : 'New Application Received',
              message: isQuickOffer
                ? `${candidate.name} accepted the quick offer for "${job.title}".`
                : `${candidate.name} has applied for "${job.title}"`,
              jobId: job.id,
              candidateId: candidate.id,
              userId: 'recruiter', // In real app, this would be the recruiter's user ID
            }));
            
            showToast(
              isQuickOffer ? 'Job offer accepted successfully!' : 'Job application submitted successfully!',
              'Success',
              toastTypes.success
            );
          },
        },
      ]
    );
  };

  const onDecline = (job) => {
    Alert.alert(
      'Decline Job',
      'Are you sure you want to decline this job offer?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            // Pass the full job object to track declined jobs properly
            dispatch(declineActiveOffer(job));
            showToast('Job offer declined', 'Info', toastTypes.info);
          },
        },
      ]
    );
  };

  const openFilter = () => {
    sheetRef.current?.open();
  };

  const applyFilters = () => {
    sheetRef.current?.close();
  };

  const resetFilters = () => {
    setFilters({ minSalary: '', maxSalary: '', minExp: '', maxExp: '', city: '' });
  };

  const cities = [
    { label: 'All Australia', value: '' },
    { label: 'Sydney', value: 'Sydney' },
    { label: 'Melbourne', value: 'Melbourne' },
    { label: 'Brisbane', value: 'Brisbane' },
    // { label: 'Perth', value: 'Perth' },
    // { label: 'Adelaide', value: 'Adelaide' },
    // { label: 'Gold Coast', value: 'Gold Coast' },
  ];

  const filteredOffers = React.useMemo(() => {
    // For completed jobs, just return all (no filtering needed)
    if (isCompleted) {
      console.log('Returning all completed offers:', jobOffers.length);
      return jobOffers;
    }

    // Filter logic for active jobs
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);

    const filtered = jobOffers.filter((job) => {
      // 🧮 Parse experience from "4 Years 0 Month" or "4 Years 0 Month" format
      let experienceYears = 0;
      if (job.experience) {
        const expParts = job.experience.split(' ');
        const yearsIndex = expParts.findIndex(part => part.toLowerCase() === 'years' || part.toLowerCase() === 'year');
        if (yearsIndex > 0) {
          experienceYears = Number(expParts[yearsIndex - 1]) || 0;
        } else {
          // Fallback: try to parse first number
          experienceYears = Number(expParts[0]) || 0;
        }
      }

      // 💰 Parse salary range
      const salaryMin = Number(job.salaryMin) || 0;
      const salaryMax = Number(job.salaryMax) || 0;

      // 🕒 Posted date comes from createdAt (ISO string)
      const postedDate = job.createdAt ? new Date(job.createdAt) : null;

      // ✅ Salary Filter - Check if salary ranges overlap
      const salaryOk =
        (filters.minSalary === '' || salaryMax >= Number(filters.minSalary)) &&
        (filters.maxSalary === '' || salaryMin <= Number(filters.maxSalary));

      // ✅ Experience Filter
      const expOk =
        (filters.minExp === '' || experienceYears >= Number(filters.minExp)) &&
        (filters.maxExp === '' || experienceYears <= Number(filters.maxExp));

      // ✅ City Filter
      const cityOk =
        filters.city === '' ||
        job.location?.toLowerCase() === filters.city?.toLowerCase();

      // ✅ Posted Date Filter (Today / Week / Month)
      let postOk = true;
      if (postRange !== 'all') {
        if (!postedDate) {
          postOk = false;
        } else if (postRange === 'today') {
          postOk = postedDate >= startOfToday;
        } else if (postRange === 'week') {
          postOk = postedDate >= startOfWeek;
        } else if (postRange === 'month') {
          postOk = postedDate >= startOfMonth;
        }
      }

      return salaryOk && expOk && cityOk && postOk;
    });
    
    console.log('Filtered active offers:', filtered.length, 'from', jobOffers.length);
    return filtered;
  }, [jobOffers, filters, postRange, isCompleted]);

  const renderJobCard = ({ item: job }) => {
    // Check if job is already accepted or declined
    const isAccepted = acceptedOffers.some(offer => offer.id === job.id);
    const isDeclined = declinedOffers.some(offer => offer.id === job.id);
    const jobSeekerStatus = isAccepted ? 'accepted' : isDeclined ? 'declined' : null;
    
    // Create a decline handler that passes the full job object
    const handleDecline = (jobId) => {
      onDecline(job);
    };
    
    return (
      <JobSeekerJobCard
        job={job}
        isCompleted={isCompleted}
        onAccept={onAccept}
        onDecline={handleDecline}
        jobSeekerStatus={jobSeekerStatus}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name={isCompleted ? "checkmark-circle-outline" : "briefcase-outline"} size={48} color="#9CA3AF" />
      <Text style={styles.emptyText}>
        No {isCompleted ? 'completed' : 'active'} job offers yet
      </Text>
      <Text style={styles.emptySubText}>
        {isCompleted 
          ? 'Completed jobs will appear here.' 
          : 'Apply to jobs to see them here.'}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {filteredOffers.length} {isCompleted ? 'completed' : 'active'} job {filteredOffers.length === 1 ? 'offer' : 'offers'}
        </Text>
        {!isCompleted && (
          <TouchableOpacity onPress={openFilter}>
            <MaterialIcons name="tune" size={24} color="#FF9800" />
          </TouchableOpacity>
        )}
      </View>

      {/* Post range Dropdown - Only show for active jobs */}
      {!isCompleted && (
        <View style={{ paddingHorizontal: 15, marginBottom: 15, zIndex: 1000 }}>
          <AppDropDown
            placeholder="All Post"
            options={[
              { label: 'All Post', value: 'all' },
              { label: 'Today', value: 'today' },
              { label: 'This Week', value: 'week' },
              { label: 'This Month', value: 'month' },
            ]}
            selectedValue={postRange}
            isVisible={isPostOpen}
            setIsVisible={setIsPostOpen}
            onSelect={(value) => setPostRange(value)}
            dropdownStyle={{ zIndex: 10000, elevation: 25 }}
          />
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredOffers}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id || `job-${item.title}-${item.location}`}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={filteredOffers.length === 0 ? styles.emptyContainer : styles.listContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={true}
      />

      {/* Filter Sheet */}
      <RbSheetComponent ref={sheetRef} height={hp(60)}>
        <View style={{ padding: wp(5) }}>
          <AppText style={{ fontWeight: '700', fontSize: getFontSize(16), marginBottom: hp(1) }}>Filter offers</AppText>
          <AppText style={{ color: colors.gray, marginBottom: hp(2) }}>Only jobs in Australia are shown</AppText>

          <AppText style={{ fontWeight: '600', marginBottom: hp(1) }}>Price range (monthly, $)</AppText>
          <View style={{ flexDirection: 'row', gap: wp(3) }}>
            <View style={{ flex: 1 }}>
              <AppInputField
                placeholder="Min"
                keyboardType="numeric"
                value={filters.minSalary}
                onChangeText={(t) => setFilters(prev => ({ ...prev, minSalary: t.replace(/[^0-9]/g, '') }))}
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppInputField
                placeholder="Max"
                keyboardType="numeric"
                value={filters.maxSalary}
                onChangeText={(t) => setFilters(prev => ({ ...prev, maxSalary: t.replace(/[^0-9]/g, '') }))}
              />
            </View>
          </View>

          <View style={{ height: hp(2) }} />

          <AppText style={{ fontWeight: '600', marginBottom: hp(1) }}>Experience (years)</AppText>
          <View style={{ flexDirection: 'row', gap: wp(3) }}>
            <View style={{ flex: 1 }}>
              <AppInputField
                placeholder="Min"
                keyboardType="numeric"
                value={filters.minExp}
                onChangeText={(t) => setFilters(prev => ({ ...prev, minExp: t.replace(/[^0-9]/g, '') }))}
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppInputField
                placeholder="Max"
                keyboardType="numeric"
                value={filters.maxExp}
                onChangeText={(t) => setFilters(prev => ({ ...prev, maxExp: t.replace(/[^0-9]/g, '') }))}
              />
            </View>
          </View>

          <View style={{ height: hp(2) }} />

          <AppText style={{ fontWeight: '600', marginBottom: hp(1) }}>Location (Australia)</AppText>
          <View style={{ zIndex: 1000 }}>
            <AppDropDown
              placeholder="Select city"
              options={cities}
              dropdownStyle={{ zIndex: 10000, elevation: 25 }}
              selectedValue={filters.city}
              isVisible={isCityOpen}
              setIsVisible={setIsCityOpen}
              onSelect={(value) => setFilters(prev => ({ ...prev, city: value }))}
            />
          </View>

          <View style={{ height: hp(3) }} />
          <View style={{ flexDirection: 'row' }}>
            <Pressable
              onPress={resetFilters}
              style={{
                flex: 1,
                backgroundColor: colors.grayE8,
                paddingVertical: hp(1.8),
                borderRadius: hp(3),
                alignItems: 'center',
                marginRight: wp(2),
              }}
            >
              <AppText>Reset</AppText>
            </Pressable>
            <Pressable
              onPress={applyFilters}
              style={{
                flex: 1,
                backgroundColor: colors.primary,
                paddingVertical: hp(1.8),
                borderRadius: hp(3),
                alignItems: 'center',
                marginLeft: wp(2),
              }}
            >
              <AppText style={{ color: colors.white }}>Apply</AppText>
            </Pressable>
          </View>
        </View>
      </RbSheetComponent>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  listContainer: {
    paddingBottom: hp(5),
  },
  emptyContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    alignItems: 'center',
  },
  headerText: { fontWeight: '700', fontSize: 16 },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  dropdownText: { color: '#aaa', flex: 1 },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: hp(10),
    paddingHorizontal: wp(10),
  },
  emptyText: {
    marginTop: hp(2),
    fontWeight: '700',
    fontSize: getFontSize(16),
    color: '#111827',
  },
  emptySubText: {
    marginTop: hp(1),
    color: '#6B7280',
    fontSize: getFontSize(14),
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 0.8,
    borderColor: '#eee',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, color: '#aaa', marginTop: 3 },
  navActive: { fontSize: 12, color: '#FF9800', marginTop: 3, fontWeight: '600' },
});

export default JobSeekerActiveJob;
