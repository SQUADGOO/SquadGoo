import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { applyToOffer, declineActiveOffer } from '@/store/jobSeekerOffersSlice';
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
  const jobOffers = useSelector(state => state?.jobSeekerOffers?.activeOffers || []);
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

  const onAccept = (id) => {
    dispatch(applyToOffer(id));
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
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);

    return jobOffers.filter((job) => {
      // 🧮 Parse experience from "4 Years 0 Month"
      const expParts = job.experience?.split(' ') || [];
      const experienceYears = Number(expParts[0]) || 0;

      // 💰 Parse salary range
      const salaryMin = Number(job.salaryMin) || 0;
      const salaryMax = Number(job.salaryMax) || 0;

      // 🕒 Posted date comes from createdAt (ISO string)
      const postedDate = job.createdAt ? new Date(job.createdAt) : null;

      // ✅ Salary Filter
      const salaryOk =
        (filters.minSalary === '' || salaryMin >= Number(filters.minSalary)) &&
        (filters.maxSalary === '' || salaryMax <= Number(filters.maxSalary));

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
  }, [jobOffers, filters, postRange]);

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>{filteredOffers.length} active job offers</Text>
          <TouchableOpacity onPress={openFilter}>
            <MaterialIcons name="tune" size={24} color="#FF9800" />
          </TouchableOpacity>
        </View>

        {/* Post range Dropdown */}
        <View style={{ paddingHorizontal: 15, marginBottom: 15 }}>
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
          />
        </View>
        {/* Job Cards */}
        {filteredOffers.map((job) => (
          <TouchableOpacity
            key={job.id}
            style={styles.card}
            onPress={() => navigation.navigate(screenNames.JOB_OFFER_DETAILS, { job })}
          >

            <View style={{ gap: hp(1) }}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{job.title}</Text>
                <Text style={styles.expiry}>Expire on {job.expireDate}</Text>
              </View>

              <View style={styles.cardHeader}>
                <Text style={styles.salary}>{job.salaryRange}</Text>
                <Text style={styles.expiry}>{job?.searchType?.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.description}>
              {job?.description}
              <Text style={styles.viewDetails}> View Details</Text>
            </Text>

            <View style={styles.companyRow}>
              <Image source={{ uri: job?.image }} style={styles.logo} />
              <View style={styles.companyInfo}>
                <Text style={styles.companyName}>{job.industry}</Text>
                <View style={styles.locationRow}>
                  <Icon name="location-outline" size={14} color="#4F5D75" />
                  <Text style={styles.location}>{job.location}</Text>
                </View>
              </View>
              <Text style={styles.experience}>Experience: {job.experience}</Text>
            </View>

            {type === 'active' &&
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.acceptBtn} onPress={() => onAccept(job.id)}>
                  <Icon name="checkmark" size={18} color="green" />
                  <Text style={styles.acceptText}>Apply</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.declineBtn} onPress={() => onDecline(job.id)}>
                  <Icon name="close" size={18} color="red" />
                  <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>
              </View>
            }

          </TouchableOpacity>
        ))}

      </ScrollView>

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
          <AppDropDown
            placeholder="Select city"
            options={cities}
            dropdownStyle={{top:'-200%'}}
            selectedValue={filters.city}
            isVisible={isCityOpen}
            setIsVisible={setIsCityOpen}
            onSelect={(value) => setFilters(prev => ({ ...prev, city: value }))}
          />

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
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontWeight: '700', fontSize: 16, color: '#4F5D75' },
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
