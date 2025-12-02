import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AppHeader from "@/core/AppHeader";
import AppButton from "@/core/AppButton";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from "@/store/marketplaceSlice";
import { colors, hp, wp, getFontSize } from "@/theme";
import VectorIcons, { iconLibName } from "@/theme/vectorIcon";
import { screenNames } from "@/navigation/screenNames";
import { showToast, toastTypes } from "@/utilities/toastConfig";
import {
  getPriceNumber,
  calculateCartTotal,
  formatPrice,
} from "@/utilities/marketplaceHelpers";

const Cart = ({ navigation }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.marketplace.cart);

  const total = calculateCartTotal(cart);

  const handleRemoveItem = (item) => {
    Alert.alert(
      "Remove Item",
      `Are you sure you want to remove "${item.title}" from your cart?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            dispatch(removeFromCart({ id: item.id }));
            showToast("Item removed from cart", "Success", toastTypes.info);
          },
        },
      ]
    );
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(item);
    } else {
      dispatch(updateCartQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast("Your cart is empty", "Error", toastTypes.error);
      return;
    }

    navigation.navigate(screenNames.MARKETPLACE_CHECKOUT);
  };

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            dispatch(clearCart());
            showToast("Cart cleared", "Success", toastTypes.info);
          },
        },
      ]
    );
  };

  const renderCartItem = ({ item }) => {
    const price = getPriceNumber(item.price);
    const itemTotal = price * (item.quantity || 1);

    return (
      <View style={styles.cartItem}>
        <Image source={item.image} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
          <Text style={styles.itemLocation}>{item.location}</Text>

          {/* Quantity Controls */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => handleQuantityChange(item, (item.quantity || 1) - 1)}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="remove"
                size={18}
                color={colors.primary}
              />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity || 1}</Text>
            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => handleQuantityChange(item, (item.quantity || 1) + 1)}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="add"
                size={18}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.itemActions}>
          <Text style={styles.itemTotal}>{formatPrice(itemTotal)}</Text>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => handleRemoveItem(item)}
          >
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="trash-outline"
              size={20}
              color={colors.red}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <AppHeader title="Shopping Cart" showTopIcons={false} />
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="cart-outline"
            size={80}
            color={colors.gray}
          />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>
            Add items to your cart to see them here
          </Text>
          <AppButton
            text="Browse Marketplace"
            onPress={() => navigation.navigate(screenNames.MARKET_PLACE)}
            style={styles.browseBtn}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleClearCart}>
              <Text style={styles.clearText}>Clear Cart</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>{formatPrice(total)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items:</Text>
              <Text style={styles.summaryValue}>{cart.length}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>

            <AppButton
              text={`Proceed to Payment - ${formatPrice(total)}`}
              onPress={handleCheckout}
              style={styles.checkoutBtn}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
  },
  clearText: {
    color: colors.red,
    fontSize: getFontSize(14),
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(25),
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 12,
    marginVertical: hp(1),
    padding: wp(3),
    borderWidth: 1,
    borderColor: colors.grayE8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: 8,
    resizeMode: "cover",
  },
  itemInfo: {
    flex: 1,
    marginLeft: wp(3),
    justifyContent: "space-between",
  },
  itemTitle: {
    fontSize: getFontSize(14),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(0.5),
  },
  itemPrice: {
    fontSize: getFontSize(14),
    fontWeight: "bold",
    color: colors.red,
    marginBottom: hp(0.3),
  },
  itemLocation: {
    fontSize: getFontSize(12),
    color: colors.gray,
    marginBottom: hp(1),
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.5),
  },
  quantityBtn: {
    width: wp(8),
    height: wp(8),
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  quantityText: {
    fontSize: getFontSize(14),
    fontWeight: "600",
    color: colors.black,
    marginHorizontal: wp(3),
    minWidth: wp(6),
    textAlign: "center",
  },
  itemActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginLeft: wp(2),
  },
  itemTotal: {
    fontSize: getFontSize(14),
    fontWeight: "bold",
    color: colors.black,
    marginBottom: hp(1),
  },
  removeBtn: {
    padding: wp(1),
  },
  summary: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(3),
    borderTopWidth: 1,
    borderTopColor: colors.grayE8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(0.8),
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
  checkoutBtn: {
    marginTop: hp(2),
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
    marginBottom: hp(1),
  },
  emptySubtext: {
    fontSize: getFontSize(14),
    color: colors.gray,
    textAlign: "center",
    marginBottom: hp(3),
  },
  browseBtn: {
    marginTop: hp(2),
    paddingHorizontal: wp(6),
  },
});

