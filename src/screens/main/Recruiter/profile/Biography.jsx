import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import AppHeader from '@/core/AppHeader';
import AppText, { Variant } from '@/core/AppText';
import AppButton from '@/core/AppButton';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { colors, hp, wp, getFontSize } from '@/theme';
import { showToast, toastTypes } from '@/utilities/toastConfig';

const Biography = () => {
  const userInfo = useSelector(state => state.auth?.userInfo || {});
  const [bio, setBio] = useState(userInfo?.bio || '');

  const handleSave = () => {
    showToast('Bio updated successfully', 'Success', toastTypes.success);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Bio" showTopIcons={false} />

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <VectorIcons name={iconLibName.Ionicons} iconName="document-text-outline" size={20} color={colors.primary} />
            <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>Your Bio</AppText>
          </View>
          <View style={styles.divider} />

          <AppText variant={Variant.caption} style={styles.infoText}>
            Write a short bio about yourself. This will be visible to recruiters.
          </AppText>

          <TextInput
            style={styles.bioInput}
            placeholder="Tell us about yourself..."
            placeholderTextColor="#9CA3AF"
            value={bio}
            onChangeText={(t) => setBio(t.slice(0, 150))}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          <AppText variant={Variant.caption} style={styles.charCount}>
            {bio.length}/150
          </AppText>
        </View>

        <AppButton
          text="Save Bio"
          onPress={handleSave}
          bgColor={colors.primary}
          textColor="#FFFFFF"
        />
      </View>
    </View>
  );
};

export default Biography;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: wp(4) },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: hp(2.5), padding: wp(5), marginBottom: hp(2),
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: wp(2), marginBottom: hp(1) },
  sectionTitle: { fontSize: getFontSize(16), fontWeight: '800', color: colors.secondary },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: hp(1.5) },
  infoText: { color: '#6B7280', fontSize: getFontSize(13), lineHeight: getFontSize(20), marginBottom: hp(1.5) },
  bioInput: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: hp(1.5), padding: wp(4),
    minHeight: hp(15), fontSize: getFontSize(14), color: '#111827', backgroundColor: '#F9FAFB',
  },
  charCount: { color: '#9CA3AF', fontSize: getFontSize(11), textAlign: 'right', marginTop: hp(0.5) },
});
