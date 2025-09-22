// screens/AddExperience.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors, getFontSize, hp, wp} from '@/theme';
import AppText, {Variant} from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import VectorIcons from '@/theme/vectorIcon';

const AddExperience = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={{flex: 1, backgroundColor: colors.white}}>
      {/* Header */}
      <AppHeader showTopIcons={false} title="Add Experience" />

      <View style={styles.container}>
        {/* Job Title */}
        <AppText style={styles.label}>Job title</AppText>
        <View style={styles.dropdown}>
          <TextInput
            placeholder="Search"
            placeholderTextColor="#A0A0A0"
            style={styles.input}
          />
          <VectorIcons name="chevron-down" size={18} color="#A0A0A0" />
        </View>

        {/* Company Name */}
        <AppText style={styles.label}>Company name</AppText>
        <TextInput
          placeholder="Enter company name"
          placeholderTextColor="#A0A0A0"
          style={styles.inputBox}
        />

        {/* Country */}
        <AppText style={styles.label}>Country</AppText>
        <View style={styles.dropdown}>
          <TextInput
            placeholder="Australia"
            placeholderTextColor="#A0A0A0"
            style={styles.input}
          />
          <VectorIcons name="chevron-down" size={18} color="#A0A0A0" />
        </View>

        {/* Work Duration */}
        <AppText style={styles.label}>Work duration</AppText>
        <View style={styles.row}>
          <View style={styles.dateBox}>
            <TextInput placeholder="January" style={styles.inputSmall} />
            <VectorIcons name="calendar" size={16} color="#A0A0A0" />
          </View>
          <View style={styles.dateBox}>
            <TextInput placeholder="YYYY" style={styles.inputSmall} />
            <VectorIcons name="calendar" size={16} color="#A0A0A0" />
          </View>
        </View>

        <AppText style={[styles.label, {marginTop: hp(2)}]}>To</AppText>
        <View style={styles.row}>
          <View style={styles.dateBox}>
            <TextInput placeholder="January" style={styles.inputSmall} />
            <VectorIcons name="calendar" size={16} color="#A0A0A0" />
          </View>
          <View style={styles.dateBox}>
            <TextInput placeholder="YYYY" style={styles.inputSmall} />
            <VectorIcons name="calendar" size={16} color="#A0A0A0" />
          </View>
        </View>

        {/* Job Description */}
        <AppText style={styles.label}>Job description</AppText>
        <TextInput
          placeholder="Enter job description"
          placeholderTextColor="#A0A0A0"
          multiline
          style={styles.textArea}
        />
        <AppText style={styles.wordLimit}>Word limit: 0/1000</AppText>

        {/* Experience Proof */}
        <AppText variant={Variant.h3} style={styles.sectionTitle}>
          Experience proof
        </AppText>
        <AppText style={styles.subLabel}>Reference 1</AppText>

        <TextInput placeholder="Name" style={styles.inputBox} />
        <TextInput placeholder="Position" style={styles.inputBox} />
        <TextInput placeholder="Contact number" style={styles.inputBox} />
        <TextInput placeholder="Email address" style={styles.inputBox} />

        {/* Add another reference */}
        <TouchableOpacity style={styles.addRefRow}>
          <VectorIcons name="plus-circle" size={18} color={colors.primary} />
          <AppText style={styles.addRefText}>Add another reference</AppText>
        </TouchableOpacity>

        {/* Upload Pay Slip */}
        <AppText style={styles.uploadLabel}>Upload pay slip</AppText>
        <TouchableOpacity style={styles.uploadBox}>
          <VectorIcons name="plus-circle" size={18} color={colors.primary} />
          <AppText style={styles.uploadText}>
            Click here to upload pay slip1
          </AppText>
        </TouchableOpacity>
        <AppText style={styles.note}>
          Accept only .jpg, .jpeg, .png and pdf file (Max file size 1 MB)
        </AppText>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <AppText style={styles.saveText}>Save</AppText>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  inputBox: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    padding: wp(3),
    fontSize: getFontSize(14),
    color: '#000',
    marginBottom: hp(1.5),
  },
  dropdown: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    paddingHorizontal: wp(3),
    alignItems: 'center',
    justifyContent: 'space-between',
    height: hp(6),
  },
  input: {
    flex: 1,
    fontSize: getFontSize(14),
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    paddingHorizontal: wp(3),
    flex: 1,
    height: hp(6),
    marginRight: wp(2),
  },
  inputSmall: {
    flex: 1,
    fontSize: getFontSize(14),
    color: '#000',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    padding: wp(3),
    height: hp(12),
    fontSize: getFontSize(14),
    color: '#000',
    textAlignVertical: 'top',
    marginBottom: hp(0.5),
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
