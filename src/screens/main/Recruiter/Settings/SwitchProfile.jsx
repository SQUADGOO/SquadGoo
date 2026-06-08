import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '../../../../core/PoolHeader';

// Current user type — in real app, get from auth context/redux
const CURRENT_USER_TYPE = 'recruiter';

const ALL_PROFILES = [
    {
        key: 'jobseeker',
        title: 'JOBSEEKER',
        description: 'Find jobs and manage your work',
        icon: 'briefcase-outline',
        iconBg: '#E8F5E9',
        iconColor: '#2E7D32',
        borderColor: '#4CAF50',
        accountStatus: 'exists', // 'exists' | 'none' | 'requires_jobseeker'
    },
    {
        key: 'recruiter',
        title: 'RECRUITER',
        description: 'Post jobs and hire talent',
        icon: 'people-outline',
        iconBg: '#E3F2FD',
        iconColor: '#1565C0',
        borderColor: '#2196F3',
        accountStatus: 'exists',
    },
    {
        key: 'squadpair',
        title: 'SQUADPAIR',
        description: 'Create or join a squad to work together',
        icon: 'git-merge-outline',
        iconBg: '#FFF3E0',
        iconColor: '#E65100',
        borderColor: '#FF9800',
        accountStatus: 'requires_jobseeker', // SquadPair requires Jobseeker
        requiresType: 'Jobseeker',
    },
    {
        key: 'marketplace',
        title: 'MARKETPLACE',
        description: 'Buy/sell tools, equipment, and services',
        icon: 'storefront-outline',
        iconBg: '#F3E5F5',
        iconColor: '#7B1FA2',
        borderColor: '#9C27B0',
        accountStatus: 'none',
    },
];

const HOW_IT_WORKS = [
    'Use the same email/phone across all profiles (no duplicates)',
    'Each profile type has different features and dashboard',
    'Your data is separate but linked under one account',
    'Switch anytime without logging out',
    'Some features require specific profile types (e.g., SquadPair needs Jobseeker)',
];

const LINKED_ACCOUNTS = [
    {
        email: 'john.recruiter@squadgoo.com.au', profiles: [
            { type: 'Recruiter', status: 'Active' },
            { type: 'Jobseeker', status: 'Linked' },
        ]
    },
];

const SwitchProfile = ({ navigation }) => {
    // Filter out the current user type
    const availableProfiles = ALL_PROFILES.filter(
        (p) => p.key !== CURRENT_USER_TYPE
    );

    const getStatusBadge = (profile) => {
        switch (profile.accountStatus) {
            case 'exists':
                return (
                    <View style={[styles.statusBadge, styles.statusBadgeGreen]}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-circle" size={12} color="#2E7D32" />
                        <AppText variant={Variant.caption} style={styles.statusBadgeGreenText}>Account exists</AppText>
                    </View>
                );
            case 'requires_jobseeker':
                return (
                    <View style={[styles.statusBadge, styles.statusBadgeOrange]}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="warning" size={12} color="#E65100" />
                        <AppText variant={Variant.caption} style={styles.statusBadgeOrangeText}>
                            Requires {profile.requiresType} account
                        </AppText>
                    </View>
                );
            case 'none':
            default:
                return (
                    <View style={[styles.statusBadge, styles.statusBadgeRed]}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="close-circle" size={12} color="#DC3545" />
                        <AppText variant={Variant.caption} style={styles.statusBadgeRedText}>No account found</AppText>
                    </View>
                );
        }
    };

    const getActionButton = (profile) => {
        switch (profile.accountStatus) {
            case 'exists':
                return (
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.actionBtnSwitch]}
                        activeOpacity={0.8}
                        onPress={() => handleSwitch(profile)}
                    >
                        <AppText variant={Variant.caption} style={styles.actionBtnSwitchText}>Switch →</AppText>
                    </TouchableOpacity>
                );
            case 'requires_jobseeker':
                return (
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.actionBtnCreate]}
                        activeOpacity={0.8}
                        onPress={() => handleCreate(profile)}
                    >
                        <AppText variant={Variant.caption} style={styles.actionBtnCreateText}>Create →</AppText>
                    </TouchableOpacity>
                );
            case 'none':
            default:
                return (
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.actionBtnSignup]}
                        activeOpacity={0.8}
                        onPress={() => handleSignUp(profile)}
                    >
                        <AppText variant={Variant.caption} style={styles.actionBtnSignupText}>Sign Up →</AppText>
                    </TouchableOpacity>
                );
        }
    };

    const handleSwitch = (profile) => {
        Alert.alert(
            `Switch to ${profile.title}`,
            `Switching to your ${profile.title} profile. Your Recruiter session will be preserved.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Switch', onPress: () => {
                        Alert.alert('Switched!', `You are now viewing as ${profile.title}.`);
                    }
                },
            ]
        );
    };

    const handleCreate = (profile) => {
        if (profile.accountStatus === 'requires_jobseeker') {
            Alert.alert(
                `Create ${profile.title} Account`,
                `${profile.title} requires a Jobseeker account. You already have a linked Jobseeker account, so you can create your ${profile.title} profile now.`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Create', onPress: () => {
                            Alert.alert('Account Created!', `Your ${profile.title} profile has been set up.`);
                        }
                    },
                ]
            );
        }
    };

    const handleSignUp = (profile) => {
        Alert.alert(
            `Sign Up for ${profile.title}`,
            `Create a new ${profile.title} account using your existing email and details. No duplicate accounts will be created.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Up', onPress: () => {
                        Alert.alert('Welcome!', `Your ${profile.title} account sign-up flow will start.`);
                    }
                },
            ]
        );
    };

    const handleLinkNewAccount = () => {
        Alert.alert(
            'Link New Account Type',
            'Choose a profile type to link to your existing account. You can use the same email address and phone number.',
        );
    };

    return (
        <View style={styles.container}>
            <PoolHeader title="Switch Profile" />

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Currently Active Banner */}
                <View style={styles.activeBanner}>
                    <View style={{ flex: 1 }}>
                        <AppText variant={Variant.caption} style={styles.activeLabel}>Currently Active:</AppText>
                        <View style={styles.activeRow}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="people-outline" size={18} color={colors.primary} />
                            <AppText variant={Variant.h6} style={styles.activeTitle}>RECRUITER</AppText>
                        </View>
                    </View>
                    <View style={styles.loggedInBadge}>
                        <AppText variant={Variant.caption} style={styles.loggedInText}>Logged In</AppText>
                        <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-circle" size={14} color="#2E7D32" />
                    </View>
                </View>

                {/* Section label */}
                <AppText variant={Variant.caption} style={styles.sectionLabel}>SWITCH TO OTHER PROFILE</AppText>

                {/* Profile Cards */}
                {availableProfiles.map((profile) => (
                    <View
                        key={profile.key}
                        style={[styles.profileCard, { borderLeftColor: profile.borderColor }]}
                    >
                        <View style={styles.profileCardRow}>
                            <View style={[styles.profileIcon, { backgroundColor: profile.iconBg }]}>
                                <VectorIcons
                                    name={iconLibName.Ionicons}
                                    iconName={profile.icon}
                                    size={26}
                                    color={profile.iconColor}
                                />
                            </View>
                            <View style={styles.profileInfo}>
                                <AppText variant={Variant.bodyMedium} style={styles.profileTitle}>
                                    {profile.title}
                                </AppText>
                                <AppText variant={Variant.caption} style={styles.profileDesc}>
                                    {profile.description}
                                </AppText>
                                {getStatusBadge(profile)}
                            </View>
                            {getActionButton(profile)}
                        </View>
                    </View>
                ))}

                {/* How Switch Profile Works */}
                <View style={styles.infoCard}>
                    <View style={styles.infoHeader}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="information-circle" size={18} color={colors.primary} />
                        <AppText variant={Variant.bodyMedium} style={styles.infoTitle}>How Switch Profile Works:</AppText>
                    </View>
                    {HOW_IT_WORKS.map((item, index) => (
                        <View key={index} style={styles.infoItem}>
                            <AppText variant={Variant.caption} style={styles.infoBullet}>•</AppText>
                            <AppText variant={Variant.caption} style={styles.infoText}>{item}</AppText>
                        </View>
                    ))}
                </View>

                {/* Linked Accounts */}
                <AppText variant={Variant.caption} style={styles.sectionLabel}>LINKED ACCOUNTS</AppText>

                {LINKED_ACCOUNTS.map((account, index) => (
                    <View key={index} style={styles.linkedCard}>
                        <View style={styles.linkedEmailRow}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="mail-outline" size={16} color={colors.primary} />
                            <AppText variant={Variant.bodyMedium} style={styles.linkedEmail}>
                                {account.email}
                            </AppText>
                        </View>
                        {account.profiles.map((profile, pIndex) => (
                            <View key={pIndex} style={styles.linkedProfileRow}>
                                <AppText variant={Variant.caption} style={styles.linkedTreeLine}>└─</AppText>
                                <AppText
                                    variant={Variant.caption}
                                    style={[
                                        styles.linkedProfileText,
                                        profile.status === 'Active' && styles.linkedProfileActive,
                                        profile.status === 'Linked' && styles.linkedProfileLinked,
                                    ]}
                                >
                                    {profile.type} ({profile.status})
                                </AppText>
                            </View>
                        ))}
                    </View>
                ))}

                {/* Link New Account Button */}
                <TouchableOpacity
                    style={styles.linkNewBtn}
                    activeOpacity={0.8}
                    onPress={handleLinkNewAccount}
                >
                    <VectorIcons name={iconLibName.Ionicons} iconName="add-circle-outline" size={20} color={colors.primary} />
                    <AppText variant={Variant.bodyMedium} style={styles.linkNewBtnText}>
                        + Link New Account Type
                    </AppText>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default SwitchProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray || '#F6F7FB',
    },
    scroll: {
        padding: wp(4),
        paddingBottom: hp(10),
    },
    activeBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: colors.primary,
        padding: wp(4),
        marginBottom: hp(2),
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    activeLabel: {
        color: colors.gray,
        fontWeight: '500',
        fontSize: getFontSize(11),
        marginBottom: hp(0.3),
    },
    activeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
    },
    activeTitle: {
        color: colors.primary,
        fontWeight: '800',
        fontSize: getFontSize(18),
    },
    loggedInBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
    },
    loggedInText: {
        color: '#2E7D32',
        fontWeight: '600',
        fontSize: getFontSize(12),
    },
    sectionLabel: {
        color: colors.gray,
        fontWeight: '600',
        fontSize: getFontSize(11),
        letterSpacing: 0.5,
        marginBottom: hp(1.2),
        marginTop: hp(0.5),
    },
    profileCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
        borderLeftWidth: 4,
        padding: wp(4),
        marginBottom: hp(1.5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    profileCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
    },
    profileIcon: {
        width: 50,
        height: 50,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileInfo: {
        flex: 1,
    },
    profileTitle: {
        color: '#111',
        fontWeight: '800',
        fontSize: getFontSize(15),
        letterSpacing: 0.3,
    },
    profileDesc: {
        color: colors.gray,
        fontSize: getFontSize(12),
        marginTop: hp(0.2),
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
        alignSelf: 'flex-start',
        borderRadius: 6,
        paddingHorizontal: wp(2),
        paddingVertical: hp(0.25),
        marginTop: hp(0.5),
    },
    statusBadgeGreen: {
        backgroundColor: '#E8F5E9',
    },
    statusBadgeGreenText: {
        color: '#2E7D32',
        fontWeight: '600',
        fontSize: getFontSize(10),
    },
    statusBadgeOrange: {
        backgroundColor: '#FFF3E0',
    },
    statusBadgeOrangeText: {
        color: '#E65100',
        fontWeight: '600',
        fontSize: getFontSize(10),
    },
    statusBadgeRed: {
        backgroundColor: '#FFEBEE',
    },
    statusBadgeRedText: {
        color: '#DC3545',
        fontWeight: '600',
        fontSize: getFontSize(10),
    },
    actionBtn: {
        borderRadius: 10,
        paddingHorizontal: wp(4),
        paddingVertical: hp(1),
    },
    actionBtnSwitch: {
        backgroundColor: colors.primary,
    },
    actionBtnSwitchText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: getFontSize(13),
    },
    actionBtnCreate: {
        backgroundColor: '#555',
    },
    actionBtnCreateText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: getFontSize(13),
    },
    actionBtnSignup: {
        backgroundColor: '#FF9800',
    },
    actionBtnSignupText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: getFontSize(13),
    },
    infoCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
        padding: wp(4),
        marginTop: hp(1),
        marginBottom: hp(2),
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        marginBottom: hp(1),
    },
    infoTitle: {
        color: '#111',
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    infoItem: {
        flexDirection: 'row',
        gap: wp(2),
        marginBottom: hp(0.5),
        paddingLeft: wp(1),
    },
    infoBullet: {
        color: '#555',
        fontSize: getFontSize(12),
    },
    infoText: {
        color: '#555',
        fontSize: getFontSize(12),
        flex: 1,
        lineHeight: getFontSize(17),
    },
    linkedCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
        padding: wp(4),
        marginBottom: hp(1.5),
    },
    linkedEmailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        marginBottom: hp(0.8),
    },
    linkedEmail: {
        color: '#111',
        fontWeight: '600',
        fontSize: getFontSize(13),
    },
    linkedProfileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: wp(6),
        marginBottom: hp(0.3),
    },
    linkedTreeLine: {
        color: colors.gray,
        fontSize: getFontSize(12),
        marginRight: wp(1),
    },
    linkedProfileText: {
        fontSize: getFontSize(12),
        fontWeight: '500',
    },
    linkedProfileActive: {
        color: '#333',
    },
    linkedProfileLinked: {
        color: colors.primary,
    },
    linkNewBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(2),
        backgroundColor: colors.white,
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 14,
        paddingVertical: hp(1.5),
        marginTop: hp(0.5),
    },
    linkNewBtnText: {
        color: colors.primary,
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
});
