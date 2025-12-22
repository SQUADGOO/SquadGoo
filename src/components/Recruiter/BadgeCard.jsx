// src/components/BadgeCard.js
import React, {useMemo, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import AppText, {Variant} from '@/core/AppText';
import {colors, hp} from '@/theme';
import icons from '@/assets/icons';

const MAX_VISIBLE_ITEMS = 3;

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

  return (
    <View style={[styles.card, isDisabled && styles.cardDisabled]}>
      <View style={[styles.accentBar, {backgroundColor: item?.color || colors.primary}]} />
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Image
            source={icons.badge}
            style={{width: hp(3), height: hp(3), resizeMode: 'contain'}}
            tintColor={item.color}
          />
          <AppText
            variant={Variant.bodybold}
            style={[styles.badgeTitle, {color: item.color}]}>
            {item.title}
          </AppText>
          {!!statusLabel && (
            <View
              style={[
                styles.pill,
                {
                  borderColor: item?.color || colors.primary,
                  backgroundColor: colors.white,
                },
              ]}>
              <AppText
                variant={Variant.caption}
                style={[styles.pillText, {color: item?.color || colors.primary}]}>
                {statusLabel}
              </AppText>
            </View>
          )}
        </View>
        <AppText variant={Variant.caption} style={styles.coinText}>
          {item.price} SG Coins
        </AppText>
      </View>

      {/* Requirements */}
      <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
        Requirements:
      </AppText>
      {visibleRequirements.map((req, index) => (
        <AppText key={index} variant={Variant.caption} style={styles.listItem}>
          • {req}
        </AppText>
      ))}

      {/* Benefits */}
      <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
        Benefits:
      </AppText>
      {visibleBenefits.map((ben, index) => (
        <AppText key={index} variant={Variant.caption} style={styles.listItem}>
          • {ben}
        </AppText>
      ))}

      {hasOverflow && (
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={() => setExpanded(v => !v)}>
          <AppText
            variant={Variant.caption}
            style={[styles.showMoreText, {color: item?.color || colors.primary}]}>
            {expanded ? 'Show less' : 'Show more'}
          </AppText>
        </TouchableOpacity>
      )}

      {/* Button */}
      <TouchableOpacity
        style={[
          styles.button,
          {backgroundColor: item?.color || colors.primary},
          isDisabled && styles.buttonDisabled,
        ]}
        onPress={() => {
          if (isDisabled) return;
          onPress?.(item);
        }}>
        <AppText variant={Variant.bodybold} style={styles.buttonText}>
          {item.buttonLabel}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

export default BadgeCard;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.white,
    borderColor: colors.text,
    marginBottom: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  cardDisabled: {
    opacity: 0.92,
  },
  accentBar: {
    height: 4,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  badgeTitle: {
    marginLeft: 8,
    marginRight: 8,
  },
  coinText: {
    color: colors.text,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
  },
  pillText: {
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sectionTitle: {
    marginTop: 10,
    color: colors.black,
  },
  listItem: {
    color: colors.text,
    marginLeft: 6,
    marginTop: 4,
  },
  showMoreButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  showMoreText: {
    textDecorationLine: 'underline',
  },
  button: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: '#fff',
  },
});
