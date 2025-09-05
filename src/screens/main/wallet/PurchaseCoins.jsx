import React, { useState } from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity
} from 'react-native'
import { useForm, FormProvider } from 'react-hook-form'
import { colors, hp, wp, getFontSize, borders } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import FormField from '@/core/FormField'
import AppHeader from '@/core/AppHeader'

const PurchaseCoins = ({ navigation }) => {
  const [coinQuantity, setCoinQuantity] = useState(1)
  
  const methods = useForm({
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvc: ''
    }
  })

  const coinRate = 1 // 1 AUD = 1 Coin
  const totalAmount = coinQuantity * coinRate

  const incrementCoins = () => {
    setCoinQuantity(prev => prev + 1)
  }

  const decrementCoins = () => {
    if (coinQuantity > 1) {
      setCoinQuantity(prev => prev - 1)
    }
  }

  const onSubmit = (data) => {
    console.log('Processing payment...', {
      coins: coinQuantity,
      amount: totalAmount,
      cardData: {
        ...data,
        cardNumber: data.cardNumber.slice(-4) // Only log last 4 digits for security
      }
    })
    // Handle payment processing
  }

  const handlePayNow = () => {
    methods.handleSubmit(onSubmit)()
  }

  return (
    <FormProvider {...methods}>
        <AppHeader
            title='Purchase Coins'
            showTopIcons={false}
        />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <AppText variant={Variant.title} style={styles.title}>
          Deposit Squad goo coin (SGC)
        </AppText>

        {/* Coin Selection */}
        <View style={styles.coinSection}>
          <AppText variant={Variant.bodyMedium} style={styles.coinLabel}>
            Coin
          </AppText>
          
          <View style={styles.coinSelector}>
            <AppText variant={Variant.body} style={styles.coinDisplay}>
              {coinQuantity}
            </AppText>
            
            <View style={styles.coinControls}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={decrementCoins}
                activeOpacity={0.7}
              >
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="remove"
                  size={20}
                  color={colors.gray}
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={incrementCoins}
                activeOpacity={0.7}
              >
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="add"
                  size={20}
                  color={colors.gray}
                />
              </TouchableOpacity>
            </View>
          </View>

          <AppText variant={Variant.body} style={styles.exchangeRate}>
            1 AUD = 1 Coin
          </AppText>
        </View>

        {/* Payment Summary */}
        <View style={styles.summaryContainer}>
          <AppText variant={Variant.title} style={styles.summaryTitle}>
            Amount to pay ${totalAmount.toFixed(2)}
          </AppText>
          <AppText variant={Variant.title} style={styles.summaryCoins}>
            {coinQuantity} Coins
          </AppText>
        </View>

        {/* Card Details */}
        <View style={styles.cardSection}>
          <View style={styles.cardHeader}>
            <AppText variant={Variant.bodyMedium} style={styles.cardTitle}>
              Enter card details
            </AppText>
            
            {/* Payment Method Icons */}
            <View style={styles.paymentIcons}>
              <View style={styles.paymentIcon}>
                <AppText variant={Variant.caption} style={styles.visaText}>VISA</AppText>
              </View>
              <View style={[styles.paymentIcon, styles.mastercardIcon]}>
                <View style={styles.mastercardCircle1} />
                <View style={styles.mastercardCircle2} />
              </View>
              <View style={[styles.paymentIcon, styles.amexIcon]}>
                <AppText variant={Variant.caption} style={styles.amexText}>AMEX</AppText>
              </View>
              <View style={[styles.paymentIcon, styles.discoverIcon]}>
                <AppText variant={Variant.caption} style={styles.discoverText}>DISCOVER</AppText>
              </View>
            </View>
          </View>

          {/* Card Number */}
          <FormField
            name="cardNumber"
            placeholder="Card Number"
            keyboardType="numeric"
            rules={{
              required: 'Card number is required',
              pattern: {
                value: /^[0-9\s]{13,19}$/,
                message: 'Please enter a valid card number'
              }
            }}
            inputWrapperStyle={styles.formFieldWrapper}
          />

          {/* Expiry and CVC */}
          <View style={styles.cardRow}>
            <FormField
              name="expiryDate"
              placeholder="MM / YY"
              keyboardType="numeric"
              rules={{
                required: 'Expiry date is required',
                pattern: {
                  value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                  message: 'Please enter valid expiry date (MM/YY)'
                }
              }}
              inputWrapperStyle={[styles.formFieldWrapper, styles.halfInput]}
            />
            
            <FormField
              name="cvc"
              placeholder="CVC"
              keyboardType="numeric"
              type="passwordInput"
              rules={{
                required: 'CVC is required',
                pattern: {
                  value: /^[0-9]{3,4}$/,
                  message: 'Please enter valid CVC'
                }
              }}
              inputWrapperStyle={[styles.formFieldWrapper, styles.halfInput]}
            />
          </View>
        </View>

        {/* Pay Button */}
        <View style={styles.payButtonContainer}>
          <AppButton
            text="Pay Now"
            onPress={handlePayNow}
            bgColor={colors.primary}
          />
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <AppText variant={Variant.body} style={styles.description}>
            Welcome to our Job Portal! With our innovative platform, employers can now easily access top talent by posting job opportunities. To streamline the process, we've introduced a coin-based system where employers purchase coins to post jobs. Each coin represents a single job posting, providing flexibility and cost-effectiveness. Whether you're a small startup or a large corporation, our job portal ensures that your job listings reach the right candidates efficiently. Purchase coins today and unlock a world of talent!
          </AppText>
        </View>
      </ScrollView>
    </FormProvider>
  )
}

export default PurchaseCoins

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  title: {
    color: colors.secondary,
    fontSize: getFontSize(24),
    fontWeight: 'bold',
    marginBottom: hp(4),
  },
  coinSection: {
    marginBottom: hp(3),
  },
  coinLabel: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    marginBottom: hp(1.5),
  },
  coinSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    borderRadius: borders.borderMainradius,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    marginBottom: hp(1),
  },
  coinDisplay: {
    fontSize: getFontSize(16),
    color: colors.black,
    fontWeight: '500',
    flex: 1,
    textAlignVertical: 'center',
  },
  coinControls: {
    flexDirection: 'row',
    gap: wp(2),
  },
  controlButton: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(2),
    backgroundColor: colors.grayE8 || '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exchangeRate: {
    color: colors.gray || '#9CA3AF',
    fontSize: getFontSize(11),
  },
  summaryContainer: {
    backgroundColor: colors.secondary,
    borderRadius: hp(3),
    paddingVertical: hp(3),
    paddingHorizontal: wp(6),
    marginBottom: hp(4),
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: getFontSize(18),
    fontWeight: '600',
    marginBottom: hp(0.5),
  },
  summaryCoins: {
    color: '#FFFFFF',
    fontSize: getFontSize(18),
    fontWeight: '600',
  },
  cardSection: {
    marginBottom: hp(4),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  cardTitle: {
   color: colors.secondary,
    fontSize: getFontSize(13),
  },
  paymentIcons: {
    flexDirection: 'row',
    gap: wp(2),
  },
  paymentIcon: {
    width: wp(12),
    height: hp(3),
    backgroundColor: '#1E40AF',
    borderRadius: wp(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  mastercardIcon: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.grayE8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mastercardCircle1: {
    width: wp(3),
    height: wp(3),
    borderRadius: wp(1.5),
    backgroundColor: '#EB001B',
    marginRight: -wp(1),
  },
  mastercardCircle2: {
    width: wp(3),
    height: wp(3),
    borderRadius: wp(1.5),
    backgroundColor: '#F79E1B',
  },
  amexIcon: {
    backgroundColor: '#006FCF',
  },
  discoverIcon: {
    backgroundColor: '#FF6000',
  },
  visaText: {
    color: '#FFFFFF',
    fontSize: getFontSize(8),
    fontWeight: 'bold',
  },
  amexText: {
    color: '#FFFFFF',
    fontSize: getFontSize(7),
    fontWeight: 'bold',
  },
  discoverText: {
    color: '#FFFFFF',
    fontSize: getFontSize(6),
    fontWeight: 'bold',
  },
  formFieldWrapper: {
    // marginBottom: hp(2),
  },
  cardRow: {
    flexDirection: 'row',
    gap: wp(3),
  },
  halfInput: {
    flex: 1,
  },
  payButtonContainer: {
    marginBottom: hp(4),
  },
  descriptionContainer: {
    paddingBottom: hp(6),
  },
  description: {
    color: colors.gray || '#6B7280',
    fontSize: getFontSize(14),
    lineHeight: 22,
    textAlign: 'left',
  },
})