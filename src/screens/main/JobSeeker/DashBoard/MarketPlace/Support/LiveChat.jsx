import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
} from "react-native";
import AppHeader from "@/core/AppHeader";
import VectorIcons, { iconLibName } from "@/theme/vectorIcon";
import { colors, hp, wp, getFontSize } from "@/theme";

// Dummy initial messages
const initialMessages = [
  {
    id: "1",
    text: "Hello! Welcome to SquadGoo Marketplace Support. How can I help you today?",
    sender: "agent",
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
];

// Quick reply suggestions
const quickReplies = [
  "I have an issue with my order",
  "I need help with payment",
  "How do I track my delivery?",
  "I want to report a seller",
  "Other question",
];

const LiveChat = ({ navigation }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const flatListRef = useRef(null);
  const typingAnim = useRef(new Animated.Value(0)).current;

  // Typing animation
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnim.setValue(0);
    }
  }, [isTyping]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      text: text.trim(),
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setShowQuickReplies(false);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate agent typing
    setIsTyping(true);

    // Simulate agent response after delay
    setTimeout(() => {
      setIsTyping(false);
      const agentResponse = getAgentResponse(text);
      setMessages((prev) => [...prev, agentResponse]);
      
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2000 + Math.random() * 1000);
  };

  const getAgentResponse = (userText) => {
    const lowerText = userText.toLowerCase();
    let responseText = "";

    if (lowerText.includes("order") || lowerText.includes("delivery")) {
      responseText =
        "I understand you have a concern about your order. Could you please provide your order ID so I can look into this for you?";
    } else if (lowerText.includes("payment") || lowerText.includes("refund")) {
      responseText =
        "I can help you with payment-related issues. Please describe the problem you're experiencing, and share any relevant transaction details.";
    } else if (lowerText.includes("seller") || lowerText.includes("report")) {
      responseText =
        "I'm sorry to hear you're having issues with a seller. To file a report, please go to Support > Dispute Resolution, or describe the issue here and I'll guide you through the process.";
    } else if (lowerText.includes("track")) {
      responseText =
        "You can track your order by going to My Orders > Select the order > View tracking details. If the seller hasn't provided tracking info, you can message them directly or let me know the order ID.";
    } else {
      responseText =
        "Thank you for reaching out. I'm here to help! Could you please provide more details about your issue so I can assist you better?";
    }

    return {
      id: `msg-${Date.now()}`,
      text: responseText,
      sender: "agent",
      timestamp: new Date().toISOString(),
    };
  };

  const handleQuickReply = (reply) => {
    sendMessage(reply);
  };

  const renderMessage = ({ item, index }) => {
    const isUser = item.sender === "user";
    const showAvatar =
      index === 0 ||
      messages[index - 1]?.sender !== item.sender;

    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.messageRowUser : styles.messageRowAgent,
        ]}
      >
        {!isUser && showAvatar && (
          <View style={styles.agentAvatar}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="headset"
              size={20}
              color={colors.white}
            />
          </View>
        )}
        {!isUser && !showAvatar && <View style={styles.avatarPlaceholder} />}
        
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.messageBubbleUser : styles.messageBubbleAgent,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser && styles.messageTextUser,
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isUser && styles.messageTimeUser,
            ]}
          >
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={styles.typingContainer}>
        <View style={styles.agentAvatar}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="headset"
            size={20}
            color={colors.white}
          />
        </View>
        <View style={styles.typingBubble}>
          <Animated.View
            style={[
              styles.typingDot,
              {
                opacity: typingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.typingDot,
              {
                opacity: typingAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 1, 0.3],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.typingDot,
              {
                opacity: typingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.3],
                }),
              },
            ]}
          />
        </View>
      </View>
    );
  };

  const renderQuickReplies = () => {
    if (!showQuickReplies || messages.length > 2) return null;

    return (
      <View style={styles.quickRepliesContainer}>
        <Text style={styles.quickRepliesTitle}>Quick replies:</Text>
        <View style={styles.quickRepliesWrapper}>
          {quickReplies.map((reply, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickReplyButton}
              onPress={() => handleQuickReply(reply)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickReplyText}>{reply}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <>
      <AppHeader title="Live Chat" showTopIcons={false} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={hp(0)}
      >
        {/* Agent Info Banner */}
        <View style={styles.agentInfoBanner}>
          <View style={styles.agentInfoLeft}>
            <View style={styles.agentAvatarLarge}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="headset"
                size={24}
                color={colors.white}
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.agentDetails}>
              <Text style={styles.agentName}>Support Agent</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Online • Usually replies instantly</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.infoButton}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="information-circle-outline"
              size={24}
              color={colors.gray}
            />
          </TouchableOpacity>
        </View>

        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderTypingIndicator}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Quick Replies */}
        {renderQuickReplies()}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="attach"
              size={24}
              color={colors.gray}
            />
          </TouchableOpacity>
          
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={colors.gray}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={1000}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim()}
            activeOpacity={0.7}
          >
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="send"
              size={20}
              color={inputText.trim() ? colors.white : colors.gray}
            />
          </TouchableOpacity>
        </View>

        {/* Safety Notice */}
        <View style={styles.safetyNotice}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="shield-checkmark"
            size={14}
            color={colors.gray}
          />
          <Text style={styles.safetyText}>
            This chat is encrypted and monitored for your safety
          </Text>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default LiveChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  agentInfoBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: colors.grayE8 + "40",
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8,
  },
  agentInfoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  agentAvatarLarge: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: wp(3.5),
    height: wp(3.5),
    borderRadius: wp(1.75),
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: colors.white,
  },
  agentDetails: {
    marginLeft: wp(3),
    flex: 1,
  },
  agentName: {
    fontSize: getFontSize(16),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(0.3),
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  statusText: {
    fontSize: getFontSize(12),
    color: colors.gray,
  },
  infoButton: {
    padding: wp(2),
  },
  messagesList: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    paddingBottom: hp(1),
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: hp(1.5),
    maxWidth: "85%",
  },
  messageRowUser: {
    alignSelf: "flex-end",
    justifyContent: "flex-end",
  },
  messageRowAgent: {
    alignSelf: "flex-start",
  },
  agentAvatar: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(2),
  },
  avatarPlaceholder: {
    width: wp(8),
    marginRight: wp(2),
  },
  messageBubble: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    borderRadius: 18,
    maxWidth: "100%",
  },
  messageBubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  messageBubbleAgent: {
    backgroundColor: colors.grayE8,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: getFontSize(15),
    color: colors.black,
    lineHeight: 22,
  },
  messageTextUser: {
    color: colors.white,
  },
  messageTime: {
    fontSize: getFontSize(10),
    color: colors.gray,
    marginTop: hp(0.5),
    alignSelf: "flex-end",
  },
  messageTimeUser: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
  },
  typingBubble: {
    flexDirection: "row",
    backgroundColor: colors.grayE8,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    gap: wp(1),
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray,
  },
  quickRepliesContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(1),
  },
  quickRepliesTitle: {
    fontSize: getFontSize(12),
    color: colors.gray,
    marginBottom: hp(1),
  },
  quickRepliesWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(2),
  },
  quickReplyButton: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  quickReplyText: {
    fontSize: getFontSize(13),
    color: colors.primary,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderTopWidth: 1,
    borderTopColor: colors.grayE8,
    backgroundColor: colors.white,
    gap: wp(2),
  },
  attachButton: {
    padding: wp(2),
    marginBottom: hp(0.5),
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.grayE8 + "50",
    borderRadius: 24,
    paddingHorizontal: wp(4),
    paddingVertical: Platform.OS === "ios" ? hp(1) : 0,
    maxHeight: hp(15),
  },
  textInput: {
    fontSize: getFontSize(15),
    color: colors.black,
    maxHeight: hp(12),
    paddingVertical: Platform.OS === "android" ? hp(1) : 0,
  },
  sendButton: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(0.5),
  },
  sendButtonDisabled: {
    backgroundColor: colors.grayE8,
  },
  safetyNotice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    backgroundColor: colors.grayE8 + "30",
    gap: wp(1.5),
  },
  safetyText: {
    fontSize: getFontSize(11),
    color: colors.gray,
  },
});

