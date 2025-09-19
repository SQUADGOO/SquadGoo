import PoolHeader from "@/core/PoolHeader";
import { useRoute } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ProductDetails = () => {
    const route = useRoute();
    const { item } = route.params;
  return (
<>
   <PoolHeader title="Product Details"/>

    <ScrollView style={styles.container}>
      {/* Title + Icons */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>iPhone 14 Pro Max - 256GB</Text>
        <View style={styles.iconRow}>
          <Icon name="heart-outline" size={22} color="#333" style={styles.icon} />
          <Icon name="share-social-outline" size={22} color="#333" />
        </View>
      </View>

      {/* Image */}
      <Image
        source={ item.image }
        style={styles.image}
      />

      {/* Price + Location */}
      <Text style={styles.price}>1200 SG</Text>
      <Text style={styles.subText}>Sydney CBD • 2.5 km | 2 hours ago</Text>

      {/* Seller */}
      <View style={styles.sellerCard}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.avatar} />
          <View>
            <Text style={styles.sellerName}>John Doe</Text>
            <Text style={styles.rating}>⭐ 4.8 (18)</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewProfileBtn}>
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
        <Text style={styles.deliveryItem}>• Pickup available</Text>
        <Text style={styles.deliveryItem}>• Seller delivery available</Text>
        <Text style={styles.deliveryItem}>• Squad Courier available</Text>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity style={styles.buyBtn}>
        <Text style={styles.buyBtnText}>Buy Item - 1200 SG</Text>
      </TouchableOpacity>

      <View style={styles.rowBtn}>
        <TouchableOpacity style={styles.outlinedBtn}>
          <Text style={styles.outlinedBtnText}>Hold Listing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlinedBtn}>
          <Text style={styles.outlinedBtnText}>Chat With Seller</Text>
        </TouchableOpacity>
      </View>

      {/* Safe Transaction */}
      <View style={styles.safeBox}>
        <Text style={styles.sectionTitle}>Safe Transaction</Text>
        <Text style={styles.safeText}>
          All payments are secured with SG Coins. Funds are held until both
          parties confirm the transaction.
        </Text>
      </View>

      {/* Description */}
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.desc}>
        Barely used iPhone 14 Pro Max in excellent condition. Includes original
        box and charger.
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
  iconRow: { flexDirection: "row" },
  icon: { marginLeft: 15 },
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
  outlinedBtnText: { color: "#FF8C00", fontWeight: "bold" },

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
