import {
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Images } from '@/assets'
import { colors, getFontSize, hp, wp } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import FormField from '@/core/FormField'
import AppButton from '@/core/AppButton'
import AppText, { Variant } from '@/core/AppText'
import VerificationSuccessModal from '@/components/VerificationSuccessModal'
import { store } from '@/store/store'
import { login } from '@/store/authSlice'
import { useVerifyEmail } from '@/api/auth/auth.query'
import { screenNames } from '@/navigation/screenNames'

const EmailVerification = ({ navigation, route }) => {
  const [resendTimer, setResendTimer] = useState(0)
  const [canResend, setCanResend] = useState(true)
   const [showSuccessModal, setShowSuccessModal] = useState(false)
   const { mutateAsync: verifyEmail, isPending, isError } = useVerifyEmail()
   
   // Get email from navigation params (passed from signup screen)
   const email = route?.params?.email || 'your email address'
   console.log('emial', email)

  // Initialize form methods
  const methods = useForm({
    defaultValues: {
      verificationCode: ''
    }
  })

  const { handleSubmit, formState: { isSubmitting } } = methods

  // Countdown timer for resend functionality
  useEffect(() => {
    let timer
    if (resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer(resendTimer - 1)
      }, 1000)
    } else {
      setCanResend(true)
    }
    return () => clearTimeout(timer)
  }, [resendTimer])

  // Validation rules for verification code
  const verificationRules = {
    verificationCode: {
      required: 'Verification code is required',
      minLength: {
        value: 4,
        message: 'Verification code must be at least 4 characters'
      },
      maxLength: {
        value: 6,
        message: 'Verification code cannot exceed 6 characters'
      },
      pattern: {
        value: /^[0-9]+$/,
        message: 'Verification code must contain only numbers'
      }
    }
  }

  const handleVerify = async (data) => {
    try {
      console.log('Verify with code:', email, data.verificationCode);
      let response = await verifyEmail({ 
        email: email,
        code: data.verificationCode
       })

       
        console.log('response from verifyEmail mutation:', response?.status);
       if(response?.status == 200){
        console.log('Email verified successfully', response);
        // Show success modal
        setShowSuccessModal(true)
       }
      if(response?.error) {
        // return
        throw new Error(response?.error?.message || 'Verification failed')
      }
      // On successful verification
    
   
    } catch (error) {
      // Alert.alert('Error', 'Invalid verification code. Please try again.')
      console.error('Verification error:', error)
    }
  }

  const handleResendCode = async () => {
    if (!canResend) return
    
    try {
      console.log('Resending verification code to:', email);
      
      // Add your resend logic here
      // Example: await resendVerificationCode(email)
      
      Alert.alert('Code Sent', 'A new verification code has been sent to your email.')
      
      // Start countdown timer (60 seconds)
      setResendTimer(60)
      setCanResend(false)
      
    } catch (error) {
      Alert.alert('Error', 'Failed to resend verification code. Please try again.')
      console.error('Resend error:', error)
    }
  }

  const handleGotoDashboard = () => {
    // Navigate to dashboard/home screen
     // or 'Home' or your main app screen
     navigation.reset({
      index: 0,
      routes: [{ name: screenNames.AUTH_NAVIGATION }],
    });
    //  store.dispatch(login({
    //   token: 'token',
    //   userInfo: {email: 'recruiter@gmail.com', password: 'Recruiter@123'},
    //   role: 'recruiter'
    //  }))
  }

  const handleCloseModal = () => {
    setShowSuccessModal(false)
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image source={Images.logo} style={styles.logo} />
          </View>

          {/* Verification Icon */}
          <View style={styles.iconContainer}>
            <Image source={Images.emailverified} style={{
              width: wp(30),
              height: wp(30),
            }} />
          </View>

          {/* Title and Subtitle */}
          <View style={styles.textContainer}>
            <AppText variant={Variant.title} style={styles.title}>
              Verify your email address
            </AppText>
            
            <AppText variant={Variant.body} style={styles.subtitle}>
              We have sent a code on your email address
            </AppText>
          </View>

          {/* Form Section */}
          <FormProvider {...methods}>
            <View style={styles.formContainer}>
              
              {/* Verification Code Input */}
              <FormField
                name="verificationCode"
                placeholder="Enter verification code"
                keyboardType="numeric"
                rules={verificationRules.verificationCode}
                // inputWrapperStyle={styles.inputContainer}
                style={styles.inputText}
                maxLength={6}
                autoCapitalize="none"
                autoCorrect={false}
              />

              {/* Resend Code Link */}
              <TouchableOpacity
                style={styles.resendContainer}
                onPress={handleResendCode}
                disabled={!canResend}
                activeOpacity={0.7}
              >
                <AppText 
                  variant={Variant.bodyMedium} 
                  style={[
                    styles.resendText,
                    !canResend && styles.resendTextDisabled
                  ]}
                >
                  {canResend 
                    ? 'Re-send verification code'
                    : `Resend in ${resendTimer}s`
                  }
                </AppText>
              </TouchableOpacity>

              {/* Verify Button */}
              <View style={styles.buttonContainer}>
                <AppButton
                  bgColor={colors.primary || '#FF6B35'}
                  text="Verify"
                  onPress={handleSubmit(handleVerify)}
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                />
              </View>

            </View>
          </FormProvider>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <AppText variant={Variant.caption} style={styles.loginText}>
              Already have an account?{' '}
            </AppText>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <AppText variant={Variant.captionMedium} style={styles.loginLink}>
                Log In
              </AppText>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationSuccessModal
        visible={showSuccessModal}
        onClose={handleCloseModal}
        onGotoDashboard={handleGotoDashboard}
      />
    </View>
  )
}

export default EmailVerification

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(6),
    paddingTop: hp(8),
    paddingBottom: hp(3),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: hp(5),
  },
  logo: {
    width: wp(25),
    height: wp(25),
    resizeMode: 'contain',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: hp(2),
  },
  verificationBadge: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(12.5),
    backgroundColor: '#4A90E2', // Blue color from the design
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: hp(4),
    paddingHorizontal: wp(4),
  },
  title: {
    textAlign: 'center',
    color: '#604478', // Purple color from design
    marginBottom: hp(1.5),
    fontSize: getFontSize(26),
  },
  subtitle: {
    textAlign: 'center',
    color: colors.gray || '#6B7280',
    lineHeight: hp(2.5),
  },
  formContainer: {
    marginBottom: hp(6),
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    borderRadius: hp(2),
    backgroundColor: colors.white,
    height: hp(7),
    marginBottom: hp(2),
  },
  inputText: {
    color: colors.black,
    fontSize: getFontSize(16),
    textAlign: 'center',
    letterSpacing: 2,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: hp(4),
  },
  resendText: {
    color: colors.primary || '#FF6B35',
    textDecorationLine: 'underline',
  },
  resendTextDisabled: {
    color: colors.gray || '#6B7280',
    textDecorationLine: 'none',
  },
  buttonContainer: {
    marginTop: hp(2),
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  loginText: {
    color: colors.gray || '#6B7280',
  },
  loginLink: {
    color: colors.primary || '#FF6B35',
    textDecorationLine: 'underline',
  },
})