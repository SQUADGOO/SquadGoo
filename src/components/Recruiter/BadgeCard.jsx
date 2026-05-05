import React, {useMemo, useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppText, {Variant} from '@/core/AppText';
import VectorIcons, {iconLibName} from '@/theme/vectorIcon';
import {colors, getFontSize, hp} from '@/theme';

const MAX_VISIBLE_ITEMS = 3;

const TIER_GRADIENTS = {
  bronze: ['#CD7F32', '#A0622B'],
  platinum: ['#9B59B6', '#7D3FA0'],
  gold: ['#D4AF37', '#C4982B'],
  pro: ['#3D5AFE', '#536DFE'],
};

const TIER_ICONS = {
  bronze: 'shield-outline',
  platinum: 'diamond-outline',
  gold: 'trophy-outline',
  pro: 'ribbon-outline',
};

const BadgeCard = ({item, onPress}) => {
  const [expanded, setExpanded] = useState(false);

  const requirements = Array.isArray(item?.requirements) ? item.requirements : [];
  const benefits = Array.isArray(item?.benefits) ? item.benefits : [];

  const hasOverflow =
    requirements.length > MAX_VISIBLE_ITEMS || benefits.length > MAX_VISIBLE_ITEMS;

  const visibleRequirements = useMemo(() => {
    return expanded ? requirements : requirements.slice(0, MAX_VISIBLE_ITEMS);
  }, [expanded, requirements]);

  const visibleBenefits = useMemo(() => {
    return expanded ? benefits : benefits.slice(0, MAX_VISIBLE_ITEMS);
  }, [expanded, benefits]);

  const isDisabled = Boolean(item?.disabled);
  const statusLabel = item?.statusLabel;
  const gradient = TIER_GRADIENTS[item?.key] || [colors.primary, colors.primary];
  const tierIcon = TIER_ICONS[item?.key] || 'shield-outline';

  return (
    <View style={[styles.card, isDisabled && styles.cardDisabled]}>
      {/* Gradient Header */}
      <View style={styles.cardHeaderWrap}>
        <LinearGradient
          colors={gradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.cardHeaderContent}>
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName={tierIcon}
                size={22}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.titleWrap}>
              <AppText variant={Variant.subTitle} style={styles.badgeTitle} numberOfLines={1}>
                {item.title}
              </AppText>
              {!!statusLabel && (
                <View style={styles.statusPill}>
                  <AppText variant={Variant.caption} style={styles.statusText}>
                    {statusLabel}
                  </AppText>
                </View>
              )}
            </View>
          </View>
          <View style={styles.priceBlock}>
            <AppText variant={Variant.title} style={styles.priceValue}>
              {item.price}
            </AppText>
            <AppText variant={Variant.caption} style={styles.priceUnit}>
              SG Coins
            </AppText>
          </View>
        </View>
      </View>

      {/* Card Body */}
      <View style={styles.cardBody}>
        {/* Requirements */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="checkmark-circle-outline"
              size={16}
              color={item?.color || colors.primary}
            />
            <AppText
              variant={Variant.bodyMedium}
              style={[styles.sectionLabel, {color: item?.color || colors.primary}]}>
              Requirements
            </AppText>
          </View>
          {visibleRequirements.map((req, index) => (
            <View key={index} style={styles.listRow}>
              <View style={[styles.bullet, {backgroundColor: item?.color || colors.primary}]} />
              <AppText variant={Variant.body} style={styles.listText}>
                {req}
              </AppText>
            </View>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Benefits */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="star-outline"
              size={16}
              color={item?.color || colors.primary}
            />
            <AppText
              variant={Variant.bodyMedium}
              style={[styles.sectionLabel, {color: item?.color || colors.primary}]}>
              Benefits
            </AppText>
          </View>
          {visibleBenefits.map((ben, index) => (
            <View key={index} style={styles.listRow}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="checkmark"
                size={14}
                color="#10B981"
              />
              <AppText variant={Variant.body} style={styles.listText}>
                {ben}
              </AppText>
            </View>
          ))}
        </View>

        {hasOverflow && (
          <TouchableOpacity
            style={styles.showMoreButton}
            activeOpacity={0.7}
            onPress={() => setExpanded(v => !v)}>
            <AppText
              variant={Variant.bodyMedium}
              style={[styles.showMoreText, {color: item?.color || colors.primary}]}>
              {expanded ? 'Show less' : `Show all (${requirements.length + benefits.length})`}
            </AppText>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName={expanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={item?.color || colors.primary}
            />
          </TouchableOpacity>
        )}

        {/* CTA Button */}
        <TouchableOpacity
          style={[
            styles.ctaButton,
            {backgroundColor: item?.color || colors.primary},
            isDisabled && styles.ctaDisabled,
          ]}
          activeOpacity={0.8}
          onPress={() => {
            if (isDisabled) return;
            onPress?.(item);
          }}>
          <AppText variant={Variant.bodyMedium} style={styles.ctaText}>
            {item.buttonLabel}
          </AppText>
          {!isDisabled && (
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="arrow-forward"
              size={16}
              color="#FFFFFF"
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BadgeCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    backgroundColor: colors.white,
    marginBottom: hp(2),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  cardDisabled: {
    opacity: 0.75,
  },

  // Header
  cardHeaderWrap: {
    overflow: 'hidden',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  cardHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
    marginRight: 8,
  },
  titleWrap: {
    flex: 1,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: getFontSize(15),
    flexShrink: 1,
  },
  statusPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 3,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: getFontSize(10),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceBlock: {
    alignItems: 'center',
    flexShrink: 0,
  },
  priceValue: {
    color: '#FFFFFF',
    fontSize: getFontSize(24),
    fontWeight: '800',
  },
  priceUnit: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: getFontSize(10),
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  // Body
  cardBody: {
    padding: 16,
    paddingTop: 12,
  },
  section: {
    marginBottom: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sectionLabel: {
    fontWeight: '700',
    fontSize: getFontSize(13),
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 6,
    paddingLeft: 4,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  listText: {
    color: colors.darkGray || '#535862',
    fontSize: getFontSize(13),
    flex: 1,
    lineHeight: getFontSize(19),
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayE8 || '#E8E8EA',
    marginVertical: 10,
  },

  // Show More
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  showMoreText: {
    fontWeight: '600',
    fontSize: getFontSize(13),
  },

  // CTA
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: getFontSize(15),
  },
});
