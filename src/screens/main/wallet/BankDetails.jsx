import React, { useState } from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity
} from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import AppHeader from '@/core/AppHeader'
import ActionButton from '@/components/ActionButton'
import { screenNames } from '@/navigation/screenNames'

const BankDetails = ({ navigation }) => {
  const [bankAccounts] = useState([
    {
      id: 1,
      bankName: 'ING Bank Pvt. Ltd.',
      accountNumber: '11112501',
      bsbCode: '63001',
      branch: 'Finders Street',
      isVerified: false,
      isSelected: false
    },
    {
      id: 2,
      bankName: 'Westpac Banking Corporation',
      accountNumber: '11112501',
      bsbCode: '63001',
      branch: 'Finders Street',
      isVerified: true,
      isSelected: true
    }
  ])

  const handleEdit = (accountId) => {
    console.log('Edit account:', accountId)
    // Navigate to edit screen or show edit modal
  }

  const handleDelete = (accountId) => {
    console.log('Delete account:', accountId)
    // Show confirmation dialog and delete account
  }

  const handleVerify = (accountId) => {
    console.log('Verify account:', accountId)
    // Navigate to verification screen
  }

  const handleAddNewAccount = () => {
    console.log('Add new account')
    navigation.navigate(screenNames.ACCOUNT_DETAILS)
    // Navigate to add account screen
  }

  const renderBankAccount = (account) => (
    <View key={account.id} style={styles.bankCard}>
      {/* Bank Header */}
      <View style={styles.bankHeader}>
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

      </View>

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
        
        <AppText variant={Variant.body} style={styles.detailText}>
          Account number: <AppText style={styles.detailValue}>{account.accountNumber}</AppText>
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
      {/* Bank Accounts List */}
      <View style={styles.accountsList}>
        {bankAccounts.map(renderBankAccount)}
      </View>

      {/* Add New Account Button */}
      <View style={styles.addButtonContainer}>
        <AppButton
          text="Add New Account"
          onPress={handleAddNewAccount}
          bgColor="#F59E0B"
          textColor="#FFFFFF"
          // style={styles.addButton}
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
  accountsList: {
    marginBottom: hp(4),
  },
  bankCard: {
    backgroundColor: colors.white,
    // marginBottom: hp(3),
  },
  bankHeader: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
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
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    flex: 1,
  },
  verifiedBadge: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unverifiedBadge: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankDetails: {
    marginBottom: hp(3),
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderRadius: hp(3),
    borderWidth: 1,
    gap: wp(2),
  },
  editButton: {
    borderColor: '#10B981',
    backgroundColor: colors.white,
  },
  editButtonText: {
    color: '#10B981',
    fontSize: getFontSize(14),
    fontWeight: '500',
  },
  deleteButton: {
    borderColor: '#F59E0B',
    backgroundColor: colors.white,
  },
  deleteButtonText: {
    color: '#F59E0B',
    fontSize: getFontSize(14),
    fontWeight: '500',
  },
  verifyButton: {
    borderColor: '#7C3AED',
    backgroundColor: colors.white,
  },
  verifyButtonText: {
    color: '#7C3AED',
    fontSize: getFontSize(14),
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: colors.grayE8 || '#E5E7EB',
    marginVertical: hp(2),
  },
  addButtonContainer: {
    marginBottom: hp(3),
  },
  addButton: {
    borderRadius: hp(3),
    paddingVertical: hp(2.5),
  },
})