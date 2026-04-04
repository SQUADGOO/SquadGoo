import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import AppButton from '@/core/AppButton';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { colors, getFontSize, hp, wp } from '@/theme';
import { screenNames } from '@/navigation/screenNames';
import CandidateProfileView from '@/components/Recruiter/CandidateProfileView';
import InfoTooltip from '@/components/InfoTooltip';

const CompletedWorkerProfile = ({ route, navigation }) => {
  const { jobId, candidateId, source } = route?.params || {};
  const userInfo = useSelector(state => state?.auth?.userInfo || {});
  const currentUserId = userInfo?._id || userInfo?.id || userInfo?.userId || null;

  const job = useSelector(
    state => state.jobs?.completedJobs?.find(j => j.id === jobId) || null,
  );
  const candidates = useSelector(
    state => state.jobs?.jobCandidates?.[jobId] || [],
  );
  const candidate = candidates.find(c => c.id === candidateId) || null;

  const contactReveals = useSelector(state => state?.contactReveal?.contactReveals || []);
  const chatSessions = useSelector(state => state?.chat?.chatSessions || []);

  const canSeePhone = React.useMemo(() => {
    if (!currentUserId || !candidateId) return false;
    const now = new Date();
    return contactReveals.some(r => {
      if (!r?.isActive || r?.jobId !== jobId || new Date(r.expiresAt) <= now) return false;
      return (
        (r.userId1 === currentUserId && r.userId2 === candidateId) ||
        (r.userId2 === currentUserId && r.userId1 === candidateId)
      );
    });
  }, [contactReveals, currentUserId, candidateId, jobId]);

  const canChat = React.useMemo(() => {
    if (!currentUserId || !candidateId) return false;
    const now = new Date();
    return chatSessions.some(s => {
      if (!s?.isActive || s?.jobId !== jobId || new Date(s.expiresAt) <= now) return false;
      return (
        (s.userId === currentUserId && s.otherUserId === candidateId) ||
        (s.userId === candidateId && s.otherUserId === currentUserId)
      );
    });
  }, [chatSessions, currentUserId, candidateId, jobId]);

  const handleTrackHours = () => {
    navigation.navigate(screenNames.CANDIDATE_HOURS, {
      job: job || { id: jobId, title: 'Job', salaryType: 'Hourly' },
      candidate: { id: candidateId, name: candidate?.name || 'Candidate' },
      source: source === 'quick' ? 'quick' : 'manual',
    });
  };

  const handleChat = () => {
    if (!canChat) return;
    navigation.navigate(screenNames.MESSAGES, {
      chatData: {
        jobId,
        name: candidate?.name || 'Candidate',
        jobTitle: job?.title || 'Job',
        jobType: source === 'quick' ? 'quick' : 'manual',
        otherUserId: candidateId,
      },
    });
  };

  if (!candidate) {
    return (
      <View style={styles.container}>
        <AppHeader title="Worker Profile" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={styles.emptyState}>
          <AppText variant={Variant.body}>Worker not found.</AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Worker Profile" showBackButton onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <CandidateProfileView
          candidate={candidate}
          matchedForLabel={job?.title ? `Completed: ${job.title}` : undefined}
          headerExtra={
            <View style={styles.contactInfo}>
              <View style={styles.divider} />
              <View style={styles.infoGrid}>
                <View style={styles.infoCell}>
                  <AppText variant={Variant.caption} style={styles.infoLabel}>Phone</AppText>
                  {canSeePhone ? (
                    <AppText variant={Variant.bodyMedium} style={styles.infoValue}>
                      {candidate?.phone || '—'}
                    </AppText>
                  ) : (
                    <View style={styles.lockedRow}>
                      <AppText variant={Variant.bodyMedium} style={styles.lockedText}>Locked</AppText>
                      <InfoTooltip message="Contact details are available for 30 days after the match." />
                    </View>
                  )}
                </View>
                <View style={styles.infoCell}>
                  <AppText variant={Variant.caption} style={styles.infoLabel}>Experience</AppText>
                  <AppText variant={Variant.bodyMedium} style={styles.infoValue}>
                    {candidate?.experience || '—'}
                  </AppText>
                </View>
              </View>
            </View>
          }
        >
          {/* Hours tracking */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={20} color={colors.primary} />
              <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>Hours worked & sessions</AppText>
            </View>
            <View style={styles.divider} />
            <AppText variant={Variant.body} style={styles.bodyText}>
              View dates/times worked, breaks, notes and totals.
            </AppText>
            <View style={styles.spacer} />
            <AppButton text="Track hours" onPress={handleTrackHours} bgColor={colors.primary} textColor="#FFFFFF" />
          </View>

          {/* Chat action */}
          <View style={styles.footerActions}>
            <View style={styles.chatRow}>
              <TouchableOpacity
                style={[styles.chatButton, !canChat && styles.chatButtonDisabled]}
                onPress={handleChat}
                activeOpacity={0.85}
                disabled={!canChat}
              >
                <VectorIcons name={iconLibName.Ionicons} iconName="chatbubble-ellipses-outline" size={18} color={canChat ? colors.primary : '#9CA3AF'} />
                <AppText variant={Variant.bodyMedium} style={[styles.chatButtonText, !canChat && styles.chatButtonTextDisabled]}>
                  Chat
                </AppText>
              </TouchableOpacity>
              {!canChat ? (
                <View style={styles.lockedRow}>
                  <AppText variant={Variant.caption} style={styles.lockedText}>Unavailable</AppText>
                  <InfoTooltip message="Chat is available for 30 days after the match date." />
                </View>
              ) : null}
            </View>
          </View>
        </CandidateProfileView>
      </ScrollView>
    </View>
  );
};

export default CompletedWorkerProfile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background || '#F5F6FA' },
  content: { padding: wp(4), paddingBottom: hp(4), gap: hp(2) },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: wp(6) },
  contactInfo: { marginTop: hp(1) },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: hp(1.5) },
  infoGrid: { flexDirection: 'row', gap: wp(3) },
  infoCell: { flex: 1 },
  infoLabel: {
    color: colors.gray, fontSize: getFontSize(11), fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: hp(0.4),
  },
  infoValue: { color: colors.secondary, fontWeight: '700' },
  lockedRow: { flexDirection: 'row', alignItems: 'center', gap: wp(1.5), marginTop: hp(0.3) },
  lockedText: { color: '#9CA3AF', fontWeight: '600' },
  chatRow: { gap: hp(1) },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: hp(2.5), padding: wp(5),
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: wp(2), marginBottom: hp(1) },
  sectionTitle: { color: colors.secondary, fontWeight: '800', fontSize: getFontSize(16) },
  bodyText: { color: colors.secondary, lineHeight: hp(2.4) },
  spacer: { height: hp(1.2) },
  footerActions: {
    backgroundColor: '#FFFFFF', borderRadius: hp(2.5), padding: wp(5),
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  chatButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: wp(2),
    paddingVertical: hp(1.4), borderRadius: hp(2.5),
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.primary,
  },
  chatButtonDisabled: { borderColor: '#E5E7EB' },
  chatButtonText: { color: colors.primary, fontWeight: '700' },
  chatButtonTextDisabled: { color: '#9CA3AF' },
});
