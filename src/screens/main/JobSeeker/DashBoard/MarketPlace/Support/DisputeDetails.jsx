import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppHeader from "@/core/AppHeader";
import AppButton from "@/core/AppButton";
import VectorIcons, { iconLibName } from "@/theme/vectorIcon";
import { colors, hp, wp, getFontSize } from "@/theme";
import { updateDisputeStatus, addDisputeMessage } from "@/store/marketplaceSlice";
import { formatPrice, formatOrderDate } from "@/utilities/marketplaceHelpers";

const DisputeDetails = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  const { dispute: initialDispute } = route.params || {};
  
  // Get fresh dispute data from Redux
  const disputes = useSelector((state) => state.marketplace?.disputes || []);
  const dispute = disputes.find((d) => d.id === initialDispute?.id) || initialDispute;

  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState("details"); // details, chat, evidence

  if (!dispute) {
    return (
      <>
        <AppHeader title="Dispute Details" showTopIcons={false} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Dispute not found</Text>
          <AppButton text="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </>
    );
  }

  const statusColors = {
    pending: colors.orange,
    in_progress: colors.primary,
    resolved: colors.green,
    closed: colors.gray,
  };
  const statusColor = statusColors[dispute.status] || colors.gray;

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const message = {
      id: `MSG-${Date.now()}`,
      text: messageText.trim(),
      sender: "user",
      senderName: "You",
      timestamp: new Date().toISOString(),
    };

    dispatch(
      addDisputeMessage({
        disputeId: dispute.id,
        message,
      })
    );

    setMessageText("");
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleAppeal = () => {
    if (dispute.appeals >= dispute.maxAppeals) {
      Alert.alert(
        "Maximum Appeals Reached",
        "You have used all your appeal chances. The decision is now final."
      );
      return;
    }

    Alert.alert(
      "Re-Appeal Dispute",
      `You have ${dispute.maxAppeals - dispute.appeals} appeal(s) remaining. Re-appeals without new evidence will be automatically closed.\n\nDo you want to proceed?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Proceed",
          onPress: () => {
            // Navigate back to edit or add new evidence
            Alert.alert(
              "Appeal Submitted",
              "Please add new evidence or information in the chat to support your appeal."
            );
          },
        },
      ]
    );
  };

  const renderDetailsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Status Card */}
      <View style={styles.statusCard}>
        <View
          style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}
        >
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName={
              dispute.status === "resolved"
                ? "checkmark-circle"
                : dispute.status === "closed"
                ? "close-circle"
                : "time"
            }
            size={24}
            color={statusColor}
          />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {dispute.status.replace("_", " ").toUpperCase()}
          </Text>
        </View>
        <Text style={styles.disputeId}>{dispute.id}</Text>
        <Text style={styles.disputeDate}>
          Submitted on {formatOrderDate(dispute.createdAt, true)}
        </Text>
      </View>

      {/* Held Coins Info */}
      {dispute.heldCoins > 0 && dispute.status !== "resolved" && (
        <View style={styles.heldCoinsCard}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="lock-closed"
            size={20}
            color={colors.orange}
          />
          <View style={styles.heldCoinsInfo}>
            <Text style={styles.heldCoinsAmount}>
              {formatPrice(dispute.heldCoins)} on Hold
            </Text>
            <Text style={styles.heldCoinsText}>
              Funds will be released after the dispute is resolved
            </Text>
          </View>
        </View>
      )}

      {/* Order Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order ID:</Text>
            <Text style={styles.infoValue}>{dispute.orderId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order Total:</Text>
            <Text style={styles.infoValueBold}>
              {formatPrice(dispute.orderDetails?.total)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Items:</Text>
            <Text style={styles.infoValue}>
              {dispute.orderDetails?.items?.length || 0} items
            </Text>
          </View>
        </View>
      </View>

      {/* Complaint Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Complaint Details</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role:</Text>
            <Text style={styles.infoValue}>
              {dispute.complainantType === "buyer" ? "Buyer" : "Seller"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Reason:</Text>
            <Text style={styles.infoValue}>{dispute.reasonLabel}</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>{dispute.description}</Text>
        </View>
      </View>

      {/* Appeal Button */}
      {(dispute.status === "resolved" || dispute.status === "closed") &&
        dispute.appeals < dispute.maxAppeals && (
          <View style={styles.appealSection}>
            <AppButton
              text={`Re-Appeal (${dispute.maxAppeals - dispute.appeals} remaining)`}
              onPress={handleAppeal}
              style={styles.appealButton}
            />
            <Text style={styles.appealNote}>
              You can only re-appeal with new evidence
            </Text>
          </View>
        )}
    </ScrollView>
  );

  const renderChatTab = () => (
    <KeyboardAvoidingView
      style={styles.chatContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={hp(12)}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {/* System Message */}
        <View style={styles.systemMessage}>
          <Text style={styles.systemMessageText}>
            This is a group chat between you, the other party, and our mediator.
            Please be respectful and provide evidence to support your claims.
          </Text>
        </View>

        {dispute.messages?.length === 0 ? (
          <View style={styles.noMessagesContainer}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="chatbubbles-outline"
              size={48}
              color={colors.gray}
            />
            <Text style={styles.noMessagesText}>No messages yet</Text>
            <Text style={styles.noMessagesSubtext}>
              Start the conversation with our mediator
            </Text>
          </View>
        ) : (
          dispute.messages?.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.sender === "user"
                  ? styles.messageWrapperUser
                  : message.sender === "mediator"
                  ? styles.messageWrapperMediator
                  : styles.messageWrapperOther,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.sender === "user"
                    ? styles.messageBubbleUser
                    : message.sender === "mediator"
                    ? styles.messageBubbleMediator
                    : styles.messageBubbleOther,
                ]}
              >
                <Text style={styles.messageSender}>{message.senderName}</Text>
                <Text
                  style={[
                    styles.messageText,
                    message.sender === "user" && styles.messageTextUser,
                  ]}
                >
                  {message.text}
                </Text>
                <Text style={styles.messageTime}>
                  {formatOrderDate(message.timestamp, true)}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !messageText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={!messageText.trim()}
        >
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="send"
            size={22}
            color={messageText.trim() ? colors.white : colors.gray}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  const renderEvidenceTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Submitted Evidence</Text>
      {dispute.evidence?.length > 0 ? (
        <View style={styles.evidenceGrid}>
          {dispute.evidence.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.evidenceItem}
              onPress={() => {
                // TODO: Open full screen image viewer
              }}
            >
              <Image source={{ uri: item.uri }} style={styles.evidenceImage} />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.noEvidenceContainer}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="images-outline"
            size={48}
            color={colors.gray}
          />
          <Text style={styles.noEvidenceText}>No evidence uploaded</Text>
        </View>
      )}
    </ScrollView>
  );

  return (
    <>
      <AppHeader title="Dispute Details" showTopIcons={false} />
      <View style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "details" && styles.tabActive]}
            onPress={() => setActiveTab("details")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "details" && styles.tabTextActive,
              ]}
            >
              Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "chat" && styles.tabActive]}
            onPress={() => setActiveTab("chat")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "chat" && styles.tabTextActive,
              ]}
            >
              Chat
            </Text>
            {dispute.messages?.length > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{dispute.messages.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "evidence" && styles.tabActive]}
            onPress={() => setActiveTab("evidence")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "evidence" && styles.tabTextActive,
              ]}
            >
              Evidence
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === "details" && renderDetailsTab()}
        {activeTab === "chat" && renderChatTab()}
        {activeTab === "evidence" && renderEvidenceTab()}
      </View>
    </>
  );
};

export default DisputeDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp(8),
  },
  errorText: {
    fontSize: getFontSize(16),
    color: colors.gray,
    marginBottom: hp(2),
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(1.5),
    gap: wp(1),
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: getFontSize(14),
    fontWeight: "500",
    color: colors.gray,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  tabBadge: {
    backgroundColor: colors.red,
    borderRadius: 10,
    paddingHorizontal: wp(1.5),
    paddingVertical: hp(0.1),
    minWidth: wp(4),
    alignItems: "center",
  },
  tabBadgeText: {
    color: colors.white,
    fontSize: getFontSize(10),
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
    padding: wp(4),
  },
  statusCard: {
    alignItems: "center",
    padding: wp(4),
    backgroundColor: colors.grayE8 + "30",
    borderRadius: 12,
    marginBottom: hp(2),
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: 20,
    marginBottom: hp(1),
    gap: wp(2),
  },
  statusText: {
    fontSize: getFontSize(14),
    fontWeight: "700",
  },
  disputeId: {
    fontSize: getFontSize(16),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(0.3),
  },
  disputeDate: {
    fontSize: getFontSize(12),
    color: colors.gray,
  },
  heldCoinsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    padding: wp(3),
    borderRadius: 10,
    marginBottom: hp(2),
    gap: wp(3),
  },
  heldCoinsInfo: {
    flex: 1,
  },
  heldCoinsAmount: {
    fontSize: getFontSize(15),
    fontWeight: "600",
    color: "#92400E",
  },
  heldCoinsText: {
    fontSize: getFontSize(12),
    color: "#92400E",
  },
  section: {
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: getFontSize(16),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(1),
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: wp(3),
    borderWidth: 1,
    borderColor: colors.grayE8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(0.8),
  },
  infoLabel: {
    fontSize: getFontSize(14),
    color: colors.gray,
  },
  infoValue: {
    fontSize: getFontSize(14),
    color: colors.black,
  },
  infoValueBold: {
    fontSize: getFontSize(14),
    fontWeight: "bold",
    color: colors.primary,
  },
  descriptionCard: {
    backgroundColor: colors.grayE8 + "30",
    borderRadius: 10,
    padding: wp(3),
  },
  descriptionText: {
    fontSize: getFontSize(14),
    color: colors.black,
    lineHeight: 22,
  },
  appealSection: {
    marginTop: hp(2),
    marginBottom: hp(4),
  },
  appealButton: {
    backgroundColor: colors.orange,
  },
  appealNote: {
    fontSize: getFontSize(12),
    color: colors.gray,
    textAlign: "center",
    marginTop: hp(1),
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: wp(4),
    paddingBottom: hp(2),
  },
  systemMessage: {
    backgroundColor: colors.grayE8 + "50",
    padding: wp(3),
    borderRadius: 10,
    marginBottom: hp(2),
  },
  systemMessageText: {
    fontSize: getFontSize(12),
    color: colors.gray,
    textAlign: "center",
    fontStyle: "italic",
  },
  noMessagesContainer: {
    alignItems: "center",
    paddingVertical: hp(6),
  },
  noMessagesText: {
    fontSize: getFontSize(16),
    fontWeight: "600",
    color: colors.black,
    marginTop: hp(1),
  },
  noMessagesSubtext: {
    fontSize: getFontSize(13),
    color: colors.gray,
  },
  messageWrapper: {
    marginBottom: hp(1.5),
  },
  messageWrapperUser: {
    alignItems: "flex-end",
  },
  messageWrapperMediator: {
    alignItems: "center",
  },
  messageWrapperOther: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: wp(3),
    borderRadius: 12,
  },
  messageBubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  messageBubbleMediator: {
    backgroundColor: "#E0E7FF",
    borderRadius: 12,
  },
  messageBubbleOther: {
    backgroundColor: colors.grayE8,
    borderBottomLeftRadius: 4,
  },
  messageSender: {
    fontSize: getFontSize(11),
    fontWeight: "600",
    color: colors.gray,
    marginBottom: hp(0.3),
  },
  messageText: {
    fontSize: getFontSize(14),
    color: colors.black,
  },
  messageTextUser: {
    color: colors.white,
  },
  messageTime: {
    fontSize: getFontSize(10),
    color: colors.gray,
    marginTop: hp(0.5),
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: wp(3),
    paddingBottom: hp(2),
    borderTopWidth: 1,
    borderTopColor: colors.grayE8,
    backgroundColor: colors.white,
    gap: wp(2),
  },
  messageInput: {
    flex: 1,
    backgroundColor: colors.grayE8 + "50",
    borderRadius: 20,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    fontSize: getFontSize(14),
    maxHeight: hp(12),
  },
  sendButton: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: colors.grayE8,
  },
  evidenceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(2),
    marginTop: hp(1),
  },
  evidenceItem: {
    width: wp(28),
    height: wp(28),
    borderRadius: 8,
  },
  evidenceImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "cover",
  },
  noEvidenceContainer: {
    alignItems: "center",
    paddingVertical: hp(6),
  },
  noEvidenceText: {
    fontSize: getFontSize(16),
    fontWeight: "600",
    color: colors.gray,
    marginTop: hp(1),
  },
});

