import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AppHeader from "@/core/AppHeader";
import AppDropDown from "@/core/AppDropDown";
import AppInputField from "@/core/AppInputField";
import images from "@/assets/images";
import { screenNames } from "@/navigation/screenNames";
import { colors, hp, wp, getFontSize, borders } from "@/theme";
import { fonts } from "@/assets/fonts";
import { useSelector, useDispatch } from "react-redux";
import VectorIcons, { iconLibName } from "@/theme/vectorIcon";
import { addToCart } from "@/store/marketplaceSlice";
import { showToast, toastTypes } from "@/utilities/toastConfig";

const items = [
  {
    id: "1",
    title: "iPhone 14 Pro Max - 256GB",
    price: "1200 SG",
    location: "Sydney CBD • 2.5 km",
    time: "2 hours ago",
    seller: "John Doe",
    rating: "4.8",
image:images.phone,
    tags: ["Like New", "Pickup", "Delivery", "Squad Courier"],
  },
  {
    id: "2",
    title: "Honda Civic 2020 - Low Mileage",
    price: "25000 SG",
    location: "Melbourne • 5.2 km",
    time: "2 hours ago",
    seller: "Sarah M.",
    rating: "4.9 (18)",
    image:images.car,
    tags: ["Excellent", "Pickup", "Squad Courier"],
  },
  {
    id: "3",
    title: "iPhone 14 Pro Max - 256GB",
    price: "1200 SG",
    location: "Sydney CBD • 2.5 km",
    time: "2 hours ago",
    seller: "John Doe",
    rating: "4.8",
    image:images.phone,
    tags: ["Like New", "Pickup", "Delivery", "Squad Courier"],
  },
];

const MarketPlace = ({navigation}) => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cart = useSelector((state) => state.marketplace?.cart || []);
  const favorites = useSelector((state) => state.marketplace?.favorites || []);
  const orders = useSelector((state) => state.marketplace?.orders || []);
  const products = useSelector((state) => state.marketplace?.products || []);
  const cartItemCount = cart?.length || 0;
  const favoritesCount = favorites?.length || 0;
  const ordersCount = orders?.length || 0;

  const categories = [
    { label: "All Categories", value: "all" },
    { label: "Electronics", value: "electronics" },
    { label: "Vehicles", value: "vehicles" },
    { label: "Furniture", value: "furniture" },
    { label: "Clothing", value: "clothing" },
    { label: "Appliances", value: "appliances" },
    { label: "Sports & Outdoors", value: "sports" },
    { label: "Books", value: "books" },
    { label: "Toys & Games", value: "toys" },
    { label: "Other", value: "other" },
  ];

  const sortOptions = [
    { label: "Most Recent", value: "recent" },
    { label: "Price: Low to High", value: "price_low" },
    { label: "Price: High to Low", value: "price_high" },
    { label: "Distance: Nearest First", value: "distance" },
    { label: "Highest Rated", value: "rating" },
  ];

  const handleCategoryToggle = (visible) => {
    if (visible) {
      setCategoryDropdownVisible(true);
      setSortDropdownVisible(false);
    } else {
      setCategoryDropdownVisible(false);
    }
  };

  const handleSortToggle = (visible) => {
    if (visible) {
      setSortDropdownVisible(true);
      setCategoryDropdownVisible(false);
    } else {
      setSortDropdownVisible(false);
    }
  };

  const handleCategorySelect = (value) => {
    setSelectedCategory(value);
    setCategoryDropdownVisible(false);
    // TODO: Filter products by category
    console.log("Selected category:", value);
  };

  const handleSortSelect = (value) => {
    setSelectedSort(value);
    setSortDropdownVisible(false);
    // TODO: Sort products
    console.log("Selected sort:", value);
  };

  // Filter and sort items based on search, category, and sort options
  const getFilteredAndSortedItems = () => {
    // Combine user-created products (from Redux) with hardcoded items
    // User-created products appear first (most recent)
    const allItems = [...products, ...items];
    let filtered = [...allItems];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) => {
        const titleMatch = item.title?.toLowerCase().includes(query);
        const locationMatch = item.location?.toLowerCase().includes(query);
        const sellerMatch = item.seller?.toLowerCase().includes(query);
        const tagsMatch = item.tags?.some((tag) =>
          tag.toLowerCase().includes(query)
        );
        return titleMatch || locationMatch || sellerMatch || tagsMatch;
      });
    }

    // Filter by category (if category is selected and not "all")
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((item) => {
        // Check if item has category field (user-created products have it)
        if (item.category) {
          return item.category === selectedCategory;
        }
        // For hardcoded items without category, skip filtering
        // TODO: Add category field to hardcoded items when API is integrated
        return true;
      });
    }

    // Sort items
    if (selectedSort) {
      switch (selectedSort) {
        case "price_low":
          filtered.sort((a, b) => {
            const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ""));
            const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ""));
            return priceA - priceB;
          });
          break;
        case "price_high":
          filtered.sort((a, b) => {
            const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ""));
            const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ""));
            return priceB - priceA;
          });
          break;
        case "rating":
          filtered.sort((a, b) => {
            const ratingA = parseFloat(a.rating);
            const ratingB = parseFloat(b.rating);
            return ratingB - ratingA;
          });
          break;
        case "recent":
        default:
          // Most recent (default order)
          break;
      }
    }

    return filtered;
  };

  const filteredItems = getFilteredAndSortedItems();

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
    
    // Handle both static assets and URI-based images
    const imageSource = item.image?.uri 
      ? { uri: item.image.uri } 
      : item.image;
    
    return (
    <View style={styles.card}>
      {/* Product Image */}
      <Image source={imageSource} style={styles.image} />

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
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity 
            onPress={()=>navigation.navigate(screenNames.PRODUCT_DETAILS,{item:item})} 
            style={styles.btnPrimary}
          >
            <Text style={styles.btnTextPrimary}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btnSecondary, inCart && styles.btnSecondaryInCart]}
            onPress={() => handleBuyNow(item)}
          >
            <Text style={[styles.btnTextSecondary, inCart && styles.btnTextSecondaryInCart]}>
              {inCart ? "View Cart" : "Buy Now"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    );
  };

  const renderCartIcon = () => (
    <TouchableOpacity
      style={styles.cartIconContainer}
      onPress={() => navigation.navigate(screenNames.MARKETPLACE_CART)}
      activeOpacity={0.7}
    >
      <VectorIcons
        name={iconLibName.Ionicons}
        iconName="cart-outline"
        size={24}
        color="#FFFFFF"
      />
      {cartItemCount > 0 && (
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>
            {cartItemCount > 99 ? '99+' : cartItemCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderFavoritesIcon = () => (
    <TouchableOpacity
      style={styles.favoritesIconContainer}
      onPress={() => navigation.navigate(screenNames.MARKETPLACE_FAVORITES)}
      activeOpacity={0.7}
    >
      <VectorIcons
        name={iconLibName.Ionicons}
        iconName={favoritesCount > 0 ? "heart" : "heart-outline"}
        size={24}
        color="#FFFFFF"
      />
      {favoritesCount > 0 && (
        <View style={styles.favoritesBadge}>
          <Text style={styles.favoritesBadgeText}>
            {favoritesCount > 99 ? '99+' : favoritesCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderOrdersIcon = () => {
    return (
      <TouchableOpacity
        style={styles.ordersIconContainer}
        onPress={() => navigation.navigate(screenNames.MARKETPLACE_ORDERS)}
        activeOpacity={0.7}
      >
        <VectorIcons
          name={iconLibName.Ionicons}
          iconName="receipt-outline"
          size={24}
          color="#FFFFFF"
        />
        {ordersCount > 0 && (
          <View style={styles.ordersBadge}>
            <Text style={styles.ordersBadgeText}>
              {ordersCount > 99 ? '99+' : ordersCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderHeaderIcons = () => (
    <View style={styles.headerIconsContainer}>
      {renderOrdersIcon()}
      {renderFavoritesIcon()}
      {renderCartIcon()}
    </View>
  );

  return (
    <>
 <AppHeader 
   title="Marketplace" 
   rightComponent={renderHeaderIcons()}
 />


    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Browse Items</Text>
        <TouchableOpacity 
          style={styles.sellBtn}
          onPress={() => navigation.navigate(screenNames.POST_PRODUCT)}
        >
          <Text style={styles.sellBtnText}>Sell your product</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subHeader}>
        Find great deals in your local area
      </Text>

      {/* Search */}
      <AppInputField
        placeholder="Search by keywords, name, tags, city..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        returnKeyType="search"
        wrapperStyle={styles.searchWrapper}
        inputStyle={styles.searchInput}
        endIcon={
          <Icon name="search" size={18} color={colors.gray} />
        }
      />

      {/* Filters */}
      <View style={styles.filterRow} pointerEvents="box-none">
        <View style={styles.filterContainer} pointerEvents="box-none">
          <AppDropDown
            placeholder="All Categories"
            options={categories}
            selectedValue={selectedCategory}
            onSelect={handleCategorySelect}
            isVisible={categoryDropdownVisible}
            setIsVisible={handleCategoryToggle}
            style={styles.filterDropdown}
            dropdownStyle={styles.filterDropdownList}
            maxHeight={hp(25)}
          />
        </View>
        <View style={styles.filterContainer} pointerEvents="box-none">
          <AppDropDown
            placeholder="Most Recent"
            options={sortOptions}
            selectedValue={selectedSort}
            onSelect={handleSortSelect}
            isVisible={sortDropdownVisible}
            setIsVisible={handleSortToggle}
            style={styles.filterDropdown}
            dropdownStyle={styles.filterDropdownList}
            maxHeight={hp(25)}
          />
        </View>
      </View>

      {/* List */}
      {filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          scrollEnabled={!categoryDropdownVisible && !sortDropdownVisible}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No items found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search or filters
          </Text>
        </View>
      )}
    </View>
    </>
    
  );
};

export default MarketPlace;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  header: { fontSize: 18, fontWeight: "bold", color: "#000" },
  sellBtn: {
    borderWidth: 1,
    borderColor: "#2979FF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sellBtnText: { color: "#2979FF", fontSize: 14 },
  subHeader: { color: "#667", marginVertical: 8 },
  searchWrapper: {
    // marginBottom: hp(1.5),
    marginTop: hp(1),
  },
  searchInput: {
    fontSize: getFontSize(14),
    fontFamily: fonts.regular,
  },

  filterRow: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    marginBottom: hp(1),
    position: 'relative',
  },
  filterContainer: {
    flex: 1,
    marginHorizontal: wp(1),
    zIndex: 1000,
    elevation: 5,
  },
  filterDropdown: {
    marginBottom: 0,
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    minHeight: hp(5),
    borderRadius: hp(1),
    borderWidth: borders.borderWidthThin,
    borderColor: colors.gray02,
  },
  filterDropdownList: {
    position: 'absolute',
    zIndex: 99999,
    elevation: 50,
    marginTop: hp(0.5),
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
  },
  image: { width: "100%", height: 180, resizeMode: "cover" },
  infoBox: { padding: 12 },
  title: { fontSize: 16, fontWeight: "600", color: "#333" },
  price: { fontSize: 16, fontWeight: "bold", color: "red", marginVertical: 4 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  location: { color: "#555", fontSize: 12 },
  time: { color: "#888", fontSize: 12 },
  seller: { fontSize: 12, color: "#666" },
  rating: { fontSize: 12, color: "#F39C12" },

  tagContainer: { flexDirection: "row", flexWrap: "wrap", marginVertical: 8 },
  tag: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    margin: 3,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tagText: { fontSize: 10, color: "#555" },

  btnRow: { flexDirection: "row", justifyContent: "space-between" },
  btnPrimary: {
    flex: 1,
    backgroundColor: "#FF8C00",
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 5,
    alignItems: "center",
  },
  btnTextPrimary: { color: "#fff", fontWeight: "bold" },
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
  btnTextSecondary: { color: "#FF8C00", fontWeight: "bold" },
  btnTextSecondaryInCart: { color: "#fff", fontWeight: "bold" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(10),
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: hp(1),
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
  },
  headerIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  cartIconContainer: {
    position: 'relative',
    padding: wp(2),
  },
  favoritesIconContainer: {
    position: 'relative',
    padding: wp(2),
  },
  cartBadge: {
    position: 'absolute',
    top: wp(0.5),
    right: wp(0.5),
    backgroundColor: '#FF3B30',
    borderRadius: wp(2.5),
    minWidth: wp(4.5),
    height: wp(4.5),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(0.8),
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  favoritesBadge: {
    position: 'absolute',
    top: wp(0.5),
    right: wp(0.5),
    backgroundColor: '#FF3B30',
    borderRadius: wp(2.5),
    minWidth: wp(4.5),
    height: wp(4.5),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(0.8),
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: getFontSize(9),
    fontWeight: 'bold',
  },
  favoritesBadgeText: {
    color: '#FFFFFF',
    fontSize: getFontSize(9),
    fontWeight: 'bold',
  },
  ordersIconContainer: {
    position: 'relative',
    padding: wp(2),
  },
  ordersBadge: {
    position: 'absolute',
    top: wp(0.5),
    right: wp(0.5),
    backgroundColor: '#FF3B30',
    borderRadius: wp(2.5),
    minWidth: wp(4.5),
    height: wp(4.5),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(0.8),
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  ordersBadgeText: {
    color: '#FFFFFF',
    fontSize: getFontSize(9),
    fontWeight: 'bold',
  },
});
