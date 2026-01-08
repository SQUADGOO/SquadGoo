import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import AppHeader from "@/core/AppHeader";
import AppButton from "@/core/AppButton";
import FormField from "@/core/FormField";
import AppDropDown from "@/core/AppDropDown";
import CustomCheckBox from "@/core/CustomCheckBox";
import ImagePickerSheet from "@/components/ImagePickerSheet";
import VectorIcons, { iconLibName } from "@/theme/vectorIcon";
import { colors, hp, wp, getFontSize } from "@/theme";
import { addDispute } from "@/store/marketplaceSlice";
import { formatPrice, formatOrderDate } from "@/utilities/marketplaceHelpers";

// Complaint reasons based on requirements document
const buyerReasons = [
  { label: "Item is faulty or not as described", value: "item_faulty" },
  { label: "Scam or Fraud report", value: "scam_fraud" },
  { label: "Seller asking payment outside platform", value: "payment_outside" },
  { label: "Platform hired courier issues", value: "courier_issue" },
  { label: "Seller did not deliver after payment", value: "no_delivery" },
  { label: "Other", value: "other" },
];

const sellerReasons = [
  { label: "Buyer refused to release payment", value: "payment_refused" },
  { label: "Scam or Fraud report", value: "scam_fraud" },
  { label: "Buyer asking to pay outside platform", value: "payment_outside" },
  { label: "Platform hired courier issues", value: "courier_issue" },
  { label: "Other", value: "other" },
];

const buyerTransactionStatus = [
  { label: "Already paid but did not receive item", value: "paid_not_received" },
  { label: "Item did not arrive at my location", value: "not_arrived" },
  { label: "Item arrived / Already picked up", value: "item_received" },
  { label: "Not paid yet, still in process", value: "not_paid" },
  { label: "Already paid, but item faulty", value: "paid_item_faulty" },
];

const sellerTransactionStatus = [
  { label: "Shipped/Picked but no payment released", value: "shipped_no_payment" },
  { label: "Received payment but item not shipped", value: "payment_received" },
];

const buyerResolutions = [
  { label: "Refund my purchase", value: "refund" },
  { label: "Return item back to seller", value: "return" },
  { label: "Request delivery/pickup ASAP", value: "request_delivery" },
  { label: "Other (specify below)", value: "other" },
];

const sellerResolutions = [
  { label: "Refund buyer and get item back", value: "refund_return" },
  { label: "Request payment for delivered item", value: "request_payment" },
  { label: "Other (specify below)", value: "other" },
];

const CreateDispute = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const imagePickerRef = useRef(null);
  const { order } = route.params || {};
  
  const [userType, setUserType] = useState("buyer"); // buyer or seller
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedResolutions, setSelectedResolutions] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const methods = useForm({
    defaultValues: {
      description: "",
      customResolution: "",
    },
  });

  const { handleSubmit } = methods;

  const reasons = userType === "buyer" ? buyerReasons : sellerReasons;
  const transactionStatuses =
    userType === "buyer" ? buyerTransactionStatus : sellerTransactionStatus;
  const resolutions = userType === "buyer" ? buyerResolutions : sellerResolutions;

  const toggleStatus = (value) => {
    if (selectedStatuses.includes(value)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== value));
    } else {
      setSelectedStatuses([...selectedStatuses, value]);
    }
  };

  const toggleResolution = (value) => {
    if (selectedResolutions.includes(value)) {
      setSelectedResolutions(selectedResolutions.filter((r) => r !== value));
    } else {
      setSelectedResolutions([...selectedResolutions, value]);
    }
  };

  const handleImageSelect = (image) => {
    if (image && evidence.length < 5) {
      setEvidence([...evidence, image]);
    } else if (evidence.length >= 5) {
      Alert.alert("Limit Reached", "You can only upload up to 5 files");
    }
  };

  const removeEvidence = (index) => {
    setEvidence(evidence.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!selectedReason) {
      Alert.alert("Error", "Please select a reason for your complaint");
      return false;
    }
    if (selectedStatuses.length === 0) {
      Alert.alert("Error", "Please select at least one transaction status");
      return false;
    }
    if (selectedResolutions.length === 0) {
      Alert.alert("Error", "Please select at least one resolution expectation");
      return false;
    }
    return true;
  };

  const onSubmit = (data) => {
    if (!validateForm()) return;

    if (!data.description || data.description.trim().length < 20) {
      Alert.alert(
        "Error",
        "Please provide a detailed description (minimum 20 characters)"
      );
      return;
    }

    const disputeId = `DSP-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

    const reasonLabel = reasons.find((r) => r.value === selectedReason)?.label;

    const dispute = {
      id: disputeId,
      orderId: order.id,
      orderDetails: {
        total: order.total,
        items: order.items,
        createdAt: order.createdAt,
      },
      complainantType: userType,
      reason: selectedReason,
      reasonLabel: reasonLabel,
      transactionStatus: selectedStatuses,
      resolutionExpectation: selectedResolutions,
      description: data.description.trim(),
      customResolution: data.customResolution?.trim() || null,
      evidence: evidence.map((e) => ({ uri: e.uri, type: e.type || "image" })),
      status: "pending",
      mediatorId: null,
      appeals: 0,
      maxAppeals: 2,
      heldCoins: order.total, // Hold equivalent order amount
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addDispute(dispute));

    Alert.alert(
      "Dispute Submitted",
      `Your dispute ${disputeId} has been submitted successfully. Our mediators will review your case and get back to you within 24-48 hours.\n\n${formatPrice(
        order.total
      )} SG Coins have been put on hold until the dispute is resolved.`,
      [
        {
          text: "View Dispute",
          onPress: () =>
            navigation.navigate("MARKETPLACE_DISPUTE_DETAILS", { dispute }),
        },
        {
          text: "Done",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  if (!order) {
    return (
      <>
        <AppHeader title="Create Dispute" showTopIcons={false} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Order not found</Text>
          <AppButton text="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </>
    );
  }

  return (
    <>
      <AppHeader title="Report an Issue" showTopIcons={false} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          <View style={styles.orderCard}>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Order ID:</Text>
              <Text style={styles.orderValue}>{order.id}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Date:</Text>
              <Text style={styles.orderValue}>
                {formatOrderDate(order.createdAt, true)}
              </Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Total:</Text>
              <Text style={styles.orderValueBold}>{formatPrice(order.total)}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Items:</Text>
              <Text style={styles.orderValue}>
                {order.items?.length || 0} items
              </Text>
            </View>
          </View>
        </View>

        {/* User Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I am the *</Text>
          <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[
                styles.userTypeBtn,
                userType === "buyer" && styles.userTypeBtnActive,
              ]}
              onPress={() => {
                setUserType("buyer");
                setSelectedReason("");
                setSelectedStatuses([]);
                setSelectedResolutions([]);
              }}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="cart-outline"
                size={24}
                color={userType === "buyer" ? colors.white : colors.primary}
              />
              <Text
                style={[
                  styles.userTypeText,
                  userType === "buyer" && styles.userTypeTextActive,
                ]}
              >
                Buyer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.userTypeBtn,
                userType === "seller" && styles.userTypeBtnActive,
              ]}
              onPress={() => {
                setUserType("seller");
                setSelectedReason("");
                setSelectedStatuses([]);
                setSelectedResolutions([]);
              }}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="storefront-outline"
                size={24}
                color={userType === "seller" ? colors.white : colors.primary}
              />
              <Text
                style={[
                  styles.userTypeText,
                  userType === "seller" && styles.userTypeTextActive,
                ]}
              >
                Seller
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reason Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reason of Complaint *</Text>
          <AppDropDown
            placeholder="Select reason..."
            options={reasons}
            selectedValue={selectedReason}
            onSelect={setSelectedReason}
            isVisible={dropdownVisible}
            setIsVisible={setDropdownVisible}
            style={styles.dropdown}
            maxHeight={hp(25)}
          />
        </View>

        {/* Transaction Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Status *</Text>
          <Text style={styles.sectionSubtitle}>Select all that apply</Text>
          {transactionStatuses.map((status) => (
            <TouchableOpacity
              key={status.value}
              style={styles.checkboxRow}
              onPress={() => toggleStatus(status.value)}
            >
              <CustomCheckBox
                checked={selectedStatuses.includes(status.value)}
                onPress={() => toggleStatus(status.value)}
              />
              <Text style={styles.checkboxLabel}>{status.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Resolution Expectation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resolution Expectation *</Text>
          <Text style={styles.sectionSubtitle}>What do you expect to happen?</Text>
          {resolutions.map((resolution) => (
            <TouchableOpacity
              key={resolution.value}
              style={styles.checkboxRow}
              onPress={() => toggleResolution(resolution.value)}
            >
              <CustomCheckBox
                checked={selectedResolutions.includes(resolution.value)}
                onPress={() => toggleResolution(resolution.value)}
              />
              <Text style={styles.checkboxLabel}>{resolution.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description */}
        <FormProvider {...methods}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detailed Description *</Text>
            <Text style={styles.sectionSubtitle}>
              Please describe your complaint in detail (max 2000 words)
            </Text>
            <FormField
              name="description"
              placeholder="Explain the issue, include facts, timeline, and any correspondence..."
              multiline={true}
              rules={{
                required: "Description is required",
                minLength: {
                  value: 20,
                  message: "Please provide more details (min 20 characters)",
                },
                maxLength: {
                  value: 10000,
                  message: "Description too long",
                },
              }}
              inputWrapperStyle={styles.textAreaWrapper}
            />
          </View>

          {/* Custom Resolution (if Other selected) */}
          {selectedResolutions.includes("other") && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Specify Other Resolution</Text>
              <FormField
                name="customResolution"
                placeholder="Describe what resolution you're looking for..."
                multiline={true}
                inputWrapperStyle={styles.smallTextAreaWrapper}
              />
            </View>
          )}
        </FormProvider>

        {/* Evidence Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evidence & Screenshots</Text>
          <Text style={styles.sectionSubtitle}>
            Upload screenshots, chat transcripts, or any proof (max 5 files)
          </Text>

          <View style={styles.evidenceContainer}>
            {evidence.map((item, index) => (
              <View key={index} style={styles.evidenceItem}>
                <Image source={{ uri: item.uri }} style={styles.evidenceImage} />
                <TouchableOpacity
                  style={styles.removeEvidenceBtn}
                  onPress={() => removeEvidence(index)}
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

            {evidence.length < 5 && (
              <TouchableOpacity
                style={styles.addEvidenceBtn}
                onPress={() => imagePickerRef.current?.open()}
              >
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="cloud-upload-outline"
                  size={32}
                  color={colors.primary}
                />
                <Text style={styles.addEvidenceText}>Upload</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Warning */}
        <View style={styles.warningBanner}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="warning-outline"
            size={20}
            color={colors.orange}
          />
          <Text style={styles.warningText}>
            By submitting this dispute, {formatPrice(order.total)} SG Coins will be
            put on hold until the dispute is resolved. False claims may result in
            account penalties.
          </Text>
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <AppButton
            text="Submit Dispute"
            onPress={handleSubmit(onSubmit)}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>

      <ImagePickerSheet ref={imagePickerRef} onSelect={handleImageSelect} />
    </>
  );
};

export default CreateDispute;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp(8),
  },
  errorText: {
    fontSize: getFontSize(16),
    color: colors.gray,
    marginBottom: hp(2),
  },
  orderSummary: {
    padding: wp(4),
    backgroundColor: colors.grayE8 + "30",
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: wp(4),
    borderWidth: 1,
    borderColor: colors.grayE8,
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(1),
  },
  orderLabel: {
    fontSize: getFontSize(14),
    color: colors.gray,
  },
  orderValue: {
    fontSize: getFontSize(14),
    color: colors.black,
  },
  orderValueBold: {
    fontSize: getFontSize(14),
    fontWeight: "bold",
    color: colors.primary,
  },
  section: {
    padding: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8,
  },
  sectionTitle: {
    fontSize: getFontSize(16),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(0.5),
  },
  sectionSubtitle: {
    fontSize: getFontSize(13),
    color: colors.gray,
    marginBottom: hp(1.5),
  },
  userTypeContainer: {
    flexDirection: "row",
    gap: wp(3),
    marginTop: hp(1),
  },
  userTypeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
    paddingVertical: hp(1.5),
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  userTypeBtnActive: {
    backgroundColor: colors.primary,
  },
  userTypeText: {
    fontSize: getFontSize(15),
    fontWeight: "600",
    color: colors.primary,
  },
  userTypeTextActive: {
    color: colors.white,
  },
  dropdown: {
    marginTop: hp(1),
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1),
    gap: wp(3),
  },
  checkboxLabel: {
    flex: 1,
    fontSize: getFontSize(14),
    color: colors.black,
  },
  textAreaWrapper: {
    minHeight: hp(15),
  },
  smallTextAreaWrapper: {
    minHeight: hp(10),
  },
  evidenceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(2),
    marginTop: hp(1),
  },
  evidenceItem: {
    width: wp(25),
    height: wp(25),
    borderRadius: 8,
    position: "relative",
  },
  evidenceImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "cover",
  },
  removeEvidenceBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  addEvidenceBtn: {
    width: wp(25),
    height: wp(25),
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.grayE8 + "30",
  },
  addEvidenceText: {
    fontSize: getFontSize(12),
    color: colors.primary,
    marginTop: hp(0.5),
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEF3C7",
    margin: wp(4),
    padding: wp(3),
    borderRadius: 10,
    gap: wp(2),
  },
  warningText: {
    flex: 1,
    fontSize: getFontSize(13),
    color: "#92400E",
    lineHeight: 18,
  },
  buttonContainer: {
    padding: wp(4),
    paddingBottom: hp(4),
  },
  submitButton: {
    backgroundColor: colors.red,
  },
});

