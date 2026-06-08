import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import AppHeader from "@/core/AppHeader";
import { useSelector, useDispatch } from "react-redux";
import { removeFromFavorites, addToCart } from "@/store/marketplaceSlice";
import { screenNames } from "@/navigation/screenNames";
import { colors, hp, wp, getFontSize } from "@/theme";
import { showToast, toastTypes } from "@/utilities/toastConfig";
import { Alert } from "react-native";
import VectorIcons, { iconLibName } from "@/theme/vectorIcon";

const Favorites = ({ navigation }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.marketplace.favorites);
  const cart = useSelector((state) => state.marketplace.cart);

  const handleRemoveFavorite = (item) => {
    Alert.alert(
      "Remove from Favorites",
      `Are you sure you want to remove "${item.title}" from your favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            dispatch(removeFromFavorites({ id: item.id }));
            showToast("Removed from favorites", "Success", toastTypes.info);
          },
        },
      ]
    );
  };

  const handleBuyNow = (item) => {
    const isInCart = cart.some((cartItem) => cartItem.id === item.id);
    
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
    }
  };

  const isItemInCart = (itemId) => {
    return cart.some((cartItem) => cartItem.id === itemId);
  };

  const renderItem = ({ item }) => {
    const inCart = isItemInCart(item.id);
    
    return (
      <View style={styles.card}>
        {/* Product Image */}
        <Image source={item.image} style={styles.image} />

        {/* Favorite Icon */}
        <TouchableOpacity
          style={styles.favoriteIcon}
          onPress={() => handleRemoveFavorite(item)}
        >
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="heart"
            size={24}
            color={colors.red}
          />
        </TouchableOpacity>

        {/* Product Info */}
        <View style={styles.infoBox}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>{item.price}</Text>

          <View style={styles.rowBetween}>
            <Text style={styles.location}>{item.location}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.seller}>● {item.seller}</Text>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
          </View>

          {/* Tags */}
          <View style={styles.tagContainer}>
            {item.tags?.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(screenNames.PRODUCT_DETAILS, { item: item })
              }
              style={styles.btnPrimary}
            >
              <Text style={styles.btnTextPrimary}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnSecondary, inCart && styles.btnSecondaryInCart]}
              onPress={() => handleBuyNow(item)}
            >
              <Text
                style={[
                  styles.btnTextSecondary,
                  inCart && styles.btnTextSecondaryInCart,
                ]}
              >
                {inCart ? "View Cart" : "Buy Now"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <AppHeader title="My Favorites" showTopIcons={false} />
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="heart-outline"
            size={80}
            color={colors.gray}
          />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>
            Items you favorite will appear here
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
            data={favorites}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100, padding: 15 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  infoBox: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
    marginVertical: 4,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  location: {
    color: "#555",
    fontSize: 12,
  },
  time: {
    color: "#888",
    fontSize: 12,
  },
  seller: {
    fontSize: 12,
    color: "#666",
  },
  rating: {
    fontSize: 12,
    color: "#F39C12",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  tag: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    margin: 3,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tagText: {
    fontSize: 10,
    color: "#555",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: "#FF8C00",
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 5,
    alignItems: "center",
  },
  btnTextPrimary: {
    color: "#fff",
    fontWeight: "bold",
  },
  btnSecondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FF8C00",
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 5,
    alignItems: "center",
  },
  btnSecondaryInCart: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  btnTextSecondary: {
    color: "#FF8C00",
    fontWeight: "bold",
  },
  btnTextSecondaryInCart: {
    color: "#fff",
    fontWeight: "bold",
  },
});

