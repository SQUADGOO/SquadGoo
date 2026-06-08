import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import AppButton from '@/core/AppButton';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { colors, hp, wp, getFontSize } from '@/theme';
import { showToast, toastTypes } from '@/utilities/toastConfig';

const QUALIFICATION_OPTIONS = [
  'White Card (Construction)',
  'Police Check',
  'Working With Children Check (WWCC)',
  'NDIS Worker Screening Check',
  'First Aid Certificate',
  'CPR Certificate',
  'RSA (Responsible Service of Alcohol)',
  'RCG (Responsible Conduct of Gambling)',
  'Food Handling Certificate',
  'COVID-19 Vaccination Certificate',
  'Manual Handling Certificate',
  'Driver Licence (Full)',
  'Provisional Licence (P1/P2)',
  'HR/MR/LR/HC/MC Licence',
  'Forklift Licence',
  'Bus Driver Authority',
  'Taxi Driver Accreditation',
  'Dangerous Goods Licence',
  'High Risk Work Licence',
  'EWP Ticket',
  'Traffic Control Ticket',
  'Asbestos Removal Licence',
  'Confined Space Entry Ticket',
  'Working at Heights Ticket',
  'Electrical Licence',
  'Plumbing Licence',
  'Gas Fitter Licence',
  'WWVP Card',
  'AHPRA Registration',
  'Medication Administration Certificate',
  'Mental Health First Aid',
  'Disability Support Worker Certificate',
  'Barista Certificate',
  'Food Safety Supervisor Certificate',
  'Gaming Licence',
  'Order Picker Licence',
  'Warehouse Induction Card',
  'Security Licence',
  'MSIC/ASIC Card',
  'Boat Licence',
  'Firearms Licence',
  'Q Fever Vaccination Card',
  'Working With Animals Permit',
  'Other (please specify)',
];

const JobQualification = ({ navigation }) => {
  const [selectedQuals, setSelectedQuals] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  const isSelected = (qual) => selectedQuals.some(q => q.name === qual);

  const toggleQual = (qual) => {
    setSelectedQuals(prev =>
      prev.some(q => q.name === qual)
        ? prev.filter(q => q.name !== qual)
        : [...prev, { name: qual, file: null, expiry: '' }]
    );
  };

  const removeQual = (name) => {
    setSelectedQuals(prev => prev.filter(q => q.name !== name));
  };

  const handleSave = () => {
    if (selectedQuals.length === 0) {
      showToast('Please select at least one qualification', 'Required', toastTypes.warning);
      return;
    }
    showToast('Qualifications saved successfully', 'Success', toastTypes.success);
  };

  const renderQualOption = ({ item: qual }) => {
    const selected = isSelected(qual);
    return (
      <TouchableOpacity
        style={[styles.optionItem, selected && styles.optionItemSelected]}
        onPress={() => toggleQual(qual)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected ? (
            <VectorIcons name={iconLibName.Ionicons} iconName="checkmark" size={14} color="#FFFFFF" />
          ) : null}
        </View>
        <AppText variant={Variant.body} style={[styles.optionText, selected && styles.optionTextSelected]}>
          {qual}
        </AppText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Extra Job Qualifications" showTopIcons={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Info Card */}
        <View style={styles.card}>
          <View style={styles.infoBox}>
            <VectorIcons name={iconLibName.Ionicons} iconName="information-circle" size={22} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <AppText variant={Variant.bodyMedium} style={styles.infoTitle}>Extra Job Qualifications</AppText>
              <AppText variant={Variant.caption} style={styles.infoText}>
                Select and upload any relevant licences or certificates to improve your job matches.
              </AppText>
            </View>
          </View>
        </View>

        {/* Selected Chips */}
        {selectedQuals.length > 0 ? (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-done-outline" size={20} color="#10B981" />
              <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
                Selected ({selectedQuals.length})
              </AppText>
            </View>
            <View style={styles.divider} />
            <View style={styles.chipsWrap}>
              {selectedQuals.map((q) => (
                <View key={q.name} style={styles.selectedChip}>
                  <AppText variant={Variant.caption} style={styles.selectedChipText} numberOfLines={1}>
                    {q.name}
                  </AppText>
                  <TouchableOpacity onPress={() => removeQual(q.name)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="close-circle" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Qualification Picker */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.pickerHeader} onPress={() => setShowPicker(!showPicker)} activeOpacity={0.7}>
            <View style={{ flex: 1 }}>
              <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>Select Qualification(s)</AppText>
              <AppText variant={Variant.caption} style={styles.pickerSubtext}>
                Tap to {showPicker ? 'hide' : 'show'} the list
              </AppText>
            </View>
            <View style={styles.pickerToggle}>
              <VectorIcons name={iconLibName.Ionicons} iconName={showPicker ? 'chevron-up' : 'chevron-down'} size={20} color={colors.primary} />
            </View>
          </TouchableOpacity>

          {showPicker ? (
            <>
              <View style={styles.divider} />
              <FlatList
                data={QUALIFICATION_OPTIONS}
                keyExtractor={(item) => item}
                renderItem={renderQualOption}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.optionSeparator} />}
              />
            </>
          ) : null}
        </View>

        {/* Upload Section for Selected */}
        {selectedQuals.length > 0 ? (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <VectorIcons name={iconLibName.Ionicons} iconName="cloud-upload-outline" size={20} color={colors.primary} />
              <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>Upload Documents</AppText>
            </View>
            <View style={styles.divider} />
            <AppText variant={Variant.caption} style={styles.uploadInfo}>
              Upload a certificate or card for each selected qualification.
            </AppText>

            {selectedQuals.map((qual, idx) => (
              <View key={qual.name} style={[styles.uploadItem, idx < selectedQuals.length - 1 && styles.uploadItemBorder]}>
                <View style={styles.uploadItemHeader}>
                  <View style={styles.uploadItemDot} />
                  <AppText variant={Variant.bodyMedium} style={styles.uploadItemName} numberOfLines={1}>{qual.name}</AppText>
                </View>

                <View style={styles.uploadActions}>
                  <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.7}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="document-attach-outline" size={16} color={colors.primary} />
                    <AppText variant={Variant.caption} style={styles.uploadBtnText}>Upload File</AppText>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.expiryBtn} activeOpacity={0.7}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="calendar-outline" size={16} color="#6B7280" />
                    <AppText variant={Variant.caption} style={styles.expiryBtnText}>Expiry Date</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {/* Save */}
        <View style={{ marginTop: hp(1) }}>
          <AppButton
            text="Save Qualifications"
            onPress={handleSave}
            bgColor={colors.primary}
            textColor="#FFFFFF"
          />
        </View>

        <View style={{ height: hp(4) }} />
      </ScrollView>
    </View>
  );
};

export default JobQualification;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scrollContent: { padding: wp(4), paddingBottom: hp(5) },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2),
    padding: wp(5),
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  // Info box
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp(3),
    backgroundColor: '#EFF6FF',
    padding: wp(4),
    borderRadius: hp(1.5),
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoTitle: { color: '#1E40AF', fontWeight: '700', fontSize: getFontSize(14), marginBottom: hp(0.3) },
  infoText: { color: '#3B82F6', fontSize: getFontSize(12), lineHeight: getFontSize(18) },

  // Section
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: wp(2), marginBottom: hp(1) },
  sectionTitle: { fontSize: getFontSize(15), fontWeight: '800', color: colors.secondary || '#111' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: hp(1.5) },

  // Selected chips
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: wp(2) },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: hp(3),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    maxWidth: '95%',
  },
  selectedChipText: { color: '#065F46', fontWeight: '600', fontSize: getFontSize(12), flexShrink: 1 },

  // Picker
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerSubtext: { color: '#9CA3AF', fontSize: getFontSize(11), marginTop: hp(0.2) },
  pickerToggle: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Options list
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(2),
    borderRadius: hp(1),
  },
  optionItemSelected: {
    backgroundColor: '#F0FDF4',
  },
  checkbox: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(1.2),
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    flex: 1,
    color: '#374151',
    fontSize: getFontSize(14),
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#065F46',
    fontWeight: '700',
  },
  optionSeparator: {
    height: 1,
    backgroundColor: '#F9FAFB',
    marginHorizontal: wp(2),
  },

  // Upload section
  uploadInfo: { color: '#6B7280', fontSize: getFontSize(12), marginBottom: hp(1.5), lineHeight: getFontSize(18) },
  uploadItem: { paddingVertical: hp(1.5) },
  uploadItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  uploadItemHeader: { flexDirection: 'row', alignItems: 'center', gap: wp(2), marginBottom: hp(1) },
  uploadItemDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  uploadItemName: { color: colors.secondary || '#111', fontWeight: '700', fontSize: getFontSize(14), flex: 1 },
  uploadActions: { flexDirection: 'row', gap: wp(3), marginLeft: wp(5) },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    paddingVertical: hp(1),
    paddingHorizontal: wp(3.5),
    borderRadius: hp(1.2),
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
  },
  uploadBtnText: { color: colors.primary, fontWeight: '600', fontSize: getFontSize(12) },
  expiryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    paddingVertical: hp(1),
    paddingHorizontal: wp(3.5),
    borderRadius: hp(1.2),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  expiryBtnText: { color: '#6B7280', fontWeight: '600', fontSize: getFontSize(12) },
});
