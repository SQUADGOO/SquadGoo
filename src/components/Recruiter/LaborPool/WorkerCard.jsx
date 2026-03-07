import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';

/**
 * WorkerCard component for displaying worker information in Labor Pool.
 *
 * Props:
 * - name: Worker's name
 * - role: Worker's role/job title
 * - location: Worker's location
 * - availability: Worker's availability status
 * - rate: Worker's hourly rate
 * - rating: Worker's rating
 * - onView: Callback when View button is pressed
 * - onOffer: Callback when Offer button is pressed
 * - onPress: Optional callback when card is pressed
 * - badge: Optional badge level (Bronze, Silver, Gold, Platinum)
 * - keySkills: Optional array of strings to show as "KEY SKILLS" chips (used for Squad cards)
 * - onPressRating: Optional callback when rating is pressed (used to open Reviews)
 */

const BADGE_COLORS = {
  Bronze: '#CD7F32',
  Silver: '#A0AEC0',
  Gold: '#F59E0B',
  Platinum: '#8B5CF6',
};

const WorkerCard = ({
  name,
  role,
  location,
  availability,
  rate,
  rating,
  badge,
  onView,
  onOffer,
  onPress,
  keySkills = [],
  onPressRating,
}) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  const wrapperProps = onPress
    ? { activeOpacity: 0.7, onPress }
    : {};

  const visibleSkills = useMemo(() => {
    const skills = (keySkills || []).filter(Boolean);
    return skills.slice(0, 6);
  }, [keySkills]);

  return (
    <Wrapper style={styles.card} {...wrapperProps}>
      {/* Badge pill */}
      {badge ? (
        <View style={styles.badgeRow}>
          <View style={[styles.badgePill, { backgroundColor: BADGE_COLORS[badge] || BADGE_COLORS.Bronze }]}>
            <VectorIcons name={iconLibName.Ionicons} iconName="ribbon" size={11} color="#FFFFFF" />
            <AppText variant={Variant.caption} style={styles.badgeText}>{badge}</AppText>
          </View>
        </View>
      ) : null}

      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <AppText variant={Variant.bodyMedium} style={styles.avatarText}>
              {name?.charAt(0)?.toUpperCase() || 'U'}
            </AppText>
          </View>
          <View style={styles.headerInfo}>
            <AppText variant={Variant.bodyMedium} style={styles.name}>
              {name}
            </AppText>
            <View style={styles.metaRow}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="briefcase-outline"
                size={12}
                color={colors.gray}
              />
              <AppText variant={Variant.caption} style={styles.role}>
                {role}
              </AppText>
            </View>
          </View>
        </View>

        <TouchableOpacity
          disabled={!onPressRating}
          onPress={onPressRating}
          activeOpacity={0.85}
          style={styles.ratingContainer}
        >
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="star"
            size={14}
            color="#F59E0B"
          />
          <AppText variant={Variant.caption} style={styles.ratingText}>
            {rating}
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="location-outline"
            size={14}
            color={colors.primary}
          />
          <AppText variant={Variant.caption} style={styles.statText}>
            {location}
          </AppText>
        </View>
        <View style={styles.statItem}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="time-outline"
            size={14}
            color={colors.primary}
          />
          <AppText variant={Variant.caption} style={styles.statText}>
            {availability}
          </AppText>
        </View>
      </View>

      {/* Rate */}
      <View style={styles.expiryContainer}>
        <VectorIcons
          name={iconLibName.Ionicons}
          iconName="cash-outline"
          size={14}
          color={colors.gray}
        />
        <AppText variant={Variant.caption} style={styles.expiryText}>
          {rate}
        </AppText>
      </View>

      {/* Key skills (for squad cards) */}
      {visibleSkills.length ? (
        <View style={styles.skillsSection}>
          <AppText variant={Variant.caption} style={styles.skillsTitle}>
            KEY SKILLS
          </AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.skillsRow}>
            {visibleSkills.map((s) => (
              <View key={s} style={styles.skillChip}>
                <AppText variant={Variant.caption} style={styles.skillChipText}>
                  {s}
                </AppText>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.viewButton}
          activeOpacity={0.8}
          onPress={onView}
        >
          <AppText variant={Variant.bodyMedium} style={styles.viewButtonText}>
            View
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.offerButton}
          activeOpacity={0.8}
          onPress={onOffer}
        >
          <AppText variant={Variant.bodyMedium} style={styles.offerButtonText}>
            Offer
          </AppText>
        </TouchableOpacity>
      </View>
    </Wrapper>
  );
};

export default WorkerCard;

const styles = StyleSheet.create({
  card: {
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
  badgeRow: {
    flexDirection: 'row',
    marginBottom: hp(1),
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: hp(1.5),
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: getFontSize(10),
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
  name: {
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
  role: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: hp(2),
    backgroundColor: `${'#F59E0B'}15`,
    gap: wp(1),
  },
  ratingText: {
    fontSize: getFontSize(11),
    fontWeight: '600',
    color: '#F59E0B',
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
    width: '90%',
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
  skillsSection: {
    marginTop: hp(0.5),
  },
  skillsTitle: {
    color: colors.gray,
    fontWeight: '800',
    marginBottom: hp(1),
  },
  skillsRow: {
    gap: wp(2),
    paddingRight: wp(2),
  },
  skillChip: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.7),
    borderRadius: 999,
  },
  skillChipText: {
    color: colors.primary,
    fontWeight: '700',
  },
  cardActions: {
    flexDirection: 'row',
    gap: wp(2),
    marginTop: hp(2),
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    borderRadius: hp(2),
    backgroundColor: colors.primary,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  offerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    borderRadius: hp(2),
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  offerButtonText: {
    color: colors.primary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
});
