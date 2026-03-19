import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Animated,
    Vibration,
} from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import Clipboard from '@react-native-clipboard/clipboard';
import { showToast, toastTypes } from '@/utilities/toastConfig';

const CodeExchangeModal = ({ visible, onDismiss, code = '4832', jobTitle = 'Warehouse Night Shift', candidateName = 'Sarah J.' }) => {
    const [copied, setCopied] = useState(false);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            slideAnim.setValue(0);
            Animated.spring(slideAnim, {
                toValue: 1,
                tension: 65,
                friction: 10,
                useNativeDriver: true,
            }).start();

            // Pulse the code
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.03, duration: 1200, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
                ])
            );
            pulse.start();
            return () => pulse.stop();
        }
    }, [visible]);

    const handleCopy = () => {
        Clipboard.setString(code);
        setCopied(true);
        Vibration.vibrate(50);
        showToast(toastTypes.SUCCESS, 'Code Copied!', 'Share this code with the worker');
        setTimeout(() => setCopied(false), 2500);
    };

    const handleDismiss = () => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            onDismiss?.();
        });
    };

    return (
        <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
            <View style={styles.backdrop}>
                <Animated.View
                    style={[
                        styles.modalCard,
                        {
                            transform: [
                                { translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] }) },
                                { scale: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
                            ],
                            opacity: slideAnim,
                        },
                    ]}
                >
                    {/* Top accent */}
                    <View style={styles.topAccent} />

                    {/* Arrived badge */}
                    <View style={styles.arrivedBadge}>
                        <View style={styles.arrivedIconCircle}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="location" size={20} color="#fff" />
                        </View>
                        <AppText variant={Variant.bodyMedium} style={styles.arrivedText}>Worker Has Arrived!</AppText>
                    </View>

                    {/* Job info */}
                    <View style={styles.jobInfoRow}>
                        <View style={styles.candidateAvatar}>
                            <AppText variant={Variant.bodyMedium} style={styles.candidateInitials}>
                                {candidateName.split(' ').map(w => w[0]).join('').toUpperCase()}
                            </AppText>
                        </View>
                        <View style={{ flex: 1 }}>
                            <AppText variant={Variant.bodyMedium} style={styles.jobTitle}>{jobTitle}</AppText>
                            <AppText variant={Variant.caption} style={styles.candidateNameText}>{candidateName}</AppText>
                        </View>
                    </View>

                    {/* Instructions */}
                    <View style={styles.instructionBox}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="information-circle" size={16} color="#6366F1" />
                        <AppText variant={Variant.caption} style={styles.instructionText}>
                            Share this code with the worker to start the job. They will enter it to clock in.
                        </AppText>
                    </View>

                    {/* Code display */}
                    <AppText variant={Variant.caption} style={styles.codeLabel}>CLOCK-IN CODE</AppText>
                    <Animated.View style={[styles.codeContainer, { transform: [{ scale: pulseAnim }] }]}>
                        <View style={styles.codeDigitsRow}>
                            {code.split('').map((digit, i) => (
                                <View key={i} style={styles.codeDigitBox}>
                                    <AppText variant={Variant.h4} style={styles.codeDigit}>{digit}</AppText>
                                </View>
                            ))}
                        </View>
                    </Animated.View>

                    {/* Copy button */}
                    <TouchableOpacity
                        style={[styles.copyBtn, copied && styles.copyBtnCopied]}
                        onPress={handleCopy}
                        activeOpacity={0.7}
                    >
                        <VectorIcons
                            name={iconLibName.Ionicons}
                            iconName={copied ? 'checkmark-circle' : 'copy-outline'}
                            size={16}
                            color={copied ? '#16A34A' : '#6366F1'}
                        />
                        <AppText variant={Variant.bodyMedium} style={[styles.copyBtnText, copied && styles.copyBtnTextCopied]}>
                            {copied ? 'Code Copied!' : 'Copy Code'}
                        </AppText>
                    </TouchableOpacity>

                    {/* Status */}
                    <View style={styles.statusRow}>
                        <View style={styles.statusDot} />
                        <AppText variant={Variant.caption} style={styles.statusText}>Waiting for worker to enter code...</AppText>
                    </View>

                    {/* Dismiss */}
                    <TouchableOpacity style={styles.dismissBtn} onPress={handleDismiss} activeOpacity={0.7}>
                        <AppText variant={Variant.bodyMedium} style={styles.dismissText}>Dismiss</AppText>
                    </TouchableOpacity>
                    <AppText variant={Variant.caption} style={styles.dismissHint}>
                        You can find this code in Wallet → Active Holds anytime
                    </AppText>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default CodeExchangeModal;

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: wp(5),
    },
    modalCard: {
        backgroundColor: colors.white,
        borderRadius: 24,
        width: '100%',
        maxWidth: 380,
        overflow: 'hidden',
    },
    topAccent: {
        height: 4,
        backgroundColor: '#6366F1',
    },
    // Arrived badge
    arrivedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(2),
        paddingTop: hp(2.5),
        paddingBottom: hp(1),
    },
    arrivedIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#16A34A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrivedText: {
        color: '#16A34A',
        fontWeight: '800',
        fontSize: getFontSize(16),
    },
    // Job info
    jobInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2.5),
        paddingHorizontal: wp(5),
        paddingBottom: hp(1.5),
    },
    candidateAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8E5FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    candidateInitials: {
        color: '#6366F1',
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    jobTitle: {
        color: '#111',
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    candidateNameText: {
        color: '#888',
        fontSize: getFontSize(11),
    },
    // Instruction
    instructionBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(1.5),
        backgroundColor: '#F5F3FF',
        marginHorizontal: wp(5),
        borderRadius: 10,
        padding: wp(3),
        marginBottom: hp(1.5),
    },
    instructionText: {
        flex: 1,
        color: '#555',
        fontSize: getFontSize(11),
        lineHeight: getFontSize(16),
    },
    // Code
    codeLabel: {
        textAlign: 'center',
        color: '#999',
        fontWeight: '700',
        fontSize: getFontSize(10),
        letterSpacing: 2,
        marginBottom: hp(0.8),
    },
    codeContainer: {
        alignItems: 'center',
        marginBottom: hp(1.5),
    },
    codeDigitsRow: {
        flexDirection: 'row',
        gap: wp(2.5),
    },
    codeDigitBox: {
        width: wp(14),
        height: wp(16),
        backgroundColor: '#F8F7FF',
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#6366F1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    codeDigit: {
        color: '#6366F1',
        fontWeight: '900',
        fontSize: getFontSize(28),
    },
    // Copy
    copyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(1.5),
        backgroundColor: '#F5F3FF',
        marginHorizontal: wp(10),
        borderRadius: 12,
        paddingVertical: hp(1),
        marginBottom: hp(1.5),
        borderWidth: 1,
        borderColor: '#E8E5FF',
    },
    copyBtnCopied: {
        backgroundColor: '#F0FFF4',
        borderColor: '#BBF7D0',
    },
    copyBtnText: {
        color: '#6366F1',
        fontWeight: '700',
        fontSize: getFontSize(13),
    },
    copyBtnTextCopied: {
        color: '#16A34A',
    },
    // Status
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(1.5),
        marginBottom: hp(2),
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#F59E0B',
    },
    statusText: {
        color: '#F59E0B',
        fontWeight: '600',
        fontSize: getFontSize(11),
    },
    // Dismiss
    dismissBtn: {
        alignItems: 'center',
        paddingVertical: hp(1.2),
        marginHorizontal: wp(5),
        backgroundColor: '#F4F4F5',
        borderRadius: 12,
    },
    dismissText: {
        color: '#666',
        fontWeight: '600',
        fontSize: getFontSize(13),
    },
    dismissHint: {
        textAlign: 'center',
        color: '#BBB',
        fontSize: getFontSize(9),
        paddingVertical: hp(1),
        paddingHorizontal: wp(5),
    },
});
