
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import React from 'react'
import { colors, getFontSize, hp, wp } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppButton from '@/core/AppButton'
import AppText, { Variant } from '@/core/AppText'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const VerificationSuccessModal = ({ 
  visible, 
  onClose, 
  onGotoDashboard,
  animationType = 'fade'
}) => {

  const handleGotoDashboard = () => {
    onGotoDashboard && onGotoDashboard()
    onClose && onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType={animationType}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            
            {/* Success Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.successIcon}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="checkmark"
                  size={50}
                  color="#FFFFFF"
                />
              </View>
            </View>

            {/* Title */}
            <AppText variant={Variant.title} style={styles.title}>
              Congratulation !
            </AppText>

            {/* Subtitle */}
            <AppText variant={Variant.body} style={styles.subtitle}>
              Your account has been verified.
            </AppText>

            {/* Button */}
            <View style={styles.buttonContainer}>
              <AppButton
                bgColor={colors.primary || '#FF6B35'}
                text="Go to Sign in"
                onPress={handleGotoDashboard}
                // style={styles.button}
              />
            </View>

          </View>
        </View>
      </View>
    </Modal>
  )
}

export default VerificationSuccessModal

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    width: screenWidth,
    height: screenHeight,
  },
  modalContainer: {
    width: wp(85),
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: colors.white || '#FFFFFF',
    borderRadius: hp(3),
    paddingHorizontal: wp(8),
    paddingVertical: hp(5),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  iconContainer: {
    marginBottom: hp(3),
  },
  successIcon: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    backgroundColor: '#4CAF50', // Green color from the design
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  title: {
    color: '#604478', // Purple color matching the design
    marginBottom: hp(1.5),
    fontSize: getFontSize(28),
    textAlign: 'center',
  },
  subtitle: {
    // color: colors.gray || '#6B7280',
    textAlign: 'center',
    marginBottom: hp(4),
    fontSize: getFontSize(16),
    lineHeight: hp(2.5),
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    borderRadius: hp(2),
  },
})