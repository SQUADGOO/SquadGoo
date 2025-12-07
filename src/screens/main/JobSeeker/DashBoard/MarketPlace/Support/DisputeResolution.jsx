import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AppHeader from "@/core/AppHeader";
import VectorIcons, { iconLibName } from "@/theme/vectorIcon";
import { colors, hp, wp, getFontSize } from "@/theme";
import { useSelector } from "react-redux";
import { screenNames } from "@/navigation/screenNames";
import {
  getOrderStatusColor,
  formatOrderDate,
  formatPrice,
} from "@/utilities/marketplaceHelpers";

const DisputeResolution = ({ navigation }) => {
  const orders = useSelector((state) => state.marketplace?.orders || []);
  const disputes = useSelector((state) => state.marketplace?.disputes || []);
  const [activeTab, setActiveTab] = useState("create"); // 'create' or 'history'

  // Get orders that can have disputes (exclude already disputed ones)
  const disputedOrderIds = disputes.map((d) => d.orderId);
  const eligibleOrders = orders.filter(
    (order) => !disputedOrderIds.includes(order.id)
  );

  const handleSelectOrder = (order) => {
    navigation.navigate("MARKETPLACE_CREATE_DISPUTE", { order });
  };

  const handleViewDispute = (dispute) => {
    navigation.navigate("MARKETPLACE_DISPUTE_DETAILS", { dispute });
  };

  const renderOrderItem = ({ item }) => {
    const statusColor = getOrderStatusColor(item.status);
    
    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => handleSelectOrder(item)}
        activeOpacity={0.7}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.orderDate}>
              {formatOrderDate(item.createdAt)}
            </Text>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}
          >
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.orderItemsContainer}>
          <Text style={styles.itemsCount}>
            {item.items?.length || 0}{" "}
            {(item.items?.length || 0) === 1 ? "item" : "items"}
          </Text>
          {item.items?.slice(0, 2).map((orderItem, index) => (
            <Text key={index} style={styles.itemName} numberOfLines={1}>
              • {orderItem.title}
            </Text>
          ))}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.totalAmount}>{formatPrice(item.total)}</Text>
          <View style={styles.reportBtnContainer}>
            <Text style={styles.reportBtnText}>Report Issue</Text>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="chevron-forward"
              size={16}
              color={colors.red}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDisputeItem = ({ item }) => {
    const statusColors = {
      pending: colors.orange,
      in_progress: colors.primary,
      resolved: colors.green,
      closed: colors.gray,
    };
    const statusColor = statusColors[item.status] || colors.gray;

    return (
      <TouchableOpacity
        style={styles.disputeCard}
        onPress={() => handleViewDispute(item)}
        activeOpacity={0.7}
      >
        <View style={styles.disputeHeader}>
          <View style={styles.disputeIdContainer}>
            <Text style={styles.disputeId}>{item.id}</Text>
            <Text style={styles.disputeDate}>
              {formatOrderDate(item.createdAt)}
            </Text>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}
          >
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status.replace("_", " ").charAt(0).toUpperCase() +
                item.status.replace("_", " ").slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.disputeContent}>
          <Text style={styles.disputeReason} numberOfLines={2}>
            {item.reasonLabel || "Issue reported"}
          </Text>
          <Text style={styles.disputeOrderRef}>
            Order: {item.orderId}
          </Text>
        </View>

        <View style={styles.disputeFooter}>
          {item.heldCoins > 0 && (
            <Text style={styles.heldCoins}>
              🔒 {formatPrice(item.heldCoins)} held
            </Text>
          )}
          <View style={styles.viewDetailsBtnContainer}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="chevron-forward"
              size={16}
              color={colors.primary}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyOrders = () => (
    <View style={styles.emptyContainer}>
      <VectorIcons
        name={iconLibName.Ionicons}
        iconName="receipt-outline"
        size={60}
        color={colors.gray}
      />
      <Text style={styles.emptyTitle}>No Orders Available</Text>
      <Text style={styles.emptySubtitle}>
        You don't have any orders that can be disputed. Make a purchase first or
        all your orders have existing disputes.
      </Text>
    </View>
  );

  const renderEmptyDisputes = () => (
    <View style={styles.emptyContainer}>
      <VectorIcons
        name={iconLibName.Ionicons}
        iconName="checkmark-circle-outline"
        size={60}
        color={colors.green}
      />
      <Text style={styles.emptyTitle}>No Active Disputes</Text>
      <Text style={styles.emptySubtitle}>
        You haven't reported any issues yet. We hope your marketplace experience
        has been great!
      </Text>
    </View>
  );

  return (
    <>
      <AppHeader title="Dispute Resolution" showTopIcons={false} />
      <View style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "create" && styles.tabActive]}
            onPress={() => setActiveTab("create")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "create" && styles.tabTextActive,
              ]}
            >
              Report Issue
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "history" && styles.tabActive]}
            onPress={() => setActiveTab("history")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "history" && styles.tabTextActive,
              ]}
            >
              Dispute History
            </Text>
            {disputes.length > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{disputes.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Info Banner */}
        {activeTab === "create" && (
          <View style={styles.infoBanner}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="information-circle"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.infoText}>
              Select an order below to report an issue. Our mediators will help
              resolve the dispute between you and the other party.
            </Text>
          </View>
        )}

        {/* Content */}
        {activeTab === "create" ? (
          eligibleOrders.length > 0 ? (
            <FlatList
              data={eligibleOrders}
              renderItem={renderOrderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            renderEmptyOrders()
          )
        ) : disputes.length > 0 ? (
          <FlatList
            data={disputes}
            renderItem={renderDisputeItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          renderEmptyDisputes()
        )}
      </View>
    </>
  );
};

export default DisputeResolution;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    paddingVertical: hp(2),
    gap: wp(1),
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: getFontSize(15),
    fontWeight: "500",
    color: colors.gray,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  badgeContainer: {
    backgroundColor: colors.red,
    borderRadius: 10,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.2),
    minWidth: wp(5),
    alignItems: "center",
  },
  badgeText: {
    color: colors.white,
    fontSize: getFontSize(11),
    fontWeight: "bold",
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.grayE8 + "40",
    margin: wp(4),
    padding: wp(3),
    borderRadius: 10,
    gap: wp(2),
  },
  infoText: {
    flex: 1,
    fontSize: getFontSize(13),
    color: colors.gray,
    lineHeight: 18,
  },
  listContent: {
    padding: wp(4),
    paddingBottom: hp(4),
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: hp(1),
  },
  orderIdContainer: {
    flex: 1,
  },
  orderId: {
    fontSize: getFontSize(15),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(0.3),
  },
  orderDate: {
    fontSize: getFontSize(12),
    color: colors.gray,
  },
  statusBadge: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: 12,
  },
  statusText: {
    fontSize: getFontSize(12),
    fontWeight: "600",
  },
  orderItemsContainer: {
    paddingVertical: hp(1),
    borderTopWidth: 1,
    borderTopColor: colors.grayE8,
  },
  itemsCount: {
    fontSize: getFontSize(13),
    fontWeight: "500",
    color: colors.black,
    marginBottom: hp(0.5),
  },
  itemName: {
    fontSize: getFontSize(13),
    color: colors.gray,
    marginBottom: hp(0.3),
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: hp(1),
    borderTopWidth: 1,
    borderTopColor: colors.grayE8,
  },
  totalAmount: {
    fontSize: getFontSize(16),
    fontWeight: "bold",
    color: colors.black,
  },
  reportBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  reportBtnText: {
    fontSize: getFontSize(14),
    color: colors.red,
    fontWeight: "500",
  },
  disputeCard: {
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
  disputeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: hp(1),
  },
  disputeIdContainer: {
    flex: 1,
  },
  disputeId: {
    fontSize: getFontSize(15),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(0.3),
  },
  disputeDate: {
    fontSize: getFontSize(12),
    color: colors.gray,
  },
  disputeContent: {
    paddingVertical: hp(1),
    borderTopWidth: 1,
    borderTopColor: colors.grayE8,
  },
  disputeReason: {
    fontSize: getFontSize(14),
    color: colors.black,
    marginBottom: hp(0.5),
  },
  disputeOrderRef: {
    fontSize: getFontSize(12),
    color: colors.gray,
  },
  disputeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: hp(1),
    borderTopWidth: 1,
    borderTopColor: colors.grayE8,
  },
  heldCoins: {
    fontSize: getFontSize(13),
    color: colors.orange,
    fontWeight: "500",
  },
  viewDetailsBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  viewDetailsText: {
    fontSize: getFontSize(14),
    color: colors.primary,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(10),
    paddingVertical: hp(10),
  },
  emptyTitle: {
    fontSize: getFontSize(18),
    fontWeight: "600",
    color: colors.black,
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  emptySubtitle: {
    fontSize: getFontSize(14),
    color: colors.gray,
    textAlign: "center",
    lineHeight: 22,
  },
});

