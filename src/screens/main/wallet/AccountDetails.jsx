import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList
} from 'react-native'
import { useForm, FormProvider } from 'react-hook-form'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import FormField from '@/core/FormField'
import RbSheetComponent from '@/core/RbSheetComponent'
import AppHeader from '@/core/AppHeader'
import { screenNames } from '@/navigation/screenNames'
import { addAccount, editAccount } from '@/store/bankSlice'
import { useDispatch } from 'react-redux'

const AccountDetails = ({ navigation, route }) => {
  const [selectedBank, setSelectedBank] = useState('')
  const bankSheetRef = useRef(null)
  const { account, isEdit } = route?.params || {}
  const dispatch = useDispatch()
  const methods = useForm({
    defaultValues: {
      accountNumber: '',
      bsbCode: '',
      branch: '',
      city: '',
      bankName: ''
    }
  })

  const bankOptions = [
    { id: 1, name: 'Commonwealth Bank', code: 'CBA' },
    { id: 2, name: 'Westpac Banking Corporation', code: 'WBC' },
    { id: 3, name: 'Australia and New Zealand Banking Group', code: 'ANZ' },
    { id: 4, name: 'National Australia Bank', code: 'NAB' },
    { id: 5, name: 'ING Bank Pvt. Ltd.', code: 'ING' },
    { id: 6, name: 'Macquarie Bank', code: 'MBL' },
    { id: 7, name: 'Bendigo and Adelaide Bank', code: 'BEN' },
    { id: 8, name: 'Bank of Queensland', code: 'BOQ' }
  ]

  console.log(selectedBank)
  const handleBankSelect = (bank) => {
    setSelectedBank(bank.name)
    methods.setValue('bankName', bank.name)
    bankSheetRef.current?.close()
  }

  const handleBankNamePress = () => {
    bankSheetRef.current?.open()
  }

  const onSubmit = (data) => {
    if (!selectedBank && !data.bankName) {
      alert('Please select a bank')
      return
    }

    const accountData = {
      bankName: selectedBank || data.bankName,
      ...data,
    }

    if (isEdit && account) {
      // Edit existing account
      dispatch(editAccount({
        id: account.id,
        updatedData: accountData
      }))
      navigation.goBack()
    } else {
      // Add new account
      dispatch(addAccount(accountData))
      navigation.navigate(screenNames.FORM_SUMMARY, { accountData })
    }
  }

  const handleNext = () => {
    methods.handleSubmit(onSubmit)()
  }

  const { reset } = methods

  // 👇 Populate default data if 'account' exists
  useEffect(() => {
    if (account) {
      const bankName = account.bankName || ''
      reset({
        accountNumber: account.accountNumber || '',
        bsbCode: account.bsbCode || '',
        branch: account.branch || '',
        city: account.city || '',
        bankName: bankName,
      })
      setSelectedBank(bankName)
      methods.setValue('bankName', bankName)
    }
  }, [account, reset, methods])



  const renderBankOption = ({ item }) => (
    <TouchableOpacity
      style={styles.bankOption}
      onPress={() => handleBankSelect(item)}
      activeOpacity={0.7}
    >
      <AppText variant={Variant.body} style={styles.bankOptionText}>
        {item.name}
      </AppText>
    </TouchableOpacity>
  )

  const BankDropdownSheet = () => (
    <View style={styles.sheetContent}>
      <View style={styles.sheetHeader}>
        <AppText variant={Variant.subTitle} style={styles.sheetTitle}>
          Select Bank
        </AppText>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => bankSheetRef.current?.close()}
          activeOpacity={0.7}
        >
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="close"
            size={24}
            color={colors.black}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={bankOptions}
        renderItem={renderBankOption}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.optionSeparator} />}
      />
    </View>
  )

  return (
    <FormProvider {...methods}>
      <AppHeader
        title="Account details"
        showTopIcons={false}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Bank Name Dropdown */}
        <FormField
          name="bankName"
          label="Bank name"
          placeholder={selectedBank || "Select bank"}
          rules={{
            required: 'Bank name is required',
          }}
          inputWrapperStyle={styles.formFieldWrapper}
          onPressField={handleBankNamePress}
          editable={false}
        />

        {/* Account Number */}
        <FormField
          name="accountNumber"
          label="Account number"
          placeholder="Enter account number"
          keyboardType="numeric"
          rules={{
            required: 'Account number is required',
            pattern: {
              value: /^[0-9]{6,12}$/,
              message: 'Please enter a valid account number'
            }
          }}
          inputWrapperStyle={styles.formFieldWrapper}
        />

        {/* BSB Code */}
        <FormField
          name="bsbCode"
          label="BSB code"
          placeholder="Enter BSB code"
          keyboardType="numeric"
          rules={{
            required: 'BSB code is required',
            pattern: {
              value: /^[0-9]{6}$/,
              message: 'BSB code must be 6 digits'
            }
          }}
          inputWrapperStyle={styles.formFieldWrapper}
        />

        {/* Branch */}
        <FormField
          name="branch"
          label="Branch"
          placeholder="Enter branch name"
          rules={{
            required: 'Branch name is required',
            minLength: {
              value: 2,
              message: 'Branch name must be at least 2 characters'
            }
          }}
          inputWrapperStyle={styles.formFieldWrapper}
        />

        {/* City */}
        <FormField
          name="city"
          label="City"
          placeholder="Enter city"
          rules={{
            required: 'City is required',
            minLength: {
              value: 2,
              message: 'City must be at least 2 characters'
            }
          }}
          inputWrapperStyle={styles.formFieldWrapper}
        />

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <AppButton
            text="Next"
            onPress={handleNext}
            bgColor="#F59E0B"
            textColor="#FFFFFF"
          // style={styles.nextButton}
          />
        </View>
      </ScrollView>

      {/* Bank Selection Bottom Sheet */}
      <RbSheetComponent
        ref={bankSheetRef}
        height={hp(70)}
        bgColor={colors.white}
        containerStyle={styles.sheetContainer}
      >
        <BankDropdownSheet />
      </RbSheetComponent>
    </FormProvider>
  )
}

export default AccountDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  formGroup: {
    marginBottom: hp(3),
  },
  label: {
    color: colors.gray || '#6B7280',
    marginBottom: hp(1),
    fontSize: getFontSize(16),
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    borderRadius: hp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: colors.white,
    minHeight: hp(6),
  },
  dropdownText: {
    flex: 1,
    color: colors.black,
    fontSize: getFontSize(16),
  },
  placeholderText: {
    color: colors.gray || '#9CA3AF',
  },
  formFieldWrapper: {
    // marginBottom: hp(3),
  },
  buttonContainer: {
    marginTop: hp(2),
    marginBottom: hp(6),
  },
  nextButton: {
    borderRadius: hp(3),
    paddingVertical: hp(2.5),
  },

  // Bottom Sheet Styles
  sheetContainer: {
    paddingTop: 0,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#E5E7EB',
    marginBottom: hp(2),
  },
  sheetTitle: {
    color: colors.black,
    fontSize: getFontSize(18),
    fontWeight: '600',
  },
  closeButton: {
    padding: wp(2),
  },
  bankOption: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
  },
  bankOptionText: {
    color: colors.black,
    fontSize: getFontSize(16),
  },
  optionSeparator: {
    height: 1,
    backgroundColor: colors.grayE8 || '#F3F4F6',
    marginHorizontal: wp(2),
  },
})