import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch } from "react-redux";
import AppHeader from "@/core/AppHeader";
import FormField from "@/core/FormField";
import AppDropDown from "@/core/AppDropDown";
import AppButton from "@/core/AppButton";
import CustomCheckBox from "@/core/CustomCheckBox";
import ImagePickerSheet from "@/components/ImagePickerSheet";
import { colors, hp, wp } from "@/theme";
import VectorIcons, { iconLibName } from "@/theme/vectorIcon";
import { screenNames } from "@/navigation/screenNames";
import { addProduct } from "@/store/marketplaceSlice";

const PostProduct = ({ navigation }) => {
  const dispatch = useDispatch();
  const imagePickerRef = useRef(null);
  const scrollViewRef = useRef(null);
  
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [deliveryOptions, setDeliveryOptions] = useState({
    pickup: false,
    sellerDelivery: false,
    squadCourier: false,
  });

  const [dropdowns, setDropdowns] = useState({
    categoryVisible: false,
    conditionVisible: false,
  });

  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      location: "",
    },
  });

  const { handleSubmit } = methods;

  const categories = [
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

  const conditions = [
    { label: "New", value: "new" },
    { label: "Like New", value: "like_new" },
    { label: "Excellent", value: "excellent" },
    { label: "Good", value: "good" },
    { label: "Fair", value: "fair" },
    { label: "Poor", value: "poor" },
  ];

  const handleImageSelect = (image) => {
    if (image && images.length < 5) {
      setImages([...images, image]);
    } else if (images.length >= 5) {
      Alert.alert("Limit Reached", "You can only add up to 5 images");
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleDeliveryOption = (option) => {
    setDeliveryOptions({
      ...deliveryOptions,
      [option]: !deliveryOptions[option],
    });
  };

  const handleCategoryToggle = (visible) => {
    // Close condition dropdown when opening category
    if (visible) {
      setDropdowns({ categoryVisible: true, conditionVisible: false });
    } else {
      setDropdowns({ ...dropdowns, categoryVisible: false });
    }
  };

  const handleConditionToggle = (visible) => {
    // Close category dropdown when opening condition
    if (visible) {
      setDropdowns({ categoryVisible: false, conditionVisible: true });
    } else {
      setDropdowns({ ...dropdowns, conditionVisible: false });
    }
  };

  const handleScroll = () => {
    // Close all dropdowns when scrolling
    if (dropdowns.categoryVisible || dropdowns.conditionVisible) {
      setDropdowns({ categoryVisible: false, conditionVisible: false });
    }
  };

  const getConditionLabel = (value) => {
    const conditionMap = {
      new: "New",
      like_new: "Like New",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      poor: "Poor",
    };
    return conditionMap[value] || value;
  };

  const onSubmit = (data) => {
    // Additional validation for non-form fields
    if (!category) {
      Alert.alert("Error", "Please select a category");
      return;
    }
    if (!condition) {
      Alert.alert("Error", "Please select a condition");
      return;
    }
    if (images.length === 0) {
      Alert.alert("Error", "Please add at least one product image");
      return;
    }
    if (!Object.values(deliveryOptions).some((val) => val)) {
      Alert.alert("Error", "Please select at least one delivery option");
      return;
    }

    // Generate unique ID
    const productId = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Build tags array from condition and delivery options
    const tags = [getConditionLabel(condition)];
    if (deliveryOptions.pickup) tags.push("Pickup");
    if (deliveryOptions.sellerDelivery) tags.push("Delivery");
    if (deliveryOptions.squadCourier) tags.push("Squad Courier");

    // Format product data to match MarketPlace item structure
    const productData = {
      id: productId,
      title: data.title,
      price: `${data.price} SG`,
      location: data.location || "Location not specified",
      time: "Just now",
      seller: "You", // TODO: Replace with actual user name from auth
      rating: "5.0", // Default rating for new products
      image: images[0], // Use first image
      tags: tags,
      // Store additional data for product details
      description: data.description,
      category: category,
      condition: condition,
      images: images,
      deliveryOptions: deliveryOptions,
      createdAt: new Date().toISOString(),
    };

    // Add product to Redux store
    dispatch(addProduct(productData));

    // TODO: API call will go here
    console.log("Form Data:", productData);
    Alert.alert("Success", "Product posted successfully!", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <>
      <AppHeader title="Post Your Product" showTopIcons={false} />
      <ScrollView 
        ref={scrollViewRef}
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Product Images */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Images *</Text>
          <Text style={styles.sectionSubtitle}>Add up to 5 images (at least 1 required)</Text>
          
          <View style={styles.imageContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.image}
                />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => removeImage(index)}
                >
                  <VectorIcons
                    name={iconLibName.Ionicons}
                    iconName="close-circle"
                    size={24}
                    color={colors.red}
                  />
                </TouchableOpacity>
              </View>
            ))}
            
            {images.length < 5 && (
              <TouchableOpacity
                style={styles.addImageBtn}
                onPress={() => imagePickerRef.current?.open()}
              >
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="camera-outline"
                  size={32}
                  color={colors.primary}
                />
                <Text style={styles.addImageText}>Add Image</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FormProvider {...methods}>
          {/* Product Title */}
          <View style={styles.section}>
            <FormField
              name="title"
              label="Product Title *"
              placeholder="e.g., iPhone 14 Pro Max - 256GB"
              rules={{
                required: "Product title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
              }}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <FormField
              name="description"
              label="Description *"
              placeholder="Describe your product in detail..."
              multiline={true}
              rules={{
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
              }}
              inputWrapperStyle={styles.textAreaWrapper}
            />
          </View>

          {/* Price */}
          <View style={styles.section}>
            <FormField
              name="price"
              label="Price (AUD) *"
              placeholder="Enter price in Australian dollars"
              keyboardType="numeric"
              rules={{
                required: "Price is required",
                validate: (value) => {
                  const numValue = parseFloat(value);
                  if (isNaN(numValue) || numValue <= 0) {
                    return "Please enter a valid price greater than 0";
                  }
                  return true;
                },
              }}
            />
          </View>

          {/* Category */}
          <View style={styles.dropdownSection} collapsable={false} pointerEvents="box-none">
            <Text style={styles.label}>Category *</Text>
            <View style={styles.dropdownWrapper} pointerEvents="box-none">
              <AppDropDown
                placeholder="Select category"
                options={categories}
                selectedValue={category}
                onSelect={(value) => {
                  setCategory(value);
                  setDropdowns({ ...dropdowns, categoryVisible: false });
                }}
                isVisible={dropdowns.categoryVisible}
                setIsVisible={handleCategoryToggle}
                style={styles.dropdown}
                dropdownStyle={[styles.dropdownList, { zIndex: 10000, elevation: 25 }]}
                maxHeight={hp(20)}
              />
            </View>
            {dropdowns.categoryVisible && <View style={styles.dropdownSpacer} />}
          </View>

          {/* Condition */}
          <View style={styles.dropdownSection} collapsable={false} pointerEvents="box-none">
            <Text style={styles.label}>Condition *</Text>
            <View style={styles.dropdownWrapper} pointerEvents="box-none">
              <AppDropDown
                placeholder="Select condition"
                options={conditions}
                selectedValue={condition}
                onSelect={(value) => {
                  setCondition(value);
                  setDropdowns({ ...dropdowns, conditionVisible: false });
                }}
                isVisible={dropdowns.conditionVisible}
                setIsVisible={handleConditionToggle}
                style={styles.dropdown}
                dropdownStyle={[styles.dropdownList, { zIndex: 10000, elevation: 25 }]}
                maxHeight={hp(20)}
              />
            </View>
            {dropdowns.conditionVisible && <View style={styles.dropdownSpacer} />}
          </View>

          {/* Location */}
          <View style={styles.section}>
            <FormField
              name="location"
              label="Location"
              placeholder="e.g., Sydney CBD"
            />
          </View>

        {/* Delivery Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Options *</Text>
          <Text style={styles.sectionSubtitle}>Select at least one option</Text>
          
          <View style={styles.deliveryOptionsContainer}>
            <TouchableOpacity
              style={styles.deliveryOption}
              onPress={() => handleDeliveryOption("pickup")}
            >
              <CustomCheckBox
                checked={deliveryOptions.pickup}
                onPress={() => handleDeliveryOption("pickup")}
              />
              <Text style={styles.deliveryOptionText}>Pickup Available</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deliveryOption}
              onPress={() => handleDeliveryOption("sellerDelivery")}
            >
              <CustomCheckBox
                checked={deliveryOptions.sellerDelivery}
                onPress={() => handleDeliveryOption("sellerDelivery")}
              />
              <Text style={styles.deliveryOptionText}>Seller Delivery Available</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deliveryOption}
              onPress={() => handleDeliveryOption("squadCourier")}
            >
              <CustomCheckBox
                checked={deliveryOptions.squadCourier}
                onPress={() => handleDeliveryOption("squadCourier")}
              />
              <Text style={styles.deliveryOptionText}>Squad Courier Available</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <AppButton
            text="Post Product"
            onPress={handleSubmit(onSubmit)}
            style={styles.submitButton}
          />
        </View>
        </FormProvider>
      </ScrollView>

      <ImagePickerSheet ref={imagePickerRef} onSelect={handleImageSelect} />
    </>
  );
};

export default PostProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: wp(4),
  },
  section: {
    marginBottom: hp(2),
  },
  dropdownSection: {
    marginBottom: hp(2),
    zIndex: 1,
  },
  dropdownWrapper: {
    zIndex: 1000,
    elevation: 5,
    position: 'relative',
  },
  dropdownSpacer: {
    height: hp(25),
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(0.5),
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: hp(1),
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.black,
    marginBottom: hp(1),
    marginLeft: wp(0.5),
  },
  textAreaWrapper: {
    marginBottom: 0,
    minHeight: hp(10),
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(2),
  },
  imageWrapper: {
    width: wp(28),
    height: wp(28),
    borderRadius: 8,
    marginBottom: hp(1),
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "cover",
  },
  removeImageBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  addImageBtn: {
    width: wp(28),
    height: wp(28),
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bgColor,
  },
  addImageText: {
    fontSize: 12,
    color: colors.primary,
    marginTop: hp(0.5),
    fontWeight: "500",
  },
  dropdown: {
    marginBottom: 0,
  },
  dropdownList: {
    zIndex: 9999,
    elevation: 20,
  },
  deliveryOptionsContainer: {
    marginTop: hp(1),
  },
  deliveryOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
    gap: wp(3),
  },
  deliveryOptionText: {
    fontSize: 14,
    color: colors.black,
  },
  buttonContainer: {
    marginTop: hp(2),
    marginBottom: hp(4),
  },
  submitButton: {
    marginTop: hp(1),
  },
});

