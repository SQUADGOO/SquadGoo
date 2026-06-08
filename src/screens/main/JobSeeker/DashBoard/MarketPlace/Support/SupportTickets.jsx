import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import AppHeader from "@/core/AppHeader";
import AppButton from "@/core/AppButton";
import VectorIcons, { iconLibName } from "@/theme/vectorIcon";
import { colors, hp, wp, getFontSize } from "@/theme";

// Dummy tickets data
const dummyTickets = [
  {
    id: "TKT-2024-001",
    subject: "Order not delivered",
    description: "I placed an order 5 days ago but haven't received it yet. The seller marked it as shipped but there's no tracking update.",
    status: "open",
    priority: "high",
    category: "delivery",
    createdAt: "2024-12-05T10:30:00Z",
    updatedAt: "2024-12-06T14:20:00Z",
    messages: [
      {
        id: "msg1",
        text: "I placed an order 5 days ago but haven't received it yet.",
        sender: "user",
        timestamp: "2024-12-05T10:30:00Z",
      },
      {
        id: "msg2",
        text: "Hi! We're looking into this issue. Can you please provide your order number?",
        sender: "support",
        timestamp: "2024-12-05T11:45:00Z",
      },
      {
        id: "msg3",
        text: "The order number is ORD-12345",
        sender: "user",
        timestamp: "2024-12-05T12:00:00Z",
      },
    ],
  },
  {
    id: "TKT-2024-002",
    subject: "Refund not processed",
    description: "I returned an item 2 weeks ago and the seller confirmed receipt, but I still haven't received my refund.",
    status: "in_progress",
    priority: "medium",
    category: "payment",
    createdAt: "2024-12-03T09:15:00Z",
    updatedAt: "2024-12-06T16:30:00Z",
    messages: [
      {
        id: "msg1",
        text: "I returned an item 2 weeks ago but haven't received my refund.",
        sender: "user",
        timestamp: "2024-12-03T09:15:00Z",
      },
      {
        id: "msg2",
        text: "We've escalated this to our payments team. You should receive your refund within 3-5 business days.",
        sender: "support",
        timestamp: "2024-12-04T10:00:00Z",
      },
    ],
  },
  {
    id: "TKT-2024-003",
    subject: "Unable to list product",
    description: "I'm trying to list a new product but keep getting an error message saying 'Invalid category'.",
    status: "resolved",
    priority: "low",
    category: "technical",
    createdAt: "2024-12-01T14:00:00Z",
    updatedAt: "2024-12-02T09:00:00Z",
    resolution: "Issue was due to a temporary system glitch. The problem has been fixed.",
    messages: [
      {
        id: "msg1",
        text: "I'm getting an error when trying to list my product.",
        sender: "user",
        timestamp: "2024-12-01T14:00:00Z",
      },
      {
        id: "msg2",
        text: "We've identified and fixed the issue. Please try listing your product again.",
        sender: "support",
        timestamp: "2024-12-02T09:00:00Z",
      },
    ],
  },
  {
    id: "TKT-2024-004",
    subject: "Account verification pending",
    description: "I submitted my documents for verification a week ago but my account is still showing as unverified.",
    status: "closed",
    priority: "medium",
    category: "account",
    createdAt: "2024-11-28T11:00:00Z",
    updatedAt: "2024-11-30T15:00:00Z",
    resolution: "Verification completed successfully. Account is now fully verified.",
    messages: [],
  },
];

const SupportTickets = ({ navigation }) => {
  const [tickets, setTickets] = useState(dummyTickets);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketDescription, setNewTicketDescription] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const filters = [
    { label: "All", value: "all" },
    { label: "Open", value: "open" },
    { label: "In Progress", value: "in_progress" },
    { label: "Resolved", value: "resolved" },
    { label: "Closed", value: "closed" },
  ];

  const getFilteredTickets = () => {
    if (activeFilter === "all") return tickets;
    return tickets.filter((ticket) => ticket.status === activeFilter);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return colors.orange;
      case "in_progress":
        return colors.primary;
      case "resolved":
        return colors.green;
      case "closed":
        return colors.gray;
      default:
        return colors.gray;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return "alert-circle";
      case "in_progress":
        return "sync";
      case "resolved":
        return "checkmark-circle";
      case "closed":
        return "close-circle";
      default:
        return "ellipse";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return colors.red;
      case "medium":
        return colors.orange;
      case "low":
        return colors.green;
      default:
        return colors.gray;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleCreateTicket = () => {
    if (!newTicketSubject.trim()) {
      Alert.alert("Error", "Please enter a subject for your ticket");
      return;
    }
    if (!newTicketDescription.trim()) {
      Alert.alert("Error", "Please describe your issue");
      return;
    }

    const newTicket = {
      id: `TKT-${Date.now().toString(36).toUpperCase()}`,
      subject: newTicketSubject.trim(),
      description: newTicketDescription.trim(),
      status: "open",
      priority: "medium",
      category: "general",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          text: newTicketDescription.trim(),
          sender: "user",
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setTickets([newTicket, ...tickets]);
    setNewTicketSubject("");
    setNewTicketDescription("");
    setShowNewTicketModal(false);

    Alert.alert(
      "Ticket Created",
      `Your ticket ${newTicket.id} has been submitted. Our support team will respond within 24 hours.`
    );
  };

  const renderTicketItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    const statusIcon = getStatusIcon(item.status);
    const priorityColor = getPriorityColor(item.priority);

    return (
      <TouchableOpacity
        style={styles.ticketCard}
        onPress={() => setSelectedTicket(item)}
        activeOpacity={0.7}
      >
        <View style={styles.ticketHeader}>
          <View style={styles.ticketIdContainer}>
            <Text style={styles.ticketId}>{item.id}</Text>
            <View style={styles.priorityBadge}>
              <View
                style={[styles.priorityDot, { backgroundColor: priorityColor }]}
              />
              <Text style={[styles.priorityText, { color: priorityColor }]}>
                {item.priority.toUpperCase()}
              </Text>
            </View>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}
          >
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName={statusIcon}
              size={14}
              color={statusColor}
            />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status.replace("_", " ")}
            </Text>
          </View>
        </View>

        <Text style={styles.ticketSubject} numberOfLines={1}>
          {item.subject}
        </Text>
        <Text style={styles.ticketDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.ticketFooter}>
          <View style={styles.dateContainer}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="time-outline"
              size={14}
              color={colors.gray}
            />
            <Text style={styles.dateText}>
              Updated {formatDate(item.updatedAt)}
            </Text>
          </View>
          {item.messages?.length > 0 && (
            <View style={styles.messagesCount}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="chatbubbles-outline"
                size={14}
                color={colors.gray}
              />
              <Text style={styles.messagesCountText}>
                {item.messages.length}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderTicketDetails = () => {
    if (!selectedTicket) return null;

    const statusColor = getStatusColor(selectedTicket.status);

    return (
      <Modal
        visible={!!selectedTicket}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedTicket(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setSelectedTicket(null)}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedTicket(null)}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="close"
                size={24}
                color={colors.black}
              />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedTicket.id}</Text>
            <View style={{ width: 40 }} />
          </View>

          <FlatList
            ListHeaderComponent={() => (
              <>
                <View style={styles.ticketDetailsHeader}>
                  <Text style={styles.ticketDetailsSubject}>
                    {selectedTicket.subject}
                  </Text>
                  <View
                    style={[
                      styles.statusBadgeLarge,
                      { backgroundColor: statusColor + "20" },
                    ]}
                  >
                    <Text style={[styles.statusTextLarge, { color: statusColor }]}>
                      {selectedTicket.status.replace("_", " ").toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.ticketMeta}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Created:</Text>
                    <Text style={styles.metaValue}>
                      {formatDate(selectedTicket.createdAt)}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Category:</Text>
                    <Text style={styles.metaValue}>
                      {selectedTicket.category}
                    </Text>
                  </View>
                </View>

                {selectedTicket.resolution && (
                  <View style={styles.resolutionBox}>
                    <VectorIcons
                      name={iconLibName.Ionicons}
                      iconName="checkmark-circle"
                      size={20}
                      color={colors.green}
                    />
                    <Text style={styles.resolutionText}>
                      {selectedTicket.resolution}
                    </Text>
                  </View>
                )}

                <Text style={styles.conversationTitle}>Conversation</Text>
              </>
            )}
            data={selectedTicket.messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageItem,
                  item.sender === "user"
                    ? styles.messageItemUser
                    : styles.messageItemSupport,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    item.sender === "user"
                      ? styles.messageBubbleUser
                      : styles.messageBubbleSupport,
                  ]}
                >
                  <Text style={styles.messageSender}>
                    {item.sender === "user" ? "You" : "Support Team"}
                  </Text>
                  <Text
                    style={[
                      styles.messageText,
                      item.sender === "user" && styles.messageTextUser,
                    ]}
                  >
                    {item.text}
                  </Text>
                  <Text style={styles.messageTime}>
                    {formatDate(item.timestamp)}
                  </Text>
                </View>
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={styles.noMessagesContainer}>
                <Text style={styles.noMessagesText}>
                  No messages in this ticket yet
                </Text>
              </View>
            )}
            contentContainerStyle={styles.messagesListContent}
          />
          </View>
        </View>
      </Modal>
    );
  };

  const renderNewTicketModal = () => (
    <Modal
      visible={showNewTicketModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowNewTicketModal(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={() => setShowNewTicketModal(false)}
        />
        <View style={styles.modalContainer}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowNewTicketModal(false)}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="close"
                size={24}
                color={colors.black}
              />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create New Ticket</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.newTicketForm}>
            <Text style={styles.inputLabel}>Subject *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Brief summary of your issue"
              value={newTicketSubject}
              onChangeText={setNewTicketSubject}
              maxLength={100}
            />

            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Please describe your issue in detail..."
              value={newTicketDescription}
              onChangeText={setNewTicketDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={1000}
            />

            <AppButton
              text="Submit Ticket"
              onPress={handleCreateTicket}
              style={styles.submitTicketButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  const filteredTickets = getFilteredTickets();

  return (
    <>
      <AppHeader title="Support Tickets" showTopIcons={false} />
      <View style={styles.container}>
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <FlatList
            horizontal
            data={filters}
            keyExtractor={(item) => item.value}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterTab,
                  activeFilter === item.value && styles.filterTabActive,
                ]}
                onPress={() => setActiveFilter(item.value)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    activeFilter === item.value && styles.filterTabTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.filterListContent}
          />
        </View>

        {/* Tickets List */}
        {filteredTickets.length > 0 ? (
          <FlatList
            data={filteredTickets}
            renderItem={renderTicketItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="ticket-outline"
              size={60}
              color={colors.gray}
            />
            <Text style={styles.emptyText}>No tickets found</Text>
            <Text style={styles.emptySubtext}>
              {activeFilter === "all"
                ? "You haven't created any support tickets yet"
                : `No ${activeFilter.replace("_", " ")} tickets`}
            </Text>
          </View>
        )}

        {/* Create Ticket FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowNewTicketModal(true)}
          activeOpacity={0.8}
        >
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="add"
            size={28}
            color={colors.white}
          />
        </TouchableOpacity>
      </View>

      {renderTicketDetails()}
      {renderNewTicketModal()}
    </>
  );
};

export default SupportTickets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8,
  },
  filterListContent: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    gap: wp(2),
  },
  filterTab: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: 20,
    backgroundColor: colors.grayE8 + "50",
    marginRight: wp(2),
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: getFontSize(13),
    fontWeight: "500",
    color: colors.gray,
  },
  filterTabTextActive: {
    color: colors.white,
  },
  listContent: {
    padding: wp(4),
    paddingBottom: hp(10),
  },
  ticketCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: wp(4),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: colors.grayE8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: hp(1),
  },
  ticketIdContainer: {
    flex: 1,
  },
  ticketId: {
    fontSize: getFontSize(14),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(0.5),
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: getFontSize(10),
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
    borderRadius: 12,
    gap: wp(1),
  },
  statusText: {
    fontSize: getFontSize(11),
    fontWeight: "600",
    textTransform: "capitalize",
  },
  ticketSubject: {
    fontSize: getFontSize(15),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(0.5),
  },
  ticketDescription: {
    fontSize: getFontSize(13),
    color: colors.gray,
    lineHeight: 20,
    marginBottom: hp(1),
  },
  ticketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: hp(1),
    borderTopWidth: 1,
    borderTopColor: colors.grayE8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  dateText: {
    fontSize: getFontSize(12),
    color: colors.gray,
  },
  messagesCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  messagesCountText: {
    fontSize: getFontSize(12),
    color: colors.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(8),
  },
  emptyText: {
    fontSize: getFontSize(18),
    fontWeight: "600",
    color: colors.black,
    marginTop: hp(2),
    marginBottom: hp(0.5),
  },
  emptySubtext: {
    fontSize: getFontSize(14),
    color: colors.gray,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: hp(3),
    right: wp(4),
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  modalBackdrop: {
    height: "20%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    height: "80%",
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  modalHandle: {
    width: wp(10),
    height: 4,
    backgroundColor: colors.grayE8,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: hp(1),
    marginBottom: hp(0.5),
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8,
  },
  closeButton: {
    padding: wp(2),
  },
  modalTitle: {
    fontSize: getFontSize(18),
    fontWeight: "600",
    color: colors.black,
  },
  ticketDetailsHeader: {
    padding: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8,
  },
  ticketDetailsSubject: {
    fontSize: getFontSize(18),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(1),
  },
  statusBadgeLarge: {
    alignSelf: "flex-start",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: 15,
  },
  statusTextLarge: {
    fontSize: getFontSize(12),
    fontWeight: "600",
  },
  ticketMeta: {
    flexDirection: "row",
    padding: wp(4),
    gap: wp(6),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  metaLabel: {
    fontSize: getFontSize(13),
    color: colors.gray,
  },
  metaValue: {
    fontSize: getFontSize(13),
    fontWeight: "500",
    color: colors.black,
    textTransform: "capitalize",
  },
  resolutionBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.green + "15",
    margin: wp(4),
    padding: wp(3),
    borderRadius: 10,
    gap: wp(2),
  },
  resolutionText: {
    flex: 1,
    fontSize: getFontSize(13),
    color: colors.green,
    lineHeight: 20,
  },
  conversationTitle: {
    fontSize: getFontSize(16),
    fontWeight: "600",
    color: colors.black,
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(1),
  },
  messagesListContent: {
    paddingBottom: hp(4),
  },
  messageItem: {
    paddingHorizontal: wp(4),
    marginBottom: hp(1.5),
  },
  messageItemUser: {
    alignItems: "flex-end",
  },
  messageItemSupport: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "85%",
    padding: wp(3),
    borderRadius: 12,
  },
  messageBubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  messageBubbleSupport: {
    backgroundColor: colors.grayE8,
    borderBottomLeftRadius: 4,
  },
  messageSender: {
    fontSize: getFontSize(11),
    fontWeight: "600",
    marginBottom: hp(0.3),
    color: colors.gray,
  },
  messageText: {
    fontSize: getFontSize(14),
    color: colors.black,
    lineHeight: 20,
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
  noMessagesContainer: {
    alignItems: "center",
    paddingVertical: hp(4),
  },
  noMessagesText: {
    fontSize: getFontSize(14),
    color: colors.gray,
  },
  newTicketForm: {
    padding: wp(4),
  },
  inputLabel: {
    fontSize: getFontSize(15),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(1),
    marginTop: hp(2),
  },
  textInput: {
    backgroundColor: colors.grayE8 + "50",
    borderRadius: 10,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    fontSize: getFontSize(14),
    color: colors.black,
    borderWidth: 1,
    borderColor: colors.grayE8,
  },
  textArea: {
    minHeight: hp(15),
    textAlignVertical: "top",
  },
  submitTicketButton: {
    marginTop: hp(3),
  },
});

