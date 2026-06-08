import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import AppButton from '@/core/AppButton';
import AppInputField from '@/core/AppInputField';
import AppDropDown from '@/core/AppDropDown';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { colors, hp, wp, getFontSize } from '@/theme';
import { showToast, toastTypes } from '@/utilities/toastConfig';

const QUALIFICATION_TYPES = [
  { label: '<10th', value: '<10th' },
  { label: '12th', value: '12th' },
  { label: 'Certificate I', value: 'Certificate I' },
  { label: 'Certificate II', value: 'Certificate II' },
  { label: 'Certificate III', value: 'Certificate III' },
  { label: 'Certificate IV', value: 'Certificate IV' },
  { label: 'Diploma', value: 'Diploma' },
  { label: 'Advanced Diploma', value: 'Advanced Diploma' },
  { label: 'Graduate Diploma', value: 'Graduate Diploma' },
  { label: 'Bachelor Level', value: 'Bachelor Level' },
  { label: 'Masters Level', value: 'Masters Level' },
  { label: 'PHD', value: 'PHD' },
  { label: 'Others', value: 'Others' },
];

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 40 }, (_, i) => {
  const y = String(currentYear - i);
  return { label: y, value: y };
});

const emptyEntry = () => ({
  id: Date.now().toString(),
  qualificationType: '',
  courseName: '',
  institution: '',
  startYear: '',
  endYear: '',
  currentlyStudying: false,
});

const Education = ({ navigation }) => {
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [qualTypeOpen, setQualTypeOpen] = useState(false);
  const [startYearOpen, setStartYearOpen] = useState(false);
  const [endYearOpen, setEndYearOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const clearErrors = () => setErrors({});

  const startAdd = () => {
    setEditingEntry(emptyEntry());
    clearErrors();
    setShowForm(true);
  };

  const startEdit = (entry) => {
    setEditingEntry({ ...entry });
    clearErrors();
    setShowForm(true);
  };

  const validate = () => {
    const errs = {};
    if (!editingEntry.qualificationType) {
      errs.qualificationType = 'Please select a qualification type';
    }
    const isBelow10th = editingEntry.qualificationType === '<10th';
    if (!isBelow10th && !editingEntry.courseName.trim()) {
      errs.courseName = 'Course name is required';
    }
    if (!editingEntry.institution.trim()) {
      errs.institution = 'Institution / School is required';
    }
    if (!editingEntry.startYear) {
      errs.startYear = 'Please select a start year';
    }
    if (!editingEntry.currentlyStudying && editingEntry.endYear && editingEntry.startYear) {
      if (parseInt(editingEntry.endYear) < parseInt(editingEntry.startYear)) {
        errs.endYear = 'End year cannot be before start year';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      showToast('Please fill in all required fields', 'Validation Error', toastTypes.warning);
      return;
    }

    const exists = entries.find(e => e.id === editingEntry.id);
    if (exists) {
      setEntries(prev => prev.map(e => e.id === editingEntry.id ? editingEntry : e));
    } else {
      setEntries(prev => [...prev, editingEntry]);
    }
    setShowForm(false);
    setEditingEntry(null);
    clearErrors();
    showToast('Education saved', 'Success', toastTypes.success);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Education',
      'Are you sure you want to delete this education entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: () => {
            setEntries(prev => prev.filter(e => e.id !== id));
            showToast('Education deleted', 'Deleted', toastTypes.info);
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  if (showForm && editingEntry) {
    const isBelow10th = editingEntry.qualificationType === '<10th';
    return (
      <View style={styles.container}>
        <AppHeader title={entries.find(e => e.id === editingEntry.id) ? 'Edit Education' : 'Add Education'} showTopIcons={false} />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <VectorIcons name={iconLibName.Ionicons} iconName="school-outline" size={20} color={colors.primary} />
              <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>Education Details</AppText>
            </View>
            <View style={styles.divider} />

            <AppText variant={Variant.caption} style={styles.fieldLabel}>Qualification Type <AppText style={styles.mandatory}>*</AppText></AppText>
            <AppDropDown
              placeholder="Select qualification type"
              options={QUALIFICATION_TYPES}
              selectedValue={editingEntry.qualificationType}
              onSelect={(v) => { setEditingEntry(prev => ({ ...prev, qualificationType: v })); setErrors(prev => ({ ...prev, qualificationType: undefined })); }}
              isVisible={qualTypeOpen}
              setIsVisible={setQualTypeOpen}
            />
            {errors.qualificationType ? <AppText variant={Variant.caption} style={styles.errorText}>{errors.qualificationType}</AppText> : null}

            {!isBelow10th ? (
              <>
                <AppText variant={Variant.caption} style={styles.fieldLabel}>Course Name <AppText style={styles.mandatory}>*</AppText></AppText>
                <AppInputField
                  placeholder='e.g. "Diploma of Business"'
                  value={editingEntry.courseName}
                  onChangeText={(t) => { setEditingEntry(prev => ({ ...prev, courseName: t })); setErrors(prev => ({ ...prev, courseName: undefined })); }}
                />
                {errors.courseName ? <AppText variant={Variant.caption} style={styles.errorText}>{errors.courseName}</AppText> : null}
              </>
            ) : null}

            <AppText variant={Variant.caption} style={styles.fieldLabel}>Institution / School <AppText style={styles.mandatory}>*</AppText></AppText>
            <AppInputField
              placeholder='e.g. "TAFE Victoria"'
              value={editingEntry.institution}
              onChangeText={(t) => { setEditingEntry(prev => ({ ...prev, institution: t })); setErrors(prev => ({ ...prev, institution: undefined })); }}
            />
            {errors.institution ? <AppText variant={Variant.caption} style={styles.errorText}>{errors.institution}</AppText> : null}

            <AppText variant={Variant.caption} style={styles.fieldLabel}>Start Year <AppText style={styles.mandatory}>*</AppText></AppText>
            <AppDropDown
              placeholder="Select start year"
              options={YEAR_OPTIONS}
              selectedValue={editingEntry.startYear}
              onSelect={(v) => { setEditingEntry(prev => ({ ...prev, startYear: v })); setErrors(prev => ({ ...prev, startYear: undefined })); }}
              isVisible={startYearOpen}
              setIsVisible={setStartYearOpen}
            />
            {errors.startYear ? <AppText variant={Variant.caption} style={styles.errorText}>{errors.startYear}</AppText> : null}

            {!editingEntry.currentlyStudying ? (
              <>
                <AppText variant={Variant.caption} style={styles.fieldLabel}>End Year</AppText>
                <AppDropDown
                  placeholder="Select end year"
                  options={YEAR_OPTIONS}
                  selectedValue={editingEntry.endYear}
                  onSelect={(v) => { setEditingEntry(prev => ({ ...prev, endYear: v })); setErrors(prev => ({ ...prev, endYear: undefined })); }}
                  isVisible={endYearOpen}
                  setIsVisible={setEndYearOpen}
                />
                {errors.endYear ? <AppText variant={Variant.caption} style={styles.errorText}>{errors.endYear}</AppText> : null}
              </>
            ) : null}

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setEditingEntry(prev => ({ ...prev, currentlyStudying: !prev.currentlyStudying, endYear: '' }))}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, editingEntry.currentlyStudying && styles.checkboxSelected]}>
                {editingEntry.currentlyStudying ? (
                  <VectorIcons name={iconLibName.Ionicons} iconName="checkmark" size={14} color="#FFFFFF" />
                ) : null}
              </View>
              <AppText variant={Variant.body} style={styles.checkboxLabel}>Currently studying here</AppText>
            </TouchableOpacity>

            {/* Upload Certificate */}
            <View style={styles.uploadSection}>
              <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.7}>
                <VectorIcons name={iconLibName.Ionicons} iconName="cloud-upload-outline" size={18} color={colors.primary} />
                <AppText variant={Variant.caption} style={styles.uploadBtnText}>Upload Certificate (optional)</AppText>
              </TouchableOpacity>
              <View style={styles.uploadHint}>
                <VectorIcons name={iconLibName.Ionicons} iconName="information-circle-outline" size={14} color="#9CA3AF" />
                <AppText variant={Variant.caption} style={styles.uploadHintText}>Only verified certificates get a verified badge.</AppText>
              </View>
            </View>
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.8}>
              <AppText variant={Variant.bodyMedium} style={styles.cancelBtnText}>Cancel</AppText>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <AppButton text="Save" onPress={handleSave} bgColor={colors.primary} textColor="#FFFFFF" />
            </View>
          </View>

          <View style={{ height: hp(4) }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Education" showTopIcons={false} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Info */}
        <View style={styles.card}>
          <View style={styles.infoBox}>
            <VectorIcons name={iconLibName.Ionicons} iconName="school" size={22} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <AppText variant={Variant.bodyMedium} style={styles.infoTitle}>Education</AppText>
              <AppText variant={Variant.caption} style={styles.infoText}>
                List your completed or current education to improve your profile.
              </AppText>
            </View>
          </View>
        </View>

        {/* Entries */}
        {entries.map((entry) => (
          <View key={entry.id} style={styles.card}>
            <View style={styles.entryHeader}>
              <View style={{ flex: 1 }}>
                <AppText variant={Variant.bodyMedium} style={styles.entryTitle}>{entry.qualificationType}</AppText>
                {entry.courseName ? <AppText variant={Variant.body} style={styles.entrySubtitle}>{entry.courseName}</AppText> : null}
              </View>
              <View style={styles.entryActions}>
                <TouchableOpacity onPress={() => startEdit(entry)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <VectorIcons name={iconLibName.Ionicons} iconName="create-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(entry.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <VectorIcons name={iconLibName.Ionicons} iconName="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.entryDetail}>
              <VectorIcons name={iconLibName.Ionicons} iconName="business-outline" size={16} color={colors.gray} />
              <AppText variant={Variant.caption} style={styles.entryDetailText}>{entry.institution}</AppText>
            </View>
            <View style={styles.entryDetail}>
              <VectorIcons name={iconLibName.Ionicons} iconName="calendar-outline" size={16} color={colors.gray} />
              <AppText variant={Variant.caption} style={styles.entryDetailText}>
                {entry.startYear} – {entry.currentlyStudying ? 'Present' : entry.endYear || '—'}
              </AppText>
            </View>
          </View>
        ))}

        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <VectorIcons name={iconLibName.Ionicons} iconName="school-outline" size={48} color="#D1D5DB" />
            <AppText variant={Variant.bodyMedium} style={styles.emptyTitle}>No education added yet</AppText>
            <AppText variant={Variant.caption} style={styles.emptySub}>Tap + to add your first education entry.</AppText>
          </View>
        ) : null}

        <AppButton text="+ Add Education" onPress={startAdd} bgColor={colors.primary} textColor="#FFFFFF" />
        <View style={{ height: hp(4) }} />
      </ScrollView>
    </View>
  );
};

export default Education;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scrollContent: { padding: wp(4), paddingBottom: hp(5) },
  card: { backgroundColor: '#FFFFFF', borderRadius: hp(2), padding: wp(5), marginBottom: hp(2), shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: wp(2), marginBottom: hp(1) },
  sectionTitle: { fontSize: getFontSize(16), fontWeight: '800', color: colors.secondary },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: hp(1.5) },
  fieldLabel: { color: colors.gray, fontSize: getFontSize(11), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: hp(0.5), marginTop: hp(1.5) },
  mandatory: { color: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: getFontSize(11), fontWeight: '500', marginTop: hp(0.4), marginLeft: wp(1) },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', gap: wp(3), backgroundColor: '#EFF6FF', padding: wp(4), borderRadius: hp(1.5), borderWidth: 1, borderColor: '#BFDBFE' },
  infoTitle: { color: '#1E40AF', fontWeight: '700', fontSize: getFontSize(14), marginBottom: hp(0.3) },
  infoText: { color: '#3B82F6', fontSize: getFontSize(12), lineHeight: getFontSize(18) },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: wp(3), marginTop: hp(2), paddingVertical: hp(0.5) },
  checkbox: { width: wp(6), height: wp(6), borderRadius: wp(1.2), borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkboxLabel: { color: '#374151', fontSize: getFontSize(14), fontWeight: '500' },
  uploadSection: { marginTop: hp(2) },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', gap: wp(2), paddingVertical: hp(1.2), paddingHorizontal: wp(4), borderRadius: hp(1.5), borderWidth: 1, borderColor: colors.primary, borderStyle: 'dashed' },
  uploadBtnText: { color: colors.primary, fontWeight: '600', fontSize: getFontSize(12) },
  uploadHint: { flexDirection: 'row', alignItems: 'center', gap: wp(1.5), marginTop: hp(0.8) },
  uploadHintText: { color: '#9CA3AF', fontSize: getFontSize(11) },
  formActions: { flexDirection: 'row', gap: wp(3), alignItems: 'center' },
  cancelBtn: { paddingVertical: hp(1.5), paddingHorizontal: wp(6), borderRadius: hp(4), borderWidth: 1, borderColor: '#D1D5DB' },
  cancelBtnText: { color: '#6B7280', fontWeight: '600' },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: hp(1) },
  entryTitle: { color: colors.secondary, fontWeight: '800', fontSize: getFontSize(15) },
  entrySubtitle: { color: '#6B7280', fontSize: getFontSize(13), marginTop: hp(0.2) },
  entryActions: { flexDirection: 'row', gap: wp(3) },
  entryDetail: { flexDirection: 'row', alignItems: 'center', gap: wp(2), marginBottom: hp(0.8) },
  entryDetailText: { color: '#374151', fontSize: getFontSize(13) },
  emptyState: { alignItems: 'center', paddingVertical: hp(6), gap: hp(1) },
  emptyTitle: { color: '#374151', fontWeight: '700', fontSize: getFontSize(15) },
  emptySub: { color: '#9CA3AF', fontSize: getFontSize(12) },
});
