import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import AppButton from '@/core/AppButton';
import { addCandidateToJob } from '@/store/jobsSlice';
import { applyToOffer } from '@/store/jobSeekerOffersSlice';
import { useNavigation, useRoute } from '@react-navigation/native';

const JobOfferDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  // Get job from route params (passed from job list)
  const { job, isCompleted } = route.params || {};
  
  // Get current user info for candidate creation
  const userInfo = useSelector(state => state?.auth?.userInfo || {});

  if (!job) {
    return (
      <View style={styles.container}>
        <AppHeader title="Job Details" showTopIcons={false} />
        <View style={styles.errorContainer}>
          <AppText variant={Variant.h3} style={styles.errorText}>
            Job not found
          </AppText>
        </View>
      </View>
    );
  }

  const DetailRow = ({ label, value, valueStyle }) => (
    <View style={styles.detailRow}>
      <AppText variant={Variant.body} style={styles.detailLabel}>
        {label}
      </AppText>
      <AppText variant={Variant.bodyMedium} style={[styles.detailValue, valueStyle]}>
        {value || 'Not specified'}
      </AppText>
    </View>
  );

  const SectionTitle = ({ title }) => (
    <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
      {title}
    </AppText>
  );

  const handleApply = () => {
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
    
    Alert.alert(
      'Application Submitted!',
      `You have successfully applied for "${job.title}". The recruiter will review your application.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <AppHeader title="Job Details" showTopIcons={false} height={hp(14)} />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Status and Search Type Badges */}
        <View style={styles.badgesContainer}>
          {/* Completed Status Badge */}
          {(isCompleted || job.status === 'completed') && (
            <View style={styles.completedStatusBadge}>
              <AppText variant={Variant.bodyMedium} style={styles.statusBadgeText}>
                ✓ Job Completed
              </AppText>
            </View>
          )}
          
          {/* Search Type Badge */}
          {job.searchType && (
            <View style={[
              styles.searchTypeBadge,
              job.searchType === 'quick' ? styles.quickSearchBadge : styles.manualSearchBadge
            ]}>
              <AppText variant={Variant.bodySmall} style={styles.searchTypeBadgeText}>
                {job.searchType === 'quick' ? '⚡ Quick Search' : '📝 Manual Search'}
              </AppText>
            </View>
          )}
        </View>

        {/* Basic Job Info */}
        <SectionTitle title="Job Information" />
        <DetailRow 
          label="Job title:" 
          value={job.title}
          valueStyle={styles.jobTitle}
        />
        
        <DetailRow 
          label="Job type:" 
          value={job.type}
        />
        
        <DetailRow 
          label="Industry:" 
          value={job.industry}
        />
        
        <DetailRow 
          label="Work location:" 
          value={job.location}
        />
        
        <DetailRow 
          label="Range from location:" 
          value={job.rangeKm ? `${job.rangeKm} km` : 'Not specified'}
        />
        
        <DetailRow 
          label="Staff needed:" 
          value={job.staffNumber}
        />

        {/* Experience & Salary */}
        <SectionTitle title="Experience & Compensation" />
        <DetailRow 
          label="Experience required:" 
          value={job.experience}
        />
        
        <DetailRow 
          label="Salary range:" 
          value={job.salaryRange}
          valueStyle={styles.salaryValue}
        />

        <DetailRow 
          label="Salary type:" 
          value={job.salaryType}
        />

        {/* Dates */}
        <SectionTitle title="Job Timeline" />
        <DetailRow 
          label="Posted date:" 
          value={job.offerDate}
        />

        <DetailRow 
          label="Start date:" 
          value={job.jobStartDate}
        />
        
        <DetailRow 
          label="End date:" 
          value={job.jobEndDate}
        />
        
        <DetailRow 
          label="Offer expires:" 
          value={job.expireDate}
        />

        {/* Extra Pay Section */}
        {job.extraPay && Object.keys(job.extraPay).length > 0 && (
          <>
            <SectionTitle title="Extra Pay Offered:" />
            
            <DetailRow 
              label="Public holidays:" 
              value={job.extraPay.publicHolidays ? 'Yes' : 'No'}
              valueStyle={job.extraPay.publicHolidays && styles.yesValue}
            />
            
            <DetailRow 
              label="Weekend:" 
              value={job.extraPay.weekend ? 'Yes' : 'No'}
              valueStyle={job.extraPay.weekend && styles.yesValue}
            />
            
            <DetailRow 
              label="Shift loading:" 
              value={job.extraPay.shiftLoading ? 'Yes' : 'No'}
              valueStyle={job.extraPay.shiftLoading && styles.yesValue}
            />
            
            <DetailRow 
              label="Bonuses:" 
              value={job.extraPay.bonuses ? 'Yes' : 'No'}
              valueStyle={job.extraPay.bonuses && styles.yesValue}
            />
            
            <DetailRow 
              label="Overtime:" 
              value={job.extraPay.overtime ? 'Yes' : 'No'}
              valueStyle={job.extraPay.overtime && styles.yesValue}
            />
          </>
        )}

        {/* Availability */}
        {job.availability && (
          <>
            <SectionTitle title="Availability" />
            <DetailRow 
              label="Work schedule:" 
              value={job.availability}
            />
          </>
        )}

        {/* Tax Type */}
        <DetailRow 
          label="Tax type:" 
          value={job.taxType}
        />

        {/* Description */}
        {(job.jobDescription || job.description) && (
          <>
            <SectionTitle title="Job Description" />
            <View style={styles.descriptionContainer}>
              <AppText variant={Variant.body} style={styles.descriptionText}>
                {job.jobDescription || job.description}
              </AppText>
            </View>
          </>
        )}

        {/* Completed Date if completed */}
        {(isCompleted || job.status === 'completed') && job.completedDate && (
          <>
            <SectionTitle title="Completion Details" />
            <DetailRow 
              label="Completed date:" 
              value={job.completedDate}
              valueStyle={styles.completedValue}
            />
          </>
        )}

        {/* Apply Button - Only show if not completed */}
        {!(isCompleted || job.status === 'completed') && (
          <View style={styles.buttonContainer}>
            <AppButton
              text="Apply for this Job"
              onPress={handleApply}
              bgColor={colors.primary}
              textColor="#FFFFFF"
            />
          </View>
        )}

      </ScrollView>
    </View>
  );
};

export default JobOfferDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: wp(6),
    paddingBottom: hp(4),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(5),
  },
  errorText: {
    color: colors.text || '#666',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: hp(2),
    gap: wp(2),
  },
  searchTypeBadge: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8),
    borderRadius: wp(2),
    marginRight: wp(2),
  },
  quickSearchBadge: {
    backgroundColor: '#E3F2FD',
  },
  manualSearchBadge: {
    backgroundColor: '#FFF3E0',
  },
  searchTypeBadgeText: {
    fontWeight: '600',
    color: '#1976D2',
  },
  completedStatusBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8),
    borderRadius: wp(2),
    marginRight: wp(2),
  },
  statusBadgeText: {
    fontWeight: '600',
    color: '#065F46',
  },
  completedValue: {
    color: '#4ADE80',
    fontWeight: 'bold',
  },
  detailRow: {
    marginBottom: hp(2),
  },
  detailLabel: {
    marginBottom: hp(0.5),
    color: colors.text || '#666',
  },
  detailValue: {
    fontWeight: 'bold',
    color: colors.black || '#000',
  },
  jobTitle: {
    fontSize: getFontSize(18),
    fontWeight: 'bold',
  },
  salaryValue: {
    color: colors.primary || '#FF9800',
    fontWeight: 'bold',
  },
  yesValue: {
    color: '#4ADE80',
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: hp(2),
    marginBottom: hp(1),
    fontWeight: '600',
    fontSize: getFontSize(16),
  },
  descriptionContainer: {
    marginBottom: hp(2),
    padding: wp(3),
    backgroundColor: '#F5F5F5',
    borderRadius: wp(2),
  },
  descriptionText: {
    lineHeight: hp(2.5),
    color: colors.text || '#666',
  },
  buttonContainer: {
    marginTop: hp(3),
    marginBottom: hp(2),
  },
});

