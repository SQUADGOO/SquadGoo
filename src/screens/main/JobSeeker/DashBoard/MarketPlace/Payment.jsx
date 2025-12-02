import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import AppHeader from "@/core/AppHeader";
import AppButton from "@/core/AppButton";
import FormField from "@/core/FormField";
import { useDispatch } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import { addOrder, clearCart } from "@/store/marketplaceSlice";
import { colors, hp, wp, getFontSize } from "@/theme";
import { screenNames } from "@/navigation/screenNames";
import { showToast, toastTypes } from "@/utilities/toastConfig";
import {
  calculateDeliveryFee,
  generateOrderId,
  formatCardNumber,
  formatExpiryDate,
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  formatPrice,
} from "@/utilities/marketplaceHelpers";

const Payment = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { deliveryInfo, cartItems, total } = route.params || {};

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");

  const methods = useForm({
    defaultValues: {
      cardNumber: "",
      cardHolderName: "",
      expiryDate: "",
      cvv: "",
    },
    mode: "onBlur",
  });

  const { handleSubmit, formState: { errors } } = methods;

  const deliveryFee = calculateDeliveryFee(deliveryInfo?.deliveryMethod);
  const finalTotal = (total || 0) + deliveryFee;

  const onSubmit = (data) => {
    console.log("Form submitted with data:", data);
    console.log("Form errors:", errors);
    console.log("Route params:", { deliveryInfo, cartItems, total });

    // Check if required params are present
    if (!cartItems || cartItems.length === 0) {
      Alert.alert("Error", "No items in cart. Please go back and add items to cart.");
      return;
    }

    if (!deliveryInfo) {
      Alert.alert("Error", "Delivery information is missing. Please go back to checkout.");
      return;
    }

    // Validate card details
    if (selectedPaymentMethod === "card") {
      if (!validateCardNumber(data.cardNumber)) {
        Alert.alert("Invalid Card", "Please enter a valid 16-digit card number");
        return;
      }
      if (!validateExpiryDate(data.expiryDate)) {
        Alert.alert("Invalid Expiry", "Please enter a valid expiry date (MM/YY)");
        return;
      }
      if (!validateCVV(data.cvv)) {
        Alert.alert("Invalid CVV", "Please enter a valid CVV");
        return;
      }
    }

    // Create order
    const order = {
      id: generateOrderId(),
      items: cartItems.map(item => ({
        ...item,
        quantity: item.quantity || 1,
      })),
      deliveryInfo: {
        ...deliveryInfo,
        paymentMethod: selectedPaymentMethod,
      },
      paymentInfo: selectedPaymentMethod === "card" ? {
        cardLast4: (data.cardNumber || "").replace(/\s/g, "").slice(-4),
        cardHolderName: data.cardHolderName || "",
      } : {},
      total: finalTotal,
      subtotal: total || 0,
      deliveryFee: deliveryFee,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Creating order:", order);

  
    try {
      // Add order to Redux
      dispatch(addOrder(order));
      
      // Clear cart
      dispatch(clearCart());

      console.log("Order added to Redux, showing success alert");

      // Show success message with a slight delay to ensure state is updated
      setTimeout(() => {
        try {
          Alert.alert(
            "Payment Successful!",
            `Your order ${order.id} has been placed successfully.`,
            [
              {
                text: "View Orders",
                onPress: () => {
                  console.log("Navigating to orders");
                  try {
                    navigation.navigate(screenNames.MARKETPLACE_STACK, {
                      screen: screenNames.MARKETPLACE_ORDERS,
                    });
                  } catch (navError) {
                    console.error("Navigation error:", navError);
                    navigation.goBack();
                  }
                },
              },
              {
                text: "Continue Shopping",
                style: "cancel",
                onPress: () => {
                  console.log("Navigating to marketplace");
                  try {
                    navigation.navigate(screenNames.MARKETPLACE_STACK, {
                      screen: screenNames.MARKET_PLACE,
                    });
                  } catch (navError) {
                    console.error("Navigation error:", navError);
                    navigation.goBack();
                  }
                },
              },
            ]
          );
        } catch (alertError) {
          console.error("Alert error:", alertError);
          // Fallback: use toast notification
          showToast("Payment successful! Order placed.", "Success", toastTypes.success);
          navigation.navigate(screenNames.MARKETPLACE_STACK, {
            screen: screenNames.MARKET_PLACE,
          });
        }
      }, 100);
    } catch (error) {
      console.error("Error processing payment:", error);
      Alert.alert(
        "Error",
        "There was an error processing your payment. Please try again."
      );
    }
  };

  const handlePayPress = () => {
    console.log("Pay button pressed");
    console.log("Form errors:", errors);
    handleSubmit(onSubmit, (errors) => {
      console.log("Form validation errors:", errors);
      if (Object.keys(errors).length > 0) {
        const firstError = Object.values(errors)[0];
        Alert.alert(
          "Validation Error",
          firstError?.message || "Please fill in all required fields correctly."
        );
      }
    })();
  };

  return (
    <>
      <AppHeader title="Payment" showTopIcons={false} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Payment Method Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <View style={styles.paymentMethodContainer}>
            <View
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === "card" && styles.paymentMethodSelected,
              ]}
            >
              <Text style={styles.paymentMethodText}>💳 Credit/Debit Card</Text>
            </View>
          </View>
        </View>

        {/* Card Details */}
        {selectedPaymentMethod === "card" && (
          <FormProvider {...methods}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Card Details</Text>
              
              <FormField
                name="cardNumber"
                label="Card Number *"
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                rules={{
                  required: "Card number is required",
                  validate: (value) => {
                    const cleaned = value.replace(/\s/g, "");
                    if (cleaned.length < 16) {
                      return "Card number must be 16 digits";
                    }
                    return true;
                  },
                }}
                onChangeText={(text) => {
                  const formatted = formatCardNumber(text);
                  methods.setValue("cardNumber", formatted);
                }}
              />

              <FormField
                name="cardHolderName"
                label="Card Holder Name *"
                placeholder="John Doe"
                rules={{
                  required: "Card holder name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                }}
              />

              <View style={styles.row}>
                <View style={[styles.halfWidth, {width: wp(50)}]}>
                  <FormField
                    name="expiryDate"
                    label="Expiry Date (MM/YY) *"
                    placeholder="12/25"
                    keyboardType="numeric"
                    rules={{
                      required: "Expiry date is required",
                      validate: (value) => {
                        if (value.length < 5) {
                          return "Please enter MM/YY format";
                        }
                        return true;
                      },
                    }}
                    onChangeText={(text) => {
                      const formatted = formatExpiryDate(text);
                      methods.setValue("expiryDate", formatted);
                    }}
                  />
                </View>
                <View style={styles.halfWidth}>
                  <FormField
                    name="cvv"
                    label="CVV *"
                    placeholder="123"
                    keyboardType="numeric"
                    secureTextEntry={true}
                    rules={{
                      required: "CVV is required",
                      validate: (value) => {
                        if (value.length < 3) {
                          return "CVV must be 3-4 digits";
                        }
                        return true;
                      },
                    }}
                  />
                </View>
              </View>
            </View>
          </FormProvider>
        )}

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>{formatPrice(total || 0)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery:</Text>
              <Text style={styles.summaryValue}>{formatPrice(deliveryFee)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{formatPrice(finalTotal)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            text={`Pay ${formatPrice(finalTotal)}`}
            onPress={handlePayPress}
            style={styles.payButton}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default Payment;

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
    marginBottom: hp(2),
  },
  paymentMethodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  paymentMethod: {
    padding: wp(4),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grayE8,
    backgroundColor: colors.white,
    marginRight: wp(2),
    marginBottom: hp(1),
  },
  paymentMethodSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.grayE8 + "20",
  },
  paymentMethodText: {
    fontSize: getFontSize(15),
    fontWeight: "500",
    color: colors.black,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "40%",
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
  payButton: {
    marginTop: hp(1),
  },
});

