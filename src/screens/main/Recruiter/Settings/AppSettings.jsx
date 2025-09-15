import React, {useState} from 'react';
import {StyleSheet, View, Switch, TouchableOpacity} from 'react-native';
import AppHeader from '@/core/AppHeader';
import AppText, {Variant} from '@/core/AppText';
import {colors, hp} from '@/theme';

const ApplicationSettings = () => {

  return (
    <>
      <AppHeader title="Application Settings" showTopIcons={false} />
      <View style={styles.container}>

        <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
          Application Settings
        </AppText>
        <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
          Manage your account and preferences
        </AppText>

        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <AppText variant={Variant.bodybold} style={styles.labelPrimary}>
              Push Notifications
            </AppText>
            <AppText variant={Variant.caption} style={styles.labelSecondary}>
              Receive notifications on your device
            </AppText>
          </View>
          <Switch />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <AppText variant={Variant.bodybold} style={styles.labelPrimary}>
              Email Notifications
            </AppText>
            <AppText variant={Variant.caption} style={styles.labelSecondary}>
              Receive updates via email
            </AppText>
          </View>
          <Switch />
        </View>

        <TouchableOpacity style={styles.menuButton}>
          <AppText variant={Variant.bodybold} style={styles.menuText}>
            Manage Account/Profile
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton}>
          <AppText variant={Variant.bodybold} style={styles.menuText}>
            Tips & Help
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton}>
          <AppText variant={Variant.bodybold} style={styles.menuText}>
            Security & Passwords
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton}>
          <AppText variant={Variant.bodybold} style={styles.menuText}>
            Switch Profile
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton}>
          <AppText variant={Variant.bodybold} style={styles.signOutText}>
            Sign Out
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
    backgroundColor: colors.orange,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
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
    marginTop: 20,
    justifyContent: 'center',
  },
  signOutText: {
    color: '#fff',
    marginLeft: 8,
  },
});
