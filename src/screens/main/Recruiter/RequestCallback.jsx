import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    ScrollView,
    Alert,
} from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '@/core/PoolHeader';
import LinearGradient from 'react-native-linear-gradient';
import { screenNames } from '@/navigation/screenNames';
import AppButton from '@/core/AppButton';
import { useSelector } from 'react-redux';

const RECRUITER_SUBJECT_OPTIONS = [
    'Top-up SG Coins Issues',
    'Job Offer Issues',
    'KYC/KYB Verification',
    'Withdrawals',
    'Technical Support',
    'Other',
];

const JOBSEEKER_SUBJECT_OPTIONS = [
    'Offer Issue',
    'Payment/Wallet Issue',
    'KYC/Verification Issue',
    'Profile/Document Issue',
    'Technical/App Issue',
    'Account/Login Issue',
    'Other (please specify)',
];

const RequestCallback = ({ navigation }) => {
    const role = useSelector((state) => state.auth?.role);
    const SUBJECT_OPTIONS = role?.toLowerCase() === 'jobseeker' ? JOBSEEKER_SUBJECT_OPTIONS : RECRUITER_SUBJECT_OPTIONS;
    // Form state
    const [name, setName] = useState('John Smith');
    const [phone, setPhone] = useState('+61 412 345 678');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [showSubjectPicker, setShowSubjectPicker] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSubmit = () => {
        if (!subject) {
            Alert.alert('Select Subject', 'Please select a subject for your callback request.');
            return;
        }
        setShowForm(false);
        setShowConfirmation(true);
    };

    const handleConfirmationOk = () => {
        setShowConfirmation(false);
        setSubject('');
        setDescription('');
    };

    return (
        <View style={styles.screen}>
            <PoolHeader title="Request Callback" />

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Two option cards */}
                <View style={styles.optionsContainer}>
                    {/* Option 1: Form to request new callback */}
                    <TouchableOpacity
                        style={[styles.optionCard, showForm && styles.optionCardActive]}
                        activeOpacity={0.7}
                        onPress={() => {
                            setShowForm(!showForm);
                        }}
                    >
                        <View style={[styles.optionIconWrap, { backgroundColor: '#EDE9FE' }]}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="create-outline" size={22} color={colors.primary} />
                        </View>
                        <View style={styles.optionContent}>
                            <AppText variant={Variant.bodyMedium} style={styles.optionTitle}>
                                Form to Request New Callback
                            </AppText>
                            <AppText variant={Variant.caption} style={styles.optionSubtitle}>
                                Fill in details and we'll call you back
                            </AppText>
                        </View>
                        <VectorIcons
                            name={iconLibName.Ionicons}
                            iconName={showForm ? 'chevron-down' : 'chevron-forward'}
                            size={18}
                            color={colors.gray}
                        />
                    </TouchableOpacity>

                    {/* Form content (expandable) */}
                    {showForm && (
                        <View style={styles.formCard}>
                            {/* Your Name */}
                            <AppText variant={Variant.body} style={styles.label}>Your Name</AppText>
                            <View style={styles.inputWrap}>
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter your name"
                                    placeholderTextColor="#999"
                                />
                            </View>

                            {/* Phone Number */}
                            <AppText variant={Variant.body} style={styles.label}>Phone Number</AppText>
                            <View style={styles.inputWrap}>
                                <TextInput
                                    style={styles.input}
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="Enter phone number"
                                    placeholderTextColor="#999"
                                    keyboardType="phone-pad"
                                />
                            </View>

                            {/* Subject Dropdown */}
                            <AppText variant={Variant.body} style={styles.label}>Subject</AppText>
                            <TouchableOpacity
                                style={styles.dropdownBtn}
                                activeOpacity={0.7}
                                onPress={() => setShowSubjectPicker(!showSubjectPicker)}
                            >
                                <AppText
                                    variant={Variant.body}
                                    style={[styles.dropdownText, !subject && styles.dropdownPlaceholder]}
                                >
                                    {subject || 'Select a subject...'}
                                </AppText>
                                <VectorIcons
                                    name={iconLibName.Ionicons}
                                    iconName={showSubjectPicker ? 'chevron-up' : 'chevron-down'}
                                    size={18}
                                    color={colors.gray}
                                />
                            </TouchableOpacity>

                            {/* Subject picker list */}
                            {showSubjectPicker && (
                                <View style={styles.pickerList}>
                                    {SUBJECT_OPTIONS.map((option, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            style={[
                                                styles.pickerItem,
                                                subject === option && styles.pickerItemActive,
                                            ]}
                                            activeOpacity={0.7}
                                            onPress={() => {
                                                setSubject(option);
                                                setShowSubjectPicker(false);
                                            }}
                                        >
                                            <AppText
                                                variant={Variant.body}
                                                style={[
                                                    styles.pickerItemText,
                                                    subject === option && styles.pickerItemTextActive,
                                                ]}
                                            >
                                                {option}
                                            </AppText>
                                            {subject === option && (
                                                <VectorIcons
                                                    name={iconLibName.Ionicons}
                                                    iconName="checkmark"
                                                    size={16}
                                                    color={colors.primary}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {/* Description */}
                            <AppText variant={Variant.body} style={styles.label}>Description</AppText>
                            <View style={[styles.inputWrap, styles.textAreaWrap]}>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="Optional: Please provide more details..."
                                    placeholderTextColor="#999"
                                    multiline
                                    textAlignVertical="top"
                                />
                            </View>

                            {/* Support hours info */}
                            <View style={styles.infoRow}>
                                <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={16} color={colors.gray} />
                                <AppText variant={Variant.caption} style={styles.infoText}>
                                    Available Mon–Fri, 10AM–6PM AEST. We'll call you back as soon as possible.
                                </AppText>
                            </View>

                            {/* Submit button */}
                            <AppButton
                                text="Request Callback"
                                onPress={handleSubmit}
                                style={styles.submitBtn}
                            />
                        </View>
                    )}

                    {/* Option 2: My Callback Requests */}
                    <TouchableOpacity
                        style={styles.optionCard}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate(screenNames.MY_CALLBACK_REQUESTS)}
                    >
                        <View style={[styles.optionIconWrap, { backgroundColor: '#E0F2FE' }]}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="list-outline" size={22} color="#0284C7" />
                        </View>
                        <View style={styles.optionContent}>
                            <AppText variant={Variant.bodyMedium} style={styles.optionTitle}>
                                My Callback Requests
                            </AppText>
                            <AppText variant={Variant.caption} style={styles.optionSubtitle}>
                                List of past/pending callbacks
                            </AppText>
                        </View>
                        <VectorIcons
                            name={iconLibName.Ionicons}
                            iconName="chevron-forward"
                            size={18}
                            color={colors.gray}
                        />
                    </TouchableOpacity>
                </View>

                {/* No Answer Handling Info */}
                <View style={styles.noAnswerCard}>
                    <View style={styles.noAnswerHeader}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="information-circle" size={18} color={colors.primary} />
                        <AppText variant={Variant.bodyMedium} style={styles.noAnswerTitle}>No Answer Handling</AppText>
                    </View>
                    <View style={styles.noAnswerItem}>
                        <AppText variant={Variant.caption} style={styles.noAnswerBullet}>•</AppText>
                        <AppText variant={Variant.caption} style={styles.noAnswerText}>
                            If you don't answer, our team will leave a voicemail or send you an SMS.
                        </AppText>
                    </View>
                    <View style={styles.noAnswerItem}>
                        <AppText variant={Variant.caption} style={styles.noAnswerBullet}>•</AppText>
                        <AppText variant={Variant.caption} style={styles.noAnswerText}>
                            You can reschedule via the app or submit a new callback request anytime.
                        </AppText>
                    </View>
                </View>
            </ScrollView>

            {/* ═══════ Confirmation Modal ═══════ */}
            <Modal
                visible={showConfirmation}
                transparent
                animationType="fade"
                onRequestClose={handleConfirmationOk}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.confirmCard}>
                        <LinearGradient
                            colors={['#E0E7FF', '#EDE9FE']}
                            style={styles.confirmIconCircle}
                        >
                            <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-circle" size={48} color={colors.primary} />
                        </LinearGradient>
                        <AppText variant={Variant.h6} style={styles.confirmTitle}>
                            Callback Requested!
                        </AppText>
                        <AppText variant={Variant.body} style={styles.confirmText}>
                            Thanks for requesting a callback! Our support team will call you back soon at{' '}
                            <AppText variant={Variant.body} style={styles.confirmPhone}>{phone}</AppText>.
                            {' '}Keep your phone handy.
                        </AppText>
                        <AppButton
                            text="OK"
                            onPress={handleConfirmationOk}
                            style={styles.submitBtn}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default RequestCallback;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.lightGray || '#F6F7FB',
    },
    scroll: {
        padding: wp(4),
        paddingBottom: hp(10),
    },
    optionsContainer: {
        gap: hp(0),
    },
    // Option cards
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 14,
        padding: wp(4),
        borderWidth: 1,
        borderColor: '#EEE',
        marginBottom: hp(0.5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    optionCardActive: {
        borderColor: colors.primary,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        marginBottom: 0,
    },
    optionIconWrap: {
        width: 42,
        height: 42,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: wp(3),
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        color: '#111',
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    optionSubtitle: {
        color: colors.gray,
        fontSize: getFontSize(11),
        marginTop: hp(0.2),
    },
    // Form
    formCard: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.primary,
        borderTopWidth: 0,
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        padding: wp(4),
        marginBottom: hp(1.5),
    },
    label: {
        color: '#333',
        fontWeight: '600',
        fontSize: getFontSize(13),
        marginBottom: hp(0.5),
        marginTop: hp(1),
    },
    inputWrap: {
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#E8E8EF',
        borderRadius: 10,
        paddingHorizontal: wp(3),
    },
    input: {
        fontSize: getFontSize(14),
        color: '#333',
        paddingVertical: hp(1.2),
    },
    textAreaWrap: {
        minHeight: hp(10),
    },
    textArea: {
        minHeight: hp(8),
        textAlignVertical: 'top',
    },
    // Dropdown
    dropdownBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#E8E8EF',
        borderRadius: 10,
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.2),
    },
    dropdownText: {
        color: '#333',
        fontSize: getFontSize(14),
    },
    dropdownPlaceholder: {
        color: '#999',
    },
    pickerList: {
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#E8E8EF',
        borderRadius: 10,
        marginTop: hp(0.5),
        overflow: 'hidden',
    },
    pickerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.2),
        borderBottomWidth: 0.5,
        borderBottomColor: '#F0F0F0',
    },
    pickerItemActive: {
        backgroundColor: '#EDE9FE',
    },
    pickerItemText: {
        color: '#333',
        fontSize: getFontSize(13),
    },
    pickerItemTextActive: {
        color: colors.primary,
        fontWeight: '600',
    },
    // Info
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(2),
        marginTop: hp(1.5),
        backgroundColor: '#F8F7FC',
        borderRadius: 10,
        padding: wp(3),
    },
    infoText: {
        flex: 1,
        color: colors.gray,
        fontSize: getFontSize(11),
        lineHeight: getFontSize(16),
    },
    // Submit
    submitBtn: {
        marginTop: hp(2),
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
    },
    submitGradient: {
        paddingVertical: hp(1.6),
        alignItems: 'center',
        borderRadius: 12,
    },
    submitText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: getFontSize(15),
    },
    // No Answer Card
    noAnswerCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E8E8EF',
        padding: wp(4),
        marginTop: hp(2),
    },
    noAnswerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        marginBottom: hp(1),
    },
    noAnswerTitle: {
        color: '#111',
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    noAnswerItem: {
        flexDirection: 'row',
        gap: wp(2),
        marginBottom: hp(0.5),
        paddingLeft: wp(1),
    },
    noAnswerBullet: {
        color: '#555',
        fontSize: getFontSize(12),
    },
    noAnswerText: {
        color: '#555',
        fontSize: getFontSize(12),
        flex: 1,
        lineHeight: getFontSize(17),
    },
    // Confirmation modal
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(8),
    },
    confirmCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: wp(6),
        alignItems: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    confirmIconCircle: {
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
    confirmPhone: {
        color: colors.primary,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    confirmBtn: {
        borderRadius: 12,
        overflow: 'hidden',
        width: '100%',
    },
    confirmBtnGradient: {
        paddingVertical: hp(1.4),
        alignItems: 'center',
        borderRadius: 12,
    },
    confirmBtnText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: getFontSize(15),
    },
});
