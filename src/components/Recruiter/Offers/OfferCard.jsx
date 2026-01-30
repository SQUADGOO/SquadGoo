import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';

/**
 * Shared OfferCard used for both Manual and Quick Search offers.
 *
 * Props:
 * - mode: 'manual' | 'quick'
 * - candidateName
 * - jobTitle
 * - status
 * - matchPercentage
 * - acceptanceRating
 * - expiresAt (raw ISO string, optional)
 * - expiresLabel (formatted expiry string)
 * - message
 * - autoSent (quick)
 * - response (manual)
 * - onPress (card press, e.g. open details)
 * - onCancel (quick)
 * - onResend (quick)
 * - onAcceptModification (manual)
 * - onDeclineModification (manual)
 * - onViewMatches (quick)
 * - candidateId (for profile navigation)
 * - jobId (for profile navigation)
 * - onViewProfile (callback when avatar/name is clicked)
 * - onMessage (callback for message button when offer is accepted)
 * - avatarUri (candidate photo)
 * - isVerified (show blue tick)
 * - offerSentAt (formatted date/time)
 * - salaryOffered
 * - workHours
 * - startDate
 * - startTime / endTime
 * - otherTerms (array of strings)
 * - experienceSummary
 * - qualificationsSummary
 * - originalTerms (for modification diff)
 * - modificationRequestedAt (formatted date/time)
 */
const OfferCard = ({
  mode = 'manual',
  candidateName,
  jobTitle,
  status,
  matchPercentage,
  acceptanceRating,
  expiresAt,
  expiresLabel,
  message,
  autoSent,
  response,
  onPress,
  onCancel,
  onResend,
  onAcceptModification,
  onDeclineModification,
  onViewMatches,
  candidateId,
  jobId,
  onViewProfile,
  onMessage,
  onTrackHours,
  avatarUri,
  isVerified,
  offerSentAt,
  modificationRequestedAt,
  originalTerms,
  salaryOffered,
  workHours,
  startDate,
  startTime,
  endTime,
  otherTerms = [],
  experienceSummary,
  qualificationsSummary,
}) => {
  const getStatusColor = (value) => {
    switch (value) {
      case 'pending':
        return '#F59E0B';
      case 'accepted':
        return '#10B981';
      case 'declined':
        return '#EF4444';
      case 'modification_requested':
        return '#3B82F6';
      case 'expired':
        return '#6B7280';
      case 'cancelled':
        return colors.gray;
      default:
        return colors.gray;
    }
  };

  const getStatusIcon = (value) => {
    switch (value) {
      case 'pending':
        return 'time-outline';
      case 'accepted':
        return 'checkmark-circle';
      case 'declined':
        return 'close-circle';
      case 'modification_requested':
        return 'create-outline';
      case 'expired':
        return 'hourglass-outline';
      default:
        return 'ellipse-outline';
    }
  };

  const Wrapper = onPress ? TouchableOpacity : View;
  const wrapperProps = onPress
    ? { activeOpacity: 0.7, onPress }
    : {};

  const getProfileNavMeta = () => {
    const base = {
      status,
      candidateName,
      jobTitle,
      matchPercentage,
      acceptanceRating,
      expiresLabel,
      message,
    };
    if (mode === 'quick' && status === 'accepted') {
      return { ...base, mode: 'work_coordination' };
    }
    if (status === 'declined') {
      const declinedAt = response?.declinedAt || response?.declined_at || response?.declineAt || null;
      const reason = response?.reason || response?.declineReason || null;
      return { ...base, mode: 'declined_review', declinedAt, declineReason: reason };
    }
    if (status === 'expired') {
      const expiresAtValue = expiresAt || response?.expiresAt || response?.expiredAt || response?.expired_at || null;
      const expiryReason = response?.message || response?.reason || null;
      return { ...base, mode: 'expired_review', expiresAt: expiresAtValue, expiryReason };
    }
    return base;
  };

  const handleViewProfile = (e) => {
    e?.stopPropagation?.();
    if (onViewProfile && candidateId && jobId) {
      onViewProfile(candidateId, jobId, getProfileNavMeta());
    }
  };

  const AvatarWrapper = onViewProfile && candidateId && jobId ? TouchableOpacity : View;
  const NameWrapper = onViewProfile && candidateId && jobId ? TouchableOpacity : View;
  const avatarWrapperProps = onViewProfile && candidateId && jobId
    ? { onPress: handleViewProfile, activeOpacity: 0.7 }
    : {};
  const nameWrapperProps = onViewProfile && candidateId && jobId
    ? { onPress: handleViewProfile, activeOpacity: 0.7 }
    : {};

  const statusLabel =
    mode === 'quick' && status === 'pending'
      ? 'AWAITING RESPONSE'
      : status === 'modification_requested'
      ? 'MODIFICATION REQUESTED'
      : status?.replace('_', ' ')?.toUpperCase?.() || '';

  const showScenario1 = mode === 'quick' && status === 'pending';
  const showScenario2 = status === 'modification_requested';
  const showAccepted = status === 'accepted';
  const showDeclined = status === 'declined';
  const showExpired = status === 'expired';

  const formatDeclinedAt = (value) => {
    if (!value) return '';
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDeclineReason = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    const label = value?.label ? String(value.label) : '';
    const note = value?.note ? String(value.note) : '';
    return [label, note].filter(Boolean).join(' - ');
  };

  const formatExpiredAt = (value) => {
    if (!value) return '';
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatExpiryReason = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    const label = value?.label ? String(value.label) : '';
    const note = value?.note ? String(value.note) : '';
    return [label, note].filter(Boolean).join(' - ');
  };

  const requestedTerms =
    response?.modification?.requestedTerms ||
    (response?.modification?.payRate ? { payRate: response.modification.payRate } : {}) ||
    {};

  const originalPayRate =
    originalTerms?.payRate ||
    (typeof salaryOffered === 'string' ? salaryOffered : '') ||
    '';

  const requestedPayRate = requestedTerms?.payRate || '';
  const modificationMessage = response?.modification?.message || '';

  return (
    <Wrapper style={styles.offerCard} {...wrapperProps}>
      {/* Header */}

      <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(status)}15` },
          ]}
        >
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName={getStatusIcon(status)}
            size={14}
            color={getStatusColor(status)}
          />
          <AppText
            variant={Variant.caption}
            style={[styles.statusText, { color: getStatusColor(status) }]}
          >
            {statusLabel}
          </AppText>
        </View>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <AvatarWrapper
            {...avatarWrapperProps}
            style={styles.avatarContainer}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <AppText variant={Variant.bodyMedium} style={styles.avatarText}>
                {candidateName?.charAt(0)?.toUpperCase() || 'U'}
              </AppText>
            )}
          </AvatarWrapper>
          <View style={styles.headerInfo}>
            <NameWrapper
              {...nameWrapperProps}
            >
              <View style={styles.nameRow}>
                <AppText variant={Variant.bodyMedium} style={styles.offerTitle}>
                  {candidateName}
                </AppText>
                {isVerified ? (
                  <VectorIcons
                    name={iconLibName.Ionicons}
                    iconName="checkmark-circle"
                    size={16}
                    color="#3B82F6"
                    style={styles.verifiedIcon}
                  />
                ) : null}
              </View>
            </NameWrapper>
            <View style={styles.metaRow}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="briefcase-outline"
                size={12}
                color={colors.gray}
              />
              <AppText variant={Variant.caption} style={styles.offerMeta}>
                {jobTitle}
              </AppText>
            </View>
            {showScenario1 && offerSentAt ? (
              <View style={styles.metaRow}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="send-outline"
                  size={12}
                  color={colors.gray}
                />
                <AppText variant={Variant.caption} style={styles.offerMeta}>
                  Offer sent: {offerSentAt}
                </AppText>
              </View>
            ) : null}
            {showScenario2 && modificationRequestedAt ? (
              <View style={styles.metaRow}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="create-outline"
                  size={12}
                  color={colors.gray}
                />
                <AppText variant={Variant.caption} style={styles.offerMeta}>
                  Modification requested: {modificationRequestedAt}
                </AppText>
              </View>
            ) : null}
          </View>
        </View>

        
      </View>

      {/* Match & Rating */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="stats-chart"
            size={14}
            color={colors.primary}
          />
          <AppText variant={Variant.caption} style={styles.statText}>
            {Math.round(matchPercentage || 0)}% Match
          </AppText>
        </View>
        <View style={styles.statItem}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="star"
            size={14}
            color="#F59E0B"
          />
          <AppText variant={Variant.caption} style={styles.statText}>
            Rating: {acceptanceRating ?? 'N/A'}%
          </AppText>
        </View>
      </View>

      {/* Expiry */}
      <View style={styles.expiryContainer}>
        <VectorIcons
          name={iconLibName.Ionicons}
          iconName="time-outline"
          size={14}
          color={colors.gray}
        />
        <AppText variant={Variant.caption} style={styles.expiryText}>
          Expires: {expiresLabel || 'N/A'}
        </AppText>
      </View>

      {/* Accepted summary (Scenario 3) */}
      {showAccepted && (experienceSummary || qualificationsSummary) ? (
        <View style={styles.scenarioBox}>
          <AppText variant={Variant.caption} style={styles.scenarioTitle}>
            Candidate summary
          </AppText>
          {experienceSummary ? (
            <AppText variant={Variant.caption} style={styles.scenarioValue}>
              Experience: {experienceSummary}
            </AppText>
          ) : null}
          {qualificationsSummary ? (
            <AppText variant={Variant.caption} style={styles.scenarioValue}>
              Qualifications: {qualificationsSummary}
            </AppText>
          ) : null}
        </View>
      ) : null}

      {/* Declined details */}
      {showDeclined ? (
        <View style={styles.scenarioBox}>
          <AppText variant={Variant.caption} style={styles.scenarioTitle}>
            Declined details
          </AppText>
          {formatDeclinedAt(response?.declinedAt) ? (
            <AppText variant={Variant.caption} style={styles.scenarioValue}>
              Date declined: {formatDeclinedAt(response?.declinedAt)}
            </AppText>
          ) : null}
          {formatDeclineReason(response?.reason) ? (
            <AppText variant={Variant.caption} style={styles.scenarioValue}>
              Reason: {formatDeclineReason(response?.reason)}
            </AppText>
          ) : null}
        </View>
      ) : null}

      {/* Expired details */}
      {showExpired ? (
        <View style={styles.scenarioBox}>
          <AppText variant={Variant.caption} style={styles.scenarioTitle}>
            Expired details
          </AppText>
          {formatExpiredAt(expiresAt) ? (
            <AppText variant={Variant.caption} style={styles.scenarioValue}>
              Expired: {formatExpiredAt(expiresAt)}
            </AppText>
          ) : null}
          {formatExpiryReason(response?.message || response?.reason) ? (
            <AppText variant={Variant.caption} style={styles.scenarioValue}>
              Reason: {formatExpiryReason(response?.message || response?.reason)}
            </AppText>
          ) : null}
        </View>
      ) : null}

      {/* Scenario 1: Offer Sent, Awaiting Decision */}
      {showScenario1 ? (
        <>
          <View style={styles.scenarioBox}>
            <AppText variant={Variant.caption} style={styles.scenarioTitle}>
              Key offer details
            </AppText>

            {salaryOffered ? (
              <View style={styles.scenarioRow}>
                <AppText variant={Variant.caption} style={styles.scenarioLabel}>
                  Salary offered:
                </AppText>
                <AppText variant={Variant.caption} style={styles.scenarioValue}>
                  {salaryOffered}
                </AppText>
              </View>
            ) : null}

            {workHours ? (
              <View style={styles.scenarioRow}>
                <AppText variant={Variant.caption} style={styles.scenarioLabel}>
                  Work hours:
                </AppText>
                <AppText variant={Variant.caption} style={styles.scenarioValue}>
                  {workHours}
                </AppText>
              </View>
            ) : null}

            {startDate ? (
              <View style={styles.scenarioRow}>
                <AppText variant={Variant.caption} style={styles.scenarioLabel}>
                  Start date:
                </AppText>
                <AppText variant={Variant.caption} style={styles.scenarioValue}>
                  {startDate}
                </AppText>
              </View>
            ) : null}

            {startTime && endTime ? (
              <View style={styles.scenarioRow}>
                <AppText variant={Variant.caption} style={styles.scenarioLabel}>
                  Start/End time:
                </AppText>
                <AppText variant={Variant.caption} style={styles.scenarioValue}>
                  {startTime}–{endTime}
                </AppText>
              </View>
            ) : null}

            {Array.isArray(otherTerms) && otherTerms.length > 0 ? (
              <View style={styles.scenarioRow}>
                <AppText variant={Variant.caption} style={styles.scenarioLabel}>
                  Other terms:
                </AppText>
                <AppText variant={Variant.caption} style={styles.scenarioValue}>
                  {otherTerms.join(' • ')}
                </AppText>
              </View>
            ) : null}
          </View>

          {(experienceSummary || qualificationsSummary) ? (
            <View style={styles.scenarioBox}>
              <AppText variant={Variant.caption} style={styles.scenarioTitle}>
                Candidate summary
              </AppText>
              {experienceSummary ? (
                <AppText variant={Variant.caption} style={styles.scenarioValue}>
                  Experience: {experienceSummary}
                </AppText>
              ) : null}
              {qualificationsSummary ? (
                <AppText variant={Variant.caption} style={styles.scenarioValue}>
                  Qualifications: {qualificationsSummary}
                </AppText>
              ) : null}
            </View>
          ) : null}

          <View style={styles.awaitingRow}>
            <AppText variant={Variant.bodySmall} style={styles.awaitingText}>
              Status: Awaiting response from candidate
            </AppText>
          </View>
        </>
      ) : null}

      {/* Scenario 2: Offer Modification Request */}
      {showScenario2 ? (
        <>
          <View style={styles.scenarioBox}>
            <AppText variant={Variant.caption} style={styles.scenarioTitle}>
              Requested modifications
            </AppText>

            {(originalPayRate || requestedPayRate) ? (
              <View style={styles.diffRow}>
                <AppText variant={Variant.caption} style={styles.diffLabel}>
                  Salary:
                </AppText>
                <View style={styles.diffValueWrap}>
                  <AppText variant={Variant.caption} style={styles.diffOld}>
                    {originalPayRate || '—'}
                  </AppText>
                  <AppText variant={Variant.caption} style={styles.diffArrow}>
                    →
                  </AppText>
                  <AppText variant={Variant.caption} style={styles.diffNew}>
                    {requestedPayRate || '—'}
                  </AppText>
                </View>
              </View>
            ) : null}

            {modificationMessage ? (
              <View style={styles.responseDetail}>
                <AppText variant={Variant.caption} style={styles.responseLabel}>
                  Message / Reason:
                </AppText>
                <AppText variant={Variant.caption} style={styles.responseValue}>
                  {modificationMessage}
                </AppText>
              </View>
            ) : null}
          </View>

          {(experienceSummary || qualificationsSummary) ? (
            <View style={styles.scenarioBox}>
              <AppText variant={Variant.caption} style={styles.scenarioTitle}>
                Candidate summary
              </AppText>
              {experienceSummary ? (
                <AppText variant={Variant.caption} style={styles.scenarioValue}>
                  Experience: {experienceSummary}
                </AppText>
              ) : null}
              {qualificationsSummary ? (
                <AppText variant={Variant.caption} style={styles.scenarioValue}>
                  Qualifications: {qualificationsSummary}
                </AppText>
              ) : null}
            </View>
          ) : null}
        </>
      ) : null}

      {/* Auto badge (quick) */}
      {mode === 'quick' && autoSent && (
        <View style={styles.autoBadge}>
          <AppText variant={Variant.caption} style={styles.autoText}>
            🤖 Auto-sent
          </AppText>
        </View>
      )}

      {/* Message */}
      {message && (
        <View style={styles.responseBox}>
          <AppText variant={Variant.caption} style={styles.responseLabel}>
            Message:
          </AppText>
          <AppText variant={Variant.caption} style={styles.responseValue}>
            {message}
          </AppText>
        </View>
      )}

      {/* Manual response details */}
      {mode === 'manual' && response && (
        <View style={styles.responseBox}>
          <View style={styles.responseHeader}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName={
                response.type === 'accepted'
                  ? 'checkmark-circle'
                  : response.type === 'declined'
                  ? 'close-circle'
                  : 'create-outline'
              }
              size={16}
              color={getStatusColor(
                response.type === 'accepted'
                  ? 'accepted'
                  : response.type === 'declined'
                  ? 'declined'
                  : 'modification_requested',
              )}
            />
            <AppText variant={Variant.bodyMedium} style={styles.responseTitle}>
              {response.type.charAt(0).toUpperCase() + response.type.slice(1)}
            </AppText>
          </View>

          {response.reason && (
            <View style={styles.responseDetail}>
              <AppText variant={Variant.caption} style={styles.responseLabel}>
                Reason:
              </AppText>
              <AppText variant={Variant.caption} style={styles.responseValue}>
                {response.reason.label}
                {response.reason.note ? ` - ${response.reason.note}` : ''}
              </AppText>
            </View>
          )}

          {response.modification && (
            <>
              <View style={styles.responseDetail}>
                <AppText variant={Variant.caption} style={styles.responseLabel}>
                  Requested Pay:
                </AppText>
                <AppText
                  variant={Variant.caption}
                  style={styles.responseValue}
                >
                  {response.modification.payRate}
                </AppText>
              </View>
              {response.modification.message && (
                <View style={styles.responseDetail}>
                  <AppText
                    variant={Variant.caption}
                    style={styles.responseLabel}
                  >
                    Message:
                  </AppText>
                  <AppText
                    variant={Variant.caption}
                    style={styles.responseValue}
                  >
                    {response.modification.message}
                  </AppText>
                </View>
              )}
            </>
          )}
        </View>
      )}

      {/* Actions */}
      <View style={styles.cardActions}>
        {mode === 'quick' && status === 'pending' ? (
          <View style={styles.pendingActions}>
            {onViewProfile && candidateId && jobId ? (
              <TouchableOpacity
                style={styles.viewProfileButton}
                onPress={() => onViewProfile(candidateId, jobId, getProfileNavMeta())}
                activeOpacity={0.8}
              >
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="person-outline"
                  size={18}
                  color={colors.primary}
                />
                <AppText variant={Variant.bodyMedium} style={styles.viewProfileText}>
                  View Full Profile
                </AppText>
              </TouchableOpacity>
            ) : null}

            {onCancel ? (
              <TouchableOpacity
                style={styles.withdrawButton}
                onPress={onCancel}
                activeOpacity={0.8}
              >
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="close"
                  size={18}
                  color={colors.secondary}
                />
                <AppText
                  variant={Variant.bodyMedium}
                  style={styles.withdrawButtonText}
                >
                  Withdraw Offer
                </AppText>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        {status === 'modification_requested' ? (
          <View style={styles.modActions}>
            {onViewProfile && candidateId && jobId ? (
              <TouchableOpacity
                style={styles.viewProfileButton}
                onPress={() => onViewProfile(candidateId, jobId, getProfileNavMeta())}
                activeOpacity={0.8}
              >
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="person-outline"
                  size={18}
                  color={colors.primary}
                />
                <AppText variant={Variant.bodyMedium} style={styles.viewProfileText}>
                  View Full Profile
                </AppText>
              </TouchableOpacity>
            ) : null}

            {onAcceptModification ? (
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={onAcceptModification}
                activeOpacity={0.8}
              >
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="checkmark"
                  size={18}
                  color="#FFFFFF"
                />
                <AppText
                  variant={Variant.bodyMedium}
                  style={styles.acceptButtonText}
                >
                  Accept
                </AppText>
              </TouchableOpacity>
            ) : null}

            {onDeclineModification ? (
              <TouchableOpacity
                style={styles.declineButton}
                onPress={onDeclineModification}
                activeOpacity={0.8}
              >
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="close"
                  size={18}
                  color={colors.secondary}
                />
                <AppText
                  variant={Variant.bodyMedium}
                  style={styles.declineButtonText}
                >
                  Decline
                </AppText>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        {mode === 'quick' && status === 'declined' ? (
          <View style={styles.declinedActions}>
            {onViewProfile && candidateId && jobId ? (
              <TouchableOpacity
                style={styles.viewProfileButton}
                onPress={() => onViewProfile(candidateId, jobId, getProfileNavMeta())}
                activeOpacity={0.8}
              >
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="person-outline"
                  size={18}
                  color={colors.primary}
                />
                <AppText variant={Variant.bodyMedium} style={styles.viewProfileText}>
                  View Full Profile
                </AppText>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        {status === 'expired' ? (
          <View style={styles.declinedActions}>
            {onViewProfile && candidateId && jobId ? (
              <TouchableOpacity
                style={styles.viewProfileButton}
                onPress={() => onViewProfile(candidateId, jobId, getProfileNavMeta())}
                activeOpacity={0.8}
              >
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="person-outline"
                  size={18}
                  color={colors.primary}
                />
                <AppText variant={Variant.bodyMedium} style={styles.viewProfileText}>
                  View Full Profile
                </AppText>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        {mode === 'quick' && status === 'accepted' && (
          <View style={styles.acceptedActions}>
            {onViewProfile && candidateId && jobId ? (
              <TouchableOpacity
                style={[styles.candidateButton, styles.acceptedActionButton]}
                onPress={() => onViewProfile(candidateId, jobId, getProfileNavMeta())}
                activeOpacity={0.8}
              >
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="person-outline"
                  size={18}
                  color={colors.secondary}
                />
                <AppText
                  variant={Variant.bodyMedium}
                  style={styles.candidateButtonText}
                >
                  Candidate
                </AppText>
              </TouchableOpacity>
            ) : null}

            {onMessage ? (
              <TouchableOpacity
                style={[styles.messageButton, styles.acceptedActionButton]}
                onPress={onMessage}
                activeOpacity={0.8}
              >
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName='chatbubble-outline'
                  size={18}
                  color={colors.primary}
                />
                <AppText
                  variant={Variant.bodyMedium}
                  style={styles.messageButtonText}
                >
                  Message
                </AppText>
              </TouchableOpacity>
            ) : (
              <View style={styles.acceptedBadge}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName='checkmark-circle'
                  size={18}
                  color='#10B981'
                />
                <AppText
                  variant={Variant.bodyMedium}
                  style={styles.acceptedText}
                >
                  Offer Accepted
                </AppText>
              </View>
            )}

            {onTrackHours ? (
              <TouchableOpacity
                style={[styles.trackButton, styles.acceptedActionButton]}
                onPress={onTrackHours}
                activeOpacity={0.8}
              >
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName='time-outline'
                  size={18}
                  color='#0D9488'
                />
                <AppText
                  variant={Variant.bodyMedium}
                  style={styles.trackButtonText}
                >
                  Track Hours
                </AppText>
              </TouchableOpacity>
            ) : null}
          </View>
        )}

        {mode === 'manual' && status === 'accepted' && onMessage && (
          <TouchableOpacity
            style={styles.messageButton}
            onPress={onMessage}
            activeOpacity={0.8}
          >
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="chatbubble-outline"
              size={18}
              color={colors.primary}
            />
            <AppText
              variant={Variant.bodyMedium}
              style={styles.messageButtonText}
            >
              Message
            </AppText>
          </TouchableOpacity>
        )}

        {mode === 'quick' && onViewMatches && (
          <TouchableOpacity
            style={styles.viewMatchesButton}
            onPress={onViewMatches}
            activeOpacity={0.8}
          >
            <AppText
              variant={Variant.bodyMedium}
              style={styles.viewMatchesText}
            >
              View all matches
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    </Wrapper>
  );
};

export default OfferCard;

const styles = StyleSheet.create({
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2.5),
    padding: wp(4),
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(2),
  },
  headerLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: getFontSize(18),
    fontWeight: '700',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp(6),
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
  },
  verifiedIcon: {
    marginTop: hp(0.2),
  },
  offerTitle: {
    fontSize: getFontSize(16),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: hp(0.5),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  offerMeta: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  statusBadge: {
    // width: '40%',
    // width: '45%',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
    justifyContent: 'flex-end',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: hp(2),
    gap: wp(1),
  },
  statusText: {
    fontSize: getFontSize(11),
    // width: '100%',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
    paddingVertical: hp(1),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    flex: 1,
  },
  statText: {
    fontSize: getFontSize(12),
    color: colors.secondary,
    fontWeight: '500',
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    marginBottom: hp(1),
  },
  expiryText: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  scenarioBox: {
    backgroundColor: '#F9FAFB',
    padding: wp(3.5),
    borderRadius: hp(1.5),
    marginTop: hp(1),
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  scenarioTitle: {
    color: colors.secondary,
    fontWeight: '700',
    marginBottom: hp(1),
  },
  scenarioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(3),
    marginBottom: hp(0.6),
  },
  scenarioLabel: {
    color: colors.gray,
    flex: 1,
  },
  scenarioValue: {
    color: colors.secondary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  diffRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: wp(3),
    marginBottom: hp(0.8),
  },
  diffLabel: {
    color: colors.gray,
    flex: 1,
  },
  diffValueWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: wp(1.5),
  },
  diffOld: {
    color: colors.gray,
    fontWeight: '600',
  },
  diffArrow: {
    color: colors.secondary,
    fontWeight: '700',
  },
  diffNew: {
    color: colors.primary,
    fontWeight: '700',
  },
  awaitingRow: {
    marginTop: hp(1),
  },
  awaitingText: {
    color: colors.secondary,
    fontWeight: '600',
  },
  autoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.grayE8 || '#F3F4F6',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: 8,
    marginBottom: hp(1),
  },
  autoText: {
    color: colors.gray,
    fontSize: getFontSize(10),
  },
  responseBox: {
    backgroundColor: '#F9FAFB',
    padding: wp(3.5),
    borderRadius: hp(1.5),
    marginTop: hp(1),
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginBottom: hp(1),
  },
  responseTitle: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: colors.secondary,
  },
  responseDetail: {
    marginTop: hp(0.8),
  },
  responseLabel: {
    fontSize: getFontSize(12),
    fontWeight: '600',
    color: colors.gray,
    marginBottom: hp(0.3),
  },
  responseValue: {
    fontSize: getFontSize(12),
    color: colors.secondary,
  },
  cardActions: {
    flexDirection: 'row',
    gap: wp(2),
    marginTop: hp(2),
    flexWrap: 'wrap',
  },
  declinedActions: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
  },
  modActions: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
  },
  pendingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: wp(2),
  },
  viewProfileButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.3),
    paddingHorizontal: wp(3),
    borderRadius: hp(2),
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: wp(1.5),
  },
  viewProfileText: {
    color: colors.primary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  withdrawButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.3),
    paddingHorizontal: wp(3),
    borderRadius: hp(2),
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: wp(1.5),
  },
  withdrawButtonText: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  declineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderRadius: hp(2),
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: wp(1.5),
  },
  declineButtonText: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  modifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderRadius: hp(2),
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: wp(1.5),
  },
  modifyButtonText: {
    color: colors.primary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderRadius: hp(2),
    backgroundColor: '#10B981',
    gap: wp(1.5),
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderRadius: hp(2),
    backgroundColor: '#D1FAE5',
    gap: wp(1.5),
  },
  acceptedText: {
    color: '#065F46',
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  viewMatchesButton: {
    marginLeft: 'auto',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    borderRadius: hp(2),
    borderWidth: 1,
    borderColor: colors.primary,
  },
  viewMatchesText: {
    color: colors.primary,
    fontSize: getFontSize(12),
    fontWeight: '600',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    borderRadius: hp(2),
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: wp(1.5),
  },
  messageButtonText: {
    color: colors.primary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  acceptedActions: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    width: '100%',
    gap: wp(2),
  },
  acceptedActionButton: {
    flex: 1,
    minWidth: 0,
  },
  candidateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    borderRadius: hp(2),
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: wp(1.5),
  },
  candidateButtonText: {
    color: colors.secondary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    borderRadius: hp(2),
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0D9488',
    gap: wp(1.5),
  },
  trackButtonText: {
    color: '#0D9488',
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
});


