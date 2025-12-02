// import React, { useState } from 'react';
// import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import { colors, hp, wp, getFontSize } from '@/theme';
// import AppText, { Variant } from '@/core/AppText';
// import AppButton from '@/core/AppButton';
// import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
// import Share from 'react-native-share';

// // Optional QR Code import - will use placeholder if not available
// let QRCode = null;
// try {
//   QRCode = require('react-native-qrcode-svg').default;
// } catch (e) {
//   console.warn('react-native-qrcode-svg not installed. QR code display will be disabled.');
// }

// const CodeSharing = ({ 
//   code, 
//   onCodeVerified,
//   onCodeShared,
//   codeExpiry,
//   showQR = true,
//   showNumeric = true,
// }) => {
//   const [codeInput, setCodeInput] = useState('');
//   const [isVerified, setIsVerified] = useState(false);

//   const handleVerifyCode = () => {
//     if (codeInput === code) {
//       setIsVerified(true);
//       if (onCodeVerified) {
//         onCodeVerified(code);
//       }
//       Alert.alert('Success', 'Code verified successfully!');
//     } else {
//       Alert.alert('Error', 'Invalid code. Please try again.');
//       setCodeInput('');
//     }
//   };

//   const handleShareCode = async () => {
//     try {
//       const shareOptions = {
//         message: `Quick Search Payment Code: ${code}\n\nThis code expires in 10 minutes.`,
//         title: 'Payment Verification Code',
//       };
//       await Share.open(shareOptions);
//       if (onCodeShared) {
//         onCodeShared();
//       }
//     } catch (error) {
//       if (error.message !== 'User did not share') {
//         console.error('Error sharing code:', error);
//       }
//     }
//   };

//   const formatExpiryTime = () => {
//     if (!codeExpiry) return '';
//     const expiry = new Date(codeExpiry);
//     const now = new Date();
//     const diff = Math.max(0, Math.floor((expiry - now) / 1000 / 60));
//     return `${diff} minutes`;
//   };

//   return (
//     <View style={styles.container}>
//       <AppText variant={Variant.bodyMedium} style={styles.title}>
//         Payment Verification Code
//       </AppText>

//       {/* QR Code */}
//       {showQR && code && (
//         <View style={styles.qrContainer}>
//           {QRCode ? (
//             <QRCode
//               value={code}
//               size={wp(60)}
//               color={colors.black}
//               backgroundColor={colors.white}
//             />
//           ) : (
//             <View style={styles.qrPlaceholder}>
//               <VectorIcons
//                 name={iconLibName.Ionicons}
//                 iconName="qr-code-outline"
//                 size={64}
//                 color={colors.gray}
//               />
//               <AppText variant={Variant.caption} style={styles.qrPlaceholderText}>
//                 QR Code requires react-native-qrcode-svg package
//               </AppText>
//             </View>
//           )}
//           <AppText variant={Variant.caption} style={styles.qrHint}>
//             Scan this QR code or enter the numeric code below
//           </AppText>
//         </View>
//       )}

//       {/* Numeric Code */}
//       {showNumeric && code && (
//         <View style={styles.codeContainer}>
//           <AppText variant={Variant.body} style={styles.codeLabel}>
//             Numeric Code
//           </AppText>
//           <View style={styles.codeDisplay}>
//             <AppText variant={Variant.subTitle} style={styles.codeValue}>
//               {code}
//             </AppText>
//           </View>
//           {codeExpiry && (
//             <AppText variant={Variant.caption} style={styles.expiryText}>
//               Expires in: {formatExpiryTime()}
//             </AppText>
//           )}
//         </View>
//       )}

//       {/* Share Button */}
//       {code && (
//         <TouchableOpacity
//           style={styles.shareButton}
//           onPress={handleShareCode}
//           activeOpacity={0.7}
//         >
//           <VectorIcons
//             name={iconLibName.Ionicons}
//             iconName="share-outline"
//             size={20}
//             color={colors.primary}
//           />
//           <AppText variant={Variant.bodyMedium} style={styles.shareText}>
//             Share Code
//           </AppText>
//         </TouchableOpacity>
//       )}

//       {/* Code Verification Input */}
//       {onCodeVerified && !isVerified && (
//         <View style={styles.verifyContainer}>
//           <AppText variant={Variant.body} style={styles.verifyLabel}>
//             Enter Code to Verify
//           </AppText>
//           <View style={styles.inputContainer}>
//             <View style={styles.codeInput}>
//               <AppText variant={Variant.subTitle} style={styles.codeInputText}>
//                 {codeInput.padEnd(6, '_').split('').map((char, index) => (
//                   <AppText key={index} style={styles.codeChar}>
//                     {char}
//                   </AppText>
//                 ))}
//               </AppText>
//             </View>
//           </View>
//           <View style={styles.numberPad}>
//             {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
//               <TouchableOpacity
//                 key={num}
//                 style={styles.numberButton}
//                 onPress={() => {
//                   if (codeInput.length < 6) {
//                     setCodeInput(codeInput + num);
//                   }
//                 }}
//               >
//                 <AppText variant={Variant.bodyMedium} style={styles.numberText}>
//                   {num}
//                 </AppText>
//               </TouchableOpacity>
//             ))}
//             <TouchableOpacity
//               style={styles.numberButton}
//               onPress={() => setCodeInput('')}
//             >
//               <AppText variant={Variant.bodyMedium} style={styles.numberText}>
//                 Clear
//               </AppText>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.numberButton}
//               onPress={() => {
//                 if (codeInput.length < 6) {
//                   setCodeInput(codeInput + '0');
//                 }
//               }}
//             >
//               <AppText variant={Variant.bodyMedium} style={styles.numberText}>
//                 0
//               </AppText>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.numberButton, styles.deleteButton]}
//               onPress={() => setCodeInput(codeInput.slice(0, -1))}
//             >
//               <VectorIcons
//                 name={iconLibName.Ionicons}
//                 iconName="backspace-outline"
//                 size={20}
//                 color={colors.white}
//               />
//             </TouchableOpacity>
//           </View>
//           <AppButton
//             text="Verify Code"
//             onPress={handleVerifyCode}
//             bgColor={colors.primary}
//             textColor={colors.white}
//             disabled={codeInput.length !== 6}
//           />
//         </View>
//       )}

//       {/* Verified Status */}
//       {isVerified && (
//         <View style={styles.verifiedContainer}>
//           <VectorIcons
//             name={iconLibName.Ionicons}
//             iconName="checkmark-circle"
//             size={48}
//             color="#10B981"
//           />
//           <AppText variant={Variant.bodyMedium} style={styles.verifiedText}>
//             Code Verified Successfully!
//           </AppText>
//         </View>
//       )}
//     </View>
//   );
// };

// export default CodeSharing;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: colors.white,
//     borderRadius: 12,
//     padding: wp(5),
//     marginVertical: hp(1),
//   },
//   title: {
//     color: colors.secondary,
//     fontSize: getFontSize(18),
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: hp(2),
//   },
//   qrContainer: {
//     alignItems: 'center',
//     marginBottom: hp(2),
//     padding: wp(4),
//     backgroundColor: colors.white,
//     borderRadius: 8,
//   },
//   qrHint: {
//     color: colors.gray,
//     fontSize: getFontSize(12),
//     marginTop: hp(1),
//     textAlign: 'center',
//   },
//   qrPlaceholder: {
//     width: wp(60),
//     height: wp(60),
//     backgroundColor: colors.grayE8 || '#F3F4F6',
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: colors.grayE8 || '#E5E7EB',
//   },
//   qrPlaceholderText: {
//     color: colors.gray,
//     fontSize: getFontSize(10),
//     marginTop: hp(1),
//     textAlign: 'center',
//   },
//   codeContainer: {
//     alignItems: 'center',
//     marginBottom: hp(2),
//   },
//   codeLabel: {
//     color: colors.gray,
//     fontSize: getFontSize(14),
//     marginBottom: hp(1),
//   },
//   codeDisplay: {
//     backgroundColor: colors.grayE8 || '#F3F4F6',
//     paddingVertical: hp(2),
//     paddingHorizontal: wp(8),
//     borderRadius: 8,
//     marginBottom: hp(1),
//   },
//   codeValue: {
//     color: colors.primary,
//     fontSize: getFontSize(28),
//     fontWeight: 'bold',
//     letterSpacing: 4,
//   },
//   expiryText: {
//     color: colors.gray,
//     fontSize: getFontSize(12),
//   },
//   shareButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: hp(1.5),
//     borderWidth: 1,
//     borderColor: colors.primary,
//     borderRadius: 8,
//     marginBottom: hp(2),
//   },
//   shareText: {
//     color: colors.primary,
//     marginLeft: wp(2),
//     fontWeight: '600',
//   },
//   verifyContainer: {
//     marginTop: hp(2),
//   },
//   verifyLabel: {
//     color: colors.secondary,
//     fontSize: getFontSize(14),
//     textAlign: 'center',
//     marginBottom: hp(2),
//   },
//   inputContainer: {
//     alignItems: 'center',
//     marginBottom: hp(2),
//   },
//   codeInput: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   codeInputText: {
//     fontSize: getFontSize(24),
//     letterSpacing: 8,
//   },
//   codeChar: {
//     marginHorizontal: wp(1),
//     color: colors.secondary,
//     fontWeight: 'bold',
//   },
//   numberPad: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     marginBottom: hp(2),
//   },
//   numberButton: {
//     width: wp(25),
//     height: wp(25),
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: colors.grayE8 || '#F3F4F6',
//     borderRadius: 8,
//     margin: wp(1.5),
//   },
//   deleteButton: {
//     backgroundColor: colors.primary,
//   },
//   numberText: {
//     color: colors.secondary,
//     fontSize: getFontSize(20),
//     fontWeight: 'bold',
//   },
//   verifiedContainer: {
//     alignItems: 'center',
//     paddingVertical: hp(2),
//   },
//   verifiedText: {
//     color: '#10B981',
//     fontSize: getFontSize(16),
//     fontWeight: '600',
//     marginTop: hp(1),
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