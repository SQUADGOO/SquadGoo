import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import AppHeader from "@/core/AppHeader";
import AppButton from "@/core/AppButton";
import FormField from "@/core/FormField";
import AppDropDown from "@/core/AppDropDown";
import VectorIcons, { iconLibName } from "@/theme/vectorIcon";
import { colors, hp, wp, getFontSize } from "@/theme";

const RequestCallback = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [dateDropdownVisible, setDateDropdownVisible] = useState(false);
  const [timeDropdownVisible, setTimeDropdownVisible] = useState(false);
  const [topicDropdownVisible, setTopicDropdownVisible] = useState(false);

  const methods = useForm({
    defaultValues: {
      phoneNumber: "",
      additionalNotes: "",
    },
  });

  const { handleSubmit } = methods;

  // Generate next 7 days for date selection
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        const formattedDate = date.toLocaleDateString("en-AU", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });
        dates.push({
          label: formattedDate,
          value: date.toISOString().split("T")[0],
        });
      }
    }
    return dates;
  };

  const timeSlots = [
    { label: "9:00 AM - 10:00 AM", value: "09:00" },
    { label: "10:00 AM - 11:00 AM", value: "10:00" },
    { label: "11:00 AM - 12:00 PM", value: "11:00" },
    { label: "12:00 PM - 1:00 PM", value: "12:00" },
    { label: "2:00 PM - 3:00 PM", value: "14:00" },
    { label: "3:00 PM - 4:00 PM", value: "15:00" },
    { label: "4:00 PM - 5:00 PM", value: "16:00" },
    { label: "5:00 PM - 6:00 PM", value: "17:00" },
  ];

  const topics = [
    { label: "Order Issues", value: "order_issues" },
    { label: "Payment Problems", value: "payment_problems" },
    { label: "Dispute Assistance", value: "dispute_assistance" },
    { label: "Account Questions", value: "account_questions" },
    { label: "Technical Support", value: "technical_support" },
    { label: "Seller Support", value: "seller_support" },
    { label: "Squad Courier Issues", value: "courier_issues" },
    { label: "Other", value: "other" },
  ];

  const handleDropdownToggle = (dropdown, visible) => {
    // Close all dropdowns first
    setDateDropdownVisible(false);
    setTimeDropdownVisible(false);
    setTopicDropdownVisible(false);
    
    // Open the requested one
    if (visible) {
      switch (dropdown) {
        case "date":
          setDateDropdownVisible(true);
          break;
        case "time":
          setTimeDropdownVisible(true);
          break;
        case "topic":
          setTopicDropdownVisible(true);
          break;
      }
    }
  };

  const onSubmit = (data) => {
    if (!selectedDate) {
      Alert.alert("Error", "Please select a preferred date");
      return;
    }
    if (!selectedTime) {
      Alert.alert("Error", "Please select a preferred time slot");
      return;
    }
    if (!selectedTopic) {
      Alert.alert("Error", "Please select a topic for your call");
      return;
    }

    const callbackId = `CB-${Date.now().toString(36).toUpperCase()}`;
    const selectedDateLabel = generateDateOptions().find(
      (d) => d.value === selectedDate
    )?.label;
    const selectedTimeLabel = timeSlots.find(
      (t) => t.value === selectedTime
    )?.label;

    Alert.alert(
      "Callback Scheduled! 📞",
      `Your callback has been scheduled successfully.\n\n` +
        `Reference: ${callbackId}\n` +
        `Date: ${selectedDateLabel}\n` +
        `Time: ${selectedTimeLabel} (AEST)\n\n` +
        `Our support team will call you at your registered phone number. Please ensure you're available during the scheduled time.`,
      [
        {
          text: "Done",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <>
      <AppHeader title="Request Callback" showTopIcons={false} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View style={styles.headerSection}>
          <View style={styles.headerIconContainer}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="call"
              size={36}
              color={colors.primary}
            />
          </View>
          <Text style={styles.headerTitle}>Schedule a Call</Text>
          <Text style={styles.headerSubtitle}>
            Our support team will call you at your preferred time
          </Text>
        </View>

        {/* Availability Info */}
        <View style={styles.availabilityBanner}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="time-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.availabilityText}>
            Available Mon-Fri, 9:00 AM - 6:00 PM AEST
          </Text>
        </View>

        <FormProvider {...methods}>
          {/* Topic Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>What do you need help with? *</Text>
            <AppDropDown
              placeholder="Select a topic..."
              options={topics}
              selectedValue={selectedTopic}
              onSelect={(value) => {
                setSelectedTopic(value);
                setTopicDropdownVisible(false);
              }}
              isVisible={topicDropdownVisible}
              setIsVisible={(visible) => handleDropdownToggle("topic", visible)}
              style={styles.dropdown}
              maxHeight={hp(25)}
            />
          </View>

          {/* Date Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Preferred Date *</Text>
            <AppDropDown
              placeholder="Select a date..."
              options={generateDateOptions()}
              selectedValue={selectedDate}
              onSelect={(value) => {
                setSelectedDate(value);
                setDateDropdownVisible(false);
              }}
              isVisible={dateDropdownVisible}
              setIsVisible={(visible) => handleDropdownToggle("date", visible)}
              style={styles.dropdown}
              maxHeight={hp(25)}
            />
          </View>

          {/* Time Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Preferred Time Slot *</Text>
            <AppDropDown
              placeholder="Select a time slot..."
              options={timeSlots}
              selectedValue={selectedTime}
              onSelect={(value) => {
                setSelectedTime(value);
                setTimeDropdownVisible(false);
              }}
              isVisible={timeDropdownVisible}
              setIsVisible={(visible) => handleDropdownToggle("time", visible)}
              style={styles.dropdown}
              maxHeight={hp(25)}
            />
          </View>

          {/* Phone Number */}
          <View style={styles.section}>
            <FormField
              name="phoneNumber"
              label="Contact Phone Number"
              placeholder="Enter phone number (optional)"
              keyboardType="phone-pad"
            />
            <Text style={styles.hintText}>
              Leave empty to use your registered phone number
            </Text>
          </View>

          {/* Additional Notes */}
          <View style={styles.section}>
            <FormField
              name="additionalNotes"
              label="Additional Notes (Optional)"
              placeholder="Briefly describe your issue so we can prepare..."
              multiline={true}
              inputWrapperStyle={styles.textAreaWrapper}
            />
          </View>
        </FormProvider>

        {/* Info Cards */}
        <View style={styles.infoCardsContainer}>
          <View style={styles.infoCard}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="checkmark-circle"
              size={24}
              color={colors.green}
            />
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>Confirmation</Text>
              <Text style={styles.infoCardText}>
                You'll receive an SMS confirmation
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="notifications"
              size={24}
              color={colors.orange}
            />
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>Reminder</Text>
              <Text style={styles.infoCardText}>
                We'll remind you 15 min before
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="refresh"
              size={24}
              color={colors.primary}
            />
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>Reschedule</Text>
              <Text style={styles.infoCardText}>
                Can reschedule up to 1 hour before
              </Text>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <AppButton
            text="Schedule Callback"
            onPress={handleSubmit(onSubmit)}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default RequestCallback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerSection: {
    alignItems: "center",
    paddingVertical: hp(3),
    paddingHorizontal: wp(4),
    backgroundColor: colors.grayE8 + "30",
  },
  headerIconContainer: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(1.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: getFontSize(20),
    fontWeight: "700",
    color: colors.black,
    marginBottom: hp(0.5),
  },
  headerSubtitle: {
    fontSize: getFontSize(14),
    color: colors.gray,
    textAlign: "center",
  },
  availabilityBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary + "15",
    paddingVertical: hp(1.2),
    gap: wp(2),
  },
  availabilityText: {
    fontSize: getFontSize(13),
    color: colors.primary,
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  label: {
    fontSize: getFontSize(15),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(1),
  },
  dropdown: {
    marginBottom: 0,
  },
  hintText: {
    fontSize: getFontSize(12),
    color: colors.gray,
    marginTop: hp(0.5),
    marginLeft: wp(1),
  },
  textAreaWrapper: {
    minHeight: hp(10),
  },
  infoCardsContainer: {
    padding: wp(4),
    gap: hp(1.5),
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.grayE8 + "40",
    padding: wp(3),
    borderRadius: 10,
    gap: wp(3),
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: getFontSize(14),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(0.2),
  },
  infoCardText: {
    fontSize: getFontSize(12),
    color: colors.gray,
  },
  buttonContainer: {
    padding: wp(4),
    paddingBottom: hp(4),
  },
  submitButton: {
    marginTop: hp(1),
  },
});

