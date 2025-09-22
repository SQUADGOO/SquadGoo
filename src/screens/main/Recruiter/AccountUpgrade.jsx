import React from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import BadgeCard from '@/components/Recruiter/BadgeCard';
import AppHeader from '@/core/AppHeader';
import AppText, {Variant} from '@/core/AppText';
import Scrollable from '@/core/Scrollable';
import globalStyles from '@/styles/globalStyles';
import {colors, hp, wp} from '@/theme';
import {badges} from '@/utilities/dummyData';

const BadgeScreen = () => {
  return (
    <>
      <AppHeader title="Account Upgrades" showTopIcons={false} />

      <Scrollable contentContainerStyle={styles.container}>
        <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
          Account Upgrades
        </AppText>
        <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
          Enhance your profile with premium badges
        </AppText>

        <FlatList
          data={badges}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <BadgeCard
              item={item}
              onPress={() => console.log('Pressed', item)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={false}
        />

        <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
          Extra Purchases
        </AppText>
        <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
          Additional services not included in badge memberships
        </AppText>

        <View style={{flexDirection:'row',width:wp(90),justifyContent:'space-between',marginVertical:hp(1)}}>
          <AppText variant={Variant.bodybold}>
            Resume/Experience Verification
          </AppText>
          <AppText variant={Variant.bodybold}>50 SG Coins</AppText>
        </View>
        <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
          Get PRO verification badge on your profile. Valid for 12 months.
        </AppText>

        <TouchableOpacity style={styles.purchaseButton}>
          <AppText variant={Variant.bodybold} style={styles.purchaseText}>
            Purchase
          </AppText>
        </TouchableOpacity>
      </Scrollable>
    </>
  );
};

export default BadgeScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  listContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 4,
    color: colors.black,
  },
  sectionSubtitle: {
    marginBottom: 16,
    color: colors.text,
  },
  extraRow: {
    marginBottom: 6,
  },
  extraText: {
    color: colors.black,
  },
  extraPrice: {
    color: colors.black,
  },
  purchaseButton: {
    marginTop: 12,
    backgroundColor: colors.primary, // use your theme color
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  purchaseText: {
    color: '#fff',
  },
});
