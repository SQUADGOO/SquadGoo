// screens/JobPreference.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors, getFontSize, hp, wp} from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import {screenNames} from '@/navigation/screenNames';

const AddJobStep1 = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={{flex: 1, backgroundColor: colors.white}}>
      {/* Header */}
   
       <AppHeader
              title="Add a Job"
              showTopIcons={false}
              rightComponent={
                <AppText variant={Variant.body} style={styles.stepText}>
                  Step 1/2
                </AppText>
              }
            />

      <View style={styles.container}>
        {/* Job Title */}
        <AppText style={styles.label}>Job title</AppText>
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor="#C0AFCF"
        />

        {/* Job Type */}
        <AppText style={styles.label}>Job type</AppText>
        <TextInput
          style={styles.input}
          placeholder="Select"
          placeholderTextColor="#C0AFCF"
        />

        {/* Job Search Type */}
        <AppText style={styles.label}>Job search type</AppText>
        <TextInput
          style={styles.input}
          placeholder="Both (Quick and Manual)"
          placeholderTextColor="#C0AFCF"
        />

        {/* Total Experience */}
        <AppText style={styles.label}>Total experience</AppText>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Years"
            placeholderTextColor="#C0AFCF"
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Month"
            placeholderTextColor="#C0AFCF"
          />
        </View>

        {/* Expected Salary */}
        <AppText style={styles.label}>Expected salary</AppText>

        <View style={styles.salaryBox}>
          <AppText style={styles.salaryPrefix}>Min $</AppText>
          <TextInput
            style={styles.salaryInput}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#C0AFCF"
          />
          <AppText style={styles.salarySuffix}>/per hour</AppText>
        </View>

        <View style={styles.salaryBox}>
          <AppText style={styles.salaryPrefix}>Max $</AppText>
          <TextInput
            style={styles.salaryInput}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#C0AFCF"
          />
          <AppText style={styles.salarySuffix}>/per hour</AppText>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate(screenNames.ADD_JOB_STEP2)}
          style={styles.nextButton}>
          <AppText style={styles.nextText}>Next</AppText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddJobStep1;

const styles = StyleSheet.create({
  container: {
    padding: wp(5),
  },
  label: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: '#3B2E57',
    marginBottom: hp(0.8),
    marginTop: hp(2),
  },
  input: {
    borderWidth: 1,
    borderColor: '#C0AFCF',
    borderRadius: 8,
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(3),
    fontSize: getFontSize(14),
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  salaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C0AFCF',
    borderRadius: 8,
    marginBottom: hp(1.5),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.2),
  },
  salaryPrefix: {
    color: '#6C7A92',
    fontSize: getFontSize(14),
    marginRight: wp(2),
  },
  salaryInput: {
    flex: 1,
    fontSize: getFontSize(14),
    color: '#000',
  },
  salarySuffix: {
    color: '#6C7A92',
    fontSize: getFontSize(14),
    marginLeft: wp(2),
  },
  nextButton: {
    backgroundColor: '#FF9E2C',
    paddingVertical: hp(1.8),
    borderRadius: 8,
    marginTop: hp(4),
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontSize: getFontSize(16),
    fontWeight: '600',
  },
    stepText: {
      color: colors.white,
      fontWeight: 'bold',
      fontSize: getFontSize(20),
    },
});
