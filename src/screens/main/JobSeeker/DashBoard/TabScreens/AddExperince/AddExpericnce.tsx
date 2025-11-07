import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { colors, getFontSize, hp, wp } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import VectorIcons from '@/theme/vectorIcon';
import FormField from '@/core/FormField';

const AddExperience = () => {
  const navigation = useNavigation();

  // ✅ Initialize React Hook Form
  const methods = useForm({
    defaultValues: {
      jobTitle: '',
      companyName: '',
      country: '',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      jobDescription: '',
      referenceName: '',
      referencePosition: '',
      referenceContact: '',
      referenceEmail: '',
      paySlip: '',
    },
  });

  const { handleSubmit } = methods;

  // ✅ Handle form submission
  const onSubmit = (data: any) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '')
    );
    console.log('Submitted Data:', filteredData);
    navigation.goBack();
  };

  return (
    <FormProvider {...methods}>
      <ScrollView style={{ flex: 1, backgroundColor: colors.white }}>
        <AppHeader showTopIcons={false} title="Add Experience" />

        <View style={styles.container}>
          {/* Job Title */}
          <FormField
            name="jobTitle"
            label="Job title"
            placeholder="Enter job title"
            rules={{ required: 'Job title is required' }}
          />

          {/* Company Name */}
          <FormField
            name="companyName"
            label="Company name"
            placeholder="Enter company name"
            rules={{ required: 'Company name is required' }}
          />

          {/* Country */}
          <FormField
            name="country"
            label="Country"
            placeholder="Enter country"
            rules={{ required: 'Country is required' }}
          />

          {/* Work Duration */}
          <AppText style={styles.label}>Work duration</AppText>
           <AppText style={[styles.label]}>From</AppText>
          <View style={styles.row}>
            <FormField
              name="startMonth"
              placeholder="Month"
              inputWrapperStyle={styles.dateBox}
              rules={{ required: 'Start month is required' }}
            />
            <FormField
              name="startYear"
              placeholder="Year"
              inputWrapperStyle={styles.dateBox}
              rules={{ required: 'Start year is required' }}
            />
          </View>

          <AppText style={[styles.label]}>To</AppText>
          <View style={styles.row}>
            <FormField
              name="endMonth"
              placeholder="Month"
              inputWrapperStyle={styles.dateBox}
              rules={{ required: 'End month is required' }}
            />
            <FormField
              name="endYear"
              placeholder="Year"
              inputWrapperStyle={styles.dateBox}
              rules={{ required: 'End year is required' }}
            />
          </View>

          {/* Job Description */}
          <FormField
            name="jobDescription"
            label="Job description"
            placeholder="Enter job description"
            multiline
            rules={{
              required: 'Job description is required',
              maxLength: {
                value: 1000,
                message: 'Maximum 1000 characters allowed',
              },
            }}
          />
          <AppText style={styles.wordLimit}>Word limit: 0/1000</AppText>

          {/* Experience Proof (Optional) */}
          <AppText variant={Variant.h3} style={styles.sectionTitle}>
            Experience proof (optional)
          </AppText>
          <AppText style={styles.subLabel}>Reference</AppText>

          <FormField name="referenceName" placeholder="Name" />
          <FormField name="referencePosition" placeholder="Position" />
          <FormField
            name="referenceContact"
            placeholder="Contact number"
            keyboardType="phone-pad"
          />
          <FormField
            name="referenceEmail"
            placeholder="Email address"
            keyboardType="email-address"
          />

          {/* Add another reference */}
          <TouchableOpacity style={styles.addRefRow}>
            <VectorIcons name="plus-circle" size={18} color={colors.primary} />
            <AppText style={styles.addRefText}>Add another reference</AppText>
          </TouchableOpacity>

          {/* Upload Pay Slip (Optional) */}
          <AppText style={styles.uploadLabel}>Upload pay slip (optional)</AppText>
          <TouchableOpacity style={styles.uploadBox}>
            <VectorIcons name="plus-circle" size={18} color={colors.primary} />
            <AppText style={styles.uploadText}>
              Click here to upload pay slip
            </AppText>
          </TouchableOpacity>
          <AppText style={styles.note}>
            Accept only .jpg, .jpeg, .png and pdf file (Max file size 1 MB)
          </AppText>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.saveButton}>
            <AppText style={styles.saveText}>Save</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </FormProvider>
  );
};

export default AddExperience;

const styles = StyleSheet.create({
  container: {
    padding: wp(5),
  },
  label: {
    fontSize: getFontSize(13),
    fontWeight: '600',
    color: '#3B2E57',
    marginBottom: hp(0.5),
    marginTop: hp(2),
  },
  subLabel: {
    fontSize: getFontSize(13),
    fontWeight: '600',
    color: '#3B2E57',
    marginBottom: hp(1),
    marginTop: hp(2),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: hp(1.5),
  },
  dateBox: {
    flex: 1,
    marginRight: wp(2),
    width: wp(42),

  },
  wordLimit: {
    fontSize: getFontSize(12),
    color: '#6C7A92',
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: getFontSize(15),
    fontWeight: '700',
    marginTop: hp(2),
    color: colors.black,
  },
  addRefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(2),
    gap: wp(2),
  },
  addRefText: {
    color: colors.primary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  uploadLabel: {
    fontSize: getFontSize(13),
    fontWeight: '600',
    color: '#3B2E57',
    marginBottom: hp(1),
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: 8,
    padding: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginBottom: hp(1),
  },
  uploadText: {
    color: colors.primary,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
  note: {
    fontSize: getFontSize(12),
    color: '#6C7A92',
    marginBottom: hp(3),
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: hp(1.8),
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: hp(4),
  },
  saveText: {
    color: '#fff',
    fontSize: getFontSize(15),
    fontWeight: '600',
  },
});
