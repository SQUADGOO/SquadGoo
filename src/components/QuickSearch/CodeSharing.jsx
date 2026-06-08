// import React, { useMemo, useState } from 'react';
// import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import { colors, hp, wp, getFontSize } from '@/theme';
// import AppText, { Variant } from '@/core/AppText';
// import AppButton from '@/core/AppButton';
// import VectorIcons, { iconLibName } from '@/theme/vectorIcon';

// let QRCode = null;
// try {
//   QRCode = require('react-native-qrcode-svg').default;
// } catch (error) {
//   console.warn('react-native-qrcode-svg package not installed. Showing placeholder artwork.');
// }

// const keypadDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'];

// const CodeSharing = ({
//   code = '000000',
//   codeLabel = 'Payment Verification Code',
//   helperText = 'Share or enter this code to keep escrow moving.',
//   codeExpiry,
//   showQR = true,
//   showNumeric = true,
//   showKeypad = true,
//   readOnly = false,
//   onSharePress,
//   onVerifyPress,
// }) => {
//   const [codeInput, setCodeInput] = useState('');

//   const expiryLabel = useMemo(() => {
//     if (!codeExpiry) return '';
//     const expiryDate = new Date(codeExpiry).getTime();
//     const diffMs = expiryDate - Date.now();
//     if (Number.isNaN(diffMs) || diffMs <= 0) return 'Expired';
//     const minutes = Math.floor(diffMs / 60000)
//       .toString()
//       .padStart(2, '0');
//     const seconds = Math.floor((diffMs % 60000) / 1000)
//       .toString()
//       .padStart(2, '0');
//     return `in ${minutes}:${seconds}`;
//   }, [codeExpiry]);

//   const handleShare = () => {
//     if (typeof onSharePress === 'function') {
//       onSharePress(code);
//       return;
//     }
//     Alert.alert('Share Code', 'Share flow will be connected to backend later.');
//   };

//   const handleVerify = () => {
//     if (codeInput.length !== 6) return;
//     if (typeof onVerifyPress === 'function') {
//       onVerifyPress(codeInput);
//       return;
//     }
//     Alert.alert('Verify Code', 'Verification handler not wired yet.');
//   };

//   const handleDigitPress = (digit) => {
//     if (digit === 'back') {
//       setCodeInput((prev) => prev.slice(0, -1));
//       return;
//     }
//     if (digit === 'clear') {
//       setCodeInput('');
//       return;
//     }
//     if (codeInput.length >= 6) return;
//     setCodeInput((prev) => prev + digit);
//   };

//   const shouldRenderKeypad = showKeypad && !readOnly;

//   const renderDigitLabel = (digit) => {
//     if (digit === 'back') {
//       return (
//         <VectorIcons
//           name={iconLibName.Ionicons}
//           iconName="backspace-outline"
//           size={20}
//           color={colors.white}
//         />
//       );
//     }
//     if (digit === 'clear') {
//       return (
//         <AppText variant={Variant.caption} style={styles.keypadClearLabel}>
//           Clear
//         </AppText>
//       );
//     }
//     return (
//       <AppText variant={Variant.bodyMedium} style={styles.keypadDigit}>
//         {digit}
//       </AppText>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <AppText variant={Variant.bodyMedium} style={styles.title}>
//         {codeLabel}
//       </AppText>
//       <AppText variant={Variant.caption} style={styles.helperText}>
//         {helperText}
//       </AppText>

//       {showQR && code && (
//         <View style={styles.qrContainer}>
//           {QRCode ? (
//             <QRCode value={code} size={wp(42)} color={colors.black} backgroundColor={colors.white} />
//           ) : (
//             <View style={styles.qrPlaceholder}>
//               <VectorIcons
//                 name={iconLibName.Ionicons}
//                 iconName="qr-code-outline"
//                 size={48}
//                 color={colors.gray}
//               />
//               <AppText variant={Variant.caption} style={styles.qrPlaceholderText}>
//                 QR preview placeholder
//               </AppText>
//             </View>
//           )}
//           <AppText variant={Variant.caption} style={styles.qrHint}>
//             Scan or enter this code to keep the timer in sync.
//           </AppText>
//         </View>
//       )}

//       {showNumeric && (
//         <View style={styles.codeDisplay}>
//           <AppText variant={Variant.caption} style={styles.codeLabel}>
//             Numeric Code
//           </AppText>
//           <View style={styles.codeValueWrapper}>
//             <AppText variant={Variant.title} style={styles.codeValue}>
//               {code}
//             </AppText>
//           </View>
//           {expiryLabel ? (
//             <AppText variant={Variant.caption} style={styles.expiryText}>
//               Expires {expiryLabel}
//             </AppText>
//           ) : null}
//         </View>
//       )}

//       {shouldRenderKeypad && (
//         <>
//           <View style={styles.entryPreview}>
//             {Array.from({ length: 6 }).map((_, index) => (
//               <View key={`slot-${index}`} style={styles.entrySlot}>
//                 <AppText variant={Variant.bodyMedium} style={styles.entrySlotText}>
//                   {codeInput[index] || '•'}
//                 </AppText>
//               </View>
//             ))}
//           </View>
//           <View style={styles.keypadContainer}>
//             {keypadDigits.map((digit) => (
//               <TouchableOpacity
//                 key={digit}
//                 style={[
//                   styles.keypadButton,
//                   digit === 'back' && styles.keypadBackButton,
//                   digit === 'clear' && styles.keypadClearButton,
//                 ]}
//                 activeOpacity={0.85}
//                 onPress={() => handleDigitPress(digit)}
//               >
//                 {renderDigitLabel(digit)}
//               </TouchableOpacity>
//             ))}
//           </View>
//           <AppButton
//             text="Verify & Hold"
//             onPress={handleVerify}
//             bgColor={colors.primary}
//             textColor={colors.white}
//             disabled={codeInput.length !== 6}
//           />
//         </>
//       )}

//       {!shouldRenderKeypad && (
//         <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.85}>
//           <VectorIcons
//             name={iconLibName.Ionicons}
//             iconName="share-outline"
//             size={18}
//             color={colors.primary}
//           />
//           <AppText variant={Variant.bodyMedium} style={styles.shareText}>
//             Share code with counterpart
//           </AppText>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// export default CodeSharing;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: colors.white,
//     borderRadius: 16,
//     padding: wp(4),
//     borderWidth: 1,
//     borderColor: colors.grayE8 || '#E5E7EB',
//     marginVertical: hp(1.5),
//   },
//   title: {
//     color: colors.secondary,
//     fontSize: getFontSize(16),
//     fontWeight: '600',
//   },
//   helperText: {
//     color: colors.gray,
//     marginTop: hp(0.5),
//   },
//   qrContainer: {
//     alignItems: 'center',
//     marginVertical: hp(2),
//   },
//   qrPlaceholder: {
//     width: wp(42),
//     height: wp(42),
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: colors.grayE8 || '#E5E7EB',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: colors.white,
//   },
//   qrPlaceholderText: {
//     color: colors.gray,
//     marginTop: hp(0.5),
//   },
//   qrHint: {
//     color: colors.gray,
//     marginTop: hp(1),
//     textAlign: 'center',
//   },
//   codeDisplay: {
//     alignItems: 'center',
//     marginBottom: hp(1.5),
//   },
//   codeLabel: {
//     color: colors.gray,
//     marginBottom: hp(0.5),
//   },
//   codeValueWrapper: {
//     paddingVertical: hp(1),
//     paddingHorizontal: wp(6),
//     backgroundColor: colors.grayE8 || '#F3F4F6',
//     borderRadius: 12,
//   },
//   codeValue: {
//     letterSpacing: 6,
//     color: colors.primary,
//   },
//   expiryText: {
//     marginTop: hp(0.5),
//     color: colors.gray,
//   },
//   entryPreview: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: hp(1),
//   },
//   entrySlot: {
//     width: wp(10),
//     height: wp(10),
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: colors.grayE8 || '#E5E7EB',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   entrySlotText: {
//     color: colors.secondary,
//     fontSize: getFontSize(18),
//     fontWeight: '600',
//   },
//   keypadContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: hp(1),
//   },
//   keypadButton: {
//     width: '30%',
//     aspectRatio: 1,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: colors.grayE8 || '#E5E7EB',
//     marginBottom: hp(0.8),
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: colors.white,
//   },
//   keypadDigit: {
//     color: colors.secondary,
//     fontSize: getFontSize(18),
//     fontWeight: '600',
//   },
//   keypadClearButton: {
//     backgroundColor: colors.grayE8 || '#F3F4F6',
//   },
//   keypadBackButton: {
//     backgroundColor: colors.primary,
//   },
//   keypadClearLabel: {
//     color: colors.secondary,
//     fontWeight: '600',
//   },
//   shareButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: hp(1.3),
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: colors.primary,
//     marginTop: hp(1),
//   },
//   shareText: {
//     color: colors.primary,
//     marginLeft: wp(2),
//     fontWeight: '600',
//   },
// });



import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CodeSharing = () => {
  return (
    <View>
      <Text>CodeSharing</Text>
    </View>
  )
}

export default CodeSharing

const styles = StyleSheet.create({})