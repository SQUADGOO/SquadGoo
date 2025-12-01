import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppButton from '@/core/AppButton';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';

const CodeSharing = ({ 
  code, 
  onCodeVerified,
  onCodeShared,
  codeExpiry,
  showNumeric = true,
  isRecruiter = false, // If true, shows code to share; if false, shows input to verify
}) => {
  const [codeInput, setCodeInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    if (codeExpiry) {
      const updateTimer = () => {
        const expiry = new Date(codeExpiry);
        const now = new Date();
        const diff = Math.max(0, Math.floor((expiry - now) / 1000));
        setTimeRemaining(diff);
        
        if (diff === 0) {
          Alert.alert('Code Expired', 'The verification code has expired. Please request a new one.');
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [codeExpiry]);

  const handleVerifyCode = () => {
    if (codeInput.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter a 6-digit code.');
      return;
    }

    if (codeInput === code) {
      setIsVerified(true);
      if (onCodeVerified) {
        onCodeVerified(code);
      }
    } else {
      Alert.alert('Invalid Code', 'The code you entered is incorrect. Please try again.');
      setCodeInput('');
    }
  };

  const formatTimeRemaining = () => {
    if (!timeRemaining) return '';
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Recruiter view - show code to share
  if (isRecruiter && code) {
    return (
      <View style={styles.container}>
        <AppText variant={Variant.bodyMedium} style={styles.title}>
          Share This Code
        </AppText>
        <AppText variant={Variant.caption} style={styles.subtitle}>
          Share this code with the job seeker to confirm platform payment
        </AppText>

        {/* Numeric Code Display */}
        {showNumeric && code && (
          <View style={styles.codeContainer}>
            <AppText variant={Variant.body} style={styles.codeLabel}>
              Verification Code
            </AppText>
            <View style={styles.codeDisplay}>
              <AppText variant={Variant.subTitle} style={styles.codeValue}>
                {code}
              </AppText>
            </View>
            {codeExpiry && timeRemaining !== null && (
              <AppText variant={Variant.caption} style={styles.expiryText}>
                Expires in: {formatTimeRemaining()}
              </AppText>
            )}
          </View>
        )}

        {/* Copy Code Button */}
        {code && (
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => {
              // In a real app, this would copy to clipboard
              Alert.alert('Code Copied', `Code ${code} has been copied to clipboard.`);
              if (onCodeShared) {
                onCodeShared();
              }
            }}
            activeOpacity={0.7}
          >
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="copy-outline"
              size={20}
              color={colors.primary}
            />
            <AppText variant={Variant.bodyMedium} style={styles.copyText}>
              Copy Code
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Job Seeker view - show input to verify code
  if (!isRecruiter && onCodeVerified && !isVerified) {
    return (
      <View style={styles.container}>
        <AppText variant={Variant.bodyMedium} style={styles.title}>
          Enter Verification Code
        </AppText>
        <AppText variant={Variant.caption} style={styles.subtitle}>
          Enter the 6-digit code shared by the recruiter
        </AppText>

        {/* Code Input */}
        <View style={styles.inputContainer}>
          <View style={styles.codeInputRow}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <View
                key={index}
                style={[
                  styles.codeInputBox,
                  codeInput.length === index && styles.codeInputBoxActive,
                ]}
              >
                <AppText variant={Variant.subTitle} style={styles.codeInputText}>
                  {codeInput[index] || ''}
                </AppText>
              </View>
            ))}
          </View>
          {codeExpiry && timeRemaining !== null && (
            <AppText variant={Variant.caption} style={styles.expiryText}>
              Code expires in: {formatTimeRemaining()}
            </AppText>
          )}
        </View>

        {/* Number Pad */}
        <View style={styles.numberPad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.numberButton}
              onPress={() => {
                if (codeInput.length < 6) {
                  setCodeInput(codeInput + num.toString());
                }
              }}
              activeOpacity={0.7}
            >
              <AppText variant={Variant.bodyMedium} style={styles.numberText}>
                {num}
              </AppText>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.numberButton}
            onPress={() => setCodeInput('')}
            activeOpacity={0.7}
          >
            <AppText variant={Variant.bodyMedium} style={styles.numberText}>
              Clear
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numberButton}
            onPress={() => {
              if (codeInput.length < 6) {
                setCodeInput(codeInput + '0');
              }
            }}
            activeOpacity={0.7}
          >
            <AppText variant={Variant.bodyMedium} style={styles.numberText}>
              0
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.numberButton, styles.deleteButton]}
            onPress={() => setCodeInput(codeInput.slice(0, -1))}
            activeOpacity={0.7}
          >
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="backspace-outline"
              size={20}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>

        <AppButton
          text="Verify Code"
          onPress={handleVerifyCode}
          bgColor={colors.primary}
          textColor={colors.white}
          disabled={codeInput.length !== 6}
          style={styles.verifyButton}
        />
      </View>
    );
  }

  // Verified status
  if (isVerified) {
  return (
      <View style={styles.container}>
        <View style={styles.verifiedContainer}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="checkmark-circle"
            size={64}
            color="#10B981"
          />
          <AppText variant={Variant.bodyMedium} style={styles.verifiedText}>
            Code Verified Successfully!
          </AppText>
        </View>
    </View>
    );
}

  return null;
};

export default CodeSharing;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: wp(5),
    marginVertical: hp(1),
  },
  title: {
    color: colors.secondary,
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp(1),
  },
  subtitle: {
    color: colors.gray,
    fontSize: getFontSize(12),
    textAlign: 'center',
    marginBottom: hp(2),
  },
  codeContainer: {
    alignItems: 'center',
    marginBottom: hp(2),
  },
  codeLabel: {
    color: colors.gray,
    fontSize: getFontSize(14),
    marginBottom: hp(1),
  },
  codeDisplay: {
    backgroundColor: colors.grayE8 || '#F3F4F6',
    paddingVertical: hp(2.5),
    paddingHorizontal: wp(8),
    borderRadius: 12,
    marginBottom: hp(1),
    borderWidth: 2,
    borderColor: colors.primary,
  },
  codeValue: {
    color: colors.primary,
    fontSize: getFontSize(32),
    fontWeight: 'bold',
    letterSpacing: 6,
  },
  expiryText: {
    color: colors.gray,
    fontSize: getFontSize(12),
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    marginTop: hp(1),
  },
  copyText: {
    color: colors.primary,
    marginLeft: wp(2),
    fontWeight: '600',
  },
  inputContainer: {
    alignItems: 'center',
    marginBottom: hp(2),
  },
  codeInputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: hp(1),
  },
  codeInputBox: {
    width: wp(12),
    height: wp(12),
    borderWidth: 2,
    borderColor: colors.grayE8 || '#E5E7EB',
    borderRadius: 8,
    marginHorizontal: wp(1),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  codeInputBoxActive: {
    borderColor: colors.primary,
    backgroundColor: colors.grayE8 || '#F3F4F6',
  },
  codeInputText: {
    fontSize: getFontSize(24),
    fontWeight: 'bold',
    color: colors.secondary,
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  numberButton: {
    width: wp(25),
    height: wp(12),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grayE8 || '#F3F4F6',
    borderRadius: 8,
    margin: wp(1.5),
  },
  deleteButton: {
    backgroundColor: colors.primary,
  },
  numberText: {
    color: colors.secondary,
    fontSize: getFontSize(18),
    fontWeight: 'bold',
  },
  verifyButton: {
    marginTop: hp(1),
  },
  verifiedContainer: {
    alignItems: 'center',
    paddingVertical: hp(2),
  },
  verifiedText: {
    color: '#10B981',
    fontSize: getFontSize(16),
    fontWeight: '600',
    marginTop: hp(1),
  },
});
