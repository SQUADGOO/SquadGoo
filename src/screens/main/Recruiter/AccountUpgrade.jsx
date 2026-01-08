import React, {useMemo} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import BadgeCard from '@/components/Recruiter/BadgeCard';
import AppHeader from '@/core/AppHeader';
import AppText, {Variant} from '@/core/AppText';
import Scrollable from '@/core/Scrollable';
import {colors, hp, wp} from '@/theme';
import {recruiterBadges, recruiterExtraPurchases} from '@/utilities/dummyData';
import {showToast, toastTypes} from '@/utilities/toastConfig';

const BadgeScreen = () => {
  const userInfo = useSelector(state => state?.auth?.userInfo);
  const walletCoins = useSelector(state => state?.wallet?.coins);
  const currentBadgeKey = userInfo?.badge; // 'bronze' | 'platinum' | 'gold' | null
  const proEnabled = Boolean(userInfo?.proEnabled || userInfo?.isPro);

  const badgeRank = useMemo(
    () => ({bronze: 1, platinum: 2, gold: 3}),
    [],
  );

  const currentTierLabel = useMemo(() => {
    if (!currentBadgeKey) return 'Free';
    if (currentBadgeKey === 'bronze') return 'Bronze';
    if (currentBadgeKey === 'platinum') return 'Platinum';
    if (currentBadgeKey === 'gold') return 'Gold';
    return 'Free';
  }, [currentBadgeKey]);

  const badgesData = useMemo(() => {
    return recruiterBadges.map(badge => {
      // PRO is not part of badgeRank; treat separately
      if (badge.key === 'pro') {
        return {
          ...badge,
          statusLabel: proEnabled ? 'Owned' : 'Add-on',
          disabled: proEnabled,
          buttonLabel: proEnabled ? 'Owned' : badge.buttonLabel,
        };
      }

      const currentRank = badgeRank[currentBadgeKey] || 0;
      const itemRank = badgeRank[badge.key] || 0;

      if (badge.key === currentBadgeKey) {
        return {
          ...badge,
          statusLabel: 'Current plan',
          disabled: true,
          buttonLabel: 'Current Plan',
        };
      }

      if (currentRank > 0 && itemRank > 0 && itemRank < currentRank) {
        return {
          ...badge,
          statusLabel: 'Not available',
          disabled: true,
          buttonLabel: 'Already Upgraded',
        };
      }

      return badge;
    });
  }, [badgeRank, currentBadgeKey, proEnabled]);

  const extrasData = useMemo(() => {
    return recruiterExtraPurchases.map(extra => ({
      ...extra,
      buttonLabel: proEnabled && extra.key === 'pro' ? 'Owned' : 'Purchase',
      disabled: proEnabled && extra.key === 'pro',
    }));
  }, [proEnabled]);

  const handlePressBadge = badge => {
    if (badge?.disabled) return;
    showToast(
      `“${badge?.title}” purchase flow will be added next.`,
      'Coming soon',
      toastTypes.warning,
    );
  };

  return (
    <>
      <AppHeader title="Account Upgrades" showTopIcons={false} />

      <Scrollable contentContainerStyle={styles.container}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View style={{flex: 1}}>
              <AppText variant={Variant.bodybold} style={styles.summaryTitle}>
                Your plan
              </AppText>
              <AppText variant={Variant.caption} style={styles.summarySubtitle}>
                Upgrade to unlock more recruiter features
              </AppText>
            </View>
            <View style={styles.coinsPill}>
              <AppText variant={Variant.caption} style={styles.coinsPillText}>
                {Number.isFinite(walletCoins) ? walletCoins : 0} SG
              </AppText>
            </View>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <AppText variant={Variant.caption} style={styles.summaryLabel}>
                Current tier
              </AppText>
              <AppText variant={Variant.bodybold} style={styles.summaryValue}>
                {currentTierLabel}
              </AppText>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <AppText variant={Variant.caption} style={styles.summaryLabel}>
                PRO
              </AppText>
              <AppText variant={Variant.bodybold} style={styles.summaryValue}>
                {proEnabled ? 'Owned' : 'Not owned'}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
            Account Upgrades
          </AppText>
          <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
            Premium badges to unlock Squad Hiring, in-app payments, discounts and more
          </AppText>
        </View>

        <FlatList
          data={badgesData}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <BadgeCard item={item} onPress={handlePressBadge} />
          )}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={false}
        />

        <View style={styles.sectionHeader}>
          <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
            Extra Purchases
          </AppText>
          <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
            One-off add-ons that can be purchased separately
          </AppText>
        </View>

        {extrasData.map(extra => (
          <View key={extra.id} style={styles.extraCard}>
            <View
              style={[
                styles.extraAccentBar,
                {backgroundColor: colors.primary},
              ]}
            />
            <View style={styles.extraHeaderRow}>
              <View style={{flex: 1, paddingRight: 10}}>
                <AppText variant={Variant.bodybold} style={styles.extraTitle}>
                  {extra.title}
                </AppText>
                {!!extra.description && (
                  <AppText variant={Variant.caption} style={styles.extraSubtitle}>
                    {extra.description}
                  </AppText>
                )}
              </View>
              <View style={styles.extraPricePill}>
                <AppText variant={Variant.caption} style={styles.extraPriceText}>
                  {extra.price} SG
                </AppText>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.purchaseButton,
                extra.disabled && styles.purchaseButtonDisabled,
              ]}
              onPress={() => {
                if (extra.disabled) return;
                showToast(
                  `“${extra?.title}” purchase flow will be added next.`,
                  'Coming soon',
                  toastTypes.warning,
                );
              }}>
              <AppText variant={Variant.bodybold} style={styles.purchaseText}>
                {extra.buttonLabel}
              </AppText>
            </TouchableOpacity>
          </View>
        ))}
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
  summaryCard: {
    borderWidth: 1,
    borderColor: colors.text,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    marginBottom: 14,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryTitle: {
    color: colors.black,
  },
  summarySubtitle: {
    color: colors.text,
    marginTop: 4,
  },
  coinsPill: {
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  coinsPillText: {
    color: colors.black,
  },
  summaryGrid: {
    marginTop: 14,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 12,
    overflow: 'hidden',
  },
  summaryItem: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.text,
  },
  summaryLabel: {
    color: colors.text,
  },
  summaryValue: {
    color: colors.black,
    marginTop: 4,
  },
  sectionHeader: {
    marginTop: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    marginBottom: 4,
    color: colors.black,
  },
  sectionSubtitle: {
    marginBottom: 16,
    color: colors.text,
  },
  extraCard: {
    borderWidth: 1,
    borderColor: colors.text,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: hp(2),
    overflow: 'hidden',
  },
  extraAccentBar: {
    height: 4,
    width: '100%',
  },
  extraHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 14,
    paddingBottom: 10,
  },
  extraTitle: {
    color: colors.black,
  },
  extraSubtitle: {
    color: colors.text,
    marginTop: 6,
  },
  extraPricePill: {
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  extraPriceText: {
    color: colors.black,
  },
  purchaseButton: {
    backgroundColor: colors.primary, // use your theme color
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 14,
    marginBottom: 14,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseText: {
    color: '#fff',
  },
});
