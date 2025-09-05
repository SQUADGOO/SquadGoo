import React, { useState } from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput
} from 'react-native'
import { colors, hp, wp, getFontSize, borders } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import AppHeader from '@/core/AppHeader'
import { screenNames } from '@/navigation/screenNames'

const FormSummary = ({ navigation }) => {
  const [withdrawAmount, setWithdrawAmount] = useState(1)
  const [availableCoins] = useState(70)
  
  const transactionFees = 1 // Fixed transaction fee
  const totalCoins = withdrawAmount - transactionFees
  const coinToUsdRate = 1.0 // 1 SGCOIN = 1 USD
  const totalUsdAmount = totalCoins * coinToUsdRate

  const incrementCoins = () => {
    if (withdrawAmount < availableCoins) {
      setWithdrawAmount(prev => prev + 1)
    }
  }

  const decrementCoins = () => {
    if (withdrawAmount > 1) {
      setWithdrawAmount(prev => prev - 1)
    }
  }

  const setMaxCoins = () => {
    setWithdrawAmount(availableCoins)
  }

  const handleNext = () => {
    if (withdrawAmount > availableCoins) {
      alert('Insufficient coins available')
      return
    }
    
    const withdrawData = {
      withdrawAmount,
      transactionFees,
      totalCoins,
      totalUsdAmount
    }
    
    navigation.navigate(screenNames.BANK_DETAILS)
    console.log('Proceeding with withdrawal:', withdrawData)
    // Navigate to next step or process withdrawal
  }

  const TableRow = ({ label, value }) => (
    <View style={styles.tableRow}>
      <AppText variant={Variant.bodyMedium} style={styles.tableLabel}>
        {label}
      </AppText>
      <AppText variant={Variant.bodyMedium} style={styles.tableValue}>
        {value}
      </AppText>
    </View>
  )

  return (
    <>
   
        <AppHeader
          title="Form Summary"
          showBackButton
          showTopIcons={false}
          onPressBack={() => navigation.goBack()}
        />
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Transaction Breakdown Table */}
      <View style={styles.transactionTable}>
        {/* Withdraw Coins Row */}
        <TableRow label="Withdraw coins (SGCOIN)" value={withdrawAmount} />

       

        {/* Transaction Fees Row */}
        <TableRow label="Transaction fees (SGCOIN)" value={transactionFees} />


        {/* Total Coins Row */}
        <TableRow label="Total coins (SGCOIN)" value={totalCoins} />


        {/* Total Amount Row - Highlighted */}
       <TableRow label="Total amount (USD)" value={`$${totalUsdAmount.toFixed(2)}`} highlighted />
      </View>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          text="Withdraw Now"
          onPress={handleNext}
          bgColor="#F59E0B"
          textColor="#FFFFFF"
        //   style={styles.nextButton}
        />
      </View>
    </ScrollView>
     </>
  )
}

export default FormSummary

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  availableCoins: {
    color: colors.secondary,
    fontSize: getFontSize(24),
    fontWeight: 'bold',
    marginBottom: hp(4),
  },
  coinSection: {
    marginBottom: hp(4),
  },
  coinLabel: {
    color: colors.gray || '#6B7280',
    fontSize: getFontSize(14),
    marginBottom: hp(1.5),
  },
  coinSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    borderRadius: borders.borderMainradius,
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.2),
  },
  coinInput: {
    flex: 1,
    fontSize: getFontSize(14),
    color: colors.black,
    fontWeight: '500',
  },
  coinControls: {
    flexDirection: 'row',
    gap: wp(2),
    alignItems: 'center',
  },
  controlButton: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(2),
    backgroundColor: colors.grayE8 || '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  maxButton: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    backgroundColor: colors.grayE8 || '#F3F4F6',
    borderRadius: wp(2),
  },
  maxButtonText: {
    color: colors.gray || '#6B7280',
    fontSize: getFontSize(14),
    fontWeight: '500',
  },
  transactionTable: {
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    // borderRadius: borders.borderMainradius,
    marginBottom: hp(4),
    backgroundColor: colors.white,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#E5E7EB',
  },
  tableLabel: {
    color: colors.textPrimary,
    fontSize: getFontSize(15),
    flex: 1,
  },
  tableValue: {
    color: colors.textPrimary,
    fontSize: getFontSize(15),
    fontWeight: '500',
    textAlign: 'right',
  },
  tableSeparator: {
    height: 1,
    backgroundColor: colors.grayE8 || '#E5E7EB',
    
    // marginHorizontal: wp(4),
  },
  totalRow: {
    backgroundColor: colors.grayE8 || '#F9FAFB',
  },
  totalLabel: {
    color: colors.black || '#374151',
    fontSize: getFontSize(16),
    fontWeight: '600',
    flex: 1,
  },
  totalValue: {
    color: colors.black || '#374151',
    fontSize: getFontSize(16),
    fontWeight: '700',
    textAlign: 'right',
  },
  buttonContainer: {
    // marginTop: hp(2),
    marginBottom: hp(6),
  },
  nextButton: {
    borderRadius: hp(3),
    paddingVertical: hp(2.5),
  },
})