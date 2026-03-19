import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    Modal,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import AppText, { Variant } from '@/core/AppText';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    QUICK_ACTIONS,
    MORE_TOPICS,
    AUTO_REPLIES,
    WELCOME_MESSAGE,
    AGENT_ESCALATION_MESSAGE,
    RATING_CONFIRMATION,
    QUICK_REPLY_SUGGESTIONS,
} from './liveChatData';

const AGENT_AVATAR =
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop&crop=faces';

const LiveChat = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const flatListRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [showMoreTopics, setShowMoreTopics] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(true);
    const [showFollowUp, setShowFollowUp] = useState(false);
    const [showRating, setShowRating] = useState(false);
    const [rating, setRating] = useState(0);
    const [ratingFeedback, setRatingFeedback] = useState('');
    const [isAgentTyping, setIsAgentTyping] = useState(false);
    const [chatEnded, setChatEnded] = useState(false);
    const [currentTopicLabel, setCurrentTopicLabel] = useState('');

    // Initialize with welcome message
    useEffect(() => {
        addBotMessage(WELCOME_MESSAGE);
    }, []);

    const resetChat = () => {
        setMessages([]);
        setInputText('');
        setShowMoreTopics(false);
        setShowQuickActions(true);
        setShowFollowUp(false);
        setShowRating(false);
        setRating(0);
        setRatingFeedback('');
        setIsAgentTyping(false);
        setChatEnded(false);
        setCurrentTopicLabel('');
        // Re-add welcome message
        setTimeout(() => {
            addBotMessage(WELCOME_MESSAGE);
        }, 200);
    };

    const scrollToEnd = () => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const addBotMessage = (text, extras = {}) => {
        const msg = {
            id: Date.now().toString() + Math.random(),
            text,
            sender: 'bot',
            timestamp: new Date(),
            ...extras,
        };
        setMessages(prev => [...prev, msg]);
        scrollToEnd();
    };

    const addUserMessage = (text) => {
        const msg = {
            id: Date.now().toString() + Math.random(),
            text,
            sender: 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, msg]);
        scrollToEnd();
    };

    const handleQuickAction = (action) => {
        if (action.id === 'other') {
            setShowMoreTopics(true);
            return;
        }
        processTopicSelection(action.id, action.label);
    };

    const handleMoreTopic = (topic) => {
        setShowMoreTopics(false);
        processTopicSelection(topic.id, topic.label);
    };

    const processTopicSelection = (topicId, topicLabel) => {
        setShowQuickActions(false);
        setCurrentTopicLabel(topicLabel);
        addUserMessage(topicLabel);

        // Simulate typing delay
        setIsAgentTyping(true);
        setTimeout(() => {
            setIsAgentTyping(false);
            const reply = AUTO_REPLIES[topicId] || AUTO_REPLIES.something_else;
            addBotMessage(`Here's some info that might help:\n\n${reply}`);
            setShowFollowUp(true);
            scrollToEnd();
        }, 1200);
    };

    const handleFollowUp = (solved) => {
        setShowFollowUp(false);
        if (solved) {
            addUserMessage('Yes, solved ✓');
            setTimeout(() => {
                addBotMessage('Glad we could help! Please rate your chat experience.');
                setShowRating(true);
                scrollToEnd();
            }, 600);
        } else {
            addUserMessage('No, I need more help');
            setIsAgentTyping(true);
            setTimeout(() => {
                setIsAgentTyping(false);
                addBotMessage(AGENT_ESCALATION_MESSAGE);
                setTimeout(() => {
                    addBotMessage(
                        `Hi, I see you need help with ${currentTopicLabel || 'your issue'}. How can I assist you further?`,
                        { isAgent: true }
                    );
                    scrollToEnd();
                }, 1500);
            }, 1000);
        }
    };

    const handleSendMessage = () => {
        if (!inputText.trim()) return;
        const text = inputText.trim();
        setInputText('');
        addUserMessage(text);
        setShowQuickActions(false);

        // Simulate agent response
        setIsAgentTyping(true);
        setTimeout(() => {
            setIsAgentTyping(false);
            addBotMessage(
                "Thank you for your message. Our support specialist is reviewing your query and will respond shortly.",
                { isAgent: true }
            );
            scrollToEnd();
        }, 1500);
    };

    const handleQuickReply = (reply) => {
        addUserMessage(reply);
        if (reply === 'Yes, that helped') {
            setTimeout(() => {
                addBotMessage('Glad we could help! Please rate your chat experience.');
                setShowRating(true);
                scrollToEnd();
            }, 600);
        } else if (reply === 'Connect me to a specialist') {
            setIsAgentTyping(true);
            setTimeout(() => {
                setIsAgentTyping(false);
                addBotMessage(AGENT_ESCALATION_MESSAGE);
                scrollToEnd();
            }, 1000);
        } else {
            setIsAgentTyping(true);
            setTimeout(() => {
                setIsAgentTyping(false);
                addBotMessage(
                    "Of course! Please share more details about your issue and I'll help you further.",
                    { isAgent: true }
                );
                scrollToEnd();
            }, 1000);
        }
    };

    const handleSubmitRating = () => {
        setShowRating(false);
        setChatEnded(true);
        addBotMessage(RATING_CONFIRMATION);
        scrollToEnd();
    };

    const formatTime = (date) => {
        const d = new Date(date);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // ─── Render functions ───

    const renderMessage = ({ item }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowBot]}>
                {!isUser && (
                    <Image source={{ uri: AGENT_AVATAR }} style={styles.msgAvatar} />
                )}
                <View style={[styles.msgBubble, isUser ? styles.msgBubbleUser : styles.msgBubbleBot]}>
                    {item.isAgent && (
                        <AppText variant={Variant.caption} style={styles.agentLabel}>Support Specialist</AppText>
                    )}
                    <AppText variant={Variant.body} style={[styles.msgText, isUser && styles.msgTextUser]}>
                        {item.text}
                    </AppText>
                    <AppText variant={Variant.caption} style={[styles.msgTime, isUser && styles.msgTimeUser]}>
                        {formatTime(item.timestamp)}
                    </AppText>
                </View>
            </View>
        );
    };

    const renderFooter = () => (
        <View>
            {/* Typing indicator */}
            {isAgentTyping && (
                <View style={[styles.msgRow, styles.msgRowBot]}>
                    <Image source={{ uri: AGENT_AVATAR }} style={styles.msgAvatar} />
                    <View style={[styles.msgBubble, styles.msgBubbleBot, styles.typingBubble]}>
                        <AppText variant={Variant.caption} style={styles.typingText}>typing...</AppText>
                    </View>
                </View>
            )}

            {/* Follow-up buttons */}
            {showFollowUp && (
                <View style={styles.followUpRow}>
                    <TouchableOpacity
                        style={[styles.followUpBtn, styles.followUpBtnSolved]}
                        onPress={() => handleFollowUp(true)}
                        activeOpacity={0.8}
                    >
                        <VectorIcons name={iconLibName.Ionicons} iconName="checkmark-circle" size={16} color="#2E7D32" />
                        <AppText variant={Variant.caption} style={styles.followUpSolvedText}>Yes, Solved</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.followUpBtn, styles.followUpBtnMore]}
                        onPress={() => handleFollowUp(false)}
                        activeOpacity={0.8}
                    >
                        <VectorIcons name={iconLibName.Ionicons} iconName="help-circle" size={16} color="#DC3545" />
                        <AppText variant={Variant.caption} style={styles.followUpMoreText}>No, Need More Help</AppText>
                    </TouchableOpacity>
                </View>
            )}

            {/* Quick reply suggestions */}
            {messages.length > 3 && !showFollowUp && !showRating && !showQuickActions && !chatEnded && (
                <View style={styles.quickReplyRow}>
                    {QUICK_REPLY_SUGGESTIONS.map((reply, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={styles.quickReplyBtn}
                            activeOpacity={0.7}
                            onPress={() => handleQuickReply(reply)}
                        >
                            <AppText variant={Variant.caption} style={styles.quickReplyText}>{reply}</AppText>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
        >
            {/* ═══════ Chat Top Bar ═══════ */}
            <View style={styles.chatTopBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <VectorIcons name={iconLibName.Ionicons} iconName="arrow-back" size={22} color="#333" />
                </TouchableOpacity>
                <Image source={{ uri: AGENT_AVATAR }} style={styles.agentAvatar} />
                <View style={{ flex: 1 }}>
                    <AppText variant={Variant.bodyMedium} style={styles.agentName}>SquadGoo Support</AppText>
                    <View style={styles.agentStatusRow}>
                        <View style={styles.onlineDot} />
                        <AppText variant={Variant.caption} style={styles.agentStatus}>Active now</AppText>
                    </View>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.headerActionBtn}
                        onPress={() => navigation.navigate('request_callback')}
                    >
                        <VectorIcons name={iconLibName.Ionicons} iconName="call-outline" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerActionBtn}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={20} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* ═══════ Chat Messages ═══════ */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.chatList}
                ListFooterComponent={renderFooter}
                onContentSizeChange={() => scrollToEnd()}
                ListHeaderComponent={
                    showQuickActions ? (
                        <View style={styles.quickActionsSection}>
                            <AppText variant={Variant.caption} style={styles.quickActionsLabel}>
                                How can we assist you today?
                            </AppText>
                            <View style={styles.quickActionsWrap}>
                                {QUICK_ACTIONS.map((action) => (
                                    <TouchableOpacity
                                        key={action.id}
                                        style={styles.quickActionChip}
                                        activeOpacity={0.7}
                                        onPress={() => handleQuickAction(action)}
                                    >
                                        <AppText variant={Variant.caption} style={styles.quickActionText}>
                                            {action.label}
                                        </AppText>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ) : null
                }
            />

            {/* ═══════ Rating UI ═══════ */}
            {showRating && (
                <View style={styles.ratingCard}>
                    <AppText variant={Variant.bodyMedium} style={styles.ratingTitle}>
                        How would you rate your support experience?
                    </AppText>
                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
                                <VectorIcons
                                    name={iconLibName.Ionicons}
                                    iconName={star <= rating ? 'star' : 'star-outline'}
                                    size={32}
                                    color={star <= rating ? '#F59E0B' : '#D1D5DB'}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TextInput
                        style={styles.ratingInput}
                        placeholder="Optional feedback..."
                        placeholderTextColor="#999"
                        value={ratingFeedback}
                        onChangeText={setRatingFeedback}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.ratingSubmitBtn, !rating && styles.ratingSubmitDisabled]}
                        activeOpacity={0.8}
                        onPress={handleSubmitRating}
                        disabled={!rating}
                    >
                        <AppText variant={Variant.bodyMedium} style={styles.ratingSubmitText}>Submit Rating</AppText>
                    </TouchableOpacity>
                </View>
            )}

            {/* ═══════ Input Bar ═══════ */}
            {!chatEnded && (
                <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, hp(1)) }]}>
                    <TouchableOpacity style={styles.attachBtn}>
                        <VectorIcons name={iconLibName.Ionicons} iconName="attach-outline" size={22} color={colors.gray} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message..."
                        placeholderTextColor="#999"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
                        onPress={handleSendMessage}
                        disabled={!inputText.trim()}
                        activeOpacity={0.8}
                    >
                        <VectorIcons
                            name={iconLibName.Ionicons}
                            iconName="send"
                            size={18}
                            color={inputText.trim() ? colors.white : '#999'}
                        />
                    </TouchableOpacity>
                </View>
            )}

            {/* ═══════ Start New Chat (when ended) ═══════ */}
            {chatEnded && (
                <View style={[styles.newChatBar, { paddingBottom: Math.max(insets.bottom, hp(1)) }]}>
                    <TouchableOpacity
                        style={styles.newChatBtn}
                        activeOpacity={0.8}
                        onPress={resetChat}
                    >
                        <VectorIcons name={iconLibName.Ionicons} iconName="chatbubble-ellipses-outline" size={18} color={colors.white} />
                        <AppText variant={Variant.bodyMedium} style={styles.newChatBtnText}>Start New Chat</AppText>
                    </TouchableOpacity>
                </View>
            )}

            {/* ═══════ "More Support Topics" Modal ═══════ */}
            <Modal
                visible={showMoreTopics}
                transparent
                animationType="slide"
                onRequestClose={() => setShowMoreTopics(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.modalBackdrop}
                    onPress={() => setShowMoreTopics(false)}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.moreSheet}>
                        <View style={styles.sheetHandle} />
                        <AppText variant={Variant.h6} style={styles.moreTitle}>More Support Topics</AppText>
                        {MORE_TOPICS.map((topic) => (
                            <TouchableOpacity
                                key={topic.id}
                                style={styles.moreTopicRow}
                                activeOpacity={0.7}
                                onPress={() => handleMoreTopic(topic)}
                            >
                                <VectorIcons name={iconLibName.Ionicons} iconName={topic.icon} size={20} color={colors.primary} />
                                <AppText variant={Variant.body} style={styles.moreTopicText}>{topic.label}</AppText>
                                <VectorIcons name={iconLibName.Ionicons} iconName="chevron-forward" size={16} color={colors.gray} />
                            </TouchableOpacity>
                        ))}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </KeyboardAvoidingView>
    );
};

export default LiveChat;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F8F7FC',
    },
    // Chat top bar
    chatTopBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
        paddingTop: hp(6),
        paddingBottom: hp(1.2),
        paddingHorizontal: wp(4),
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    backBtn: {
        padding: wp(1),
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
    },
    headerActionBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#F3F0FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    agentAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    agentName: {
        color: '#111',
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    agentStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#22C55E',
    },
    agentStatus: {
        color: '#22C55E',
        fontSize: getFontSize(11),
        fontWeight: '500',
    },
    // Chat
    chatList: {
        paddingHorizontal: wp(4),
        paddingBottom: hp(2),
        paddingTop: hp(1),
    },
    msgRow: {
        flexDirection: 'row',
        marginBottom: hp(1.2),
        alignItems: 'flex-end',
    },
    msgRowUser: {
        justifyContent: 'flex-end',
    },
    msgRowBot: {
        justifyContent: 'flex-start',
    },
    msgAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: wp(2),
    },
    msgBubble: {
        maxWidth: '78%',
        borderRadius: 16,
        paddingHorizontal: wp(3.5),
        paddingVertical: hp(1),
    },
    msgBubbleBot: {
        backgroundColor: colors.white,
        borderBottomLeftRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    msgBubbleUser: {
        backgroundColor: colors.primary,
        borderBottomRightRadius: 4,
    },
    agentLabel: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: getFontSize(10),
        marginBottom: hp(0.3),
    },
    msgText: {
        color: '#333',
        fontSize: getFontSize(13),
        lineHeight: getFontSize(19),
    },
    msgTextUser: {
        color: colors.white,
    },
    msgTime: {
        color: '#AAA',
        fontSize: getFontSize(9),
        marginTop: hp(0.3),
        alignSelf: 'flex-end',
    },
    msgTimeUser: {
        color: 'rgba(255,255,255,0.7)',
    },
    // Typing
    typingBubble: {
        paddingVertical: hp(0.8),
    },
    typingText: {
        color: colors.gray,
        fontStyle: 'italic',
        fontSize: getFontSize(12),
    },
    // Quick actions
    quickActionsSection: {
        marginBottom: hp(1),
    },
    quickActionsLabel: {
        color: colors.gray,
        fontWeight: '600',
        fontSize: getFontSize(12),
        marginBottom: hp(1),
        textAlign: 'center',
    },
    quickActionsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: wp(2),
        justifyContent: 'center',
    },
    quickActionChip: {
        backgroundColor: colors.white,
        borderWidth: 1.5,
        borderColor: '#E0D4F5',
        borderRadius: 20,
        paddingHorizontal: wp(4),
        paddingVertical: hp(0.9),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    quickActionText: {
        color: '#333',
        fontWeight: '600',
        fontSize: getFontSize(12),
    },
    // Follow-up
    followUpRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: wp(3),
        marginTop: hp(1),
        marginBottom: hp(1),
    },
    followUpBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1.5),
        borderRadius: 12,
        paddingHorizontal: wp(4),
        paddingVertical: hp(1),
        borderWidth: 1.5,
    },
    followUpBtnSolved: {
        backgroundColor: '#F0FDF4',
        borderColor: '#86EFAC',
    },
    followUpSolvedText: {
        color: '#166534',
        fontWeight: '700',
        fontSize: getFontSize(12),
    },
    followUpBtnMore: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FECACA',
    },
    followUpMoreText: {
        color: '#DC3545',
        fontWeight: '700',
        fontSize: getFontSize(12),
    },
    // Quick replies
    quickReplyRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: wp(2),
        marginTop: hp(0.5),
        justifyContent: 'center',
    },
    quickReplyBtn: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: '#E0D4F5',
        borderRadius: 16,
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.6),
    },
    quickReplyText: {
        color: colors.primary,
        fontWeight: '500',
        fontSize: getFontSize(11),
    },
    // Rating
    ratingCard: {
        backgroundColor: colors.white,
        marginHorizontal: wp(4),
        marginBottom: hp(1),
        borderRadius: 16,
        padding: wp(4),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    ratingTitle: {
        color: '#111',
        fontWeight: '700',
        fontSize: getFontSize(14),
        textAlign: 'center',
        marginBottom: hp(1.2),
    },
    starsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: wp(3),
        marginBottom: hp(1.5),
    },
    ratingInput: {
        borderWidth: 1,
        borderColor: '#E8E8EF',
        borderRadius: 10,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: wp(3),
        paddingVertical: hp(1),
        fontSize: getFontSize(13),
        color: '#333',
        minHeight: hp(6),
        marginBottom: hp(1),
        textAlignVertical: 'top',
    },
    ratingSubmitBtn: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: hp(1.2),
        alignItems: 'center',
    },
    ratingSubmitDisabled: {
        backgroundColor: '#D1C4E9',
    },
    ratingSubmitText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    // New chat bar
    newChatBar: {
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingHorizontal: wp(4),
        paddingTop: hp(1),
    },
    newChatBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(2),
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: hp(1.4),
    },
    newChatBtnText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: getFontSize(14),
    },
    // Input bar
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: wp(3),
        paddingVertical: hp(1),
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        gap: wp(2),
    },
    attachBtn: {
        paddingVertical: hp(0.8),
    },
    input: {
        flex: 1,
        fontSize: getFontSize(14),
        color: '#333',
        maxHeight: hp(10),
        paddingVertical: hp(0.8),
    },
    sendBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnDisabled: {
        backgroundColor: '#E8E8EF',
    },
    // Modal
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    moreSheet: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: wp(4),
        paddingTop: hp(1.2),
        paddingBottom: hp(4),
        maxHeight: '65%',
    },
    sheetHandle: {
        alignSelf: 'center',
        width: wp(12),
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E0E0E0',
        marginBottom: hp(1.5),
    },
    moreTitle: {
        fontWeight: '800',
        fontSize: getFontSize(17),
        color: '#111',
        marginBottom: hp(1.5),
    },
    moreTopicRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
        paddingVertical: hp(1.5),
        borderBottomWidth: 0.5,
        borderBottomColor: '#F3F3F3',
    },
    moreTopicText: {
        flex: 1,
        color: '#333',
        fontWeight: '500',
        fontSize: getFontSize(14),
    },
});
