import React, { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
} from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '@/core/PoolHeader';
import AppButton from '@/core/AppButton';
import LinearGradient from 'react-native-linear-gradient';
import { DISPUTE_REASONS } from './escrowData';

const OpenDispute = ({ navigation, route }) => {
    const { hold } = route.params;

    const [reason, setReason] = useState('');
    const [showReasonPicker, setShowReasonPicker] = useState(false);
    const [customReason, setCustomReason] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [description, setDescription] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    const isOther = reason === 'Other (please specify)';
    const finalReason = isOther ? customReason : reason;
    const isValid = finalReason.trim().length > 0 && description.trim().length > 0;

    const handleSelectReason = (r) => {
        setReason(r);
        setShowReasonPicker(false);
        if (r === 'Other (please specify)') {
            setShowCustomInput(true);
        } else {
            setShowCustomInput(false);
            setCustomReason('');
        }
    };

    const handleAttach = () => {
        // Mock attachment — in real app, use DocumentPicker or ImagePicker
        Alert.alert('Attach Evidence', 'File picker would open here. Supports JPG, PNG, PDF (max 10MB).');
    };

    const handleSubmit = () => {
        if (!isValid) return;
        setShowSuccess(true);
    };

    const handleSuccessOk = () => {
        setShowSuccess(false);
        navigation.goBack();
    };

    return (
        <View style={styles.screen}>
            <PoolHeader title="Open Dispute" />

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                {/* Warning icon */}
                <View style={styles.warningIcon}>
                    <View style={styles.warningCircle}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="warning-outline" size={24} color="#F59E0B" />
                    </View>
                </View>

                {/* Job Summary Card */}
                <View style={styles.jobSummaryCard}>
                    <AppText variant={Variant.bodyMedium} style={styles.jobTitle}>{hold.jobTitle}</AppText>
                    <AppText variant={Variant.caption} style={styles.jobCompany}>{hold.company}</AppText>

                    <View style={styles.jobDetailRow}>
                        <View style={styles.candidateRow}>
                            <View style={[styles.avatar, { backgroundColor: hold.candidate.color }]}>
                                <AppText variant={Variant.caption} style={styles.avatarText}>{hold.candidate.initials}</AppText>
                            </View>
                            <View>
                                <AppText variant={Variant.bodyMedium} style={styles.candidateName}>{hold.candidate.name}</AppText>
                                <AppText variant={Variant.caption} style={styles.candidateEmail}>{hold.candidate.email}</AppText>
                            </View>
                        </View>
                        {hold.amountOnHold > 0 && (
                            <View style={styles.amountBox}>
                                <AppText variant={Variant.caption} style={styles.amountLabel}>Amount on Hold</AppText>
                                <AppText variant={Variant.bodyMedium} style={styles.amountValue}>${hold.amountOnHold.toFixed(2)}</AppText>
                            </View>
                        )}
                    </View>
                </View>

                {/* Dispute Details */}
                <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>Dispute Details</AppText>

                {/* Reason Dropdown */}
                <View style={styles.fieldGroup}>
                    <AppText variant={Variant.caption} style={styles.fieldLabel}>Reason for Dispute *</AppText>
                    <TouchableOpacity
                        style={styles.dropdownBtn}
                        onPress={() => setShowReasonPicker(true)}
                        activeOpacity={0.7}
                    >
                        <AppText variant={Variant.body} style={reason ? styles.dropdownText : styles.dropdownPlaceholder}>
                            {reason || 'Select a reason...'}
                        </AppText>
                        <VectorIcons name={iconLibName.Ionicons} iconName="chevron-down" size={18} color="#999" />
                    </TouchableOpacity>
                </View>

                {/* Custom reason input */}
                {showCustomInput && (
                    <View style={styles.fieldGroup}>
                        <AppText variant={Variant.caption} style={styles.fieldLabel}>Please specify *</AppText>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Describe your dispute reason..."
                            placeholderTextColor="#999"
                            value={customReason}
                            onChangeText={setCustomReason}
                        />
                    </View>
                )}

                {/* Description */}
                <View style={styles.fieldGroup}>
                    <AppText variant={Variant.caption} style={styles.fieldLabel}>Description / Details *</AppText>
                    <TextInput
                        style={[styles.textInput, styles.textArea]}
                        placeholder="Please provide detailed information about the issue..."
                        placeholderTextColor="#999"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        textAlignVertical="top"
                        maxLength={1000}
                    />
                    <AppText variant={Variant.caption} style={styles.charCount}>{description.length} / 1000 characters</AppText>
                </View>

                {/* Attach Evidence */}
                <View style={styles.fieldGroup}>
                    <AppText variant={Variant.caption} style={styles.fieldLabel}>Attach Evidence (Optional)</AppText>
                    <TouchableOpacity style={styles.uploadBox} onPress={handleAttach} activeOpacity={0.7}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="cloud-upload-outline" size={28} color={colors.primary} />
                        <AppText variant={Variant.bodyMedium} style={styles.uploadText}>Click to upload files</AppText>
                        <AppText variant={Variant.caption} style={styles.uploadSub}>Supported: JPG, PNG, PDF (max 10MB)</AppText>
                    </TouchableOpacity>
                </View>

                {/* Info tip */}
                <View style={styles.infoTip}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="information-circle" size={16} color={colors.primary} />
                    <AppText variant={Variant.caption} style={styles.infoTipText}>
                        Evidence helps us resolve disputes faster. Screenshots, photos, or documents related to the issue are recommended.
                    </AppText>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonsRow}>
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <AppText variant={Variant.bodyMedium} style={styles.cancelBtnText}>Cancel</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]}
                        onPress={handleSubmit}
                        disabled={!isValid}
                        activeOpacity={0.7}
                    >
                        <AppText variant={Variant.bodyMedium} style={styles.submitBtnText}>Submit Dispute</AppText>
                    </TouchableOpacity>
                </View>

                <View style={{ height: hp(4) }} />
            </ScrollView>

            {/* Reason Picker Modal */}
            <Modal visible={showReasonPicker} transparent animationType="slide">
                <TouchableOpacity
                    style={styles.modalBackdrop}
                    activeOpacity={1}
                    onPress={() => setShowReasonPicker(false)}
                >
                    <View style={styles.pickerModal}>
                        <View style={styles.pickerHeader}>
                            <AppText variant={Variant.bodyMedium} style={styles.pickerTitle}>Select Dispute Reason</AppText>
                            <TouchableOpacity onPress={() => setShowReasonPicker(false)}>
                                <VectorIcons name={iconLibName.Ionicons} iconName="close" size={22} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {DISPUTE_REASONS.map((r, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.reasonItem, reason === r && styles.reasonItemActive]}
                                    onPress={() => handleSelectReason(r)}
                                    activeOpacity={0.7}
                                >
                                    <AppText variant={Variant.body} style={[styles.reasonText, reason === r && styles.reasonTextActive]}>
                                        {r}
                                    </AppText>
                                    {reason === r && (
                                        <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-circle" size={18} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Success Full Screen */}
            <Modal visible={showSuccess} transparent={false} animationType="slide">
                <View style={styles.successScreen}>
                    <PoolHeader title="Dispute Submitted" />
                    <ScrollView contentContainerStyle={styles.successScrollContent} showsVerticalScrollIndicator={false}>
                        {/* Success icon */}
                        <View style={styles.successIconWrap}>
                            <LinearGradient
                                colors={['#16A34A', '#22C55E']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.successIconCircle}
                            >
                                <VectorIcons name={iconLibName.Ionicons} iconName="checkmark" size={32} color="#FFFFFF" />
                            </LinearGradient>
                        </View>
                        <AppText variant={Variant.h6} style={styles.successTitle}>Dispute Submitted{'\n'}Successfully!</AppText>

                        {/* Dispute Reference Card */}
                        <View style={styles.successRefCard}>
                            <AppText variant={Variant.caption} style={styles.successRefLabel}>Dispute Reference #</AppText>
                            <AppText variant={Variant.bodyMedium} style={styles.successRefValue}>
                                DISP-{hold.jobId?.replace('#JOB-', '') || '2024-0001'}-001
                            </AppText>
                            <View style={styles.successRefDivider} />
                            <AppText variant={Variant.bodyMedium} style={styles.successNextTitle}>What happens next?</AppText>
                            <AppText variant={Variant.caption} style={styles.successNextText}>
                                Our team will review your dispute and contact you within 24-48 hours.
                            </AppText>
                        </View>

                        {/* Job Details Recap */}
                        <View style={styles.successJobCard}>
                            <AppText variant={Variant.caption} style={styles.successJobLabel}>Job Details</AppText>
                            <AppText variant={Variant.bodyMedium} style={styles.successJobTitle}>{hold.jobTitle}</AppText>
                            <AppText variant={Variant.caption} style={styles.successJobSub}>
                                {hold.candidate.name} • {hold.company}
                            </AppText>
                            {hold.amountOnHold > 0 && (
                                <AppText variant={Variant.caption} style={styles.successJobAmount}>
                                    Amount on hold: ${hold.amountOnHold.toFixed(2)}
                                </AppText>
                            )}
                        </View>

                        {/* Important Notice */}
                        <View style={styles.successNotice}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="information-circle" size={16} color="#F59E0B" />
                            <AppText variant={Variant.caption} style={styles.successNoticeText}>
                                Funds remain on hold until the dispute is resolved. You'll receive notifications with updates on your case.
                            </AppText>
                        </View>

                        {/* Buttons */}
                        <AppButton
                            text="View My Disputes"
                            onPress={handleSuccessOk}
                            style={styles.successPrimaryBtn}
                        />
                        <TouchableOpacity
                            style={styles.successSecondaryBtn}
                            onPress={handleSuccessOk}
                            activeOpacity={0.7}
                        >
                            <AppText variant={Variant.bodyMedium} style={styles.successSecondaryText}>Back to Wallet</AppText>
                        </TouchableOpacity>

                        <View style={{ height: hp(4) }} />
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
};

export default OpenDispute;

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F4F2F9' },
    scroll: { flex: 1 },
    scrollContent: { padding: wp(4) },
    // Warning icon
    warningIcon: { alignItems: 'center', marginBottom: hp(1) },
    warningCircle: {
        width: 52, height: 52, borderRadius: 26,
        backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: '#FDE68A',
    },
    // Job summary
    jobSummaryCard: {
        backgroundColor: colors.white, borderRadius: 16, padding: wp(4),
        marginBottom: hp(2),
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    jobTitle: { color: '#111', fontWeight: '800', fontSize: getFontSize(16), marginBottom: hp(0.2) },
    jobCompany: { color: '#888', fontSize: getFontSize(12), marginBottom: hp(1.2) },
    jobDetailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    candidateRow: { flexDirection: 'row', alignItems: 'center', gap: wp(2) },
    avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: colors.white, fontWeight: '800', fontSize: getFontSize(12) },
    candidateName: { color: '#333', fontWeight: '600', fontSize: getFontSize(13) },
    candidateEmail: { color: '#999', fontSize: getFontSize(10) },
    amountBox: { alignItems: 'flex-end' },
    amountLabel: { color: '#DC2626', fontWeight: '600', fontSize: getFontSize(10) },
    amountValue: { color: '#DC2626', fontWeight: '800', fontSize: getFontSize(18) },
    // Section
    sectionTitle: { color: '#111', fontWeight: '800', fontSize: getFontSize(16), marginBottom: hp(1.5) },
    // Fields
    fieldGroup: { marginBottom: hp(2) },
    fieldLabel: { color: '#333', fontWeight: '700', fontSize: getFontSize(12), marginBottom: hp(0.5) },
    dropdownBtn: {
        backgroundColor: colors.white, borderWidth: 1, borderColor: '#E8E8EF',
        borderRadius: 12, paddingHorizontal: wp(3.5), paddingVertical: hp(1.4),
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    dropdownText: { color: '#333', fontSize: getFontSize(14) },
    dropdownPlaceholder: { color: '#999', fontSize: getFontSize(14) },
    textInput: {
        backgroundColor: colors.white, borderWidth: 1, borderColor: '#E8E8EF',
        borderRadius: 12, paddingHorizontal: wp(3.5), paddingVertical: hp(1.2),
        fontSize: getFontSize(14), color: '#333',
    },
    textArea: { minHeight: hp(14), paddingTop: hp(1.2) },
    charCount: { color: '#999', fontSize: getFontSize(10), textAlign: 'right', marginTop: hp(0.3) },
    // Upload
    uploadBox: {
        backgroundColor: colors.white, borderWidth: 1.5, borderColor: '#E8E5F0',
        borderRadius: 12, borderStyle: 'dashed', padding: wp(5),
        alignItems: 'center', gap: hp(0.4),
    },
    uploadText: { color: colors.primary, fontWeight: '600', fontSize: getFontSize(13) },
    uploadSub: { color: '#999', fontSize: getFontSize(10) },
    // Info tip
    infoTip: {
        flexDirection: 'row', alignItems: 'flex-start', gap: wp(2),
        backgroundColor: '#F5F3FF', borderRadius: 10, padding: wp(3),
        marginBottom: hp(2), borderWidth: 1, borderColor: '#E8E5F0',
    },
    infoTipText: { flex: 1, color: '#555', fontSize: getFontSize(11), lineHeight: getFontSize(16) },
    // Buttons
    buttonsRow: { flexDirection: 'row', gap: wp(3) },
    cancelBtn: {
        flex: 1, borderWidth: 1.5, borderColor: '#E8E8EF', borderRadius: 12,
        paddingVertical: hp(1.5), alignItems: 'center', backgroundColor: colors.white,
    },
    cancelBtnText: { color: '#555', fontWeight: '600', fontSize: getFontSize(14) },
    submitBtn: {
        flex: 1, backgroundColor: '#DC2626', borderRadius: 12,
        paddingVertical: hp(1.5), alignItems: 'center',
    },
    submitBtnDisabled: { opacity: 0.5 },
    submitBtnText: { color: colors.white, fontWeight: '700', fontSize: getFontSize(14) },
    // Reason picker modal
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    pickerModal: {
        backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20,
        maxHeight: '70%', paddingBottom: hp(5),
    },
    pickerHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: wp(5), paddingVertical: hp(1.5),
        borderBottomWidth: 1, borderBottomColor: '#F3F3F3',
    },
    pickerTitle: { color: '#111', fontWeight: '700', fontSize: getFontSize(16) },
    reasonItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: wp(5), paddingVertical: hp(1.5),
        borderBottomWidth: 0.5, borderBottomColor: '#F3F3F3',
    },
    reasonItemActive: { backgroundColor: '#F5F3FF' },
    reasonText: { flex: 1, color: '#333', fontSize: getFontSize(14) },
    reasonTextActive: { color: colors.primary, fontWeight: '600' },
    // Success full screen
    successScreen: { flex: 1, backgroundColor: '#F4F2F9' },
    successScrollContent: { padding: wp(5), alignItems: 'center' },
    successIconWrap: { marginTop: hp(3), marginBottom: hp(2) },
    successIconCircle: {
        width: 70, height: 70, borderRadius: 35,
        alignItems: 'center', justifyContent: 'center',
    },
    successTitle: {
        color: '#111', fontWeight: '800', fontSize: getFontSize(22),
        textAlign: 'center', marginBottom: hp(2.5),
    },
    successRefCard: {
        width: '100%', backgroundColor: colors.white, borderRadius: 16,
        padding: wp(5), marginBottom: hp(2),
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    successRefLabel: { color: '#888', fontSize: getFontSize(12), marginBottom: hp(0.3) },
    successRefValue: { color: '#111', fontWeight: '800', fontSize: getFontSize(18), marginBottom: hp(1.5) },
    successRefDivider: { height: 1, backgroundColor: '#E8E8EF', marginBottom: hp(1.5) },
    successNextTitle: { color: '#111', fontWeight: '700', fontSize: getFontSize(15), marginBottom: hp(0.5) },
    successNextText: { color: '#666', fontSize: getFontSize(13), lineHeight: getFontSize(19) },
    successJobCard: {
        width: '100%', backgroundColor: colors.white, borderRadius: 16,
        padding: wp(4), marginBottom: hp(2),
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    successJobLabel: { color: '#888', fontSize: getFontSize(11), marginBottom: hp(0.3) },
    successJobTitle: { color: '#111', fontWeight: '700', fontSize: getFontSize(15), marginBottom: hp(0.2) },
    successJobSub: { color: '#666', fontSize: getFontSize(12), marginBottom: hp(0.4) },
    successJobAmount: { color: '#F59E0B', fontWeight: '600', fontSize: getFontSize(13) },
    successNotice: {
        width: '100%', flexDirection: 'row', alignItems: 'flex-start', gap: wp(2),
        backgroundColor: '#FFF8E1', borderRadius: 10, padding: wp(3),
        marginBottom: hp(2.5), borderWidth: 1, borderColor: '#FFE082',
    },
    successNoticeText: { flex: 1, color: '#BF360C', fontSize: getFontSize(11), lineHeight: getFontSize(16) },
    successPrimaryBtn: { width: '100%', borderRadius: 12, marginBottom: hp(1) },
    successSecondaryBtn: {
        width: '100%', borderWidth: 1.5, borderColor: '#E8E8EF', borderRadius: 12,
        paddingVertical: hp(1.4), alignItems: 'center', backgroundColor: colors.white,
    },
    successSecondaryText: { color: '#555', fontWeight: '600', fontSize: getFontSize(14) },
});
