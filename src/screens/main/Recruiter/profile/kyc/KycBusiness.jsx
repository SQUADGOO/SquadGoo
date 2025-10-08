// screens/KycVerification.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import VectorIcons, {iconLibName} from '@/theme/vectorIcon';
import {colors, getFontSize, hp, wp} from '@/theme';
import AppText, {Variant} from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import { screenNames } from '@/navigation/screenNames';

const KycBusiness = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={{flex: 1, backgroundColor: colors.white}}>
      {/* Header */}
   <AppHeader showTopIcons={false} title="KYC/KYB Verification" />

      <View style={styles.container}>
        {/* Title */}
        <AppText variant={Variant.h2} style={styles.title}>
          KYC & KYB Verification
        </AppText>
        <AppText variant={Variant.body} style={styles.subtitle}>
          Complete your identity and business verification
        </AppText>

        {/* Progress bar */}
        <View style={styles.progressRow}>
          <AppText style={styles.progressText}>Overall Progress</AppText>
          <AppText style={styles.progressText}>0% Complete</AppText>
        </View>
        <View style={styles.progressBar} />

        {/* Tabs */}
     <View style={styles.stepperContainer}>
  {/* ===== Row 1: Labels ===== */}
  <View style={styles.labelsRow}>
    {['Personal KYC', 'Business KYC', 'Documents', 'Review'].map((tab, index) => (
      <AppText
        key={tab}
        style={[
          styles.stepLabel,
        (index === 0 || index === 1) ? styles.activeLabel : styles.inactiveLabel,
        ]}>
        {tab}
      </AppText>
    ))}
  </View>

  {/* ===== Row 2: Dots + Lines ===== */}
  <View style={styles.dotsRow}>
    {['Personal KYC', 'Business KYC', 'Documents', 'Review'].map((_, index, arr) => (
      <React.Fragment key={index}>
        {/* Dot */}
        <View
          style={[
            styles.dot,
            { backgroundColor: (index === 0 || index === 1) ? colors.primary : '#D9D9D9' },
          ]}
        />
        {/* Line (not after last dot) */}
        {index < arr.length - 1 && (
        <View
  style={[
    styles.line,
    { backgroundColor: (index === 0 || index === 1) ? colors.primary : '#D9D9D9' },
  ]}
/>

        )}
      </React.Fragment>
    ))}
  </View>
</View>


        {/* Section Title */}
        <AppText variant={Variant.h3} style={styles.sectionTitle}>
  Business Information
        </AppText>
        <AppText variant={Variant.body} style={styles.sectionSubtitle}>
    Provide your business details for company verification
        </AppText>

        {/* Input Fields */}
        {[
          {label: 'Business Name', placeholder: 'John Doe'},
          {label: 'Registration No.', placeholder: 'JG12345678'},
          {label: 'Business Type', placeholder: 'USA'},
          {label: 'Years of Operation', placeholder: 'Software Engineer'},
          {label: 'Business Address', placeholder: '5000'},
          {label: 'Annual Revenue (SGD)', placeholder: 'Employment'},
        ].map((field, index) => (
          <View key={index} style={{marginTop: hp(2)}}>
            <AppText style={styles.inputLabel}>{field.label}</AppText>
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              placeholderTextColor="#666"
            />
          </View>
        ))}

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.prevButton}>
            <AppText style={styles.prevText}>Previous</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate(screenNames.KYC_KYB_DOC)} style={styles.nextButton}>
            <AppText style={styles.nextText}>Next</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default KycBusiness;

const styles = StyleSheet.create({
  header: {
    height: hp(15),
    paddingHorizontal: wp(4),
    justifyContent: 'flex-end',
    paddingBottom: hp(2),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  headerTitle: {
    color: '#fff',
    fontSize: getFontSize(18),
    fontWeight: '600',
  },
  container: {
    padding: wp(5),
  },
  title: {
    fontSize: getFontSize(18),
    fontWeight: '700',
    marginBottom: hp(0.5),
    color:colors.black
  },
  subtitle: {
    color: '#6C7A92',
    marginBottom: hp(2),
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  progressText: {
    fontSize: getFontSize(12),
    color: '#6C7A92',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#D9D9D9',
    borderRadius: 2,
    marginBottom: hp(3),
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(3),
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: getFontSize(13),
    marginBottom: hp(0.5),
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  inactiveTabText: {
    color: '#A0A0A0',
  },
  tabDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: getFontSize(15),
    fontWeight: '700',
marginTop: hp(2), },
  sectionSubtitle: {
    color: '#6C7A92',
    marginBottom: hp(2),
    fontSize: getFontSize(12),
  },
  inputLabel: {
    fontSize: getFontSize(13),
    fontWeight: '600',
    marginBottom: hp(0.5),
    color: '#3B2E57',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    padding: wp(3),
    fontSize: getFontSize(14),
    color: '#000',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp(4),
  },
  prevButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    width:'48%',
    alignItems:'center',
    justifyContent:'center'
  },
  prevText: {
    color: colors.primary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(10),
    borderRadius: 8,
       width:'48%',
    alignItems:'center',
    justifyContent:'center'
  },
  nextText: {
    color: '#fff',
    fontSize: getFontSize(14),
    fontWeight: '600',
  },

   stepperContainer: {
    marginTop: 10,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6, // gap between text and dots
    paddingHorizontal: 4,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  activeLabel: {
    color: '#FF8C00', // orange
  },
  inactiveLabel: {
    color: '#C0C0C0', // gray
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width:"95%"
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  line: {
    height: 2,
    width: '25%',
  },
});
