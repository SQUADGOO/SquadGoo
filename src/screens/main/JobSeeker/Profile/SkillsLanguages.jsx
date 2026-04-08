import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import AppButton from '@/core/AppButton';
import AppDropDown from '@/core/AppDropDown';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { colors, hp, wp, getFontSize } from '@/theme';
import { showToast, toastTypes } from '@/utilities/toastConfig';

const LANGUAGE_OPTIONS = [
  'English', 'Mandarin (Chinese)', 'Cantonese', 'Hindi', 'Punjabi', 'Arabic',
  'Vietnamese', 'Tagalog (Filipino)', 'Spanish', 'Italian', 'Greek', 'Korean',
  'Japanese', 'Thai', 'Tamil', 'Urdu', 'Nepali', 'Turkish', 'Indonesian',
  'Samoan', 'Fijian', 'German', 'French', 'Portuguese', 'Russian', 'Serbian',
  'Croatian', 'Sinhalese', 'Bengali', 'Dari', 'Pashto', 'Malay', 'Burmese',
  'Khmer (Cambodian)', 'Polish', 'Macedonian', 'Afrikaans', 'Other',
];

const MAX_SKILLS = 10;

const SkillsLanguages = ({ navigation }) => {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [languages, setLanguages] = useState(['English']);
  const [langPickerOpen, setLangPickerOpen] = useState(false);

  const addSkill = () => {
    const trimmed = skillInput.trim().replace(/^#/, '');
    if (!trimmed) return;
    if (skills.length >= MAX_SKILLS) {
      showToast(`Maximum ${MAX_SKILLS} skills allowed`, 'Limit', toastTypes.warning);
      return;
    }
    if (skills.includes(trimmed)) {
      showToast('Skill already added', 'Duplicate', toastTypes.warning);
      return;
    }
    setSkills(prev => [...prev, trimmed]);
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setSkills(prev => prev.filter(s => s !== skill));
  };

  const toggleLanguage = (lang) => {
    setLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const removeLanguage = (lang) => {
    setLanguages(prev => prev.filter(l => l !== lang));
  };

  const handleSave = () => {
    if (skills.length === 0) {
      showToast('Please add at least one skill', 'Required', toastTypes.warning);
      return;
    }
    if (languages.length === 0) {
      showToast('Please select at least one language', 'Required', toastTypes.warning);
      return;
    }
    showToast('Skills & Languages saved successfully', 'Success', toastTypes.success);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Skills & Languages" showTopIcons={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Info */}
        <View style={styles.card}>
          <View style={styles.infoBox}>
            <VectorIcons name={iconLibName.Ionicons} iconName="bulb" size={22} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <AppText variant={Variant.bodyMedium} style={styles.infoTitle}>Skills & Languages</AppText>
              <AppText variant={Variant.caption} style={styles.infoText}>
                Showcase your key skills and languages to improve your job matches.
              </AppText>
            </View>
          </View>
        </View>

        {/* Skills */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <VectorIcons name={iconLibName.Ionicons} iconName="hammer-outline" size={20} color={colors.primary} />
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>Skills</AppText>
            <AppText variant={Variant.caption} style={styles.counter}>{skills.length}/{MAX_SKILLS}</AppText>
          </View>
          <View style={styles.divider} />

          <View style={styles.skillInputRow}>
            <TextInput
              style={styles.skillInput}
              placeholder='Type a skill and press Add (e.g. "Barista")'
              placeholderTextColor="#9CA3AF"
              value={skillInput}
              onChangeText={setSkillInput}
              onSubmitEditing={addSkill}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addBtn} onPress={addSkill} activeOpacity={0.7}>
              <VectorIcons name={iconLibName.Ionicons} iconName="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {skills.length > 0 ? (
            <View style={styles.chipsWrap}>
              {skills.map((skill) => (
                <View key={skill} style={styles.skillChip}>
                  <AppText variant={Variant.caption} style={styles.skillChipText}>#{skill}</AppText>
                  <TouchableOpacity onPress={() => removeSkill(skill)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="close-circle" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <AppText variant={Variant.caption} style={styles.emptyHint}>No skills added yet. Start typing above.</AppText>
          )}
        </View>

        {/* Languages */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <VectorIcons name={iconLibName.Ionicons} iconName="language-outline" size={20} color={colors.primary} />
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>Languages</AppText>
          </View>
          <View style={styles.divider} />

          {/* Selected languages */}
          {languages.length > 0 ? (
            <View style={styles.chipsWrap}>
              {languages.map((lang) => (
                <View key={lang} style={styles.langChip}>
                  <AppText variant={Variant.caption} style={styles.langChipText}>{lang}</AppText>
                  <TouchableOpacity onPress={() => removeLanguage(lang)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="close-circle" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : null}

          {/* Language picker toggle */}
          <TouchableOpacity style={styles.langPickerBtn} onPress={() => setLangPickerOpen(!langPickerOpen)} activeOpacity={0.7}>
            <AppText variant={Variant.body} style={styles.langPickerBtnText}>
              {langPickerOpen ? 'Hide language list' : 'Add Language'}
            </AppText>
            <VectorIcons name={iconLibName.Ionicons} iconName={langPickerOpen ? 'chevron-up' : 'add-circle-outline'} size={20} color={colors.primary} />
          </TouchableOpacity>

          {langPickerOpen ? (
            <View style={styles.langList}>
              {LANGUAGE_OPTIONS.map((lang) => {
                const selected = languages.includes(lang);
                return (
                  <TouchableOpacity
                    key={lang}
                    style={[styles.langOption, selected && styles.langOptionSelected]}
                    onPress={() => toggleLanguage(lang)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                      {selected ? <VectorIcons name={iconLibName.Ionicons} iconName="checkmark" size={14} color="#FFFFFF" /> : null}
                    </View>
                    <AppText variant={Variant.body} style={[styles.langOptionText, selected && styles.langOptionTextSelected]}>{lang}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>

        {/* Save */}
        <AppButton text="Save" onPress={handleSave} bgColor={colors.primary} textColor="#FFFFFF" />
        <View style={{ height: hp(4) }} />
      </ScrollView>
    </View>
  );
};

export default SkillsLanguages;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scrollContent: { padding: wp(4), paddingBottom: hp(5) },
  card: { backgroundColor: '#FFFFFF', borderRadius: hp(2), padding: wp(5), marginBottom: hp(2), shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: wp(2), marginBottom: hp(1) },
  sectionTitle: { fontSize: getFontSize(16), fontWeight: '800', color: colors.secondary, flex: 1 },
  counter: { color: '#9CA3AF', fontWeight: '700', fontSize: getFontSize(13) },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: hp(1.5) },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', gap: wp(3), backgroundColor: '#EFF6FF', padding: wp(4), borderRadius: hp(1.5), borderWidth: 1, borderColor: '#BFDBFE' },
  infoTitle: { color: '#1E40AF', fontWeight: '700', fontSize: getFontSize(14), marginBottom: hp(0.3) },
  infoText: { color: '#3B82F6', fontSize: getFontSize(12), lineHeight: getFontSize(18) },

  // Skills
  skillInputRow: { flexDirection: 'row', gap: wp(2), marginBottom: hp(1.5) },
  skillInput: { flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: hp(1.2), paddingHorizontal: wp(3), paddingVertical: hp(1.2), fontSize: getFontSize(14), color: '#111827', backgroundColor: '#F9FAFB' },
  addBtn: { width: wp(12), height: wp(12), borderRadius: hp(1.2), backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: wp(2), marginBottom: hp(1) },
  skillChip: { flexDirection: 'row', alignItems: 'center', gap: wp(1.5), backgroundColor: '#FFF7ED', borderWidth: 1, borderColor: '#FDBA74', borderRadius: hp(3), paddingHorizontal: wp(3), paddingVertical: hp(0.6) },
  skillChipText: { color: '#9A3412', fontWeight: '600', fontSize: getFontSize(13) },
  emptyHint: { color: '#9CA3AF', fontSize: getFontSize(12), textAlign: 'center', paddingVertical: hp(2) },

  // Languages
  langChip: { flexDirection: 'row', alignItems: 'center', gap: wp(1.5), backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#86EFAC', borderRadius: hp(3), paddingHorizontal: wp(3), paddingVertical: hp(0.6) },
  langChipText: { color: '#065F46', fontWeight: '600', fontSize: getFontSize(13) },
  langPickerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: wp(2), paddingVertical: hp(1.2), borderRadius: hp(1.5), borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', marginTop: hp(1) },
  langPickerBtnText: { color: colors.primary, fontWeight: '600', fontSize: getFontSize(14) },
  langList: { marginTop: hp(1.5) },
  langOption: { flexDirection: 'row', alignItems: 'center', gap: wp(3), paddingVertical: hp(1.2), paddingHorizontal: wp(2), borderRadius: hp(1) },
  langOptionSelected: { backgroundColor: '#F0FDF4' },
  langOptionText: { flex: 1, color: '#374151', fontSize: getFontSize(14), fontWeight: '500' },
  langOptionTextSelected: { color: '#065F46', fontWeight: '700' },
  checkbox: { width: wp(6), height: wp(6), borderRadius: wp(1.2), borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
});
