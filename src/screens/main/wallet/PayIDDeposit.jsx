import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    Alert,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '@/core/PoolHeader';
import LinearGradient from 'react-native-linear-gradient';
import AppButton from '@/core/AppButton';
import { showToast, toastTypes } from '@/utilities/toastConfig';

const PAYID = 'userID@squadgoo.com';
const REFERENCE_CODE = 'ABC12345';

const HELP_STEPS = [
    'Copy your unique PayID using the copy button.',
    'Open your banking app and select "Pay" or "Transfer" via PayID.',
    'Select Email as PayID to transfer the fund.',
    'Paste the PayID into the recipient/PayID field.',
    'Enter the amount you want to deposit (minimum $15 AUD).',
    'Paste your Reference Code into the "Description" or "Reference" field — this is required to match your deposit!',
    'Confirm and send the payment.',
    'Wait for confirmation — your SG Coins will be credited once payment is received and matched (usually within minutes, may take up to 24 hours).',
];

const PayIDDeposit = ({ navigation }) => {
    const [showHelp, setShowHelp] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const copyToClipboard = (text, label) => {
        Clipboard.setString(text);
        showToast(`${label} copied!`, 'Copied', toastTypes.success);
    };

    const handleTransferDone = () => {
        setShowConfirmation(true);
    };

    const handleConfirmOk = () => {
        setShowConfirmation(false);
        navigation.goBack();
    };

    return (
        <View style={styles.screen}>
            <PoolHeader title="Deposit Using PayID" />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* PayID Info Card */}
                <View style={styles.infoCard}>
                    <AppText variant={Variant.bodyMedium} style={styles.fieldLabel}>Your PayID</AppText>
                    <View style={styles.copyRow}>
                        <View style={styles.codeBox}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="mail-outline" size={16} color={colors.primary} />
                            <AppText variant={Variant.body} style={styles.codeText}>{PAYID}</AppText>
                        </View>
                        <TouchableOpacity
                            style={styles.copyBtn}
                            onPress={() => copyToClipboard(PAYID, 'PayID')}
                            activeOpacity={0.7}
                        >
                            <VectorIcons name={iconLibName.Ionicons} iconName="copy-outline" size={18} color={colors.white} />
                            <AppText variant={Variant.caption} style={styles.copyBtnText}>Copy</AppText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Reference Code Card */}
                <View style={styles.infoCard}>
                    <AppText variant={Variant.bodyMedium} style={styles.fieldLabel}>Reference Code</AppText>
                    <View style={styles.copyRow}>
                        <View style={styles.codeBox}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="key-outline" size={16} color="#F59E0B" />
                            <AppText variant={Variant.body} style={styles.codeText}>{REFERENCE_CODE}</AppText>
                        </View>
                        <TouchableOpacity
                            style={[styles.copyBtn, { backgroundColor: '#F59E0B' }]}
                            onPress={() => copyToClipboard(REFERENCE_CODE, 'Reference Code')}
                            activeOpacity={0.7}
                        >
                            <VectorIcons name={iconLibName.Ionicons} iconName="copy-outline" size={18} color={colors.white} />
                            <AppText variant={Variant.caption} style={styles.copyBtnText}>Copy</AppText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Instructions */}
                <View style={styles.instructionsCard}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="information-circle-outline" size={18} color={colors.primary} />
                    <AppText variant={Variant.body} style={styles.instructionsText}>
                        Use this PayID and enter your reference code in the payment description to receive SG Coins.
                    </AppText>
                </View>

                {/* How to Deposit Button */}
                <TouchableOpacity
                    style={styles.helpBtn}
                    onPress={() => setShowHelp(true)}
                    activeOpacity={0.7}
                >
                    <VectorIcons name={iconLibName.Ionicons} iconName="help-circle-outline" size={18} color={colors.primary} />
                    <AppText variant={Variant.bodyMedium} style={styles.helpBtnText}>
                        How to Deposit Using PayID
                    </AppText>
                    <VectorIcons name={iconLibName.Ionicons} iconName="chevron-forward" size={16} color={colors.primary} />
                </TouchableOpacity>

                {/* Bottom Action Buttons */}
                <View style={styles.actionBtns}>
                    <AppButton
                        text="I've made my PayID transfer"
                        onPress={handleTransferDone}
                        style={styles.primaryActionBtn}
                    />
                    <TouchableOpacity
                        style={styles.secondaryActionBtn}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <AppText variant={Variant.bodyMedium} style={styles.secondaryActionText}>
                            I'll transfer my money later
                        </AppText>
                    </TouchableOpacity>
                </View>

                <View style={{ height: hp(4) }} />
            </ScrollView>

            {/* Help Popup Modal */}
            <Modal visible={showHelp} transparent animationType="slide">
                <View style={styles.modalBackdrop}>
                    <View style={styles.helpModal}>
                        <View style={styles.helpModalHeader}>
                            <AppText variant={Variant.bodyMedium} style={styles.helpModalTitle}>
                                How to Deposit Using PayID
                            </AppText>
                            <TouchableOpacity onPress={() => setShowHelp(false)}>
                                <VectorIcons name={iconLibName.Ionicons} iconName="close" size={22} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.helpModalContent} showsVerticalScrollIndicator={false}>
                            {HELP_STEPS.map((step, i) => (
                                <View key={i} style={styles.helpStep}>
                                    <View style={styles.helpStepNumber}>
                                        <AppText variant={Variant.caption} style={styles.helpStepNumberText}>{i + 1}</AppText>
                                    </View>
                                    <AppText variant={Variant.body} style={styles.helpStepText}>{step}</AppText>
                                </View>
                            ))}

                            {/* Tips */}
                            <View style={styles.tipCard}>
                                <VectorIcons name={iconLibName.Ionicons} iconName="bulb-outline" size={16} color="#F59E0B" />
                                <AppText variant={Variant.caption} style={styles.tipText}>
                                    Double-check PayID and Reference Code. If you forget the reference, contact support.
                                </AppText>
                            </View>

                            <AppButton
                                text="Back to Deposit Screen"
                                onPress={() => setShowHelp(false)}
                                style={styles.helpBackBtn}
                            />

                            <View style={{ height: hp(2) }} />
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Confirmation Modal — Deposit Pending */}
            <Modal visible={showConfirmation} transparent animationType="fade">
                <View style={[styles.modalBackdrop, { justifyContent: 'center' }]}>
                    <View style={styles.confirmCard}>
                        <LinearGradient
                            colors={['#F59E0B', '#FBBF24']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.confirmIcon}
                        >
                            <VectorIcons name={iconLibName.Ionicons} iconName="hourglass-outline" size={36} color={colors.white} />
                        </LinearGradient>
                        <AppText variant={Variant.h6} style={styles.confirmTitle}>Deposit Pending</AppText>
                        <AppText variant={Variant.body} style={styles.confirmText}>
                            We're waiting for your PayID transfer. Once your payment arrives and is matched with your reference code, your SG Coins will be credited to your wallet.
                        </AppText>

                        {/* Status */}
                        <View style={styles.pendingInfoRow}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={16} color="#F59E0B" />
                            <AppText variant={Variant.caption} style={styles.pendingInfoText}>
                                Status: Awaiting bank transfer. Most deposits are credited within minutes, but it may take up to 24 hours depending on your bank.
                            </AppText>
                        </View>

                        {/* Reminder */}
                        <View style={styles.pendingInfoRow}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="alert-circle-outline" size={16} color="#E65100" />
                            <AppText variant={Variant.caption} style={styles.pendingInfoText}>
                                If you haven't made your transfer yet, please do so using the PayID and reference code above.
                            </AppText>
                        </View>

                        {/* Tips */}
                        <View style={[styles.pendingInfoRow, { backgroundColor: '#F5F3FF', borderColor: '#E8E5F0' }]}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="bulb-outline" size={16} color={colors.primary} />
                            <AppText variant={Variant.caption} style={[styles.pendingInfoText, { color: '#555' }]}>
                                You'll receive a notification when your SG Coins are credited. If you forgot to use your reference code, contact support.
                            </AppText>
                        </View>

                        <AppButton
                            text="Back to Wallet"
                            onPress={handleConfirmOk}
                            style={styles.confirmOkBtn}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default PayIDDeposit;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F4F2F9',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: wp(5),
    },
    // Info cards
    infoCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        padding: wp(4),
        marginBottom: hp(1.5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
    fieldLabel: {
        color: '#333',
        fontWeight: '700',
        fontSize: getFontSize(13),
        marginBottom: hp(0.8),
    },
    copyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
    },
    codeBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        backgroundColor: '#F5F3FF',
        borderRadius: 10,
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.2),
        borderWidth: 1,
        borderColor: '#E8E5F0',
    },
    codeText: {
        color: '#333',
        fontSize: getFontSize(13),
        fontWeight: '600',
    },
    copyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
        backgroundColor: colors.primary,
        borderRadius: 10,
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.2),
    },
    copyBtnText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: getFontSize(11),
    },
    // Instructions
    instructionsCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(2),
        backgroundColor: '#F5F3FF',
        borderRadius: 12,
        padding: wp(3.5),
        marginBottom: hp(1.5),
        borderWidth: 1,
        borderColor: '#E8E5F0',
    },
    instructionsText: {
        flex: 1,
        color: '#555',
        fontSize: getFontSize(13),
        lineHeight: getFontSize(19),
    },
    // Help button
    helpBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        backgroundColor: colors.white,
        borderRadius: 12,
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
        marginBottom: hp(3),
        borderWidth: 1,
        borderColor: '#E8E5F0',
    },
    helpBtnText: {
        flex: 1,
        color: colors.primary,
        fontWeight: '600',
        fontSize: getFontSize(13),
    },
    // Action buttons
    actionBtns: {
        gap: hp(1),
    },
    primaryActionBtn: {
        width: '100%',
        borderRadius: 12,
    },
    secondaryActionBtn: {
        borderWidth: 1.5,
        borderColor: '#E8E8EF',
        borderRadius: 12,
        paddingVertical: hp(1.5),
        alignItems: 'center',
    },
    secondaryActionText: {
        color: '#555',
        fontWeight: '600',
        fontSize: getFontSize(14),
    },
    // Modal
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    helpModal: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '85%',
    },
    helpModalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(5),
        paddingVertical: hp(1.5),
        borderBottomWidth: 1,
        borderBottomColor: '#F3F3F3',
    },
    helpModalTitle: {
        color: '#111',
        fontWeight: '700',
        fontSize: getFontSize(16),
    },
    helpModalContent: {
        paddingHorizontal: wp(5),
        paddingTop: hp(1.5),
    },
    helpStep: {
        flexDirection: 'row',
        gap: wp(3),
        marginBottom: hp(1.5),
    },
    helpStepNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(0.2),
    },
    helpStepNumberText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: getFontSize(11),
    },
    helpStepText: {
        flex: 1,
        color: '#333',
        fontSize: getFontSize(13),
        lineHeight: getFontSize(19),
    },
    tipCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(2),
        backgroundColor: '#FFF8E1',
        borderRadius: 10,
        padding: wp(3),
        marginTop: hp(0.5),
        marginBottom: hp(2),
        borderWidth: 1,
        borderColor: '#FFE082',
    },
    tipText: {
        flex: 1,
        color: '#BF360C',
        fontSize: getFontSize(12),
        lineHeight: getFontSize(17),
    },
    helpBackBtn: {
        width: '100%',
        borderRadius: 12,
        marginBottom: hp(2),
    },
    // Confirmation modal
    confirmCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: wp(6),
        alignItems: 'center',
        marginHorizontal: wp(8),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    confirmIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(2),
    },
    confirmTitle: {
        color: '#111',
        fontWeight: '800',
        fontSize: getFontSize(20),
        marginBottom: hp(1),
    },
    confirmText: {
        color: '#555',
        fontSize: getFontSize(13),
        textAlign: 'center',
        lineHeight: getFontSize(20),
        marginBottom: hp(2.5),
    },
    confirmOkBtn: {
        width: '100%',
        borderRadius: 12,
    },
    pendingInfoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(2),
        backgroundColor: '#FFF8E1',
        borderRadius: 10,
        padding: wp(3),
        marginBottom: hp(1),
        borderWidth: 1,
        borderColor: '#FFE082',
        width: '100%',
    },
    pendingInfoText: {
        flex: 1,
        color: '#BF360C',
        fontSize: getFontSize(11),
        lineHeight: getFontSize(16),
    },
});
