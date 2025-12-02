import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import AppHeader from '@/core/AppHeader'
import ActionButton from '@/components/ActionButton'
import { screenNames } from '@/navigation/screenNames'
import { showToast, toastTypes } from '@/utilities/toastConfig'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAccount, selectAccount, verifyAccount } from '@/store/bankSlice'
import { withdrawCoins } from '@/store/walletSlice'

const BankDetails = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const bankAccounts = useSelector(state => state.bank.accounts)
  const walletCoins = useSelector(state => state.wallet.coins)
  const withdrawData = route?.params?.withdrawData

  const handleSelectAccount = (accountId) => {
    dispatch(selectAccount(accountId))
  }

  const handleEdit = (accountId) => {
    const account = bankAccounts.find(acc => acc.id === accountId)
    navigation.navigate(screenNames.ACCOUNT_DETAILS, { account, isEdit: true })
  }

  const handleDelete = (accountId) => {
    const account = bankAccounts.find(acc => acc.id === accountId)

    if (bankAccounts.length === 1) {
      Alert.alert('Cannot Delete', 'You must have at least one bank account.', [{ text: 'OK' }])
      return
    }

    Alert.alert(
      'Delete Bank Account',
      `Are you sure you want to delete ${account.bankName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteAccount(accountId))
            showToast('Bank account deleted successfully.', 'success', toastTypes.success)
          }
        }
      ]
    )
  }

  const handleVerify = (accountId) => {
    dispatch(verifyAccount(accountId))
    Alert.alert('Verification', 'Account verified successfully!')
  }

  const handleAddNewAccount = () => {
    navigation.navigate(screenNames.ACCOUNT_DETAILS)
  }

  const handleWithdrawFunds = () => {
    // Check if we have withdraw data from WithdrawCoins screen
    if (!withdrawData) {
      // Navigate to WithdrawCoins screen first
      navigation.navigate(screenNames.WITHDRAW_COINS)
      return
    }

    // Find selected account
    const selectedAccount = bankAccounts.find(acc => acc.isSelected)
    
    if (!selectedAccount) {
      showToast('Please select a bank account first.', 'error', toastTypes.error)
      return
    }

    if (!selectedAccount.isVerified) {
      showToast('Please verify your bank account before withdrawing.', 'error', toastTypes.error)
      return
    }

    if (walletCoins < withdrawData.withdrawAmount) {
      showToast('Insufficient coins available.', 'error', toastTypes.error)
      return
    }

    // Process withdrawal
    dispatch(withdrawCoins({
      amount: withdrawData.withdrawAmount,
      accountId: selectedAccount.id,
      transactionFees: withdrawData.transactionFees,
      totalUsdAmount: withdrawData.totalUsdAmount,
    }))

    showToast('Withdrawal request submitted successfully.', 'success', toastTypes.success)
    navigation.goBack()
  }


  const renderBankAccount = (account) => (
    <View key={account.id} style={styles.bankCard}>
      {/* Bank Header */}
      <TouchableOpacity
        style={styles.bankHeader}
        onPress={() => handleSelectAccount(account.id)}
        activeOpacity={0.7}
      >
        <View style={styles.bankNameContainer}>
          <View style={[
            styles.bankIcon,
            account.isSelected && styles.selectedBankIcon
          ]}>
            {account.isSelected && (
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="checkmark"
                size={16}
                color="#FFFFFF"
              />
            )}
          </View>

          <AppText variant={Variant.title} style={styles.bankName}>
            {account.bankName}
          </AppText>

          {account.isVerified ? (
            <View style={styles.verifiedBadge}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="checkmark"
                size={16}
                color="#FFFFFF"
              />
            </View>
          ) : (
            <View style={styles.unverifiedBadge}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="time-outline"
                size={16}
                color="#EF4444"
              />
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Selected Indicator */}
      {account.isSelected && (
        <View style={styles.selectedIndicator}>
          <AppText variant={Variant.bodySmall} style={styles.selectedText}>
            Selected for payments
          </AppText>
        </View>
      )}

      {/* Bank Details */}
      <View style={styles.bankDetails}>
        <AppText variant={Variant.body} style={styles.detailText}>
          Account number: <AppText style={styles.detailValue}>{account.accountNumber}</AppText>
        </AppText>

        <AppText variant={Variant.body} style={styles.detailText}>
          BSB code: <AppText style={styles.detailValue}>{account.bsbCode}</AppText>
        </AppText>

        <AppText variant={Variant.body} style={styles.detailText}>
          Branch: <AppText style={styles.detailValue}>{account.branch}</AppText>
        </AppText>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <ActionButton
          text="Edit"
          iconName="create-outline"
          variant="success"
          onPress={() => handleEdit(account.id)}
        />

        <ActionButton
          text="Delete"
          iconName="trash-outline"
          variant="warning"
          onPress={() => handleDelete(account.id)}
        />

        {!account.isVerified && (
          <ActionButton
            text="Verify"
            iconName="checkmark-outline"
            variant="secondary"
            onPress={() => handleVerify(account.id)}
          />
        )}
      </View>

      {/* Separator */}
      {account.id !== bankAccounts[bankAccounts.length - 1].id && (
        <View style={styles.separator} />
      )}
    </View>
  )

  return (
    <>
      <AppHeader
        title="Bank Details"
        showTopIcons={false}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="information-circle"
            size={20}
            color="#3B82F6"
          />
          <AppText variant={Variant.bodySmall} style={styles.infoText}>
            Tap on a bank account to select it for payments
          </AppText>
        </View>

        {/* Bank Accounts List */}
        <View style={styles.accountsList}>
          {bankAccounts.map(renderBankAccount)}
        </View>

        {/* Add New Account Button */}
        <View style={styles.addButtonContainer}>
          <AppButton
            text="Withdraw Funds"
            onPress={handleWithdrawFunds}
            bgColor="#F59E0B"
            textColor="#FFFFFF"
          />
          <AppButton
            text="Add New Account"
            onPress={handleAddNewAccount}
            bgColor="#F59E0B"
            textColor="#FFFFFF"
          />
        </View>
      </ScrollView>
    </>
  )
}

export default BankDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: wp(3),
    borderRadius: hp(1),
    marginBottom: hp(2),
    gap: wp(2),
  },
  infoText: {
    color: '#3B82F6',
    flex: 1,
  },
  accountsList: {
    marginBottom: hp(1),
  },
  bankCard: {
    backgroundColor: colors.white,
    paddingVertical: hp(1),
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  bankNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bankIcon: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(2),
    borderWidth: 2,
    borderColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  selectedBankIcon: {
    backgroundColor: '#F59E0B',
  },
  bankName: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: 'bold',
    flex: 1,
  },
  verifiedBadge: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unverifiedBadge: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicator: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: hp(1),
    marginBottom: hp(1),
    alignSelf: 'flex-start',
  },
  selectedText: {
    color: '#F59E0B',
    fontWeight: '600',
    fontSize: getFontSize(12),
  },
  bankDetails: {
    marginBottom: hp(2),
  },
  detailText: {
    color: colors.textPrimary,
    fontSize: getFontSize(13),
    marginBottom: hp(0.8),
  },
  detailValue: {
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: wp(3),
    marginBottom: hp(2),
  },
  separator: {
    height: 1,
    backgroundColor: colors.grayE8 || '#E5E7EB',
    marginVertical: hp(2),
  },
  addButtonContainer: {
    gap: 20,
    marginBottom: hp(2),
  },
})