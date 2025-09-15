// src/components/BadgeCard.js
import React from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import AppText, {Variant} from '@/core/AppText';
import {colors, hp} from '@/theme';
import icons from '@/assets/icons';

const BadgeCard = ({item, onPress}) => {
  return (
    <View style={styles.card}>
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
        </View>
        <AppText variant={Variant.caption} style={styles.coinText}>
          {item.price} SG Coins
        </AppText>
      </View>

      {/* Requirements */}
      <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
        Requirements:
      </AppText>
      {item.requirements.map((req, index) => (
        <AppText key={index} variant={Variant.caption} style={styles.listItem}>
          • {req}
        </AppText>
      ))}

      {/* Benefits */}
      <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
        Benefits:
      </AppText>
      {item.benefits.map((ben, index) => (
        <AppText key={index} variant={Variant.caption} style={styles.listItem}>
          • {ben}
        </AppText>
      ))}

      {/* Button */}
      <TouchableOpacity
        style={[styles.button, {backgroundColor: item.color}]}
        onPress={() => onPress?.(item)}>
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
    borderRadius: 10,
    padding: 18,
    backgroundColor: colors.white,
    borderColor:colors.text,
    marginBottom: 16,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeTitle: {
    marginLeft: 6,
  },
  coinText: {
    color: colors.text,
  },
  sectionTitle: {
    marginTop: 6,
    color: colors.black,
  },
  listItem: {
    color: colors.text,
    marginLeft: 6,
    marginVertical: 1,
  },
  button: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
});
