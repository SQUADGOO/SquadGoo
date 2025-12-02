import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import JobSeekerJobCard from '@/components/JobSeeker/JobCard';
import { screenNames } from '@/navigation/screenNames';
import { useNavigation } from '@react-navigation/native';
import { removeAcceptedOffer } from '@/store/jobSeekerOffersSlice';
import { showToast, toastTypes } from '@/utilities/toastConfig';

const formatDuration = (seconds = 0) => {
  if (!seconds || seconds <= 0) return '0h 0m';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const MyCurrentJobs = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state?.auth?.userInfo || {});
  const acceptedOffers = useSelector(state => state?.jobSeekerOffers?.acceptedOffers || []);
  const quickSearchActiveJobs = useSelector(state => state?.quickSearch?.activeJobs || []);
  const jobCandidates = useSelector(state => state?.jobs?.jobCandidates || {});
  
  const currentCandidateId = userInfo?.candidateId || userInfo?._id || 'js-001';

  // Combine and filter jobs
  const chatSessions = useSelector(state => state?.chat?.chatSessions || []);
  
  const currentJobs = useMemo(() => {
    const jobs = [];
    
    // Add accepted manual search offers
    acceptedOffers.forEach(offer => {
      if (offer.candidateId === currentCandidateId || !offer.candidateId) {
        jobs.push({
          ...offer,
          source: 'manual',
          status: offer.status || 'accepted',
        });
      }
    });
    
    // Add quick search active jobs
    quickSearchActiveJobs.forEach(job => {
      if (job.candidateId === currentCandidateId || !job.candidateId) {
        jobs.push({
          ...job,
          source: 'quick',
          status: job.status || 'in_progress',
          title: job.jobTitle || job.title,
          description: job.jobDescription || job.description || '',
          salaryRange: job.salaryMin && job.salaryMax 
            ? `$${job.salaryMin}/hr to $${job.salaryMax}/hr`
            : 'Salary not specified',
          location: job.workLocation || job.location || 'Location not specified',
          industry: job.industry || 'General Services',
          experience: job.experienceYear && job.experienceMonth
            ? `${job.experienceYear} Year${job.experienceYear !== 1 ? 's' : ''} ${job.experienceMonth} Month${job.experienceMonth !== 1 ? 's' : ''}`
            : 'Not specified',
        });
      }
    });
    
    return jobs;
  }, [acceptedOffers, quickSearchActiveJobs, currentCandidateId]);
  
  // Check chat availability and get recruiter status for each job
  const jobsWithChatStatus = useMemo(() => {
    return currentJobs.map(job => {
      const chatSession = chatSessions.find(
        s =>
          s.jobId === job.id &&
          s.isActive &&
          (s.userId === currentCandidateId || s.otherUserId === currentCandidateId) &&
          new Date(s.expiresAt) > new Date()
      );

      // Get candidate status from recruiter's perspective
      const candidates = jobCandidates[job.id] || [];
      const candidate = candidates.find(
        c =>
          c.id === currentCandidateId ||
          c.email === userInfo.email ||
          c.email === userInfo?.email ||
          (userInfo.name && c.name === userInfo.name) ||
          (userInfo.firstName &&
            userInfo.lastName &&
            c.name === `${userInfo.firstName} ${userInfo.lastName}`)
      );
      const recruiterStatus = candidate?.status || 'pending'; // 'pending', 'accepted', 'rejected'

      return {
        ...job,
        canChat: true, // My Current Jobs always allows messaging
        chatSessionId: chatSession?.id,
        recruiterStatus,
      };
    });
  }, [currentJobs, chatSessions, currentCandidateId, jobCandidates, userInfo.email]);

  const handleChatPress = (job) => {
    navigation.navigate(screenNames.MESSAGES, {
      chatData: {
        id: job.id,
        name: job.recruiterName || 'Recruiter',
        jobId: job.id,
        jobTitle: job.title,
        jobType: job.searchType || job.source,
      },
    });
  };

  const handleViewDetails = (job) => {
    navigation.navigate(screenNames.JOB_OFFER_DETAILS, { 
      job,
      isCompleted: false,
    });
  };

  const handleCancel = (job) => {
    Alert.alert(
      'Cancel Application',
      `Are you sure you want to cancel your application for "${job.title}"?`,
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            dispatch(removeAcceptedOffer(job.id));
            showToast('Application cancelled successfully', 'Info', toastTypes.info);
          },
        },
      ]
    );
  };

  const handleTimerPress = (job) => {
    if (job.source !== 'quick') return;

    const requiresPaymentVerification =
      job?.payment?.method === 'platform' && !job?.payment?.codeVerified;

    if (requiresPaymentVerification) {
      navigation.navigate(screenNames.PAYMENT_REQUEST, { jobId: job.id });
      return;
    }

    navigation.navigate(screenNames.TIMER_CONTROL, { jobId: job.id });
  };

  const getTimerStatusLabel = (job) => {
    const timer = job?.timer || {};
    if (timer.isRunning) {
      return `Timer running • ${formatDuration(timer.elapsedTime)}`;
    }
    if (timer.elapsedTime > 0) {
      return `Paused • ${formatDuration(timer.elapsedTime)}`;
    }
    return 'Timer not started';
  };

  const getTimerButtonLabel = (job) => {
    const timer = job?.timer || {};
    if (timer.isRunning) return 'View Timer';
    if (timer.elapsedTime > 0) return 'Resume Timer';
    return 'Start Timer';
  };

  const renderJobCard = ({ item: job }) => {
    const isQuickJob = job.source === 'quick' || job.searchType === 'quick';

    return (
      <View style={styles.cardWrapper}>
        <JobSeekerJobCard
          job={job}
          isCompleted={false}
          isCurrentJob={true}
          recruiterStatus={job.recruiterStatus}
          showChatButton={true}
          chatEnabled={job.canChat}
          showTimerButton={isQuickJob}
          timerLabel={isQuickJob ? getTimerButtonLabel(job) : undefined}
          timerStatus={isQuickJob ? getTimerStatusLabel(job) : null}
          onTimerPress={() => handleTimerPress(job)}
          onChatPress={() => handleChatPress(job)}
          onCancel={() => handleCancel(job)}
          onViewDetails={() => handleViewDetails(job)}
        />
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <VectorIcons
        name={iconLibName.Ionicons}
        iconName="briefcase-outline"
        size={64}
        color={colors.gray}
      />
      <AppText variant={Variant.bodyMedium} style={styles.emptyText}>
        No Current Jobs
      </AppText>
      <AppText variant={Variant.body} style={styles.emptySubText}>
        Jobs you're working on will appear here. Apply to jobs to get started!
      </AppText>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={jobsWithChatStatus}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id || `job-${item.title}-${item.location}`}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={jobsWithChatStatus.length === 0 ? styles.emptyContainer : styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MyCurrentJobs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContainer: {
    paddingBottom: hp(5),
  },
  emptyContainer: {
    flexGrow: 1,
  },
  cardWrapper: {
    position: 'relative',
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
});

