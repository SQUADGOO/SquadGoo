import React from 'react'
import { View, StyleSheet } from 'react-native'
import { colors, hp, wp, getFontSize, borders } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import { useNavigation } from '@react-navigation/native'
import { screenNames } from '@/navigation/screenNames'
import { useSelector } from 'react-redux'

const WalletBalanceComponent = ({
  balance,
  onPurchaseCoin,
  onWithdrawCoin,
  balanceTitle = "Current Squad Go wallet balance",
  containerStyle
}) => {
  const navigation = useNavigation()
  const walletCoins = useSelector(state => state.wallet.coins)
  const displayBalance = balance !== undefined ? balance : walletCoins
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Balance Display */}
      <View style={styles.balanceContainer}>
        <AppText variant={Variant.body} style={styles.balanceTitle}>
          {balanceTitle}
        </AppText>
        <AppText variant={Variant.largeTitle} style={styles.balanceAmount}>
          {displayBalance}
        </AppText>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonWrapper}>
          <AppButton
            onPress={() => navigation.navigate(screenNames.PURCHASE_COINS)}
            text="Purchase Coin"
            bgColor={colors.primary}
            textColor="#FFFFFF"
            // style={styles.button}
          />
        </View>
        
        <View style={styles.buttonWrapper}>
          <AppButton
            text="Withdraw Coin"
            onPress={() => navigation.navigate(screenNames.WITHDRAW_COINS)}
            bgColor={colors.secondary}
            textColor="#FFFFFF"
            // style={styles.button}
          />
        </View>
      </View>
    </View>
  )
}

export default WalletBalanceComponent

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: wp(4),
    gap: 10,
    // paddingVertical: hp(3),
  },
  balanceContainer: {
    padding: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: borders.borderMainradius,
    // paddingVertical: hp(4),
    // paddingHorizontal: wp(6),
    alignItems: 'center',
    // marginBottom: hp(3),
  },
  balanceTitle: {
    color: colors.white,
    fontSize: getFontSize(13),
    textAlign: 'center',
    // marginBottom: hp(2),
    fontWeight: '500',
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: getFontSize(38),
    fontWeight: 'bold',
    // lineHeight: getFontSize(80),
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: wp(4),
  },
  buttonWrapper: {
    flex: 1,
  },
  button: {
    borderRadius: hp(3),
    paddingVertical: hp(2.5),
  },
})