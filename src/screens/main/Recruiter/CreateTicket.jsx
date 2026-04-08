import React, { useState, useMemo } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
    Alert,
} from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '@/core/PoolHeader';
import LinearGradient from 'react-native-linear-gradient';
import AppButton from '@/core/AppButton';
import { ticketCategories as recruiterCategories } from './supportData';
import { ticketCategories as jobseekerCategories } from '../JobSeeker/supportData';
import { useNavigation } from '@react-navigation/native';
import { screenNames } from '@/navigation/screenNames';
import { useSelector } from 'react-redux';

const PRIORITY_OPTIONS = ['Low', 'Normal', 'High'];

const CreateTicket = () => {
    const navigation = useNavigation();
    const role = useSelector((state) => state.auth?.role);
    const ticketCategories = role?.toLowerCase() === 'jobseeker' ? jobseekerCategories : recruiterCategories;
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('');
    const [selectedIssueTypes, setSelectedIssueTypes] = useState([]);
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Normal');
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const categories = Object.keys(ticketCategories);
    const subCategories = category ? ticketCategories[category] || [] : [];

    const isFormValid = useMemo(() => {
        return subject.trim() && category && selectedIssueTypes.length > 0 && description.trim();
    }, [subject, category, selectedIssueTypes, description]);

    const toggleIssueType = (type) => {
        setSelectedIssueTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const handleSubmit = () => {
        if (!isFormValid) {
            Alert.alert('Missing Fields', 'Please fill in all required fields.');
            return;
        }
        setShowConfirmation(true);
    };

    const handleConfirmationOk = () => {
        setShowConfirmation(false);
        setSubject('');
        setCategory('');
        setSelectedIssueTypes([]);
        setDescription('');
        setPriority('Normal');
        navigation.goBack();
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'Low': return { bg: '#E8F5E9', text: '#2E7D32', border: '#A5D6A7' };
            case 'Normal': return { bg: '#FFF8E1', text: '#F57F17', border: '#FFE082' };
            case 'High': return { bg: '#FFEBEE', text: '#C62828', border: '#EF9A9A' };
            default: return { bg: '#F5F5F5', text: '#666', border: '#DDD' };
        }
    };

    return (
        <View style={styles.screen}>
            <PoolHeader title="Create New Ticket" />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Subject */}
                <View style={styles.fieldGroup}>
                    <AppText variant={Variant.bodyMedium} style={styles.label}>
                        Subject <AppText style={styles.required}>*</AppText>
                    </AppText>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Brief description of your issue"
                        placeholderTextColor="#999"
                        value={subject}
                        onChangeText={setSubject}
                    />
                </View>

                {/* Related To (Category) */}
                <View style={styles.fieldGroup}>
                    <AppText variant={Variant.bodyMedium} style={styles.label}>
                        Related To <AppText style={styles.required}>*</AppText>
                    </AppText>
                    <TouchableOpacity
                        style={styles.pickerBtn}
                        onPress={() => setShowCategoryPicker(true)}
                        activeOpacity={0.7}
                    >
                        <AppText variant={Variant.body} style={category ? styles.pickerText : styles.pickerPlaceholder}>
                            {category || 'Select a category'}
                        </AppText>
                        <VectorIcons name={iconLibName.Ionicons} iconName="chevron-down" size={18} color="#999" />
                    </TouchableOpacity>
                </View>

                {/* Issue Type (subcategories — multi-select chips) */}
                {category ? (
                    <View style={styles.fieldGroup}>
                        <AppText variant={Variant.bodyMedium} style={styles.label}>
                            Issue Type <AppText style={styles.required}>*</AppText>
                        </AppText>
                        <View style={styles.chipsWrap}>
                            {subCategories.map((type) => {
                                const selected = selectedIssueTypes.includes(type);
                                return (
                                    <TouchableOpacity
                                        key={type}
                                        style={[styles.chip, selected && styles.chipSelected]}
                                        onPress={() => toggleIssueType(type)}
                                        activeOpacity={0.7}
                                    >
                                        <AppText
                                            variant={Variant.caption}
                                            style={[styles.chipText, selected && styles.chipTextSelected]}
                                        >
                                            {type}
                                        </AppText>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                ) : null}

                {/* Description */}
                <View style={styles.fieldGroup}>
                    <AppText variant={Variant.bodyMedium} style={styles.label}>
                        Description <AppText style={styles.required}>*</AppText>
                    </AppText>
                    <TextInput
                        style={[styles.textInput, styles.textArea]}
                        placeholder="Provide detailed information, steps to reproduce, and any error messages."
                        placeholderTextColor="#999"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                    />
                </View>

                {/* Attach screenshot/document */}
                <View style={styles.fieldGroup}>
                    <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="attach-outline" size={20} color={colors.primary} />
                        <AppText variant={Variant.body} style={styles.attachText}>
                            Attach screenshot/document
                        </AppText>
                        <AppText variant={Variant.caption} style={styles.attachOptional}>optional</AppText>
                    </TouchableOpacity>
                </View>

                {/* Priority */}
                <View style={styles.fieldGroup}>
                    <AppText variant={Variant.bodyMedium} style={styles.label}>
                        Priority <AppText variant={Variant.caption} style={styles.optionalLabel}>(optional)</AppText>
                    </AppText>
                    <View style={styles.priorityRow}>
                        {PRIORITY_OPTIONS.map((p) => {
                            const active = priority === p;
                            const pColor = getPriorityColor(p);
                            return (
                                <TouchableOpacity
                                    key={p}
                                    style={[
                                        styles.priorityChip,
                                        { borderColor: active ? pColor.border : '#E8E8EF' },
                                        active && { backgroundColor: pColor.bg },
                                    ]}
                                    onPress={() => setPriority(p)}
                                    activeOpacity={0.7}
                                >
                                    <AppText
                                        variant={Variant.caption}
                                        style={[
                                            styles.priorityText,
                                            { color: active ? pColor.text : '#888' },
                                            active && { fontWeight: '700' },
                                        ]}
                                    >
                                        {p}
                                    </AppText>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Submit */}
                <AppButton
                    text="Submit Ticket"
                    onPress={handleSubmit}
                    style={[styles.submitBtn, !isFormValid && styles.submitBtnDisabled]}
                    disabled={!isFormValid}
                />

                {/* Urgent Help Box */}
                <LinearGradient
                    colors={['#FFF3E0', '#FFF8E1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.urgentBox}
                >
                    <AppText variant={Variant.bodyMedium} style={styles.urgentTitle}>
                        Need urgent help?
                    </AppText>
                    <View style={styles.urgentRow}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="mail-outline" size={14} color="#E65100" />
                        <AppText variant={Variant.caption} style={styles.urgentText}>
                            support@squadgoo.com.au
                        </AppText>
                    </View>
                    <View style={styles.urgentRow}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={14} color="#E65100" />
                        <AppText variant={Variant.caption} style={styles.urgentText}>
                            Support hours: Mon–Fri, 9AM–6PM AEST
                        </AppText>
                    </View>
                    <TouchableOpacity
                        style={styles.urgentChatBtn}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate(screenNames.LIVE_CHAT)}
                    >
                        <AppText variant={Variant.caption} style={styles.urgentChatText}>
                            For urgent help, please use Live Chat.
                        </AppText>
                    </TouchableOpacity>
                </LinearGradient>

                <View style={{ height: hp(4) }} />
            </ScrollView>

            {/* Category Picker Modal */}
            <Modal visible={showCategoryPicker} transparent animationType="slide">
                <TouchableOpacity
                    style={styles.modalBackdrop}
                    activeOpacity={1}
                    onPress={() => setShowCategoryPicker(false)}
                >
                    <View style={styles.pickerModal}>
                        <View style={styles.pickerModalHeader}>
                            <AppText variant={Variant.bodyMedium} style={styles.pickerModalTitle}>
                                Related To
                            </AppText>
                            <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                                <VectorIcons name={iconLibName.Ionicons} iconName="close" size={22} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.pickerModalList}>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.pickerModalItem,
                                        category === cat && styles.pickerModalItemActive,
                                    ]}
                                    onPress={() => {
                                        setCategory(cat);
                                        setSelectedIssueTypes([]);
                                        setShowCategoryPicker(false);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <AppText
                                        variant={Variant.body}
                                        style={[
                                            styles.pickerModalItemText,
                                            category === cat && styles.pickerModalItemTextActive,
                                        ]}
                                    >
                                        {cat}
                                    </AppText>
                                    {category === cat && (
                                        <VectorIcons name={iconLibName.Ionicons} iconName="checkmark" size={18} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Confirmation Modal */}
            <Modal visible={showConfirmation} transparent animationType="fade">
                <View style={styles.modalBackdrop}>
                    <View style={styles.confirmCard}>
                        <LinearGradient
                            colors={[colors.primary || '#6C3CE1', '#8B5CF6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.confirmIconCircle}
                        >
                            <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-circle" size={40} color={colors.white} />
                        </LinearGradient>
                        <AppText variant={Variant.h6} style={styles.confirmTitle}>Ticket Submitted!</AppText>
                        <AppText variant={Variant.body} style={styles.confirmText}>
                            Your ticket has been submitted. Our support team will get back to you soon.
                        </AppText>
                        <AppButton
                            text="OK"
                            onPress={handleConfirmationOk}
                            style={styles.confirmOkBtn}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default CreateTicket;

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
    // Fields
    fieldGroup: {
        marginBottom: hp(2),
    },
    label: {
        color: '#333',
        fontWeight: '700',
        fontSize: getFontSize(14),
        marginBottom: hp(0.6),
    },
    required: {
        color: '#DC2626',
        fontWeight: '700',
    },
    optionalLabel: {
        color: '#999',
        fontWeight: '400',
        fontSize: getFontSize(12),
    },
    textInput: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: '#E8E8EF',
        borderRadius: 12,
        paddingHorizontal: wp(3.5),
        paddingVertical: hp(1.2),
        fontSize: getFontSize(14),
        color: '#333',
    },
    textArea: {
        minHeight: hp(14),
        textAlignVertical: 'top',
    },
    // Picker
    pickerBtn: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: '#E8E8EF',
        borderRadius: 12,
        paddingHorizontal: wp(3.5),
        paddingVertical: hp(1.4),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pickerText: {
        color: '#333',
        fontSize: getFontSize(14),
    },
    pickerPlaceholder: {
        color: '#999',
        fontSize: getFontSize(14),
    },
    // Chips
    chipsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: wp(2),
    },
    chip: {
        borderWidth: 1,
        borderColor: '#E8E8EF',
        borderRadius: 20,
        paddingHorizontal: wp(3.5),
        paddingVertical: hp(0.7),
        backgroundColor: colors.white,
    },
    chipSelected: {
        borderColor: colors.primary,
        backgroundColor: '#EDE9FE',
    },
    chipText: {
        color: '#666',
        fontSize: getFontSize(12),
    },
    chipTextSelected: {
        color: colors.primary,
        fontWeight: '700',
    },
    // Attach
    attachBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: '#E8E8EF',
        borderStyle: 'dashed',
        borderRadius: 12,
        paddingHorizontal: wp(3.5),
        paddingVertical: hp(1.4),
    },
    attachText: {
        color: colors.primary,
        fontSize: getFontSize(13),
        flex: 1,
    },
    attachOptional: {
        color: '#999',
        fontSize: getFontSize(11),
    },
    // Priority
    priorityRow: {
        flexDirection: 'row',
        gap: wp(2.5),
    },
    priorityChip: {
        flex: 1,
        borderWidth: 1.5,
        borderRadius: 10,
        paddingVertical: hp(1),
        alignItems: 'center',
    },
    priorityText: {
        fontSize: getFontSize(13),
    },
    // Submit
    submitBtn: {
        marginTop: hp(1),
        width: '100%',
        borderRadius: 12,
    },
    submitBtnDisabled: {
        opacity: 0.5,
    },
    // Urgent box
    urgentBox: {
        borderRadius: 14,
        padding: wp(4),
        marginTop: hp(2),
        borderWidth: 1,
        borderColor: '#FFE0B2',
    },
    urgentTitle: {
        color: '#E65100',
        fontWeight: '800',
        fontSize: getFontSize(15),
        marginBottom: hp(0.8),
    },
    urgentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        marginBottom: hp(0.4),
    },
    urgentText: {
        color: '#BF360C',
        fontSize: getFontSize(12),
    },
    urgentChatBtn: {
        marginTop: hp(0.8),
    },
    urgentChatText: {
        color: '#E65100',
        fontWeight: '700',
        fontSize: getFontSize(12),
        textDecorationLine: 'underline',
    },
    // Category picker modal
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    pickerModal: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '65%',
    },
    pickerModalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(5),
        paddingVertical: hp(1.5),
        borderBottomWidth: 1,
        borderBottomColor: '#F3F3F3',
    },
    pickerModalTitle: {
        color: '#111',
        fontWeight: '700',
        fontSize: getFontSize(16),
    },
    pickerModalList: {
        paddingHorizontal: wp(5),
    },
    pickerModalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: hp(1.5),
        borderBottomWidth: 0.5,
        borderBottomColor: '#F3F3F3',
    },
    pickerModalItemActive: {
        backgroundColor: '#F5F3FF',
        marginHorizontal: -wp(2),
        paddingHorizontal: wp(2),
        borderRadius: 8,
    },
    pickerModalItemText: {
        color: '#333',
        fontSize: getFontSize(14),
    },
    pickerModalItemTextActive: {
        color: colors.primary,
        fontWeight: '700',
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
    confirmOkBtn: {
        width: '100%',
        borderRadius: 12,
    },
});
