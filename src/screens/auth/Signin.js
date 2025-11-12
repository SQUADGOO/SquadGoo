import { 
  ImageBackground, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native'
import React, { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Images } from '@/assets'
import { colors, getFontSize, hp, wp } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import FormField from '@/core/FormField'
import { signinRules } from '@/utilities/validationSchemas'
import AppButton from '@/core/AppButton'
import AppText, { Variant } from '@/core/AppText'
import { screenNames } from '@/navigation/screenNames'
import { store } from '@/store/store'
import { showToast, toastTypes } from '@/utilities/toastConfig'
import { useLogin } from '@/api/auth/auth.query'
import { login as loginAction } from '@/store/authSlice'
import { useDispatch } from 'react-redux'
import { validateDummyCredentials, getDisplayCredentials, isDummyMode } from '@/utilities/dummyData'

const SignIn = ({ navigation }) => {
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // const { mutate: login, isPending, isError } = useLogin(); // Commented out for local testing
  
  // Initialize form methods
  const methods = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const { handleSubmit, formState: { isSubmitting } } = methods

const handleLogin = async (data) => {
  try {
    setIsLoggingIn(true);
    const { email, password } = data;
    console.log('Login with:', data);
    
    // === DUMMY USER LOGIN (FOR LOCAL TESTING) ===
    if (isDummyMode()) {
      const dummyUser = validateDummyCredentials(email, password);
      
      if (dummyUser) {
        dispatch(loginAction(dummyUser));
        const welcomeMessage = `Welcome back, ${dummyUser.firstName}!`;
        showToast(welcomeMessage, 'Success', toastTypes.success);
        setIsLoggingIn(false);
        return;
      } else {
        showToast('Invalid email or password', 'Error', toastTypes.error);
        setIsLoggingIn(false);
        return;
      }
    }
    
    // === FOR API INTEGRATION ===
    // await login({ email, password });
    
  } catch (error) {
    setIsLoggingIn(false);
    Alert.alert('Error', 'Login failed. Please try again.');
    console.error('Login error:', error);
  }
};


  const handleSocialLogin = (provider) => {
  
    console.log('Login with:', provider);
  };

  return (
    <ImageBackground source={Images.signinBg} style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Image Section */}
          <View style={styles.imageContainer}>
            {/* Your decorative elements can go here */}
          </View>

          {/* Login Form Container */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>Log in</Text>

            {/* Form Provider wraps the form */}
            <FormProvider {...methods}>
              
              {/* Email Input using FormField */}
              <View style={styles.inputGroup}>
                <View style={styles.passwordHeader}>
                  <Text style={styles.label}>Email</Text>
                  
                </View>
                <FormField
                  name="email"
                  // label="Email"
                  placeholder="hello@example.com"
                  keyboardType="email-address"
                  rules={signinRules.email}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                />
              </View>

              {/* Password Input using FormField */}
              <View style={styles.inputGroup}>
                <View style={styles.passwordHeader}>
                  <Text style={styles.label}>Password</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotPassword}>Forgot Password</Text>
                  </TouchableOpacity>
                </View>
                
                <FormField
                  name="password"
                  type="passwordInput"
                  placeholder="••••••••"
                  rules={signinRules.password}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                />
              </View>

              {/* Remember Me Checkbox */}
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && (
                    <VectorIcons name={iconLibName.Ionicons} iconName="checkmark" size={18} color="#FFF" />
                  )}
                </View>
                <AppText variant={Variant.ligntBody} style={styles.checkboxLabel}>Keep me signed in</AppText>
              </TouchableOpacity>

              {/* Login Button */}
              <View style={{marginBottom: hp(2)}}> 
                
              <AppButton
              bgColor={colors.primary}
              text="Log in"
              onPress={handleSubmit(handleLogin)}
              isLoading={isLoggingIn}
              />
              </View>
              {/* <TouchableOpacity 
                style={[styles.loginButton, isSubmitting && styles.loginButtonDisabled]}
                activeOpacity={0.8}
                onPress={handleSubmit(handleLogin)}
                disabled={isSubmitting}
              >
                <Text style={styles.loginButtonText}>
                  {isSubmitting ? 'Logging in...' : 'Log in'}
                </Text>
              </TouchableOpacity> */}

            </FormProvider>

            {/* Social Login Section */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or sign in with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialContainer}>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialLogin('google')}
              >
                <VectorIcons name={iconLibName.Ionicons} iconName="logo-google" size={24} color="#FFF" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialLogin('apple')}
              >
                <VectorIcons name={iconLibName.Ionicons} iconName="logo-apple" size={24} color="#FFF" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialLogin('facebook')}
              >
                <VectorIcons name={iconLibName.FontAwesome} iconName="facebook-f" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <AppText style={styles.signupText}>Don't have an Account? </AppText>
              <TouchableOpacity onPress={() => navigation.navigate(screenNames.SIGN_UP)}>
                <AppText style={styles.signupLink}>Sign up here</AppText>
              </TouchableOpacity>
            </View>

            {/* Dummy Credentials Info (For Testing) */}
            {isDummyMode() && (
              <View style={styles.dummyCredentials}>
                <Text style={styles.dummyTitle}>🔧 Test Credentials (Local Mode)</Text>
                {getDisplayCredentials().map((cred, index) => (
                  <View key={index} style={styles.credentialItem}>
                    <Text style={styles.credentialRole}>{cred.role}:</Text>
                    <Text style={styles.credentialText}>
                      {cred.email} / {cred.password}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

export default SignIn

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    height: hp(35),
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: wp(8),
    paddingTop: hp(2),
  },
  title: {
    fontSize: hp(4),
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: hp(3),
  },
  inputGroup: {
    // marginBottom: hp(2.5),
  },
  label: {
    fontSize: hp(2),
    color: '#FFF',
    marginBottom: hp(0.3),
    fontWeight: '500',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: hp(3),
    backgroundColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(7),
  },
  input: {
    flex: 1,
    paddingHorizontal: wp(5),
    fontSize: hp(2),
    color: '#FFF',
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  forgotPassword: {
    fontSize: hp(1.8),
    color: '#FFF',
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(3),
  },
  checkbox: {
    width: hp(2.5),
    height: hp(2.5),
    borderRadius: hp(0.5),
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    marginRight: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  checkboxChecked: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  checkboxLabel: {
    color: '#FFF',
  },
  loginButton: {
    backgroundColor: '#FF6B35',
    height: hp(7),
    borderRadius: hp(3),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(3),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: hp(2.5),
    fontWeight: '700',
    color: '#FFF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(3),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dividerText: {
    fontSize: hp(1.8),
    color: 'rgba(255,255,255,0.8)',
    marginHorizontal: wp(3),
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: hp(3),
  },
  socialButton: {
    width: wp(22),
    height: hp(6),
    borderRadius: hp(1.5),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(2),
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp(3),
  },
  signupText: {
    fontSize: getFontSize(13),
    color: 'rgba(255,255,255,0.8)',
  },
  signupLink: {
    fontSize: getFontSize(13),
    color: '#FFD93D',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  dummyCredentials: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: hp(2),
    padding: wp(4),
    marginTop: hp(2),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dummyTitle: {
    fontSize: getFontSize(14),
    color: '#FFD93D',
    fontWeight: '700',
    marginBottom: hp(1.5),
    textAlign: 'center',
  },
  credentialItem: {
    marginBottom: hp(0.8),
  },
  credentialRole: {
    fontSize: getFontSize(12),
    color: '#FFF',
    fontWeight: '600',
    marginBottom: hp(0.3),
  },
  credentialText: {
    fontSize: getFontSize(11),
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
})