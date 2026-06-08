import React, { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Modal,
    Alert,
} from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import PoolHeader from '@/core/PoolHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const getStatusStyle = (status) => {
    switch (status) {
        case 'Open':
            return { bg: '#FEF9C3', text: '#A16207', border: '#FDE047' };
        case 'In Progress':
            return { bg: '#FFF7ED', text: '#EA580C', border: '#FDBA74' };
        case 'Resolved':
            return { bg: '#F0FDF4', text: '#16A34A', border: '#86EFAC' };
        case 'Closed':
            return { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB' };
        default:
            return { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB' };
    }
};

const getPriorityStyle = (priority) => {
    switch (priority) {
        case 'High': return { bg: '#FFEBEE', text: '#C62828', border: '#EF9A9A' };
        case 'Medium': return { bg: '#FFF8E1', text: '#F57F17', border: '#FFE082' };
        case 'Low': return { bg: '#E8F5E9', text: '#2E7D32', border: '#A5D6A7' };
        default: return { bg: '#F5F5F5', text: '#666', border: '#DDD' };
    }
};

const TicketDetails = ({ route, navigation }) => {
    const insets = useSafeAreaInsets();
    const ticket = route?.params?.ticket;
    const flatListRef = useRef(null);
    const [messages, setMessages] = useState(ticket?.messages || []);
    const [replyText, setReplyText] = useState('');
    const [ticketStatus, setTicketStatus] = useState(ticket?.status || 'Open');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const isClosed = ticketStatus === 'Closed' || ticketStatus === 'Resolved';
    const canCancel = ticketStatus === 'Open' || ticketStatus === 'In Progress';

    const statusStyle = getStatusStyle(ticketStatus);
    const priorityStyle = getPriorityStyle(ticket?.priority);

    const handleSendReply = () => {
        if (!replyText.trim()) return;
        const newMsg = {
            id: `m${Date.now()}`,
            sender: 'user',
            text: replyText.trim(),
            time: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
            date: 'Just now',
        };
        setMessages(prev => [...prev, newMsg]);
        setReplyText('');
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleCancelTicket = () => {
        setShowCancelModal(false);
        setTicketStatus('Closed');
        Alert.alert('Ticket Cancelled', 'Your ticket has been cancelled successfully.');
    };

    const renderMessage = ({ item, index }) => {
        const isUser = item.sender === 'user';
        const showDateHeader = index === 0 ||
            messages[index - 1]?.date !== item.date;

        return (
            <>
                {showDateHeader && (
                    <View style={styles.dateHeader}>
                        <AppText variant={Variant.caption} style={styles.dateText}>{item.date}</AppText>
                    </View>
                )}
                <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAgent]}>
                    <View style={[styles.messageBubble, isUser ? styles.bubbleUser : styles.bubbleAgent]}>
                        {!isUser && (
                            <AppText variant={Variant.caption} style={styles.senderLabel}>Support Agent</AppText>
                        )}
                        {isUser && (
                            <AppText variant={Variant.caption} style={styles.senderLabelUser}>You</AppText>
                        )}
                        <AppText variant={Variant.body} style={[styles.messageText, isUser && styles.messageTextUser]}>
                            {item.text}
                        </AppText>
                        {item.attachment && (
                            <TouchableOpacity style={styles.attachmentRow}>
                                <VectorIcons name={iconLibName.Ionicons} iconName="document-attach-outline" size={14} color={isUser ? '#FFF' : colors.primary} />
                                <AppText variant={Variant.caption} style={[styles.attachmentText, isUser && { color: '#FFF' }]}>
                                    {item.attachment}
                                </AppText>
                            </TouchableOpacity>
                        )}
                        <AppText variant={Variant.caption} style={[styles.timeText, isUser && styles.timeTextUser]}>
                            {item.time}
                        </AppText>
                    </View>
                </View>
            </>
        );
    };

    return (
        <View style={styles.screen}>
            <PoolHeader title="Ticket Details" />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Ticket Info Header */}
                <View style={styles.ticketInfo}>
                    <AppText variant={Variant.bodyMedium} style={styles.ticketSubject} numberOfLines={2}>
                        {ticket?.subject}
                    </AppText>
                    <AppText variant={Variant.caption} style={styles.ticketId}>
                        Ticket ID: #{ticket?.id}
                    </AppText>
                    {ticket?.createdAt && (
                        <AppText variant={Variant.caption} style={styles.ticketDate}>
                            Created: {ticket.createdAt}  •  Updated: {ticket.lastUpdated}
                        </AppText>
                    )}
                    <View style={styles.badgesRow}>
                        <View style={[styles.badge, { backgroundColor: priorityStyle.bg, borderColor: priorityStyle.border }]}>
                            <AppText variant={Variant.caption} style={[styles.badgeText, { color: priorityStyle.text }]}>
                                Priority: {ticket?.priority}
                            </AppText>
                        </View>
                        <View style={[styles.badge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
                            <AppText variant={Variant.caption} style={[styles.badgeText, { color: statusStyle.text }]}>
                                Status: {ticketStatus}
                            </AppText>
                        </View>
                    </View>
                </View>

                {/* Messages */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    style={styles.messagesList}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                />

                {/* Reply Bar or Closed Notice */}
                {isClosed ? (
                    <View style={[styles.closedBar, { paddingBottom: Math.max(insets.bottom, hp(1)) }]}>
                        <AppText variant={Variant.caption} style={styles.closedText}>
                            This ticket is {ticket?.status?.toLowerCase()}. For new issues, create a new ticket.
                        </AppText>
                    </View>
                ) : (
                    <View style={[styles.replyBar, { paddingBottom: Math.max(insets.bottom, hp(1)) }]}>
                        <TouchableOpacity style={styles.attachReplyBtn}>
                            <VectorIcons name={iconLibName.Ionicons} iconName="attach-outline" size={22} color={colors.gray} />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.replyInput}
                            placeholder="Type your reply..."
                            placeholderTextColor="#999"
                            value={replyText}
                            onChangeText={setReplyText}
                            multiline
                        />
                        {canCancel ? (
                            <TouchableOpacity
                                style={styles.cancelTicketBtn}
                                onPress={() => setShowCancelModal(true)}
                                activeOpacity={0.8}
                            >
                                <AppText variant={Variant.caption} style={styles.cancelTicketBtnText}>Cancel Ticket</AppText>
                            </TouchableOpacity>
                        ) : null}
                        <TouchableOpacity
                            style={[styles.sendBtn, !replyText.trim() && styles.sendBtnDisabled]}
                            onPress={handleSendReply}
                            disabled={!replyText.trim()}
                            activeOpacity={0.8}
                        >
                            <VectorIcons
                                name={iconLibName.Ionicons}
                                iconName="send"
                                size={18}
                                color={replyText.trim() ? colors.white : '#999'}
                            />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Cancel Confirmation Modal */}
                <Modal visible={showCancelModal} transparent animationType="fade">
                    <View style={styles.modalBackdrop}>
                        <View style={styles.cancelCard}>
                            <View style={styles.cancelIconCircle}>
                                <VectorIcons name={iconLibName.Ionicons} iconName="warning-outline" size={32} color="#DC2626" />
                            </View>
                            <AppText variant={Variant.h6} style={styles.cancelTitle}>Cancel Ticket?</AppText>
                            <AppText variant={Variant.body} style={styles.cancelText}>
                                Are you sure you want to cancel this ticket? This action cannot be undone.
                            </AppText>
                            <View style={styles.cancelBtnsRow}>
                                <TouchableOpacity
                                    style={styles.cancelKeepBtn}
                                    onPress={() => setShowCancelModal(false)}
                                    activeOpacity={0.7}
                                >
                                    <AppText variant={Variant.bodyMedium} style={styles.cancelKeepText}>Keep Ticket</AppText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelConfirmBtn}
                                    onPress={handleCancelTicket}
                                    activeOpacity={0.7}
                                >
                                    <AppText variant={Variant.bodyMedium} style={styles.cancelConfirmText}>Cancel Ticket</AppText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </View>
    );
};

export default TicketDetails;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F4F2F9',
    },
    // Ticket info header
    ticketInfo: {
        backgroundColor: colors.white,
        paddingHorizontal: wp(5),
        paddingVertical: hp(1.5),
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    ticketSubject: {
        color: '#111',
        fontWeight: '800',
        fontSize: getFontSize(17),
        lineHeight: getFontSize(24),
        marginBottom: hp(0.3),
    },
    ticketId: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: getFontSize(11),
        marginBottom: hp(0.3),
    },
    ticketDate: {
        color: '#999',
        fontSize: getFontSize(11),
        marginBottom: hp(0.8),
    },
    badgesRow: {
        flexDirection: 'row',
        gap: wp(2),
    },
    badge: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: wp(2.5),
        paddingVertical: hp(0.3),
    },
    badgeText: {
        fontWeight: '600',
        fontSize: getFontSize(11),
    },
    // Messages
    messagesList: {
        flex: 1,
    },
    messagesContent: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(1),
    },
    dateHeader: {
        alignItems: 'center',
        marginVertical: hp(1),
    },
    dateText: {
        color: '#999',
        fontSize: getFontSize(11),
        backgroundColor: '#EFEFEF',
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.3),
        borderRadius: 10,
        overflow: 'hidden',
    },
    messageRow: {
        marginBottom: hp(1),
    },
    messageRowUser: {
        alignItems: 'flex-end',
    },
    messageRowAgent: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        borderRadius: 14,
        padding: wp(3),
    },
    bubbleUser: {
        backgroundColor: colors.primary,
        borderBottomRightRadius: 4,
    },
    bubbleAgent: {
        backgroundColor: colors.white,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#ECECF0',
    },
    senderLabel: {
        color: colors.primary,
        fontWeight: '700',
        fontSize: getFontSize(10),
        marginBottom: hp(0.3),
    },
    senderLabelUser: {
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '700',
        fontSize: getFontSize(10),
        marginBottom: hp(0.3),
    },
    messageText: {
        color: '#333',
        fontSize: getFontSize(13),
        lineHeight: getFontSize(19),
    },
    messageTextUser: {
        color: colors.white,
    },
    attachmentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1.5),
        marginTop: hp(0.5),
        backgroundColor: 'rgba(0,0,0,0.08)',
        paddingHorizontal: wp(2),
        paddingVertical: hp(0.3),
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    attachmentText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: getFontSize(11),
    },
    timeText: {
        color: '#999',
        fontSize: getFontSize(10),
        marginTop: hp(0.3),
        textAlign: 'right',
    },
    timeTextUser: {
        color: 'rgba(255,255,255,0.6)',
    },
    // Reply bar
    replyBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: wp(3),
        paddingTop: hp(1),
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        gap: wp(2),
    },
    attachReplyBtn: {
        paddingVertical: hp(0.8),
    },
    replyInput: {
        flex: 1,
        fontSize: getFontSize(14),
        color: '#333',
        maxHeight: hp(12),
        paddingVertical: hp(0.8),
    },
    sendBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(0.3),
    },
    sendBtnDisabled: {
        backgroundColor: '#F3F3F3',
    },
    // Closed bar
    closedBar: {
        backgroundColor: '#F9FAFB',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingHorizontal: wp(5),
        paddingTop: hp(1.5),
        alignItems: 'center',
    },
    closedText: {
        color: '#999',
        fontSize: getFontSize(12),
        textAlign: 'center',
    },
    // Cancel ticket button
    cancelTicketBtn: {
        backgroundColor: '#FEE2E2',
        borderRadius: 8,
        paddingHorizontal: wp(2.5),
        paddingVertical: hp(0.8),
        marginBottom: hp(0.3),
    },
    cancelTicketBtnText: {
        color: '#DC2626',
        fontWeight: '700',
        fontSize: getFontSize(11),
    },
    // Cancel modal
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: wp(6),
        alignItems: 'center',
        marginHorizontal: wp(8),
        width: wp(84),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    cancelIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(1.5),
    },
    cancelTitle: {
        color: '#111',
        fontWeight: '800',
        fontSize: getFontSize(18),
        marginBottom: hp(0.8),
    },
    cancelText: {
        color: '#555',
        fontSize: getFontSize(13),
        textAlign: 'center',
        lineHeight: getFontSize(20),
        marginBottom: hp(2.5),
    },
    cancelBtnsRow: {
        flexDirection: 'row',
        gap: wp(3),
        width: '100%',
    },
    cancelKeepBtn: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#E8E8EF',
        borderRadius: 12,
        paddingVertical: hp(1.3),
        alignItems: 'center',
    },
    cancelKeepText: {
        color: '#555',
        fontWeight: '600',
        fontSize: getFontSize(13),
    },
    cancelConfirmBtn: {
        flex: 1,
        backgroundColor: '#DC2626',
        borderRadius: 12,
        paddingVertical: hp(1.3),
        alignItems: 'center',
    },
    cancelConfirmText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: getFontSize(13),
    },
});
