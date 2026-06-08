import React, {useState} from 'react';
import {StyleSheet, View, Switch, TouchableOpacity} from 'react-native';
import AppHeader from '@/core/AppHeader';
import AppText, {Variant} from '@/core/AppText';
import {colors, hp} from '@/theme';

const ApplicationSettings = () => {
  return (
    <>
      <AppHeader title="Squad Settings" showTopIcons={false} />
      <View style={styles.container}>
        <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
          Squad Management
        </AppText>
        <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
          Manage your squad account and members
        </AppText>

        <TouchableOpacity
          style={[styles.menuButton, {backgroundColor: colors.black}]}>
          <AppText variant={Variant.bodybold} color={colors.white}>
            Pair with Another User
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, {borderColor: colors.black}]}>
          <AppText variant={Variant.bodybold} style={styles.menuText}>
            Manage Squad Members
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton}>
          <AppText variant={Variant.bodybold} style={styles.signOutText}>
            Dismantle Current Squad
          </AppText>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ApplicationSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 2,
    color: colors.black,
  },
  sectionSubtitle: {
    marginBottom: 20,
    color: colors.text,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  switchText: {
    flex: 1,
    paddingRight: 10,
  },
  labelPrimary: {
    color: colors.primaryText || colors.black,
  },
  labelSecondary: {
    color: colors.text,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
    borderWidth: 1,
  },
  menuText: {
    marginLeft: 8,
    color: colors.black,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  signOutText: {
    color: '#fff',
    marginLeft: 8,
  },
});
