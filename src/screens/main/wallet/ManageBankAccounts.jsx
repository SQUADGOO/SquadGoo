import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
} from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '@/core/PoolHeader';
import AppButton from '@/core/AppButton';
import { showToast, toastTypes } from '@/utilities/toastConfig';

const BANK_LOGOS = {
    'Commonwealth Bank': { bg: '#FFF1F0', icon: 'business', color: '#CC0000' },
    'ANZ': { bg: '#E8F4FD', icon: 'business', color: '#003C7D' },
    'Westpac': { bg: '#E8F0FF', icon: 'business', color: '#D5002B' },
    'NAB': { bg: '#E8F5E9', icon: 'business', color: '#1B7742' },
};

const initialAccounts = [
    { id: '1', bankName: 'Commonwealth Bank', accountNumber: '****1234', bsb: '062-000', isVerified: true },
    { id: '2', bankName: 'ANZ', accountNumber: '****5678', bsb: '013-000', isVerified: true },
    { id: '3', bankName: 'Westpac', accountNumber: '****9012', bsb: '032-000', isVerified: true },
    { id: '4', bankName: 'NAB', accountNumber: '****3456', bsb: '082-000', isVerified: true },
];

const ManageBankAccounts = ({ navigation }) => {
    const [accounts, setAccounts] = useState(initialAccounts);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editAccount, setEditAccount] = useState(null);
    const [editBankName, setEditBankName] = useState('');
    const [editBsb, setEditBsb] = useState('');
    const [editAccountNumber, setEditAccountNumber] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newBankName, setNewBankName] = useState('');
    const [newBsb, setNewBsb] = useState('');
    const [newAccountNumber, setNewAccountNumber] = useState('');

    // Edit
    const openEdit = (acc) => {
        setEditAccount(acc);
        setEditBankName(acc.bankName);
        setEditBsb(acc.bsb);
        setEditAccountNumber(acc.accountNumber.replace(/\*/g, ''));
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        if (!editBankName.trim() || !editBsb.trim() || !editAccountNumber.trim()) {
            Alert.alert('Missing Fields', 'Please fill in all fields.');
            return;
        }
        setAccounts(prev => prev.map(a =>
            a.id === editAccount.id
                ? { ...a, bankName: editBankName, bsb: editBsb, accountNumber: `****${editAccountNumber.slice(-4)}` }
                : a
        ));
        setShowEditModal(false);
        showToast('Bank account updated successfully', 'Success', toastTypes.success);
    };

    // Delete
    const openDelete = (id) => {
        setDeleteTargetId(id);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        setAccounts(prev => prev.filter(a => a.id !== deleteTargetId));
        setShowDeleteConfirm(false);
        setDeleteTargetId(null);
        showToast('Bank account removed successfully', 'Success', toastTypes.success);
    };

    // Add
    const handleSaveAdd = () => {
        if (!newBankName.trim() || !newBsb.trim() || !newAccountNumber.trim()) {
            Alert.alert('Missing Fields', 'Please fill in all fields.');
            return;
        }
        const newAcc = {
            id: Date.now().toString(),
            bankName: newBankName,
            bsb: newBsb,
            accountNumber: `****${newAccountNumber.slice(-4)}`,
            isVerified: false,
        };
        setAccounts(prev => [...prev, newAcc]);
        setShowAddModal(false);
        setNewBankName('');
        setNewBsb('');
        setNewAccountNumber('');
        showToast('Bank account added successfully', 'Success', toastTypes.success);
    };

    const getLogo = (bankName) => BANK_LOGOS[bankName] || { bg: '#F3F4F6', icon: 'business', color: '#666' };

    return (
        <View style={styles.screen}>
            <PoolHeader title="Manage Bank Accounts" />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {accounts.map((acc) => {
                    const logo = getLogo(acc.bankName);
                    return (
                        <View key={acc.id} style={styles.accountCard}>
                            <View style={[styles.bankIcon, { backgroundColor: logo.bg }]}>
                                <VectorIcons name={iconLibName.Ionicons} iconName={logo.icon} size={22} color={logo.color} />
                            </View>
                            <View style={styles.accountInfo}>
                                <AppText variant={Variant.bodyMedium} style={styles.accountName}>{acc.bankName}</AppText>
                                <AppText variant={Variant.caption} style={styles.accountDetail}>
                                    {acc.accountNumber}
                                </AppText>
                                <AppText variant={Variant.caption} style={styles.accountDetail}>
                                    BSB {acc.bsb}
                                </AppText>
                            </View>
                            {acc.isVerified && (
                                <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-circle" size={22} color="#16A34A" />
                            )}
                            <TouchableOpacity style={styles.actionIconBtn} onPress={() => openEdit(acc)}>
                                <VectorIcons name={iconLibName.Ionicons} iconName="create-outline" size={18} color={colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionIconBtn} onPress={() => openDelete(acc.id)}>
                                <VectorIcons name={iconLibName.Ionicons} iconName="trash-outline" size={18} color="#DC2626" />
                            </TouchableOpacity>
                        </View>
                    );
                })}

                {/* Add New Bank Account */}
                {accounts.length < 5 && (
                    <AppButton
                        text="Add New Bank Account"
                        onPress={() => setShowAddModal(true)}
                        style={styles.addBtn}
                        bgColor={colors.primary}
                        textColor="#FFFFFF"
                    />
                )}

                {/* Security note */}
                <View style={styles.secNote}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="shield-checkmark-outline" size={14} color="#999" />
                    <AppText variant={Variant.caption} style={styles.secNoteText}>
                        Only verified bank accounts can be used for withdrawals.
                    </AppText>
                </View>

                <View style={{ height: hp(4) }} />
            </ScrollView>

            {/* Edit Bank Account Modal */}
            <Modal visible={showEditModal} transparent animationType="slide">
                <View style={styles.modalBackdrop}>
                    <View style={styles.formModal}>
                        <View style={styles.formModalHeader}>
                            <AppText variant={Variant.bodyMedium} style={styles.formModalTitle}>Edit Bank Account</AppText>
                        </View>

                        <View style={styles.formFields}>
                            <View style={styles.formGroup}>
                                <AppText variant={Variant.caption} style={styles.formLabel}>Bank Name</AppText>
                                <TextInput
                                    style={styles.formInput}
                                    value={editBankName}
                                    onChangeText={setEditBankName}
                                    placeholder="Bank Name"
                                    placeholderTextColor="#999"
                                />
                            </View>
                            <View style={styles.formGroup}>
                                <AppText variant={Variant.caption} style={styles.formLabel}>BSB</AppText>
                                <TextInput
                                    style={styles.formInput}
                                    value={editBsb}
                                    onChangeText={setEditBsb}
                                    placeholder="BSB"
                                    placeholderTextColor="#999"
                                    keyboardType="number-pad"
                                />
                            </View>
                            <View style={styles.formGroup}>
                                <AppText variant={Variant.caption} style={styles.formLabel}>Account Number</AppText>
                                <TextInput
                                    style={styles.formInput}
                                    value={editAccountNumber}
                                    onChangeText={setEditAccountNumber}
                                    placeholder="Account Number"
                                    placeholderTextColor="#999"
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>

                        <AppButton
                            text="Save Changes"
                            onPress={handleSaveEdit}
                            style={styles.formSaveBtn}
                            bgColor={colors.primary}
                            textColor="#FFFFFF"
                        />
                        <TouchableOpacity style={styles.formCancelBtn} onPress={() => setShowEditModal(false)} activeOpacity={0.7}>
                            <AppText variant={Variant.bodyMedium} style={styles.formCancelText}>Cancel</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Add Bank Account Modal */}
            <Modal visible={showAddModal} transparent animationType="slide">
                <View style={styles.modalBackdrop}>
                    <View style={styles.formModal}>
                        <View style={styles.formModalHeader}>
                            <AppText variant={Variant.bodyMedium} style={styles.formModalTitle}>Add Bank Account</AppText>
                        </View>

                        <View style={styles.formFields}>
                            <View style={styles.formGroup}>
                                <AppText variant={Variant.caption} style={styles.formLabel}>Bank Name</AppText>
                                <TextInput
                                    style={styles.formInput}
                                    value={newBankName}
                                    onChangeText={setNewBankName}
                                    placeholder="Bank Name"
                                    placeholderTextColor="#999"
                                />
                            </View>
                            <View style={styles.formGroup}>
                                <AppText variant={Variant.caption} style={styles.formLabel}>BSB</AppText>
                                <TextInput
                                    style={styles.formInput}
                                    value={newBsb}
                                    onChangeText={setNewBsb}
                                    placeholder="BSB"
                                    placeholderTextColor="#999"
                                    keyboardType="number-pad"
                                />
                            </View>
                            <View style={styles.formGroup}>
                                <AppText variant={Variant.caption} style={styles.formLabel}>Account Number</AppText>
                                <TextInput
                                    style={styles.formInput}
                                    value={newAccountNumber}
                                    onChangeText={setNewAccountNumber}
                                    placeholder="Account Number"
                                    placeholderTextColor="#999"
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>

                        <AppText variant={Variant.caption} style={styles.verifyNote}>
                            New accounts must be verified before use.
                        </AppText>

                        <AppButton
                            text="Save / Add"
                            onPress={handleSaveAdd}
                            style={styles.formSaveBtn}
                            bgColor="#DC2626"
                            textColor="#FFFFFF"
                        />
                        <TouchableOpacity style={styles.formCancelBtn} onPress={() => { setShowAddModal(false); setNewBankName(''); setNewBsb(''); setNewAccountNumber(''); }} activeOpacity={0.7}>
                            <AppText variant={Variant.bodyMedium} style={styles.formCancelText}>Cancel</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal visible={showDeleteConfirm} transparent animationType="fade">
                <View style={[styles.modalBackdrop, { justifyContent: 'center' }]}>
                    <View style={styles.deleteCard}>
                        <View style={styles.deleteIconCircle}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="warning-outline" size={32} color="#DC2626" />
                        </View>
                        <AppText variant={Variant.h6} style={styles.deleteTitle}>Remove Account?</AppText>
                        <AppText variant={Variant.body} style={styles.deleteText}>
                            Are you sure you want to remove this bank account?
                        </AppText>
                        <View style={styles.deleteBtnsRow}>
                            <TouchableOpacity
                                style={styles.deleteKeepBtn}
                                onPress={() => setShowDeleteConfirm(false)}
                                activeOpacity={0.7}
                            >
                                <AppText variant={Variant.bodyMedium} style={styles.deleteKeepText}>Cancel</AppText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteConfirmBtn}
                                onPress={handleConfirmDelete}
                                activeOpacity={0.7}
                            >
                                <AppText variant={Variant.bodyMedium} style={styles.deleteConfirmText}>Confirm</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ManageBankAccounts;

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F4F2F9' },
    scroll: { flex: 1 },
    scrollContent: { padding: wp(5) },
    // Account cards
    accountCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 14,
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(3.5),
        marginBottom: hp(1.2),
        gap: wp(2.5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
    bankIcon: {
        width: 44, height: 44, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center',
    },
    accountInfo: { flex: 1 },
    accountName: { color: '#111', fontWeight: '700', fontSize: getFontSize(14) },
    accountDetail: { color: '#888', fontSize: getFontSize(11), marginTop: hp(0.1) },
    actionIconBtn: {
        width: 34, height: 34, borderRadius: 10,
        backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center',
    },
    // Add button
    addBtn: { width: '100%', borderRadius: 12, marginTop: hp(0.5), marginBottom: hp(1.5) },
    // Security note
    secNote: {
        flexDirection: 'row', alignItems: 'center', gap: wp(2),
    },
    secNoteText: { flex: 1, color: '#999', fontSize: getFontSize(11) },
    // Modal
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    formModal: {
        backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20,
        paddingHorizontal: wp(5), paddingBottom: hp(4),
    },
    formModalHeader: {
        paddingVertical: hp(1.8), borderBottomWidth: 1, borderBottomColor: '#F3F3F3',
        alignItems: 'center',
    },
    formModalTitle: { color: '#111', fontWeight: '700', fontSize: getFontSize(16) },
    formFields: { paddingTop: hp(2) },
    formGroup: { marginBottom: hp(2) },
    formLabel: { color: '#666', fontWeight: '600', fontSize: getFontSize(12), marginBottom: hp(0.5) },
    formInput: {
        backgroundColor: '#F9F9FB', borderWidth: 1, borderColor: '#E8E8EF',
        borderRadius: 10, paddingHorizontal: wp(3.5), paddingVertical: hp(1.2),
        fontSize: getFontSize(14), color: '#333',
    },
    verifyNote: { color: '#999', fontSize: getFontSize(11), textAlign: 'center', marginBottom: hp(2) },
    formSaveBtn: { width: '100%', borderRadius: 12, marginBottom: hp(1) },
    formCancelBtn: {
        borderWidth: 1.5, borderColor: '#E8E8EF', borderRadius: 12,
        paddingVertical: hp(1.3), alignItems: 'center',
    },
    formCancelText: { color: '#555', fontWeight: '600', fontSize: getFontSize(14) },
    // Delete modal
    deleteCard: {
        backgroundColor: colors.white, borderRadius: 20, padding: wp(6),
        alignItems: 'center', marginHorizontal: wp(8),
        shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
    },
    deleteIconCircle: {
        width: 64, height: 64, borderRadius: 32,
        backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center',
        marginBottom: hp(1.5),
    },
    deleteTitle: { color: '#111', fontWeight: '800', fontSize: getFontSize(18), marginBottom: hp(0.8) },
    deleteText: {
        color: '#555', fontSize: getFontSize(13), textAlign: 'center',
        lineHeight: getFontSize(20), marginBottom: hp(2.5),
    },
    deleteBtnsRow: { flexDirection: 'row', gap: wp(3), width: '100%' },
    deleteKeepBtn: {
        flex: 1, borderWidth: 1.5, borderColor: '#E8E8EF', borderRadius: 12,
        paddingVertical: hp(1.3), alignItems: 'center',
    },
    deleteKeepText: { color: '#555', fontWeight: '600', fontSize: getFontSize(13) },
    deleteConfirmBtn: {
        flex: 1, backgroundColor: '#DC2626', borderRadius: 12,
        paddingVertical: hp(1.3), alignItems: 'center',
    },
    deleteConfirmText: { color: colors.white, fontWeight: '700', fontSize: getFontSize(13) },
});
