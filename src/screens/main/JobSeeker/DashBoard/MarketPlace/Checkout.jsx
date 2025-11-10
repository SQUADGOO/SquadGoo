import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import AppHeader from "@/core/AppHeader";
import AppButton from "@/core/AppButton";
import CustomCheckBox from "@/core/CustomCheckBox";
import FormField from "@/core/FormField";
import { useSelector } from "react-redux";
import { colors, hp, wp, getFontSize } from "@/theme";
import { screenNames } from "@/navigation/screenNames";
import VectorIcons, { iconLibName } from "@/theme/vectorIcon";
import {
  calculateCartTotal,
  calculateDeliveryFee,
  formatPrice,
} from "@/utilities/marketplaceHelpers";

const Checkout = ({ navigation, route }) => {
  const cart = useSelector((state) => state.marketplace.cart);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("");

  const methods = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      deliveryInstructions: "",
    },
  });

  const { handleSubmit, formState: { errors } } = methods;

  const deliveryMethods = [
    { id: "pickup", label: "Pickup Available", description: "Collect from seller location" },
    { id: "sellerDelivery", label: "Seller Delivery", description: "Seller will deliver to your address" },
    { id: "squadCourier", label: "Squad Courier", description: "Professional courier service" },
  ];

  const total = calculateCartTotal(cart);

  const onSubmit = (data) => {
    console.log("data", data);
    if (!selectedDeliveryMethod) {
      return;
    }

    navigation.navigate(screenNames.MARKETPLACE_PAYMENT, {
      deliveryInfo: {
        ...data,
        deliveryMethod: selectedDeliveryMethod,
      },
      cartItems: cart,
      total: total,
    });
  };

  return (
    <>
      <AppHeader title="Checkout" showTopIcons={false} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Delivery Method Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Method *</Text>
          <Text style={styles.sectionSubtitle}>Select how you want to receive your items</Text>
          
          {deliveryMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.deliveryOption,
                selectedDeliveryMethod === method.id && styles.deliveryOptionSelected,
              ]}
              onPress={() => setSelectedDeliveryMethod(method.id)}
            >
              <CustomCheckBox
                checked={selectedDeliveryMethod === method.id}
                onPress={() => setSelectedDeliveryMethod(method.id)}
              />
              <View style={styles.deliveryOptionContent}>
                <Text style={styles.deliveryOptionLabel}>{method.label}</Text>
                <Text style={styles.deliveryOptionDescription}>{method.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Delivery Address */}
        <FormProvider {...methods}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            
            <FormField
              name="fullName"
              label="Full Name *"
              placeholder="Enter your full name"
              rules={{
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              }}
            />

            <FormField
              name="phone"
              label="Phone Number *"
              placeholder="Enter your phone number"
              // keyboardType="phone-pad"
              // rules={{
              //   required: "Phone number is required",
              //   pattern: {
              //     value: /^[0-9]{10,15}$/,
              //     message: "Please enter a valid phone number",
              //   },
              // }}
            />

            <FormField
              name="address"
              label="Street Address *"
              placeholder="Enter your street address"
              rules={{
                required: "Address is required",
              }}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <FormField
                  name="city"
                  label="City *"
                  placeholder="Enter city"
                  rules={{
                    required: "City is required",
                  }}
                />
              </View>
              <View style={styles.halfWidth}>
                <FormField
                  name="state"
                  label="State *"
                  placeholder="Enter state"
                  rules={{
                    required: "State is required",
                  }}
                />
              </View>
            </View>

            <FormField
              name="postalCode"
              label="Postal Code *"
              placeholder="Enter postal code"
              keyboardType="numeric"
              rules={{
                required: "Postal code is required",
                pattern: {
                  value: /^[0-9]{4,6}$/,
                  message: "Please enter a valid postal code",
                },
              }}
            />

            <FormField
              name="deliveryInstructions"
              label="Delivery Instructions (Optional)"
              placeholder="Any special instructions for delivery..."
              multiline={true}
              inputWrapperStyle={styles.textAreaWrapper}
            />
          </View>
        </FormProvider>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items ({cart.length}):</Text>
              <Text style={styles.summaryValue}>{formatPrice(total)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery:</Text>
              <Text style={styles.summaryValue}>
                {selectedDeliveryMethod 
                  ? formatPrice(calculateDeliveryFee(selectedDeliveryMethod))
                  : "TBD"}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>
                {formatPrice(total + calculateDeliveryFee(selectedDeliveryMethod))}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            text="Continue to Payment"
            onPress={handleSubmit(onSubmit)}
            disabled={!selectedDeliveryMethod}
            style={styles.continueButton}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    marginBottom: hp(0.5),
  },
  sectionSubtitle: {
    fontSize: getFontSize(14),
    color: colors.gray,
    marginBottom: hp(2),
  },
  deliveryOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp(3),
    marginBottom: hp(1),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grayE8,
    backgroundColor: colors.white,
  },
  deliveryOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.grayE8 + "20",
  },
  deliveryOptionContent: {
    flex: 1,
    marginLeft: wp(3),
  },
  deliveryOptionLabel: {
    fontSize: getFontSize(15),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(0.3),
  },
  deliveryOptionDescription: {
    fontSize: getFontSize(12),
    color: colors.gray,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  textAreaWrapper: {
    minHeight: hp(10),
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
  buttonContainer: {
    padding: wp(4),
    paddingBottom: hp(4),
  },
  continueButton: {
    marginTop: hp(1),
  },
});

