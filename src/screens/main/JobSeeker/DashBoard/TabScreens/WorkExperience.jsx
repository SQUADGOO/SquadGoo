import AppHeader from '@/core/AppHeader';
import { screenNames } from '@/navigation/screenNames';
import { hp } from '@/theme';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { removeExperience } from '@/store/jobSeekerExperienceSlice';
import { Linking } from 'react-native';
import { downloadAndOpenFile } from '@/utilities/helperFunctions';

const WorkExperienceScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const experiences = useSelector(state => state?.jobSeekerExperience?.experiences || []);

  const onDelete = (id) => {
    dispatch(removeExperience(id));
  };
  const onDownload = async (uri) => {
    await downloadAndOpenFile(uri, 'payslip');
  }

  return (
    <ScrollView style={styles.container}>
      <AppHeader onPlusPress={()=>navigation.navigate(screenNames.ADD_EXPERIENCE)} showPlusIcon={true} showBackButton={false} title='Work Experience'/>
      
      {experiences.length === 0 ? (
        <View style={{ padding: 16 }}>
          <Text style={{ color: '#4F5D75' }}>No experiences added yet. Tap + to add.</Text>
        </View>
      ) : (
        experiences.map((exp) => (
          <View key={exp.id}>
            <View style={styles.headerRow}>
              <Text style={styles.jobTitle}>{exp.jobTitle || 'Job Title'}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <TouchableOpacity onPress={() => navigation.navigate(screenNames.ADD_EXPERIENCE, { mode: 'edit', experience: exp })}>
                  <Icon name="create-outline" size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(exp.id)}>
                  <MaterialCommunityIcons name="trash-can-outline" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.contentBox}>
              <Text style={styles.label}>
                Job title: <Text style={styles.value}>{exp.jobTitle || '-'}</Text>
              </Text>
              <Text style={styles.label}>
                Company name: <Text style={styles.value}>{exp.companyName || '-'}</Text>
              </Text>
              <Text style={styles.label}>
                Country: <Text style={styles.value}>{exp.country || '-'}</Text>
              </Text>
              <Text style={styles.label}>
                Wok duration: <Text style={styles.value}>
                  {exp.startMonth} {exp.startYear} to {exp.endMonth} {exp.endYear}
                </Text>
              </Text>

              {exp.jobDescription ? (
                <>
                  <Text style={styles.sectionTitle}>Job description:</Text>
                  <Text style={styles.description}>{exp.jobDescription}</Text>
                </>
              ) : null}

              {/* Experience proof / Payslips */}
              {Array.isArray(exp.slips) && exp.slips.length > 0 ? (
                <>
                  <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Experience:</Text>
                  <View style={styles.paySlipRow}>
                    {exp.slips.map((s, idx) => (
                      <TouchableOpacity
                        key={`ps_${idx}`}
                        style={styles.paySlipBtn}
                        onPress={() => onDownload(s.uri)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.paySlipText}>{s.fileName || `Pay slip ${idx + 1}`}</Text>
                        <MaterialCommunityIcons name="download" size={18} color="#FF9800" />
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              ) : null}

              {/* Legacy single reference displayed as References 1 */}
              {(exp.referenceName || exp.referenceEmail || exp.referencePosition || exp.referenceContact) ? (
                <View style={styles.referenceBox}>
                  <View style={styles.referenceHeader}>
                    <Text style={styles.referenceTitle}>References 1</Text>
                    <MaterialCommunityIcons name="check-decagram" size={22} color="#2979FF" />
                  </View>
                  {exp.referenceName ? (
                    <Text style={styles.label}>
                      Full name: <Text style={styles.value}>{exp.referenceName}</Text>
                    </Text>
                  ) : null}
                  {exp.referencePosition ? (
                    <Text style={styles.label}>
                      Position: <Text style={styles.value}>{exp.referencePosition}</Text>
                    </Text>
                  ) : null}
                  {exp.referenceContact ? (
                    <Text style={styles.label}>
                      Contact number: <Text style={styles.value}>{exp.referenceContact}</Text>
                    </Text>
                  ) : null}
                  {exp.referenceEmail ? (
                    <Text style={styles.label}>
                      Email address: <Text style={styles.value}>{exp.referenceEmail}</Text>
                    </Text>
                  ) : null}
                </View>
              ) : null}

              {Array.isArray(exp.references) && exp.references.length > 0 ? (
                <View>
                  {exp.references.map((r, idx) => (
                    <View key={`ref_${idx}`} style={styles.referenceBox}>
                      <View style={styles.referenceHeader}>
                        <Text style={styles.referenceTitle}>{`References ${idx + 1}`}</Text>
                        {idx === 0 ? (
                          <MaterialCommunityIcons name="check-decagram" size={22} color="#2979FF" />
                        ) : (
                          <MaterialCommunityIcons name="clock-outline" size={22} color="red" />
                        )}
                      </View>
                      {r.name ? (
                        <Text style={styles.label}>
                          Full name: <Text style={styles.value}>{r.name}</Text>
                        </Text>
                      ) : null}
                      {r.position ? (
                        <Text style={styles.label}>
                          Position: <Text style={styles.value}>{r.position}</Text>
                        </Text>
                      ) : null}
                      {r.contact ? (
                        <Text style={styles.label}>
                          Contact number: <Text style={styles.value}>{r.contact}</Text>
                        </Text>
                      ) : null}
                      {r.email ? (
                        <Text style={styles.label}>
                          Email address: <Text style={styles.value}>{r.email}</Text>
                        </Text>
                      ) : null}
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
            <View style={{ height: 12, borderTopWidth: 0.6, borderColor: '#E5E7EB' }} />
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    marginVertical: 12,
    flexDirection: 'row',
    backgroundColor: '#5A6B8C',
    justifyContent: 'space-between',
    padding: 12,
    alignItems: 'center',
  },
  jobTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  contentBox: {
    padding: 15,
  },
  label: {
    fontSize: 14,
    color: '#4F5D75',
    marginBottom: 4,
  },
  value: {
    fontWeight: '700',
  },
  sectionTitle: {
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 4,
    color: '#4F5D75',
  },
  description: {
    color: '#4F5D75',
    fontSize: 13,
    lineHeight: 20,
  },
  paySlipRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },
  paySlipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.6,
    borderColor: '#E3E6EE',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: '#EFF3F9',
  },
  paySlipText: {
    fontSize: 13,
    color: '#4F5D75',
    fontWeight: '600',
  },
  referenceBox: {
    borderTopWidth: 0.6,
    borderColor: '#ddd',
    padding: 15,
  },
  referenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  referenceTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: '#4F5D75',
  },
});

export default WorkExperienceScreen;
