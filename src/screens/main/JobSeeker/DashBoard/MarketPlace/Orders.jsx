import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AppHeader from "@/core/AppHeader";
import { useSelector } from "react-redux";
import { colors, hp, wp, getFontSize } from "@/theme";
import { screenNames } from "@/navigation/screenNames";
import VectorIcons, { iconLibName } from "@/theme/vectorIcon";

const Orders = ({ navigation }) => {
  const orders = useSelector((state) => state.marketplace.orders);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return colors.primary;
      case "confirmed":
        return colors.primary;
      case "processing":
        return colors.darkBlue;
      case "shipped":
        return colors.secondary;
      case "delivered":
        return colors.green;
      case "cancelled":
        return colors.red;
      default:
        return colors.gray;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "time-outline";
      case "confirmed":
        return "checkmark-circle-outline";
      case "processing":
        return "sync-outline";
      case "shipped":
        return "car-outline";
      case "delivered":
        return "checkmark-done-circle-outline";
      case "cancelled":
        return "close-circle-outline";
      default:
        return "ellipse-outline";
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

  const renderOrderItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    const statusIcon = getStatusIcon(item.status);

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() =>
          navigation.navigate(screenNames.MARKETPLACE_ORDER_DETAILS, {
            order: item,
          })
        }
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor + "20" },
            ]}
          >
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName={statusIcon}
              size={16}
              color={statusColor}
            />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.orderItemsContainer}>
          <Text style={styles.itemsCount}>
            {item.items.length} {item.items.length === 1 ? "item" : "items"}
          </Text>
          {item.items.slice(0, 2).map((orderItem, index) => (
            <Text key={index} style={styles.itemName} numberOfLines={1}>
              • {orderItem.title}
              {orderItem.quantity > 1 && ` x${orderItem.quantity}`}
            </Text>
          ))}
          {item.items.length > 2 && (
            <Text style={styles.moreItems}>
              +{item.items.length - 2} more items
            </Text>
          )}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.totalAmount}>
            {item.total.toFixed(2)} AUD
          </Text>
          <View style={styles.viewDetailsContainer}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="chevron-forward"
              size={18}
              color={colors.primary}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <AppHeader title="My Orders" showTopIcons={false} />
      {orders?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="receipt-outline"
            size={80}
            color={colors.gray}
          />
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptySubtext}>
            Your order history will appear here
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate(screenNames.MARKET_PLACE)}
          >
            <Text style={styles.browseBtnText}>Browse Marketplace</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    padding: wp(4),
    paddingBottom: hp(4),
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: wp(4),
    marginBottom: hp(2),
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
    marginBottom: hp(1.5),
  },
  orderIdContainer: {
    flex: 1,
  },
  orderId: {
    fontSize: getFontSize(16),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(0.3),
  },
  orderDate: {
    fontSize: getFontSize(12),
    color: colors.gray,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: 20,
    gap: wp(1.5),
  },
  statusText: {
    fontSize: getFontSize(12),
    fontWeight: "600",
    textTransform: "capitalize",
  },
  orderItemsContainer: {
    marginBottom: hp(1.5),
    paddingTop: hp(1),
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
  moreItems: {
    fontSize: getFontSize(12),
    color: colors.gray,
    fontStyle: "italic",
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
    fontSize: getFontSize(18),
    fontWeight: "bold",
    color: colors.primary,
  },
  viewDetailsContainer: {
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
    paddingHorizontal: wp(8),
    paddingVertical: hp(10),
  },
  emptyText: {
    fontSize: getFontSize(18),
    fontWeight: "600",
    color: colors.black,
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  emptySubtext: {
    fontSize: getFontSize(14),
    color: colors.gray,
    textAlign: "center",
    marginBottom: hp(3),
  },
  browseBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderRadius: 8,
  },
  browseBtnText: {
    color: colors.white,
    fontSize: getFontSize(14),
    fontWeight: "600",
  },
});

