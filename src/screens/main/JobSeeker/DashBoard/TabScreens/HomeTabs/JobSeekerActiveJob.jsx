import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { applyToOffer, declineActiveOffer, initializeDummyData as initializeOffersData } from '@/store/jobSeekerOffersSlice';
import { addCandidateToJob, initializeDummyData as initializeJobsData } from '@/store/jobsSlice';
import RbSheetComponent from '@/core/RbSheetComponent';
import AppText from '@/core/AppText';
import AppInputField from '@/core/AppInputField';
import AppDropDown from '@/core/AppDropDown';
import { colors, hp, wp, getFontSize } from '@/theme';
import Pressable from '@/core/Pressable';
import ReactNative from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { screenNames } from '@/navigation/screenNames';

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
  
  // Initialize dummy data if empty
  React.useEffect(() => {
    if (recruiterJobs.length === 0) {
      dispatch(initializeJobsData());
    }
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
    // Create candidate object from current user
    const candidate = {
      id: `candidate-${job.id}-${Date.now()}`,
      name: userInfo.name || (userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : 'Job Seeker'),
      email: userInfo.email || '',
      phone: userInfo.phone || '',
      experience: userInfo.experience || 'Not specified',
      location: userInfo.location || userInfo.address || 'Not specified',
      status: 'pending',
      appliedAt: new Date().toISOString(),
    };
    
    // Add candidate to recruiter's job
    dispatch(addCandidateToJob({ jobId: job.id, candidate }));
    
    // Add to job seeker's accepted offers
    dispatch(applyToOffer(job));
  };

  const onDecline = (id) => {
    dispatch(declineActiveOffer(id));
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
      // 🧮 Parse experience from "4 Years 0 Month"
      const expParts = job.experience?.split(' ') || [];
      const experienceYears = Number(expParts[0]) || 0;

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

  const renderJobCard = ({ item: job }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(screenNames.JOB_OFFER_DETAILS, { job, isCompleted })}
    >
      <View style={{ gap: hp(1) }}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{job.title}</Text>
          {isCompleted ? (
            <View style={styles.completedBadge}>
              <Icon name="checkmark-circle" size={14} color="#4ADE80" />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          ) : (
            <Text style={styles.expiry}>Expire on {job.expireDate}</Text>
          )}
        </View>

        <View style={styles.cardHeader}>
          <Text style={styles.salary}>{job.salaryRange}</Text>
          <Text style={styles.expiry}>{job?.searchType?.toUpperCase() || 'N/A'}</Text>
        </View>
      </View>

      <Text style={styles.description}>
        {job?.description}
        <Text style={styles.viewDetails}> View Details</Text>
      </Text>

      <View style={styles.companyRow}>
        {job?.image ? (
          <Image source={{ uri: job.image }} style={styles.logo} />
        ) : (
          <View style={[styles.logo, { backgroundColor: '#E0E0E0' }]} />
        )}
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{job.industry}</Text>
          <View style={styles.locationRow}>
            <Icon name="location-outline" size={14} color="#4F5D75" />
            <Text style={styles.location}>{job.location}</Text>
          </View>
        </View>
        <Text style={styles.experience}>Experience: {job.experience}</Text>
      </View>

      {!isCompleted && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.acceptBtn} onPress={() => onAccept(job)}>
            <Icon name="checkmark" size={18} color="green" />
            <Text style={styles.acceptText}>Apply</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineBtn} onPress={() => onDecline(job.id)}>
            <Icon name="close" size={18} color="red" />
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {isCompleted && job.completedDate && (
        <View style={styles.completedInfoRow}>
          <View style={styles.infoItem}>
            <Icon name="calendar-outline" size={14} color="#4F5D75" />
            <Text style={styles.infoText}>Completed: {job.completedDate}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

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
  card: {
    borderBottomWidth: 0.8,
    borderColor: '#eee',
    padding: 15,
    marginVertical: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontWeight: '700', fontSize: 16, color: '#4F5D75', width: '60%' },
  expiry: {
    backgroundColor: '#E0D9E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    color: '#4F5D75',
  },
  salary: {
    color: '#FF9800',
    fontWeight: '700',
    width: wp(50),
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  description: { color: '#4F5D75', fontSize: 13, marginBottom: 8 },
  viewDetails: { color: '#FF9800', fontWeight: '600' },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    justifyContent: 'space-between',
  },
  logo: { width: 35, height: 35, borderRadius: 35 / 2, marginRight: 10 },
  companyInfo: { flex: 1 },
  companyName: { fontWeight: '600', color: '#000' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  location: { marginLeft: 4, color: '#4F5D75', fontSize: 12 },
  experience: { color: '#4F5D75', fontSize: 13 },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  completedText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
  },
  completedInfoRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    color: '#4F5D75',
    fontSize: 12,
  },
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 8,
    flex: 1,
    justifyContent: 'center',
    marginRight: 10,
  },
  declineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 8,
    flex: 1,
    justifyContent: 'center',
  },
  acceptText: { color: 'green', marginLeft: 6, fontWeight: '600' },
  declineText: { color: 'red', marginLeft: 6, fontWeight: '600' },
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
