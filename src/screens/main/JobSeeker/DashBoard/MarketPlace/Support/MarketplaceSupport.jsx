import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AppHeader from "@/core/AppHeader";
import VectorIcons, { iconLibName } from "@/theme/vectorIcon";
import { colors, hp, wp, getFontSize } from "@/theme";
import { screenNames } from "@/navigation/screenNames";

const supportOptions = [
  {
    id: "dispute",
    title: "Dispute Resolution",
    subtitle: "Report issues with orders or transactions",
    icon: "alert-circle-outline",
    iconColor: colors.red,
    bgColor: "#FEE2E2",
    route: "MARKETPLACE_DISPUTE_RESOLUTION",
  },
  {
    id: "faq",
    title: "FAQ's",
    subtitle: "Find answers to common questions",
    icon: "help-circle-outline",
    iconColor: colors.primary,
    bgColor: "#FEF3C7",
    route: "MARKETPLACE_FAQ",
  },
  {
    id: "chat",
    title: "Live Chat",
    subtitle: "Chat with our support team",
    icon: "chatbubbles-outline",
    iconColor: "#10B981",
    bgColor: "#D1FAE5",
    route: "MARKETPLACE_LIVE_CHAT",
  },
  {
    id: "callback",
    title: "Request Callback",
    subtitle: "Schedule a call with support",
    icon: "call-outline",
    iconColor: "#6366F1",
    bgColor: "#E0E7FF",
    route: "MARKETPLACE_REQUEST_CALLBACK",
  },
  {
    id: "tickets",
    title: "Support Tickets",
    subtitle: "View and manage your tickets",
    icon: "ticket-outline",
    iconColor: "#8B5CF6",
    bgColor: "#EDE9FE",
    route: "MARKETPLACE_SUPPORT_TICKETS",
  },
];

const MarketplaceSupport = ({ navigation }) => {
  const handleOptionPress = (option) => {
    if (option.route) {
      navigation.navigate(option.route);
    } else {
      // Show coming soon or implement later
      console.log(`${option.title} - Coming soon`);
    }
  };

  return (
    <>
      <AppHeader title="Marketplace Support" showTopIcons={false} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerIconContainer}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="headset-outline"
              size={40}
              color={colors.primary}
            />
          </View>
          <Text style={styles.headerTitle}>How can we help you?</Text>
          <Text style={styles.headerSubtitle}>
            Choose an option below to get started
          </Text>
        </View>

        {/* Support Options */}
        <View style={styles.optionsContainer}>
          {supportOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleOptionPress(option)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.optionIconContainer,
                  { backgroundColor: option.bgColor },
                ]}
              >
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName={option.icon}
                  size={24}
                  color={option.iconColor}
                />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="chevron-forward"
                size={20}
                color={colors.gray}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="information-circle-outline"
            size={20}
            color={colors.gray}
          />
          <Text style={styles.infoText}>
            For order-related disputes, please use the Dispute Resolution
            option. Our mediators will help resolve any issues between buyers
            and sellers.
          </Text>
        </View>

        {/* Contact Info */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Need urgent help?</Text>
          <View style={styles.contactRow}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="mail-outline"
              size={18}
              color={colors.primary}
            />
            <Text style={styles.contactText}>marketplace@squadgoo.com.au</Text>
          </View>
          <View style={styles.contactRow}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="time-outline"
              size={18}
              color={colors.primary}
            />
            <Text style={styles.contactText}>
              Support hours: Mon-Fri, 9AM-6PM AEST
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default MarketplaceSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerSection: {
    alignItems: "center",
    paddingVertical: hp(4),
    paddingHorizontal: wp(4),
    backgroundColor: colors.grayE8 + "30",
  },
  headerIconContainer: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: getFontSize(22),
    fontWeight: "700",
    color: colors.black,
    marginBottom: hp(0.5),
  },
  headerSubtitle: {
    fontSize: getFontSize(14),
    color: colors.gray,
    textAlign: "center",
  },
  optionsContainer: {
    padding: wp(4),
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: wp(4),
    borderRadius: 12,
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: colors.grayE8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIconContainer: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: getFontSize(16),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(0.3),
  },
  optionSubtitle: {
    fontSize: getFontSize(13),
    color: colors.gray,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.grayE8 + "40",
    marginHorizontal: wp(4),
    padding: wp(4),
    borderRadius: 12,
    marginBottom: hp(2),
    gap: wp(2),
  },
  infoText: {
    flex: 1,
    fontSize: getFontSize(13),
    color: colors.gray,
    lineHeight: 20,
  },
  contactSection: {
    marginHorizontal: wp(4),
    padding: wp(4),
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grayE8,
    marginBottom: hp(4),
  },
  contactTitle: {
    fontSize: getFontSize(16),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(1.5),
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
    gap: wp(2),
  },
  contactText: {
    fontSize: getFontSize(14),
    color: colors.gray,
  },
});

