import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import ReactNative from 'react';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addExperience, updateExperience } from '@/store/jobSeekerExperienceSlice';
import { FormProvider, useForm } from 'react-hook-form';
import { colors, getFontSize, hp, wp } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import VectorIcons from '@/theme/vectorIcon';
import FormField from '@/core/FormField';
import ImagePickerSheet from '@/components/ImagePickerSheet';
import { Linking } from 'react-native';
import { downloadAndOpenFile } from '@/utilities/helperFunctions';

const AddExperience = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute<any>();
  const isEdit = route?.params?.mode === 'edit';
  const editingExp = route?.params?.experience;
  const imagePickerRef = React.useRef<any>(null);
  const [references, setReferences] = React.useState<Array<any>>([
    { name: '', position: '', contact: '', email: '' },
  ]);
  const [slips, setSlips] = React.useState<Array<{ uri: string; fileName?: string }>>([]);

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

  const { handleSubmit, reset } = methods;

  React.useEffect(() => {
    if (isEdit && editingExp) {
      // Prefill form fields
      reset({
        jobTitle: editingExp.jobTitle || '',
        companyName: editingExp.companyName || '',
        country: editingExp.country || '',
        startMonth: editingExp.startMonth || '',
        startYear: editingExp.startYear || '',
        endMonth: editingExp.endMonth || '',
        endYear: editingExp.endYear || '',
        jobDescription: editingExp.jobDescription || '',
      });
      // Prefill references/slips local state
      if (Array.isArray(editingExp.references)) {
        setReferences(editingExp.references.map((r: any) => ({
          name: r.name || '',
          position: r.position || '',
          contact: r.contact || '',
          email: r.email || '',
        })));
      }
      if (Array.isArray(editingExp.slips)) {
        setSlips(editingExp.slips.map((s: any) => ({ uri: s.uri, fileName: s.fileName })));
      }
    }
  }, [isEdit, editingExp, reset]);

  // Reset form when adding a new experience
  useFocusEffect(
    useCallback(() => {
      if (!isEdit) {
        reset({
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
        });
        setReferences([{ name: '', position: '', contact: '', email: '' }]);
        setSlips([]);
      }
    }, [isEdit, reset])
  );

  // ✅ Handle form submission
  const onSubmit = (data: any) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '')
    );
    const payload = {
      ...filteredData,
      references: references.filter(r => r.name || r.position || r.contact || r.email),
      slips,
    };
    if (isEdit && editingExp?.id) {
      dispatch(updateExperience({ id: editingExp.id, ...payload } as any));
    } else {
      dispatch(addExperience(payload as any));
    }
    navigation.goBack();
  };

  const addReferenceRow = () => {
    setReferences(prev => [...prev, { name: '', position: '', contact: '', email: '' }]);
  };

  const updateReference = (index: number, key: string, value: string) => {
    setReferences(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const removeReference = (index: number) => {
    setReferences(prev => prev.filter((_, i) => i !== index));
  };

  const openImagePicker = () => {
    imagePickerRef.current?.open?.();
  };

  const onSelectImage = (asset: any) => {
    if (asset?.uri) {
      setSlips(prev => [...prev, { uri: asset.uri, fileName: asset.fileName }]);
    }
  };

  const removeSlip = (index: number) => {
    setSlips(prev => prev.filter((_, i) => i !== index));
  };

  const downloadSlip = async (uri: string) => {
    await downloadAndOpenFile(uri, 'payslip');
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
          <AppText style={styles.subLabel}>Reference(s)</AppText>

          {references.map((ref, idx) => (
            <View key={`ref_${idx}`} style={{ marginBottom: hp(1.5) }}>
              <FormField
                name={`referenceName_${idx}`}
                placeholder="Name"
                value={ref.name}
                onChangeText={(v: string) => updateReference(idx, 'name', v)}
              />
              <FormField
                name={`referencePosition_${idx}`}
                placeholder="Position"
                value={ref.position}
                onChangeText={(v: string) => updateReference(idx, 'position', v)}
              />
              <FormField
                name={`referenceContact_${idx}`}
                placeholder="Contact number"
                keyboardType="phone-pad"
                value={ref.contact}
                onChangeText={(v: string) => updateReference(idx, 'contact', v)}
              />
              <FormField
                name={`referenceEmail_${idx}`}
                placeholder="Email address"
                keyboardType="email-address"
                value={ref.email}
                onChangeText={(v: string) => updateReference(idx, 'email', v)}
              />
              {references.length > 1 ? (
                <TouchableOpacity onPress={() => removeReference(idx)} style={[styles.addRefRow, { justifyContent: 'flex-end' }]}>
                  <VectorIcons name="trash" size={18} color={'red'} />
                  <AppText style={[styles.addRefText, { color: 'red' }]}>Remove</AppText>
                </TouchableOpacity>
              ) : null}
            </View>
          ))}

          {/* Add another reference */}
          <TouchableOpacity style={styles.addRefRow} onPress={addReferenceRow}>
            <VectorIcons name="plus-circle" size={18} color={colors.primary} />
            <AppText style={styles.addRefText}>Add another reference</AppText>
          </TouchableOpacity>

          {/* Upload Pay Slip (Optional) */}
          <AppText style={styles.uploadLabel}>Upload pay slip (optional)</AppText>
          <TouchableOpacity style={styles.uploadBox} onPress={openImagePicker}>
            <VectorIcons name="plus-circle" size={18} color={colors.primary} />
            <AppText style={styles.uploadText}>
              Click here to upload pay slip
            </AppText>
          </TouchableOpacity>
          {slips.map((s, idx) => (
            <View key={`slip_${idx}`} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: hp(1) }}>
              <AppText>{s.fileName || `Slip ${idx + 1}`}</AppText>
              <View style={{ flexDirection: 'row', gap: wp(3) }}>
                <TouchableOpacity onPress={() => downloadSlip(s.uri)}>
                  <VectorIcons name="download" size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeSlip(idx)}>
                  <VectorIcons name="trash" size={18} color={'red'} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
      <ImagePickerSheet ref={imagePickerRef} onSelect={onSelectImage} />
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
