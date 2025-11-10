import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import AppHeader from "@/core/AppHeader";
import { useRoute, useNavigation } from "@react-navigation/native";
import { colors, hp, wp, getFontSize } from "@/theme";
import { screenNames } from "@/navigation/screenNames";
import VectorIcons, { iconLibName } from "@/theme/vectorIcon";

const OrderDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { order } = route.params;

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
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriceNumber = (priceString) => {
    if (typeof priceString === "number") return priceString;
    const match = priceString?.match(/[\d,]+\.?\d*/);
    return match ? parseFloat(match[0].replace(/,/g, "")) : 0;
  };

  const statusColor = getStatusColor(order.status);
  const statusIcon = getStatusIcon(order.status);

  return (
    <>
      <AppHeader title="Order Details" showTopIcons={false} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Order Status */}
        <View style={styles.statusSection}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor + "20" },
            ]}
          >
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName={statusIcon}
              size={24}
              color={statusColor}
            />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
          </View>
          <Text style={styles.orderId}>Order ID: {order.id}</Text>
          <Text style={styles.orderDate}>
            Placed on {formatDate(order.createdAt)}
          </Text>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item, index) => {
            const price = getPriceNumber(item.price);
            const itemTotal = price * (item.quantity || 1);
            return (
              <TouchableOpacity
                key={index}
                style={styles.orderItem}
                onPress={() =>
                  navigation.navigate(screenNames.PRODUCT_DETAILS, {
                    item: item,
                  })
                }
              >
                <Image source={item.image} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemPrice}>
                    {price.toFixed(2)} AUD x {item.quantity || 1}
                  </Text>
                  <Text style={styles.itemLocation}>{item.location}</Text>
                </View>
                <Text style={styles.itemTotal}>{itemTotal.toFixed(2)} AUD</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Delivery Information */}
        {order.deliveryInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Method:</Text>
              <Text style={styles.infoValue}>
                {order.deliveryInfo.deliveryMethod === "pickup"
                  ? "Pickup"
                  : order.deliveryInfo.deliveryMethod === "sellerDelivery"
                  ? "Seller Delivery"
                  : "Squad Courier"}
              </Text>
            </View>
            {order.deliveryInfo.fullName && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>
                  {order.deliveryInfo.fullName}
                </Text>
              </View>
            )}
            {order.deliveryInfo.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>
                  {order.deliveryInfo.phone}
                </Text>
              </View>
            )}
            {order.deliveryInfo.address && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address:</Text>
                <Text style={styles.infoValue}>
                  {order.deliveryInfo.address}
                  {order.deliveryInfo.city && `, ${order.deliveryInfo.city}`}
                  {order.deliveryInfo.state && `, ${order.deliveryInfo.state}`}
                  {order.deliveryInfo.postalCode &&
                    ` ${order.deliveryInfo.postalCode}`}
                </Text>
              </View>
            )}
            {order.deliveryInfo.deliveryInstructions && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Instructions:</Text>
                <Text style={styles.infoValue}>
                  {order.deliveryInfo.deliveryInstructions}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Method:</Text>
            <Text style={styles.infoValue}>
              {order.deliveryInfo?.paymentMethod === "card"
                ? "Credit/Debit Card"
                : "Other"}
            </Text>
          </View>
          {order.paymentInfo?.cardLast4 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Card:</Text>
              <Text style={styles.infoValue}>
                **** **** **** {order.paymentInfo.cardLast4}
              </Text>
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>
                {order.subtotal.toFixed(2)} AUD
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee:</Text>
              <Text style={styles.summaryValue}>
                {order.deliveryFee.toFixed(2)} AUD
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>
                {order.total.toFixed(2)} AUD
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  statusSection: {
    padding: wp(4),
    backgroundColor: colors.grayE8 + "30",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: 25,
    marginBottom: hp(1),
    gap: wp(2),
  },
  statusText: {
    fontSize: getFontSize(16),
    fontWeight: "600",
    textTransform: "capitalize",
  },
  orderId: {
    fontSize: getFontSize(14),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(0.3),
  },
  orderDate: {
    fontSize: getFontSize(12),
    color: colors.gray,
  },
  section: {
    padding: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8,
  },
  sectionTitle: {
    fontSize: getFontSize(18),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(2),
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8,
  },
  itemImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: 8,
    resizeMode: "cover",
    marginRight: wp(3),
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: getFontSize(15),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(0.3),
  },
  itemPrice: {
    fontSize: getFontSize(13),
    color: colors.gray,
    marginBottom: hp(0.3),
  },
  itemLocation: {
    fontSize: getFontSize(12),
    color: colors.gray,
  },
  itemTotal: {
    fontSize: getFontSize(16),
    fontWeight: "bold",
    color: colors.primary,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: hp(1),
    flexWrap: "wrap",
  },
  infoLabel: {
    fontSize: getFontSize(14),
    fontWeight: "600",
    color: colors.black,
    width: wp(25),
  },
  infoValue: {
    fontSize: getFontSize(14),
    color: colors.gray,
    flex: 1,
  },
  summaryContainer: {
    backgroundColor: colors.grayE8 + "30",
    padding: wp(4),
    borderRadius: 8,
    marginTop: hp(1),
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(1),
  },
  summaryLabel: {
    fontSize: getFontSize(14),
    color: colors.gray,
  },
  summaryValue: {
    fontSize: getFontSize(14),
    fontWeight: "600",
    color: colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayE8,
    marginVertical: hp(1),
  },
  totalLabel: {
    fontSize: getFontSize(16),
    fontWeight: "bold",
    color: colors.black,
  },
  totalValue: {
    fontSize: getFontSize(18),
    fontWeight: "bold",
    color: colors.primary,
  },
});

