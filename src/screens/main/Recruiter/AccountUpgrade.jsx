import React, {useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import BadgeCard from '@/components/Recruiter/BadgeCard';
import AppHeader from '@/core/AppHeader';
import AppText, {Variant} from '@/core/AppText';
import Scrollable from '@/core/Scrollable';
import {colors, getFontSize, hp} from '@/theme';
import VectorIcons, {iconLibName} from '@/theme/vectorIcon';
import {recruiterBadges, recruiterExtraPurchases} from '@/utilities/dummyData';
import {showToast, toastTypes} from '@/utilities/toastConfig';

const TIER_COLORS = {
  Free: '#9CA3AF',
  Bronze: '#CD7F32',
  Platinum: '#A631FB',
  Gold: '#D08700',
};

const BadgeScreen = () => {
  const userInfo = useSelector(state => state?.auth?.userInfo);
  const walletCoins = useSelector(state => state?.wallet?.coins);
  const currentBadgeKey = userInfo?.badge;
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

  const tierColor = TIER_COLORS[currentTierLabel] || TIER_COLORS.Free;

  const badgesData = useMemo(() => {
    return recruiterBadges.map(badge => {
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
      `"${badge?.title}" purchase flow will be added next.`,
      'Coming soon',
      toastTypes.warning,
    );
  };

  const coinsValue = Number.isFinite(walletCoins) ? walletCoins : 0;

  return (
    <View style={styles.screen}>
      <AppHeader title="Account Upgrades" showTopIcons={false} />

      <Scrollable style={{flex: 1}} contentContainerStyle={styles.container}>
        {/* Hero Summary Card */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={[colors.secondary, '#3D1A5E']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroTop}>
            <View style={styles.heroTitleBlock}>
              <AppText variant={Variant.caption} style={styles.heroLabel}>
                YOUR CURRENT PLAN
              </AppText>
              <View style={styles.heroTierRow}>
                <View style={[styles.tierDot, {backgroundColor: tierColor}]} />
                <AppText variant={Variant.title} style={styles.heroTier}>
                  {currentTierLabel}
                </AppText>
              </View>
            </View>
            <View style={styles.walletPill}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="wallet-outline"
                size={14}
                color="#FFD580"
              />
              <AppText variant={Variant.bodyMedium} style={styles.walletText}>
                {coinsValue} SG
              </AppText>
            </View>
          </View>

          <View style={styles.heroStats}>
            <View style={styles.heroStatItem}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="shield-checkmark-outline"
                size={18}
                color="rgba(255,255,255,0.7)"
              />
              <View>
                <AppText variant={Variant.caption} style={styles.heroStatLabel}>
                  Badge Tier
                </AppText>
                <AppText variant={Variant.bodyMedium} style={styles.heroStatValue}>
                  {currentTierLabel}
                </AppText>
              </View>
            </View>

            <View style={styles.heroStatDivider} />

            <View style={styles.heroStatItem}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="diamond-outline"
                size={18}
                color="rgba(255,255,255,0.7)"
              />
              <View>
                <AppText variant={Variant.caption} style={styles.heroStatLabel}>
                  PRO Status
                </AppText>
                <AppText variant={Variant.bodyMedium} style={styles.heroStatValue}>
                  {proEnabled ? 'Active' : 'Not active'}
                </AppText>
              </View>
            </View>
          </View>

          <AppText variant={Variant.caption} style={styles.heroHint}>
            Upgrade to unlock more recruiter features and discounts
          </AppText>
        </View>

        {/* Badge Plans */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="ribbon-outline"
              size={20}
              color={colors.primary}
            />
            <AppText variant={Variant.subTitle} style={styles.sectionTitle}>
              Badge Plans
            </AppText>
          </View>
          <AppText variant={Variant.body} style={styles.sectionSubtitle}>
            Premium badges to unlock Squad Hiring, in-app payments, discounts and more
          </AppText>
        </View>

        <View style={styles.listContainer}>
          {badgesData.map(item => (
            <BadgeCard key={item.id} item={item} onPress={handlePressBadge} />
          ))}
        </View>

        {/* Extra Purchases */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="cart-outline"
              size={20}
              color={colors.primary}
            />
            <AppText variant={Variant.subTitle} style={styles.sectionTitle}>
              Extra Purchases
            </AppText>
          </View>
          <AppText variant={Variant.body} style={styles.sectionSubtitle}>
            One-off add-ons to enhance your profile
          </AppText>
        </View>

        {extrasData.map(extra => (
          <View key={extra.id} style={styles.extraCard}>
            <LinearGradient
              colors={['#3D5AFE', '#536DFE']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.extraAccentBar}
            />
            <View style={styles.extraBody}>
              <View style={styles.extraHeaderRow}>
                <View style={styles.extraIconWrap}>
                  <VectorIcons
                    name={iconLibName.Ionicons}
                    iconName="diamond"
                    size={22}
                    color="#3D5AFE"
                  />
                </View>
                <View style={{flex: 1}}>
                  <AppText variant={Variant.subTitle} style={styles.extraTitle}>
                    {extra.title}
                  </AppText>
                  {!!extra.description && (
                    <AppText variant={Variant.body} style={styles.extraSubtitle}>
                      {extra.description}
                    </AppText>
                  )}
                </View>
              </View>

              <View style={styles.extraFooter}>
                <View style={styles.extraPricePill}>
                  <AppText variant={Variant.bodyMedium} style={styles.extraPriceText}>
                    {extra.price} SG Coins
                  </AppText>
                </View>
                <TouchableOpacity
                  style={[
                    styles.purchaseButton,
                    extra.disabled && styles.purchaseButtonDisabled,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (extra.disabled) return;
                    showToast(
                      `"${extra?.title}" purchase flow will be added next.`,
                      'Coming soon',
                      toastTypes.warning,
                    );
                  }}>
                  <AppText variant={Variant.bodyMedium} style={styles.purchaseText}>
                    {extra.buttonLabel}
                  </AppText>
                  {!extra.disabled && (
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
          </View>
        ))}

        <View style={{height: hp(4)}} />
      </Scrollable>
    </View>
  );
};

export default BadgeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgColor || '#FFF9F6',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: hp(4),
  },

  // Hero Card
  heroCard: {
    borderRadius: 20,
    padding: 16,
    marginTop: hp(1.5),
    marginBottom: hp(2.5),
    overflow: 'hidden',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroTitleBlock: {
    flex: 1,
    flexShrink: 1,
    marginRight: 10,
    overflow: 'hidden',
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: getFontSize(11),
    letterSpacing: 1.2,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  heroTierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  tierDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  heroTier: {
    color: '#FFFFFF',
    fontSize: getFontSize(24),
    fontWeight: '800',
  },
  walletPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexShrink: 0,
  },
  walletText: {
    color: '#FFD580',
    fontWeight: '700',
    fontSize: getFontSize(13),
  },

  heroStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    marginTop: 16,
    paddingVertical: 12,
  },
  heroStatItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 6,
  },
  heroStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: getFontSize(10),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroStatValue: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: getFontSize(14),
  },
  heroHint: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: getFontSize(11),
    textAlign: 'center',
    marginTop: hp(1.8),
  },

  // Section Headers
  sectionHeader: {
    marginTop: 4,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    color: colors.black,
    fontWeight: '700',
    fontSize: getFontSize(18),
  },
  sectionSubtitle: {
    color: colors.gray,
    fontSize: getFontSize(13),
    marginLeft: 28,
  },
  listContainer: {
    marginBottom: hp(1),
  },

  // Extra Purchase Cards
  extraCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: hp(2),
    overflow: 'hidden',
    shadowColor: '#3D5AFE',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  extraAccentBar: {
    height: 4,
  },
  extraBody: {
    padding: 16,
  },
  extraHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  extraIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraTitle: {
    color: colors.black,
    fontWeight: '700',
    fontSize: getFontSize(16),
  },
  extraSubtitle: {
    color: colors.gray,
    fontSize: getFontSize(12),
    marginTop: hp(0.5),
    lineHeight: getFontSize(18),
  },
  extraFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(2),
  },
  extraPricePill: {
    backgroundColor: '#EEF0FF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  extraPriceText: {
    color: '#3D5AFE',
    fontWeight: '700',
    fontSize: getFontSize(13),
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#3D5AFE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  purchaseButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  purchaseText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: getFontSize(13),
  },
});
