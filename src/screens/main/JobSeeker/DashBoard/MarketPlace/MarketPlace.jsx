import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import App from "../../../../../../App";
import AppHeader from "@/core/AppHeader";
import images from "@/assets/images";
import { screenNames } from "@/navigation/screenNames";

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
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Product Image */}
      <Image source={ item.image } style={styles.image} />

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
          <TouchableOpacity onPress={()=>navigation.navigate(screenNames.PRODUCT_DETAILS,{item:item})} style={styles.btnPrimary}>
            <Text style={styles.btnTextPrimary}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary}>
            <Text style={styles.btnTextSecondary}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <>
 <AppHeader title="Marketplace" />


    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Browse Items</Text>
        <TouchableOpacity style={styles.sellBtn}>
          <Text style={styles.sellBtnText}>Sell your product</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subHeader}>
        Find great deals in your local area
      </Text>

      {/* Search */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search by keywords"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <Icon name="search" size={20} color="#666" />
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>All Categories ▼</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Most Recent ▼</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
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

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
  },
  input: { flex: 1, fontSize: 14, padding: 8, color: "#000" },

  filterRow: { flexDirection: "row", justifyContent: "space-between" },
  filterBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    margin: 5,
    alignItems: "center",
  },
  filterText: { color: "#555", fontSize: 14 },

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
  btnTextSecondary: { color: "#FF8C00", fontWeight: "bold" },
});
