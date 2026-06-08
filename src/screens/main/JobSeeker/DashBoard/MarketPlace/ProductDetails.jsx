import PoolHeader from "@/core/PoolHeader";
import { useRoute, useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Share,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleFavorite,
  addToCart,
  toggleHeldItem,
} from "@/store/marketplaceSlice";
import { screenNames } from "@/navigation/screenNames";
import { colors, hp, wp } from "@/theme";
import { showToast, toastTypes } from "@/utilities/toastConfig";
import { getPriceNumber, formatPrice } from "@/utilities/marketplaceHelpers";

const ProductDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { item } = route.params;

  const favorites = useSelector((state) => state.marketplace.favorites);
  const heldItems = useSelector((state) => state.marketplace.heldItems);
  const cart = useSelector((state) => state.marketplace.cart);

  const isFavorite = favorites.some((fav) => fav.id === item.id);
  const isHeld = heldItems.some((held) => held.id === item.id);
  const isInCart = cart.some((cartItem) => cartItem.id === item.id);

  const price = getPriceNumber(item.price);
  const priceText = item.price || formatPrice(price);

  const handleFavorite = () => {
    dispatch(toggleFavorite(item));
    showToast(
      isFavorite ? "Removed from favorites" : "Added to favorites",
      "Success",
      isFavorite ? toastTypes.info : toastTypes.success
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this product: ${item.title} - ${priceText}`,
        title: item.title,
      });
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  const handleBuy = () => {
    if (isInCart) {
      Alert.alert(
        "Already in Cart",
        "This item is already in your cart. Would you like to view your cart?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "View Cart",
            onPress: () => navigation.navigate(screenNames.MARKETPLACE_CART),
          },
        ]
      );
    } else {
      dispatch(addToCart(item));
      showToast("Item added to cart", "Success", toastTypes.success);
      Alert.alert(
        "Added to Cart",
        "Item has been added to your cart. Would you like to proceed to checkout?",
        [
          { text: "Continue Shopping", style: "cancel" },
          {
            text: "View Cart",
            onPress: () => navigation.navigate(screenNames.MARKETPLACE_CART),
          },
        ]
      );
    }
  };

  const handleHoldListing = () => {
    dispatch(toggleHeldItem(item));
    showToast(
      isHeld ? "Removed from held items" : "Added to held items",
      "Success",
      isHeld ? toastTypes.info : toastTypes.success
    );
  };

  const handleChatWithSeller = () => {
    // TODO: Navigate to chat with seller
    // For now, navigate to chat screen
    navigation.navigate(screenNames.CHAT, {
      userId: item.sellerId || item.seller,
      userName: item.seller,
    });
  };

  const handleViewProfile = () => {
    // TODO: Navigate to seller profile
    // For now, navigate to profile screen
    navigation.navigate(screenNames.PROFILE, {
      userId: item.sellerId || item.seller,
    });
  };
  return (
<>
   <PoolHeader title="Product Details"/>

    <ScrollView style={styles.container}>
      {/* Title + Icons */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={handleFavorite} style={styles.iconButton}>
            <Icon
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? colors.red : "#333"}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
            <Icon name="share-social-outline" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Image */}
      <Image
        source={ item.image }
        style={styles.image}
      />

      {/* Price + Location */}
      <Text style={styles.price}>{priceText}</Text>
      <Text style={styles.subText}>
        {item.location || "Location not specified"} • {item.time || "Recently posted"}
      </Text>

      {/* Seller */}
      <View style={styles.sellerCard}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.avatar} />
          <View>
            <Text style={styles.sellerName}>{item.seller || "Seller"}</Text>
            <Text style={styles.rating}>
              ⭐ {item.rating || "4.0"} {item.ratingCount ? `(${item.ratingCount})` : ""}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.viewProfileBtn}
          onPress={handleViewProfile}
        >
          <Text style={styles.viewProfileText}>View Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Features */}
      <Text style={styles.sectionTitle}>Features</Text>
      <View style={styles.tagRow}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Original Box</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Warranty</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Fast Delivery</Text>
        </View>
      </View>

      {/* Delivery Options */}
      <Text style={styles.sectionTitle}>Delivery Options</Text>
      <View style={styles.deliveryList}>
        {item.tags?.includes("Pickup") && (
          <Text style={styles.deliveryItem}>• Pickup available</Text>
        )}
        {item.tags?.includes("Delivery") && (
          <Text style={styles.deliveryItem}>• Seller delivery available</Text>
        )}
        {item.tags?.includes("Squad Courier") && (
          <Text style={styles.deliveryItem}>• Squad Courier available</Text>
        )}
      </View>

      {/* Action Buttons */}
      <TouchableOpacity
        style={[styles.buyBtn, isInCart && styles.buyBtnInCart]}
        onPress={handleBuy}
      >
        <Text style={styles.buyBtnText}>
          {isInCart ? "View in Cart" : `Buy Item - ${priceText}`}
        </Text>
      </TouchableOpacity>

      <View style={styles.rowBtn}>
        <TouchableOpacity
          style={[styles.outlinedBtn, isHeld && styles.outlinedBtnActive]}
          onPress={handleHoldListing}
        >
          <Text
            style={[
              styles.outlinedBtnText,
              isHeld && styles.outlinedBtnTextActive,
            ]}
          >
            {isHeld ? "Held" : "Hold Listing"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.outlinedBtn}
          onPress={handleChatWithSeller}
        >
          <Text style={styles.outlinedBtnText}>Chat With Seller</Text>
        </TouchableOpacity>
      </View>

      {/* Safe Transaction */}
      <View style={styles.safeBox}>
        <Text style={styles.sectionTitle}>Safe Transaction</Text>
        <Text style={styles.safeText}>
          All payments are secured. Funds are held until both
          parties confirm the transaction.
        </Text>
      </View>

      {/* Description */}
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.desc}>
        {item.description ||
          "Barely used iPhone 14 Pro Max in excellent condition. Includes original box and charger."}
      </Text>
    </ScrollView>
</>
     
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#000", flex: 1 },
  iconRow: { flexDirection: "row", alignItems: "center" },
  icon: { marginLeft: 15 },
  iconButton: {
    padding: wp(1),
    marginLeft: wp(2),
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginVertical: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
    marginTop: 4,
  },
  subText: { fontSize: 13, color: "#555", marginBottom: 15 },

  sellerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    elevation: 2,
    shadowOpacity: 0.1,
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  sellerName: { fontSize: 14, fontWeight: "bold", color: "#333" },
  rating: { fontSize: 12, color: "#777" },
  viewProfileBtn: {
    backgroundColor: "#FF8C00",
    borderRadius: 6,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  viewProfileText: { color: "#fff", fontSize: 12 },

  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginTop: 10 },
  tagRow: { flexDirection: "row", marginVertical: 8 },
  tag: {
    backgroundColor: "#FFEFD5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  tagText: { color: "#FF8C00", fontSize: 12 },

  deliveryList: { marginVertical: 8 },
  deliveryItem: { fontSize: 14, color: "#444", marginBottom: 4 },

  buyBtn: {
    backgroundColor: "#FF8C00",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buyBtnInCart: {
    backgroundColor: "#4CAF50",
  },
  buyBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  rowBtn: { flexDirection: "row", justifyContent: "space-between" },
  outlinedBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FF8C00",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    margin: 5,
  },
  outlinedBtnActive: {
    backgroundColor: "#FF8C00",
  },
  outlinedBtnText: { color: "#FF8C00", fontWeight: "bold" },
  outlinedBtnTextActive: { color: "#fff", fontWeight: "bold" },

  safeBox: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    elevation: 1,
    shadowOpacity: 0.05,
    marginVertical: 15,
  },
  safeText: { color: "#555", fontSize: 13, marginTop: 4 },

  desc: { color: "#444", fontSize: 14, marginTop: 5, lineHeight: 20 },
});
