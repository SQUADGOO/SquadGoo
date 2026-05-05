import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { colors, hp, wp, getFontSize } from '@/theme';
import { screenNames } from '@/navigation/screenNames';
import { removeExperience } from '@/store/jobSeekerExperienceSlice';
import { downloadAndOpenFile } from '@/utilities/helperFunctions';

const formatJobTitle = (value) => {
  if (!value) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return value?.subCategory || value?.category || value?.title || '—';
  return '—';
};

const formatJobCategory = (value) => {
  if (!value) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return value?.category || value?.title || value?.name || '—';
  return '—';
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <VectorIcons name={iconLibName.Ionicons} iconName={icon} size={16} color={colors.gray} />
    <View style={styles.infoContent}>
      <AppText variant={Variant.caption} style={styles.infoLabel}>{label}</AppText>
      <AppText variant={Variant.body} style={styles.infoValue}>{value || '—'}</AppText>
    </View>
  </View>
);

const WorkExperienceScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const experiences = useSelector(state => state?.jobSeekerExperience?.experiences || []);

  const handleDelete = (id, title) => {
    Alert.alert(
      'Delete Experience',
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => dispatch(removeExperience(id)) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader
        onPlusPress={() => navigation.navigate(screenNames.ADD_EXPERIENCE)}
        showPlusIcon={true}
        showBackButton={false}
        title="Work Experience"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {experiences.length === 0 ? (
          <View style={styles.emptyState}>
            <VectorIcons name={iconLibName.Ionicons} iconName="briefcase-outline" size={56} color="#D1D5DB" />
            <AppText variant={Variant.bodyMedium} style={styles.emptyTitle}>No work experience added yet</AppText>
            <AppText variant={Variant.caption} style={styles.emptySub}>Tap + to add your first job.</AppText>
          </View>
        ) : (
          experiences.map((exp) => {
            const title = formatJobTitle(exp.jobTitle);
            const duration = `${exp.startMonth || ''} ${exp.startYear || ''} – ${exp.currentlyWorking ? 'Present' : `${exp.endMonth || ''} ${exp.endYear || ''}`}`.trim();

            return (
              <View key={exp.id} style={styles.card}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderIcon}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="briefcase" size={20} color={colors.white} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText variant={Variant.bodyMedium} style={styles.cardTitle} numberOfLines={2}>{title}</AppText>
                    {exp.jobType ? (
                      <View style={styles.typeBadge}>
                        <AppText variant={Variant.caption} style={styles.typeBadgeText}>{exp.jobType}</AppText>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate(screenNames.ADD_EXPERIENCE, { mode: 'edit', experience: exp })}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <VectorIcons name={iconLibName.Ionicons} iconName="create-outline" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(exp.id, title)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <VectorIcons name={iconLibName.Ionicons} iconName="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Details */}
                {exp.industry ? <InfoRow icon="pricetag-outline" label="Job Category" value={formatJobCategory(exp.industry)} /> : null}
                <InfoRow icon="business-outline" label="Company" value={exp.companyName} />
                <InfoRow icon="globe-outline" label="Country" value={exp.country} />
                <InfoRow icon="calendar-outline" label="Duration" value={duration} />

                {/* Description */}
                {exp.jobDescription ? (
                  <>
                    <View style={styles.divider} />
                    <AppText variant={Variant.caption} style={styles.descLabel}>Job Description</AppText>
                    <AppText variant={Variant.body} style={styles.descText} numberOfLines={3}>{exp.jobDescription}</AppText>
                  </>
                ) : null}

                {/* Payslips */}
                {Array.isArray(exp.slips) && exp.slips.length > 0 ? (
                  <>
                    <View style={styles.divider} />
                    <AppText variant={Variant.caption} style={styles.descLabel}>Pay Slips</AppText>
                    <View style={styles.slipsRow}>
                      {exp.slips.map((s, idx) => (
                        <TouchableOpacity
                          key={`ps_${idx}`}
                          style={styles.slipBtn}
                          onPress={() => downloadAndOpenFile(s.uri, 'payslip')}
                          activeOpacity={0.7}
                        >
                          <VectorIcons name={iconLibName.Ionicons} iconName="document-attach-outline" size={16} color={colors.primary} />
                          <AppText variant={Variant.caption} style={styles.slipBtnText} numberOfLines={1}>{s.fileName || `Pay slip ${idx + 1}`}</AppText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                ) : null}

                {/* References */}
                {((exp.referenceName || exp.referenceEmail) || (Array.isArray(exp.references) && exp.references.length > 0)) ? (
                  <>
                    <View style={styles.divider} />
                    <AppText variant={Variant.caption} style={styles.descLabel}>References</AppText>

                    {exp.referenceName || exp.referenceEmail ? (
                      <View style={styles.refCard}>
                        <View style={styles.refHeader}>
                          <AppText variant={Variant.bodyMedium} style={styles.refTitle}>Reference 1</AppText>
                          <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-circle" size={18} color="#3B82F6" />
                        </View>
                        {exp.referenceName ? <InfoRow icon="person-outline" label="Name" value={exp.referenceName} /> : null}
                        {exp.referencePosition ? <InfoRow icon="briefcase-outline" label="Position" value={exp.referencePosition} /> : null}
                        {exp.referenceContact ? <InfoRow icon="call-outline" label="Contact" value={exp.referenceContact} /> : null}
                        {exp.referenceEmail ? <InfoRow icon="mail-outline" label="Email" value={exp.referenceEmail} /> : null}
                      </View>
                    ) : null}

                    {Array.isArray(exp.references) && exp.references.map((r, idx) => (
                      <View key={`ref_${idx}`} style={styles.refCard}>
                        <View style={styles.refHeader}>
                          <AppText variant={Variant.bodyMedium} style={styles.refTitle}>Reference {idx + 1}</AppText>
                          <VectorIcons name={iconLibName.Ionicons} iconName={idx === 0 ? 'checkmark-circle' : 'time-outline'} size={18} color={idx === 0 ? '#3B82F6' : '#F59E0B'} />
                        </View>
                        {r.name ? <InfoRow icon="person-outline" label="Name" value={r.name} /> : null}
                        {r.position ? <InfoRow icon="briefcase-outline" label="Position" value={r.position} /> : null}
                        {r.contact ? <InfoRow icon="call-outline" label="Contact" value={r.contact} /> : null}
                        {r.email ? <InfoRow icon="mail-outline" label="Email" value={r.email} /> : null}
                      </View>
                    ))}
                  </>
                ) : null}
              </View>
            );
          })
        )}

        <View style={{ height: hp(4) }} />
      </ScrollView>
    </View>
  );
};

export default WorkExperienceScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scrollContent: { padding: wp(4), paddingBottom: hp(5) },

  // Card
  card: {
    backgroundColor: '#FFFFFF', borderRadius: hp(2), padding: wp(5), marginBottom: hp(2),
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: wp(3), marginBottom: hp(1) },
  cardHeaderIcon: {
    width: wp(11), height: wp(11), borderRadius: wp(5.5),
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  cardTitle: { color: colors.secondary || '#111', fontWeight: '800', fontSize: getFontSize(16), marginBottom: hp(0.3) },
  typeBadge: { alignSelf: 'flex-start', backgroundColor: '#DBEAFE', paddingHorizontal: wp(2.5), paddingVertical: hp(0.3), borderRadius: hp(1.5) },
  typeBadgeText: { color: '#1E40AF', fontWeight: '700', fontSize: getFontSize(10) },
  cardActions: { flexDirection: 'row', gap: wp(3) },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: hp(1.2) },

  // Info rows
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: wp(3), marginBottom: hp(1) },
  infoContent: { flex: 1 },
  infoLabel: { color: colors.gray, fontSize: getFontSize(11), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: hp(0.2) },
  infoValue: { color: colors.secondary || '#333', fontSize: getFontSize(14), fontWeight: '600' },

  // Description
  descLabel: { color: colors.gray, fontSize: getFontSize(11), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: hp(0.8) },
  descText: { color: '#374151', fontSize: getFontSize(13), lineHeight: getFontSize(20) },

  // Payslips
  slipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: wp(2) },
  slipBtn: {
    flexDirection: 'row', alignItems: 'center', gap: wp(1.5),
    backgroundColor: '#F0F9FF', borderWidth: 1, borderColor: '#BAE6FD',
    borderRadius: hp(1.2), paddingHorizontal: wp(3), paddingVertical: hp(0.8),
  },
  slipBtnText: { color: colors.primary, fontWeight: '600', fontSize: getFontSize(12), maxWidth: wp(30) },

  // References
  refCard: { backgroundColor: '#F9FAFB', borderRadius: hp(1.5), padding: wp(4), marginBottom: hp(1), borderWidth: 1, borderColor: '#EEF2F7' },
  refHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(1) },
  refTitle: { color: colors.secondary, fontWeight: '700', fontSize: getFontSize(14) },

  // Empty
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: hp(12), gap: hp(1) },
  emptyTitle: { color: '#374151', fontWeight: '700', fontSize: getFontSize(16) },
  emptySub: { color: '#9CA3AF', fontSize: getFontSize(13) },
});
