import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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
 */
const OfferCard = ({
  mode = 'manual',
  candidateName,
  jobTitle,
  status,
  matchPercentage,
  acceptanceRating,
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

  return (
    <Wrapper style={styles.offerCard} {...wrapperProps}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <AppText variant={Variant.bodyMedium} style={styles.avatarText}>
              {candidateName?.charAt(0)?.toUpperCase() || 'U'}
            </AppText>
          </View>
          <View style={styles.headerInfo}>
            <AppText variant={Variant.bodyMedium} style={styles.offerTitle}>
              {candidateName}
            </AppText>
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
          </View>
        </View>

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
            {status.replace('_', ' ').toUpperCase()}
          </AppText>
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
        {mode === 'quick' && status === 'pending' && onCancel && (
          <TouchableOpacity
            style={styles.declineButton}
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
              style={styles.declineButtonText}
            >
              Cancel Offer
            </AppText>
          </TouchableOpacity>
        )}

        {mode === 'quick' &&
          (status === 'declined' || status === 'expired') &&
          onResend && (
            <TouchableOpacity
              style={styles.modifyButton}
              onPress={onResend}
              activeOpacity={0.8}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="refresh-outline"
                size={18}
                color={colors.primary}
              />
              <AppText
                variant={Variant.bodyMedium}
                style={styles.modifyButtonText}
              >
                Resend to Next Match
              </AppText>
            </TouchableOpacity>
          )}

        {mode === 'quick' && status === 'accepted' && (
          <View style={styles.acceptedBadge}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="checkmark-circle"
              size={18}
              color="#10B981"
            />
            <AppText
              variant={Variant.bodyMedium}
              style={styles.acceptedText}
            >
              Offer Accepted
            </AppText>
          </View>
        )}

        {mode === 'manual' &&
          status === 'modification_requested' &&
          onAcceptModification &&
          onDeclineModification && (
            <>
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
            </>
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
  headerInfo: {
    flex: 1,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: hp(2),
    gap: wp(1),
  },
  statusText: {
    fontSize: getFontSize(11),
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
});


