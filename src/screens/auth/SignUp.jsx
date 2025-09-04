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
import React, { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Images } from '@/assets'
import { colors, getFontSize, hp, wp } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import FormField from '@/core/FormField'
import AppButton from '@/core/AppButton'
import AppText, { Variant } from '@/core/AppText'
import { screenNames } from '@/navigation/screenNames'

const SignUp = ({ navigation }) => {
  const [selectedUserType, setSelectedUserType] = useState('Jobseeker')
  const [acceptTerms, setAcceptTerms] = useState(false)

  // User type options
  const userTypes = ['Jobseeker', 'Recruiter', 'Individual']

  // Initialize form methods
  const methods = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      referralCode: ''
    }
  })

  const { handleSubmit, formState: { isSubmitting }, watch } = methods
  const password = watch('password')

  // Validation rules for signup
  const signupValidationRules = {
    firstName: {
      required: 'First name is required',
      minLength: {
        value: 2,
        message: 'First name must be at least 2 characters'
      }
    },
    lastName: {
      required: 'Last name is required',
      minLength: {
        value: 2,
        message: 'Last name must be at least 2 characters'
      }
    },
    email: {
      required: 'Email is required',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address',
      },
    },
    password: {
      required: 'Password is required',
      minLength: {
        value: 8,
        message: 'Password must be at least 8 characters long',
      },
      validate: {
        hasCapital: value => /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
        hasLower: value => /[a-z]/.test(value) || 'Password must contain at least one lowercase letter',
        hasNumber: value => /\d/.test(value) || 'Password must contain at least one number',
        hasSpecialChar: value => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Password must contain at least one special character',
      },
    },
    referralCode: {
      // Optional field, no validation needed
    }
  }

  const handleSignUp = async (data) => {
    if (!acceptTerms) {
      Alert.alert('Terms Required', 'Please accept the Terms and Conditions to continue.')
      return
    }

    try {
      const signupData = {
        ...data,
        userType: selectedUserType,
        acceptedTerms: acceptTerms
      }
      
      console.log('Sign up with:', signupData);
      // Add your signup logic here
      // Example: await signUpUser(signupData)
      Alert.alert('Success', 'Account created successfully!')
      // navigation.navigate('Home') or verification screen
    } catch (error) {
      Alert.alert('Error', 'Sign up failed. Please try again.')
      console.error('Signup error:', error)
    }
  }

  const handleGoogleSignUp = () => {
    console.log('Sign up with Google');
    navigation.navigate(screenNames.VERIFY_EMAIL)
    // Add Google signup logic here
  }

  const renderUserTypeTab = (type) => (
    <TouchableOpacity
      key={type}
      style={[
        styles.userTypeTab,
        selectedUserType === type && styles.selectedUserTypeTab
      ]}
      onPress={() => setSelectedUserType(type)}
      activeOpacity={0.7}
    >
      <AppText
        variant={Variant.bodyMedium}
        style={[
          styles.userTypeText,
          selectedUserType === type && styles.selectedUserTypeText
        ]}
      >
        {type}
      </AppText>
    </TouchableOpacity>
  )

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

          {/* Title */}
          <AppText variant={Variant.title} style={styles.title}>
            Create your account for
          </AppText>

          {/* User Type Selection */}
          <View style={styles.userTypeContainer}>
            {userTypes.map(renderUserTypeTab)}
          </View>

          {/* Form Section */}
          <FormProvider {...methods}>
            <View style={styles.formContainer}>
              
              {/* First Name */}
              <View style={styles.inputGroup}>
                <AppText variant={Variant.bodyMedium} style={styles.label}>
                  First Name*
                </AppText>
                <FormField
                  name="firstName"
                  placeholder="Enter your first name"
                  rules={signupValidationRules.firstName}
                  inputWrapperStyle={styles.inputContainer}
                  style={styles.inputText}
                />
              </View>

              {/* Last Name */}
              <View style={styles.inputGroup}>
                <AppText variant={Variant.bodyMedium} style={styles.label}>
                  Last Name*
                </AppText>
                <FormField
                  name="lastName"
                  placeholder="Enter your last name"
                  rules={signupValidationRules.lastName}
                  inputWrapperStyle={styles.inputContainer}
                  style={styles.inputText}
                />
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <AppText variant={Variant.bodyMedium} style={styles.label}>
                  Email Address*
                </AppText>
                <FormField
                  name="email"
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  rules={signupValidationRules.email}
                  inputWrapperStyle={styles.inputContainer}
                  style={styles.inputText}
                />
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <AppText variant={Variant.bodyMedium} style={styles.label}>
                  Password*
                </AppText>
                <FormField
                  name="password"
                  type="passwordInput"
                  placeholder="Enter your password"
                  rules={signupValidationRules.password}
                  inputWrapperStyle={styles.inputContainer}
                  style={styles.inputText}
                />
              </View>

              {/* Referral Code */}
              <View style={styles.inputGroup}>
                <AppText variant={Variant.bodyMedium} style={styles.label}>
                  Referral Code
                </AppText>
                <FormField
                  name="referralCode"
                  placeholder="Enter your Referral Code"
                  rules={signupValidationRules.referralCode}
                  inputWrapperStyle={styles.inputContainer}
                  style={styles.inputText}
                />
              </View>

              {/* Terms and Conditions */}
              <TouchableOpacity
                style={styles.termsContainer}
                onPress={() => setAcceptTerms(!acceptTerms)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                  {acceptTerms && (
                    <VectorIcons
                      name={iconLibName.Ionicons}
                      iconName="checkmark"
                      size={16}
                      color="#FFF"
                    />
                  )}
                </View>
                <View style={styles.termsTextContainer}>
                  <AppText variant={Variant.caption} style={styles.termsText}>
                    I agree to the Squad Goo{' '}
                    <AppText variant={Variant.caption} style={styles.termsLink}>
                      Terms and Conditions
                    </AppText>
                    {' '}and{' '}
                    <AppText variant={Variant.caption} style={styles.termsLink}>
                      Privacy Policy
                    </AppText>
                    .
                  </AppText>
                </View>
              </TouchableOpacity>

              {/* Sign Up Button */}
              <View style={styles.buttonContainer}>
                <AppButton
                  bgColor={colors.primary || '#FF6B35'}
                  text="Join Squad Goo"
                  onPress={handleSubmit(handleSignUp)}
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                />
              </View>
              </View>

            </FormProvider>

            {/* Google Sign Up */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignUp}
              activeOpacity={0.7}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="logo-google"
                size={20}
                color="#FF6B35"
              />
              <AppText variant={Variant.bodyMedium} style={styles.googleButtonText}>
                Sign Up With Google
              </AppText>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <AppText variant={Variant.caption} style={styles.loginText}>
                Already have an account?{' '}
              </AppText>
              <TouchableOpacity onPress={() => navigation.navigate(screenNames.SIGN_IN)}>
                <AppText variant={Variant.captionMedium} style={styles.loginLink}>
                  Log In
                </AppText>
              </TouchableOpacity>
            </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default SignUp

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
    marginBottom: hp(3),
  },
  logo: {
    width: wp(25),
    height: wp(25),
    resizeMode: 'contain',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: hp(3),
  },
  userTypeContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E8E8E8',
    // backgroundColor: colors.grayE8 || '#F5F5F5',
    borderRadius: hp(4),
    padding: hp(0.5),
    marginBottom: hp(3),
  },
  userTypeTab: {
    flex: 1,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(2),
    borderRadius: hp(3.5),
    alignItems: 'center',
  },
  selectedUserTypeTab: {
    backgroundColor: colors.primary || '#FF6B35',
  },
  userTypeText: {
    color: colors.gray || '#666666',
  },
  selectedUserTypeText: {
    color: colors.white,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    // marginBottom: hp(2.5),
  },
  label: {
    color: colors.black,
    marginBottom: hp(0.8),
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E8E8E8',
    borderRadius: hp(2),
    backgroundColor: colors.white,
    height: hp(7),
  },
  inputText: {
    color: colors.black,
    fontSize: getFontSize(14),
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp(3),
    paddingRight: wp(2),
  },
  checkbox: {
    width: hp(2.5),
    height: hp(2.5),
    borderRadius: hp(0.5),
    borderWidth: 2,
    borderColor: colors.grayE8 || '#E8E8E8',
    marginRight: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginTop: hp(0.2),
  },
  checkboxChecked: {
    backgroundColor: colors.primary || '#FF6B35',
    borderColor: colors.primary || '#FF6B35',
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    color: colors.gray || '#666666',
    lineHeight: hp(2.2),
  },
  termsLink: {
    color: colors.primary || '#FF6B35',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginBottom: hp(2),
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary || '#FF6B35',
    borderRadius: hp(2),
    paddingVertical: hp(1.8),
    marginBottom: hp(3),
    gap: wp(2),
  },
  googleButtonText: {
    color: colors.primary || '#FF6B35',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: colors.gray || '#666666',
  },
  loginLink: {
    color: colors.primary || '#FF6B35',
    textDecorationLine: 'underline',
  },
})