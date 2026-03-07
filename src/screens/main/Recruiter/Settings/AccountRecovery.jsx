import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '../../../../core/PoolHeader';

const AccountRecovery = ({ navigation }) => {
    const [newEmail, setNewEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+61');

    const handleSaveChanges = () => {
        if (newEmail && newEmail !== confirmEmail) {
            Alert.alert('Error', 'Email addresses do not match.');
            return;
        }
        Alert.alert(
            'Changes Saved',
            'Your recovery information has been updated. A verification code will be sent to confirm any new details.'
        );
        setNewEmail('');
        setConfirmEmail('');
        setNewPhone('');
    };

    const handleChangeEmail = () => {
        Alert.alert('Change Recovery Email', 'A verification code will be sent to your current email to confirm this change.');
    };

    const handleChangePhone = () => {
        Alert.alert('Change Recovery Phone', 'A verification code will be sent to your current phone to confirm this change.');
    };

    return (
        <View style={styles.container}>
            <PoolHeader title="Update Recovery Info" />

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Recovery info banner */}
                <View style={styles.infoBanner}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="key-outline" size={18} color={colors.primary} />
                    <View style={{ flex: 1 }}>
                        <AppText variant={Variant.bodyMedium} style={styles.infoBannerTitle}>Recovery Information</AppText>
                        <AppText variant={Variant.caption} style={styles.infoBannerDesc}>
                            Used to regain access if you lose your password
                        </AppText>
                    </View>
                </View>

                {/* Current Recovery Email */}
                <AppText variant={Variant.h6} style={styles.sectionTitle}>Current Recovery Email</AppText>
                <View style={styles.currentCard}>
                    <View style={styles.currentRow}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="mail-outline" size={18} color={colors.primary} />
                        <View style={{ flex: 1 }}>
                            <AppText variant={Variant.body} style={styles.currentValue}>john.recruiter@email.com.au</AppText>
                            <View style={styles.verifiedBadge}>
                                <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-circle" size={14} color="#2E7D32" />
                                <AppText variant={Variant.caption} style={styles.verifiedText}>Verified</AppText>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.changeBtn} activeOpacity={0.8} onPress={handleChangeEmail}>
                            <AppText variant={Variant.caption} style={styles.changeBtnText}>Change</AppText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Add/Update Recovery Email */}
                <View style={styles.formCard}>
                    <AppText variant={Variant.bodyMedium} style={styles.formTitle}>Add/Update Recovery Email</AppText>

                    <AppText variant={Variant.caption} style={styles.inputLabel}>New Email Address</AppText>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter new email address"
                        placeholderTextColor="#ccc"
                        value={newEmail}
                        onChangeText={setNewEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <AppText variant={Variant.caption} style={styles.inputLabel}>Confirm Email Address</AppText>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm new email address"
                        placeholderTextColor="#ccc"
                        value={confirmEmail}
                        onChangeText={setConfirmEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                {/* Current Recovery Phone */}
                <AppText variant={Variant.h6} style={[styles.sectionTitle, { marginTop: hp(2) }]}>Current Recovery Phone</AppText>
                <View style={styles.currentCard}>
                    <View style={styles.currentRow}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="call-outline" size={18} color={colors.primary} />
                        <View style={{ flex: 1 }}>
                            <AppText variant={Variant.body} style={styles.currentValue}>+61 412 345 678</AppText>
                            <View style={styles.verifiedBadge}>
                                <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-circle" size={14} color="#2E7D32" />
                                <AppText variant={Variant.caption} style={styles.verifiedText}>Verified</AppText>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.changeBtn} activeOpacity={0.8} onPress={handleChangePhone}>
                            <AppText variant={Variant.caption} style={styles.changeBtnText}>Change</AppText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Add/Update Recovery Phone */}
                <View style={styles.formCard}>
                    <AppText variant={Variant.bodyMedium} style={styles.formTitle}>Add/Update Recovery Phone</AppText>

                    <AppText variant={Variant.caption} style={styles.inputLabel}>Phone Number</AppText>
                    <View style={styles.phoneRow}>
                        <View style={styles.codeBox}>
                            <AppText variant={Variant.body} style={styles.codeText}>{countryCode} ▼</AppText>
                        </View>
                        <TextInput
                            style={[styles.input, styles.phoneInput]}
                            placeholder="412 345 678"
                            placeholderTextColor="#ccc"
                            value={newPhone}
                            onChangeText={setNewPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.verifyNote}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="information-circle-outline" size={14} color={colors.gray} />
                        <AppText variant={Variant.caption} style={styles.verifyNoteText}>
                            Verification code will be sent to confirm
                        </AppText>
                    </View>
                </View>

                {/* Save Changes */}
                <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={handleSaveChanges}>
                    <AppText variant={Variant.bodyMedium} style={styles.saveBtnText}>Save Changes</AppText>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default AccountRecovery;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray || '#F6F7FB',
    },
    scroll: {
        padding: wp(4),
        paddingBottom: hp(10),
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2.5),
        backgroundColor: '#EEF4FF',
        borderRadius: 14,
        padding: wp(4),
        marginBottom: hp(2),
    },
    infoBannerTitle: {
        color: colors.primary,
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    infoBannerDesc: {
        color: colors.primary,
        fontSize: getFontSize(12),
        marginTop: hp(0.2),
    },
    sectionTitle: {
        color: colors.black || '#111',
        fontWeight: '700',
        fontSize: getFontSize(17),
        marginBottom: hp(1.2),
    },
    currentCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
        padding: wp(4),
        marginBottom: hp(1.5),
    },
    currentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
    },
    currentValue: {
        color: colors.black || '#111',
        fontWeight: '600',
        fontSize: getFontSize(14),
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
        marginTop: hp(0.3),
    },
    verifiedText: {
        color: '#2E7D32',
        fontWeight: '600',
        fontSize: getFontSize(11),
    },
    changeBtn: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingHorizontal: wp(4),
        paddingVertical: hp(0.7),
    },
    changeBtnText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: getFontSize(12),
    },
    formCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
        padding: wp(4),
        marginBottom: hp(1.5),
    },
    formTitle: {
        color: colors.black || '#111',
        fontWeight: '700',
        fontSize: getFontSize(14),
        marginBottom: hp(1.2),
    },
    inputLabel: {
        color: colors.gray,
        fontWeight: '600',
        fontSize: getFontSize(12),
        marginBottom: hp(0.5),
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border || '#E0E0E0',
        borderRadius: 10,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.3),
        fontSize: getFontSize(14),
        color: colors.black || '#111',
        marginBottom: hp(1.2),
    },
    phoneRow: {
        flexDirection: 'row',
        gap: wp(2),
        marginBottom: hp(0.5),
    },
    codeBox: {
        borderWidth: 1,
        borderColor: colors.border || '#E0E0E0',
        borderRadius: 10,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: wp(3),
        justifyContent: 'center',
        alignItems: 'center',
        height: hp(5.5),
    },
    codeText: {
        color: colors.black || '#111',
        fontSize: getFontSize(14),
    },
    phoneInput: {
        flex: 1,
        marginBottom: 0,
    },
    verifyNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1.5),
        marginTop: hp(0.5),
    },
    verifyNoteText: {
        color: colors.gray,
        fontSize: getFontSize(12),
    },
    saveBtn: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: hp(1.6),
        alignItems: 'center',
        marginTop: hp(1),
    },
    saveBtnText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: getFontSize(15),
    },
});
