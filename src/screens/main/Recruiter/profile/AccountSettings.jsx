import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import PoolHeader from '@/core/PoolHeader'
import AppText, { Variant } from '@/core/AppText'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import { colors, hp, wp, getFontSize } from '@/theme'
import { ScrollView } from 'react-native-gesture-handler'
import { screenNames } from '@/navigation/screenNames'

const AccountSettings = ({ navigation }) => {
  const Row = ({ title, subtitle, onPress, iconName }) => (
    <TouchableOpacity style={styles.row} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.rowLeft}>
        <VectorIcons
          name={iconLibName.Ionicons}
          iconName={iconName}
          size={18}
          color={colors.primary}
        />
      </View>
      <View style={styles.rowContent}>
        <AppText variant={Variant.body} style={styles.rowTitle}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant={Variant.caption} style={styles.rowSubtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <VectorIcons
        name={iconLibName.Ionicons}
        iconName="chevron-forward"
        size={18}
        color={colors.gray}
      />
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <PoolHeader title="Account Settings" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <AppText variant={Variant.caption} style={styles.sectionLabel}>
          PROFILE
        </AppText>
        <View style={styles.card}>
          <Row
            title="Basic Details"
            subtitle="Name, DOB, and personal info"
            iconName="person-outline"
            onPress={() => navigation.navigate(screenNames.BASIC_DETAILS)}
          />
          <View style={styles.divider} />
          <Row
            title="Address"
            subtitle="Your current address"
            iconName="home-outline"
            onPress={() => navigation.navigate(screenNames.ADDRESS)}
          />
          <View style={styles.divider} />
          <Row
            title="Contact Details"
            subtitle="Phone number and email"
            iconName="call-outline"
            onPress={() => navigation.navigate(screenNames.CONTACT_DETAILS)}
          />
        </View>

        <AppText variant={Variant.caption} style={[styles.sectionLabel, { marginTop: hp(2.5) }]}>
          COMPLIANCE
        </AppText>
        <View style={styles.card}>
          <Row
            title="Tax Info"
            subtitle="Tax details and declarations"
            iconName="document-text-outline"
            onPress={() => navigation.navigate(screenNames.TAX_INFO)}
          />
          <View style={styles.divider} />
          <Row
            title="Visa Details"
            subtitle="Work eligibility documents"
            iconName="card-outline"
            onPress={() => navigation.navigate(screenNames.VISA_DETAILS)}
          />
          <View style={styles.divider} />
          <Row
            title="KYC / KYB"
            subtitle="Verify your identity / business"
            iconName="shield-checkmark-outline"
            onPress={() => navigation.navigate(screenNames.KYC_KYB)}
          />
        </View>

        <AppText variant={Variant.caption} style={[styles.sectionLabel, { marginTop: hp(2.5) }]}>
          ABOUT
        </AppText>
        <View style={styles.card}>
          <Row
            title="Biography"
            subtitle="Tell others about yourself"
            iconName="reader-outline"
            onPress={() => navigation.navigate(screenNames.BIO)}
          />
          <View style={styles.divider} />
          <Row
            title="Social Media"
            subtitle="Linked profiles and links"
            iconName="share-social-outline"
            onPress={() => navigation.navigate(screenNames.SOCIAL_MEDIA)}
          />
        </View>
      </ScrollView>
    </View>
  )
}

export default AccountSettings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray || '#F6F7FB',
  },
  scroll: {
    padding: wp(4),
    paddingBottom: hp(10),
  },
  sectionLabel: {
    color: colors.gray,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: hp(1),
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border || '#E8E8EF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border || '#E8E8EF',
    marginLeft: wp(4) + 38,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(4),
    backgroundColor: colors.white,
  },
  rowLeft: {
    height: 34,
    width: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF4FF',
  },
  rowContent: {
    flex: 1,
    marginLeft: wp(3),
  },
  rowTitle: {
    color: colors.black,
    fontWeight: '600',
    fontSize: getFontSize(14),
  },
  rowSubtitle: {
    color: colors.gray,
    marginTop: hp(0.3),
  },
})


