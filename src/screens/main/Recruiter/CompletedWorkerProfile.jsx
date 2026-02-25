import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText, {Variant} from '@/core/AppText';
import AppButton from '@/core/AppButton';
import VectorIcons, {iconLibName} from '@/theme/vectorIcon';
import {colors, getFontSize, hp, wp} from '@/theme';
import {screenNames} from '@/navigation/screenNames';

const CompletedWorkerProfile = ({route, navigation}) => {
  const {jobId, candidateId, source} = route?.params || {};
  const userInfo = useSelector(state => state?.auth?.userInfo || {});
  const currentUserId =
    userInfo?._id || userInfo?.id || userInfo?.userId || null;

  const job = useSelector(
    state => state.jobs?.completedJobs?.find(j => j.id === jobId) || null,
  );
  const candidates = useSelector(
    state => state.jobs?.jobCandidates?.[jobId] || [],
  );
  const candidate = candidates.find(c => c.id === candidateId) || null;

  const contactReveals = useSelector(
    state => state?.contactReveal?.contactReveals || [],
  );
  const chatSessions = useSelector(state => state?.chat?.chatSessions || []);

  const canSeePhone = React.useMemo(() => {
    if (!currentUserId || !candidateId) return false;
    const now = new Date();

    return contactReveals.some(r => {
      if (!r?.isActive) return false;

      if (r?.jobId !== jobId) return false;

      if (new Date(r.expiresAt) <= now) return false;

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
      if (!s?.isActive) return false;

      if (s?.jobId !== jobId) return false;

      if (new Date(s.expiresAt) <= now) return false;

      return (
        (s.userId === currentUserId && s.otherUserId === candidateId) ||
        (s.userId === candidateId && s.otherUserId === currentUserId)
      );
    });
  }, [chatSessions, currentUserId, candidateId, jobId]);

  const safeText = (value, fallback = '—') => {
    if (value === null || value === undefined) return fallback;

    if (typeof value === 'string') return value.trim() ? value : fallback;

    return String(value);
  };

  const skillsValue =
    Array.isArray(candidate?.skills) && candidate.skills.length > 0
      ? candidate.skills.join(' • ')
      : '—';

  const handleTrackHours = () => {
    navigation.navigate(screenNames.CANDIDATE_HOURS, {
      job: job || {id: jobId, title: 'Job', salaryType: 'Hourly'},
      candidate: {id: candidateId, name: candidate?.name || 'Candidate'},
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
        <AppHeader
          title="Worker Profile"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.emptyState}>
          <AppText variant={Variant.body}>Worker not found.</AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Worker Profile"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Header card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            {candidate?.avatarUri ||
            candidate?.photo ||
            candidate?.profilePhoto ? (
              <Image
                source={{
                  uri:
                    candidate.avatarUri ||
                    candidate.photo ||
                    candidate.profilePhoto,
                }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <AppText variant={Variant.title} style={styles.avatarText}>
                  {candidate?.name?.charAt(0)?.toUpperCase?.() || '?'}
                </AppText>
              </View>
            )}

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <AppText variant={Variant.h3} style={styles.name}>
                  {safeText(candidate?.name, 'Unknown')}
                </AppText>
                <View style={styles.verifiedPill}>
                  <VectorIcons
                    name={iconLibName.Ionicons}
                    iconName={
                      candidate?.isVerified
                        ? 'checkmark-circle'
                        : 'close-circle'
                    }
                    size={16}
                    color={candidate?.isVerified ? '#10B981' : '#9CA3AF'}
                  />
                  <AppText
                    variant={Variant.caption}
                    style={styles.verifiedText}>
                    {candidate?.isVerified ? 'Verified' : 'Not verified'}
                  </AppText>
                </View>
              </View>

              <View style={styles.metaRow}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="location-outline"
                  size={14}
                  color={colors.gray}
                />
                <AppText variant={Variant.bodySmall} style={styles.metaText}>
                  {safeText(candidate?.location, 'Address not provided')}
                </AppText>
              </View>

              <View style={styles.metaRow}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="briefcase-outline"
                  size={14}
                  color={colors.gray}
                />
                <AppText variant={Variant.bodySmall} style={styles.metaText}>
                  {safeText(job?.title, 'Job')}
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoGrid}>
            <View style={styles.infoCell}>
              <AppText variant={Variant.caption} style={styles.infoLabel}>
                Phone (30 days)
              </AppText>
              <AppText variant={Variant.bodyMedium} style={styles.infoValue}>
                {canSeePhone ? safeText(candidate?.phone, '—') : 'Hidden'}
              </AppText>
              {!canSeePhone ? (
                <AppText variant={Variant.caption} style={styles.helperText}>
                  Contact details disappear after 30 days.
                </AppText>
              ) : null}
            </View>
            <View style={styles.infoCell}>
              <AppText variant={Variant.caption} style={styles.infoLabel}>
                Experience
              </AppText>
              <AppText variant={Variant.bodyMedium} style={styles.infoValue}>
                {safeText(candidate?.experience, '—')}
              </AppText>
            </View>
          </View>
        </View>

        {/* Skills / Qualifications */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="ribbon-outline"
              size={20}
              color={colors.primary}
            />
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              Skills & qualifications
            </AppText>
          </View>
          <View style={styles.divider} />
          <AppText variant={Variant.caption} style={styles.infoLabel}>
            Key skills
          </AppText>
          <AppText variant={Variant.body} style={styles.bodyText}>
            {skillsValue}
          </AppText>
          <View style={styles.spacer} />
          <AppText variant={Variant.caption} style={styles.infoLabel}>
            Licenses / certificates
          </AppText>
          <AppText variant={Variant.body} style={styles.bodyText}>
            —
          </AppText>
          <View style={styles.spacer} />
          <AppText variant={Variant.caption} style={styles.infoLabel}>
            Languages spoken
          </AppText>
          <AppText variant={Variant.body} style={styles.bodyText}>
            —
          </AppText>
        </View>

        {/* Bio */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="person-outline"
              size={20}
              color={colors.primary}
            />
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              Personal statement / bio
            </AppText>
          </View>
          <View style={styles.divider} />
          <AppText variant={Variant.body} style={styles.bodyText}>
            —
          </AppText>
        </View>

        {/* Documents */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="document-text-outline"
              size={20}
              color={colors.primary}
            />
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              Uploaded documents
            </AppText>
          </View>
          <View style={styles.divider} />
          <AppText variant={Variant.body} style={styles.bodyText}>
            —
          </AppText>
        </View>

        {/* Hours & sessions */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="time-outline"
              size={20}
              color={colors.primary}
            />
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              Hours worked & sessions
            </AppText>
          </View>
          <View style={styles.divider} />
          <AppText variant={Variant.body} style={styles.bodyText}>
            View dates/times worked, breaks, notes and totals.
          </AppText>
          <View style={styles.spacer} />
          <AppButton
            text="Track hours"
            onPress={handleTrackHours}
            bgColor={colors.primary}
            textColor="#FFFFFF"
          />
        </View>

        {/* Payments */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="wallet-outline"
              size={20}
              color={colors.primary}
            />
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
              Payments
            </AppText>
          </View>
          <View style={styles.divider} />
          <AppText variant={Variant.caption} style={styles.infoLabel}>
            Total amount paid from SG wallet for this job
          </AppText>
          <AppText variant={Variant.body} style={styles.bodyText}>
            —
          </AppText>
        </View>

        {/* Chat */}
        <View style={styles.footerActions}>
          <TouchableOpacity
            style={[styles.chatButton, !canChat && styles.chatButtonDisabled]}
            onPress={handleChat}
            activeOpacity={0.85}
            disabled={!canChat}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="chatbubble-ellipses-outline"
              size={18}
              color={canChat ? colors.primary : '#9CA3AF'}
            />
            <AppText
              variant={Variant.bodyMedium}
              style={[
                styles.chatButtonText,
                !canChat && styles.chatButtonTextDisabled,
              ]}>
              Chat
            </AppText>
          </TouchableOpacity>
          {!canChat ? (
            <AppText variant={Variant.caption} style={styles.helperText}>
              Chat is available for 30 days after match.
            </AppText>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

export default CompletedWorkerProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#F5F6FA',
  },
  content: {
    padding: wp(4),
    paddingBottom: hp(4),
    gap: hp(2),
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2.5),
    padding: wp(5),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2.5),
    padding: wp(5),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp(1.5),
  },
  avatar: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    marginRight: wp(4),
  },
  avatarPlaceholder: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(4),
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: getFontSize(22),
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: wp(2),
  },
  name: {
    color: colors.secondary,
    fontWeight: '800',
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
    borderRadius: hp(2),
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  verifiedText: {
    color: colors.gray,
    fontWeight: '700',
    fontSize: getFontSize(10),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    marginTop: hp(0.6),
  },
  metaText: {
    color: colors.gray,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: hp(1.5),
  },
  infoGrid: {
    flexDirection: 'row',
    gap: wp(3),
  },
  infoCell: {
    flex: 1,
  },
  infoLabel: {
    color: colors.gray,
    fontSize: getFontSize(11),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: hp(0.4),
  },
  infoValue: {
    color: colors.secondary,
    fontWeight: '700',
  },
  helperText: {
    color: colors.gray,
    marginTop: hp(0.5),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginBottom: hp(1),
  },
  sectionTitle: {
    color: colors.secondary,
    fontWeight: '800',
    fontSize: getFontSize(16),
  },
  bodyText: {
    color: colors.secondary,
    lineHeight: hp(2.4),
  },
  spacer: {
    height: hp(1.2),
  },
  footerActions: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2.5),
    padding: wp(5),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(2),
    paddingVertical: hp(1.4),
    borderRadius: hp(2.5),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  chatButtonDisabled: {
    borderColor: '#E5E7EB',
  },
  chatButtonText: {
    color: colors.primary,
    fontWeight: '700',
  },
  chatButtonTextDisabled: {
    color: '#9CA3AF',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp(6),
  },
});
