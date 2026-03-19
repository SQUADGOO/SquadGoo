import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    Modal,
} from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '../../../../core/PoolHeader';

const DELETION_ITEMS = [
    'Profile information and settings',
    'All job postings and applications',
    'Messages and chat history',
    'Labour pool connections',
    'Transaction and payment history',
    'Reviews and ratings',
    'Analytics and reports',
];

const RETENTION_ITEMS = [
    'Financial records (7 years)',
    'Legal compliance data (as required)',
];

const REASONS = [
    { label: 'Select a reason', value: '' },
    { label: 'I found a better platform', value: 'better_platform' },
    { label: 'Not getting enough value / results', value: 'no_value' },
    { label: 'Too expensive / pricing issues', value: 'too_expensive' },
    { label: 'Too complicated / confusing to use', value: 'too_complicated' },
    { label: 'Privacy or security concerns', value: 'privacy_concerns' },
    { label: 'Technical issues or bugs', value: 'technical_issues' },
    { label: 'Poor customer support', value: 'poor_support' },
    { label: 'Temporary break / Not hiring at the moment', value: 'temporary_break' },
    { label: 'Created a duplicate account', value: 'duplicate_account' },
    { label: 'No longer need the service', value: 'no_longer_needed' },
    { label: 'Prefer to manage hiring elsewhere', value: 'manage_elsewhere' },
    { label: 'Concerned about data usage', value: 'data_concerns' },
    { label: 'Other (please specify)', value: 'other' },
];

const DeleteAccount = ({ navigation }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [reason, setReason] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const [confirmText, setConfirmText] = useState('');
    const [showReasonPicker, setShowReasonPicker] = useState(false);
    const [showOtherModal, setShowOtherModal] = useState(false);

    const isDeleteEnabled =
        password.length > 0 && confirmText.toUpperCase() === 'DELETE';

    const selectedReasonLabel =
        REASONS.find((r) => r.value === reason)?.label || 'Select a reason';

    const handleSelectReason = (value) => {
        setReason(value);
        setShowReasonPicker(false);
        if (value === 'other') {
            setTimeout(() => setShowOtherModal(true), 300);
        }
    };

    const handleDelete = () => {
        if (!password) {
            Alert.alert('Error', 'Please enter your current password.');
            return;
        }
        if (confirmText.toUpperCase() !== 'DELETE') {
            Alert.alert('Error', 'Please type DELETE to confirm.');
            return;
        }

        Alert.alert(
            '⚠️ Final Confirmation',
            'This is your last chance. Your account and all data will be permanently deleted. This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete My Account',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert(
                            'Account Deletion Requested',
                            'Your account deletion request has been submitted. You will receive an email confirmation. The process may take up to 30 days.'
                        );
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <PoolHeader title="Delete Account" headerColor="#DC3545" />

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Warning banner */}
                <View style={styles.warningBanner}>
                    <VectorIcons
                        name={iconLibName.Ionicons}
                        iconName="warning"
                        size={22}
                        color="#DC3545"
                    />
                    <View style={{ flex: 1 }}>
                        <AppText variant={Variant.bodyMedium} style={styles.warningTitle}>
                            Warning: This action cannot be undone
                        </AppText>
                        <AppText variant={Variant.caption} style={styles.warningDesc}>
                            Deleting your account will permanently remove all your data, jobs,
                            messages, and history.
                        </AppText>
                    </View>
                </View>

                {/* What will be deleted */}
                <AppText variant={Variant.h6} style={styles.sectionTitle}>
                    The following will be permanently deleted:
                </AppText>
                <View style={styles.listCard}>
                    {DELETION_ITEMS.map((item, index) => (
                        <View key={index} style={styles.listItem}>
                            <View style={styles.redDot} />
                            <VectorIcons
                                name={iconLibName.Ionicons}
                                iconName="document-outline"
                                size={14}
                                color="#DC3545"
                            />
                            <AppText variant={Variant.body} style={styles.listItemText}>
                                {item}
                            </AppText>
                        </View>
                    ))}
                </View>

                {/* What will be retained */}
                <AppText variant={Variant.h6} style={styles.sectionTitle}>
                    The following will be retained (as required by law):
                </AppText>
                <View style={styles.retainCard}>
                    {RETENTION_ITEMS.map((item, index) => (
                        <View key={index} style={styles.retainItem}>
                            <AppText variant={Variant.caption} style={styles.retainBullet}>
                                •
                            </AppText>
                            <AppText variant={Variant.caption} style={styles.retainText}>
                                {item}
                            </AppText>
                        </View>
                    ))}
                </View>

                {/* Confirmation steps */}
                <AppText variant={Variant.h6} style={styles.sectionTitle}>
                    To confirm deletion, please complete:
                </AppText>

                {/* Step 1: Password */}
                <View style={styles.stepCard}>
                    <AppText variant={Variant.bodyMedium} style={styles.stepLabel}>
                        Step 1: Enter your password
                    </AppText>
                    <View style={styles.inputWrap}>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            placeholder="Current password"
                            placeholderTextColor="#ccc"
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeBtn}
                        >
                            <VectorIcons
                                name={iconLibName.Ionicons}
                                iconName={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color={colors.gray}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Step 2: Reason */}
                <View style={styles.stepCard}>
                    <AppText variant={Variant.bodyMedium} style={styles.stepLabel}>
                        Step 2: Why are you leaving?{' '}
                        <AppText variant={Variant.caption} style={styles.optionalTag}>
                            (Optional)
                        </AppText>
                    </AppText>
                    <TouchableOpacity
                        style={styles.dropdown}
                        activeOpacity={0.7}
                        onPress={() => setShowReasonPicker(true)}
                    >
                        <AppText
                            variant={Variant.body}
                            style={[
                                styles.dropdownText,
                                !reason && styles.dropdownPlaceholder,
                            ]}
                        >
                            {reason === 'other' && otherReason
                                ? `Other: ${otherReason}`
                                : selectedReasonLabel}
                        </AppText>
                        <VectorIcons
                            name={iconLibName.Ionicons}
                            iconName="chevron-down"
                            size={18}
                            color={colors.gray}
                        />
                    </TouchableOpacity>
                </View>

                {/* Step 3: Type DELETE */}
                <View style={[styles.stepCard, styles.stepCardHighlight]}>
                    <AppText variant={Variant.bodyMedium} style={styles.stepLabelRed}>
                        Step 3: Type DELETE to confirm
                    </AppText>
                    <TextInput
                        style={[styles.input, styles.inputHighlight]}
                        value={confirmText}
                        onChangeText={setConfirmText}
                        placeholder="Type DELETE here"
                        placeholderTextColor="#FECACA"
                        autoCapitalize="characters"
                    />
                    {confirmText.length > 0 && confirmText.toUpperCase() !== 'DELETE' && (
                        <AppText variant={Variant.caption} style={styles.mismatchText}>
                            Please type exactly: DELETE
                        </AppText>
                    )}
                    {confirmText.toUpperCase() === 'DELETE' && (
                        <View style={styles.confirmPill}>
                            <VectorIcons
                                name={iconLibName.Ionicons}
                                iconName="checkmark-circle"
                                size={14}
                                color="#2E7D32"
                            />
                            <AppText variant={Variant.caption} style={styles.confirmPillText}>
                                Confirmed
                            </AppText>
                        </View>
                    )}
                </View>

                {/* Delete button */}
                <TouchableOpacity
                    style={[styles.deleteBtn, !isDeleteEnabled && styles.deleteBtnDisabled]}
                    activeOpacity={0.8}
                    onPress={handleDelete}
                    disabled={!isDeleteEnabled}
                >
                    <VectorIcons
                        name={iconLibName.Ionicons}
                        iconName="trash-outline"
                        size={18}
                        color={colors.white}
                    />
                    <AppText variant={Variant.bodyMedium} style={styles.deleteBtnText}>
                        Permanently Delete Account
                    </AppText>
                </TouchableOpacity>

                <AppText variant={Variant.caption} style={styles.footerNote}>
                    After submitting, your account will be scheduled for deletion. The
                    process may take up to 30 days. You can cancel during this period by
                    logging in.
                </AppText>
            </ScrollView>

            {/* ═══════ Reason Picker Modal ═══════ */}
            <Modal
                visible={showReasonPicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowReasonPicker(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.modalBackdrop}
                    onPress={() => setShowReasonPicker(false)}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.pickerSheet}>
                        <View style={styles.sheetHandle} />
                        <AppText variant={Variant.h6} style={styles.pickerTitle}>
                            Why are you leaving?
                        </AppText>
                        <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                            {REASONS.filter((r) => r.value !== '').map((r) => (
                                <TouchableOpacity
                                    key={r.value}
                                    style={[
                                        styles.pickerOption,
                                        reason === r.value && styles.pickerOptionActive,
                                    ]}
                                    activeOpacity={0.7}
                                    onPress={() => handleSelectReason(r.value)}
                                >
                                    <AppText
                                        variant={Variant.body}
                                        style={[
                                            styles.pickerOptionText,
                                            reason === r.value && styles.pickerOptionTextActive,
                                        ]}
                                    >
                                        {r.label}
                                    </AppText>
                                    {reason === r.value && (
                                        <VectorIcons
                                            name={iconLibName.Ionicons}
                                            iconName="checkmark-circle"
                                            size={18}
                                            color={colors.primary}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* ═══════ "Other" Reason Text Modal ═══════ */}
            <Modal
                visible={showOtherModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowOtherModal(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.modalBackdrop}
                    onPress={() => setShowOtherModal(false)}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.otherSheet}>
                        <AppText variant={Variant.h6} style={styles.otherTitle}>
                            Tell us more
                        </AppText>
                        <AppText variant={Variant.caption} style={styles.otherDesc}>
                            Please share your reason for leaving so we can improve.
                        </AppText>
                        <TextInput
                            style={styles.otherInput}
                            value={otherReason}
                            onChangeText={setOtherReason}
                            placeholder="Type your reason here..."
                            placeholderTextColor="#ccc"
                            multiline
                            textAlignVertical="top"
                            numberOfLines={4}
                        />
                        <View style={styles.otherBtnRow}>
                            <TouchableOpacity
                                style={styles.otherCancelBtn}
                                onPress={() => {
                                    setOtherReason('');
                                    setReason('');
                                    setShowOtherModal(false);
                                }}
                            >
                                <AppText variant={Variant.body} style={styles.otherCancelText}>
                                    Cancel
                                </AppText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.otherSubmitBtn}
                                onPress={() => setShowOtherModal(false)}
                            >
                                <AppText variant={Variant.body} style={styles.otherSubmitText}>
                                    Submit
                                </AppText>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default DeleteAccount;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5F5',
    },
    scroll: {
        padding: wp(4),
        paddingBottom: hp(10),
    },
    warningBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(3),
        backgroundColor: '#FEF2F2',
        borderWidth: 1.5,
        borderColor: '#FECACA',
        borderRadius: 14,
        padding: wp(4),
        marginBottom: hp(2.5),
    },
    warningTitle: {
        color: '#DC3545',
        fontWeight: '700',
        fontSize: getFontSize(15),
    },
    warningDesc: {
        color: '#991B1B',
        fontSize: getFontSize(12),
        marginTop: hp(0.3),
        lineHeight: getFontSize(17),
    },
    sectionTitle: {
        color: '#111',
        fontWeight: '700',
        fontSize: getFontSize(16),
        marginBottom: hp(1.2),
    },
    listCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#FECACA',
        padding: wp(4),
        marginBottom: hp(2.5),
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        marginBottom: hp(1),
    },
    redDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#DC3545',
    },
    listItemText: {
        color: '#333',
        fontSize: getFontSize(13),
        flex: 1,
    },
    retainCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
        padding: wp(4),
        marginBottom: hp(2.5),
    },
    retainItem: {
        flexDirection: 'row',
        gap: wp(2),
        marginBottom: hp(0.5),
    },
    retainBullet: {
        color: '#555',
        fontSize: getFontSize(13),
    },
    retainText: {
        color: '#555',
        fontSize: getFontSize(13),
        flex: 1,
    },
    stepCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
        padding: wp(4),
        marginBottom: hp(1.5),
    },
    stepCardHighlight: {
        borderColor: '#FECACA',
        backgroundColor: '#FEF2F2',
    },
    stepLabel: {
        color: '#111',
        fontWeight: '700',
        fontSize: getFontSize(14),
        marginBottom: hp(1),
    },
    stepLabelRed: {
        color: '#DC3545',
        fontWeight: '700',
        fontSize: getFontSize(14),
        marginBottom: hp(1),
    },
    optionalTag: {
        color: colors.gray,
        fontWeight: '400',
        fontSize: getFontSize(12),
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border || '#E0E0E0',
        borderRadius: 10,
        backgroundColor: '#FAFAFA',
    },
    input: {
        flex: 1,
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.3),
        fontSize: getFontSize(14),
        color: '#111',
        borderWidth: 1,
        borderColor: colors.border || '#E0E0E0',
        borderRadius: 10,
        backgroundColor: '#FAFAFA',
    },
    inputHighlight: {
        borderColor: '#FECACA',
        backgroundColor: '#FFFFFF',
    },
    eyeBtn: {
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.3),
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.border || '#E0E0E0',
        borderRadius: 10,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.3),
    },
    dropdownText: {
        color: '#111',
        fontSize: getFontSize(14),
        flex: 1,
    },
    dropdownPlaceholder: {
        color: '#ccc',
    },
    mismatchText: {
        color: '#DC3545',
        fontSize: getFontSize(11),
        marginTop: hp(0.5),
    },
    confirmPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
        marginTop: hp(0.5),
    },
    confirmPillText: {
        color: '#2E7D32',
        fontWeight: '600',
        fontSize: getFontSize(11),
    },
    deleteBtn: {
        backgroundColor: '#DC3545',
        borderRadius: 14,
        paddingVertical: hp(1.8),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: wp(2),
        marginTop: hp(1),
        shadowColor: '#DC3545',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    deleteBtnDisabled: {
        backgroundColor: '#F3A4AB',
        shadowOpacity: 0,
        elevation: 0,
    },
    deleteBtnText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: getFontSize(15),
    },
    footerNote: {
        color: colors.gray,
        fontSize: getFontSize(11),
        textAlign: 'center',
        marginTop: hp(1.5),
        lineHeight: getFontSize(16),
        paddingHorizontal: wp(4),
    },
    // Modals
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    pickerSheet: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: wp(4),
        paddingTop: hp(1.2),
        paddingBottom: hp(3),
        maxHeight: '70%',
    },
    sheetHandle: {
        alignSelf: 'center',
        width: wp(12),
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.border || '#E0E0E0',
        marginBottom: hp(1.5),
    },
    pickerTitle: {
        fontWeight: '700',
        fontSize: getFontSize(16),
        color: '#111',
        marginBottom: hp(1),
    },
    pickerScroll: {
        maxHeight: hp(45),
    },
    pickerOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(2),
        borderBottomWidth: 1,
        borderBottomColor: '#F3F3F3',
    },
    pickerOptionActive: {
        backgroundColor: '#EEF4FF',
        borderRadius: 10,
        borderBottomWidth: 0,
        marginBottom: 1,
    },
    pickerOptionText: {
        color: '#333',
        fontSize: getFontSize(14),
        flex: 1,
    },
    pickerOptionTextActive: {
        color: colors.primary,
        fontWeight: '600',
    },
    // Other reason modal
    otherSheet: {
        backgroundColor: colors.white,
        borderRadius: 18,
        marginHorizontal: wp(6),
        marginBottom: hp(30),
        padding: wp(5),
        marginTop: 'auto',
    },
    otherTitle: {
        fontWeight: '700',
        fontSize: getFontSize(16),
        color: '#111',
        marginBottom: hp(0.5),
    },
    otherDesc: {
        color: colors.gray,
        fontSize: getFontSize(12),
        marginBottom: hp(1.5),
    },
    otherInput: {
        borderWidth: 1,
        borderColor: colors.border || '#E0E0E0',
        borderRadius: 12,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.2),
        fontSize: getFontSize(14),
        color: '#111',
        minHeight: hp(12),
    },
    otherBtnRow: {
        flexDirection: 'row',
        gap: wp(3),
        marginTop: hp(1.5),
    },
    otherCancelBtn: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border || '#E8E8EF',
        borderRadius: 12,
        paddingVertical: hp(1.2),
        alignItems: 'center',
    },
    otherCancelText: {
        color: '#333',
        fontWeight: '600',
    },
    otherSubmitBtn: {
        flex: 1,
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: hp(1.2),
        alignItems: 'center',
    },
    otherSubmitText: {
        color: colors.white,
        fontWeight: '600',
    },
});
