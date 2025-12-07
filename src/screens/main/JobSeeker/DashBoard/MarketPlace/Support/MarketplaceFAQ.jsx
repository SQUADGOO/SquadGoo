import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AppHeader from "@/core/AppHeader";
import VectorIcons, { iconLibName } from "@/theme/vectorIcon";
import { colors, hp, wp, getFontSize } from "@/theme";

const faqData = [
  {
    category: "Buying",
    icon: "cart-outline",
    color: "#10B981",
    questions: [
      {
        q: "How do I purchase items on the marketplace?",
        a: "Browse items, click 'Buy Now' or add to cart, proceed to checkout, select delivery method, and complete payment using SG Coins.",
      },
      {
        q: "What payment methods are accepted?",
        a: "All marketplace transactions use SG Coins. You can purchase SG Coins through your wallet using credit/debit cards or bank transfer.",
      },
      {
        q: "Can I hold an item before purchasing?",
        a: "Yes! Use the 'Hold Listing' feature to reserve an item. The first 30 minutes are free, then 5 SG Coins per additional 30 minutes.",
      },
      {
        q: "What happens if the item I receive is different from the description?",
        a: "You can file a dispute within 7 days of receiving the item. Go to Support > Dispute Resolution and provide evidence. Our mediators will help resolve the issue.",
      },
      {
        q: "How do I track my order?",
        a: "Go to 'My Orders' to view order status. If seller provides tracking, you'll see it in the order details.",
      },
    ],
  },
  {
    category: "Selling",
    icon: "storefront-outline",
    color: "#6366F1",
    questions: [
      {
        q: "How do I list an item for sale?",
        a: "Click 'Sell your product' on the marketplace home, fill in product details, add photos (up to 5), set price, and submit for review.",
      },
      {
        q: "What fees does SquadGoo charge for selling?",
        a: "SquadGoo charges 0.2% transaction fee from the seller's received amount, capped at 100 SG Coins maximum.",
      },
      {
        q: "When do I receive payment for my sold items?",
        a: "Payment is credited to your wallet after buyer confirms receipt. There's a 7-day hold period for fraud monitoring before you can withdraw.",
      },
      {
        q: "Can I offer delivery for my items?",
        a: "Yes! You can offer pickup, seller delivery, or enable Squad Courier service when listing your item.",
      },
    ],
  },
  {
    category: "Delivery",
    icon: "car-outline",
    color: "#F59E0B",
    questions: [
      {
        q: "What is Squad Courier?",
        a: "Squad Courier is our delivery service connecting buyers/sellers with registered delivery personnel. They can pickup, deliver, and even inspect items on your behalf.",
      },
      {
        q: "How much does Squad Courier cost?",
        a: "Pricing includes: Base fee (10 SG Coins) + Per km charge (1 SG Coin per 5 km) + 0.2% transaction fee.",
      },
      {
        q: "Can Squad Courier inspect items for me?",
        a: "Yes! Request 'Inspection Service' when using Squad Courier. The courier will inspect and provide feedback before you commit to purchase.",
      },
    ],
  },
  {
    category: "Disputes",
    icon: "alert-circle-outline",
    color: "#EF4444",
    questions: [
      {
        q: "How do I file a dispute?",
        a: "Go to Support > Dispute Resolution > Select the order > Fill the complaint form with details and evidence.",
      },
      {
        q: "What happens when I file a dispute?",
        a: "The equivalent SG Coins of the order are put on hold. A mediator reviews your case and creates a group chat for both parties to present evidence.",
      },
      {
        q: "How long does dispute resolution take?",
        a: "Our mediators aim to resolve disputes within 7 days. Complex cases may take longer.",
      },
      {
        q: "Can I appeal a dispute decision?",
        a: "Yes, you have 2 re-appeal chances. However, appeals without new evidence will be automatically closed.",
      },
      {
        q: "What evidence should I provide for disputes?",
        a: "Screenshots of chat conversations, photos of received items, payment receipts, shipping/tracking information, and any other relevant documentation.",
      },
    ],
  },
  {
    category: "Payments & Wallet",
    icon: "wallet-outline",
    color: "#8B5CF6",
    questions: [
      {
        q: "What are SG Coins?",
        a: "SG Coins is SquadGoo's platform currency. 1 SG Coin = 1 AUD. All marketplace transactions use SG Coins.",
      },
      {
        q: "How do I buy SG Coins?",
        a: "Go to your Wallet, click 'Purchase SG Coins', and pay using credit/debit card or bank transfer.",
      },
      {
        q: "How do I withdraw my SG Coins?",
        a: "Go to Wallet > Withdraw. Enter amount and bank details. Withdrawals typically process within 1-3 business days.",
      },
      {
        q: "Why are my coins on hold?",
        a: "Coins may be held for: 7-day fraud monitoring after sales, active disputes, or pending transactions.",
      },
    ],
  },
  {
    category: "Safety & Security",
    icon: "shield-checkmark-outline",
    color: "#06B6D4",
    questions: [
      {
        q: "How does SquadGoo protect buyers?",
        a: "We hold payments until buyers confirm receipt, provide dispute resolution, verify sellers, and maintain transaction records.",
      },
      {
        q: "How does SquadGoo protect sellers?",
        a: "We verify buyers, hold disputes fairly, protect against false claims with evidence requirements, and maintain payment security.",
      },
      {
        q: "Should I pay or accept payment outside the platform?",
        a: "No! Always use in-platform payments. Off-platform transactions are not protected and may violate our terms of service.",
      },
    ],
  },
];

const MarketplaceFAQ = ({ navigation }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
    setExpandedQuestion(null);
  };

  const toggleQuestion = (questionIndex) => {
    setExpandedQuestion(expandedQuestion === questionIndex ? null : questionIndex);
  };

  // Filter FAQs based on search
  const getFilteredFAQs = () => {
    if (!searchQuery.trim()) return faqData;

    const query = searchQuery.toLowerCase().trim();
    return faqData
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (q) =>
            q.q.toLowerCase().includes(query) ||
            q.a.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.questions.length > 0);
  };

  const filteredFAQs = getFilteredFAQs();

  return (
    <>
      <AppHeader title="Frequently Asked Questions" showTopIcons={false} />
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="search-outline"
            size={20}
            color={colors.gray}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search FAQs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.gray}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="close-circle"
                size={20}
                color={colors.gray}
              />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {filteredFAQs.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="search-outline"
                size={48}
                color={colors.gray}
              />
              <Text style={styles.noResultsText}>No matching FAQs found</Text>
              <Text style={styles.noResultsSubtext}>
                Try different keywords or browse categories below
              </Text>
            </View>
          ) : (
            filteredFAQs.map((category, categoryIndex) => (
              <View key={category.category} style={styles.categoryContainer}>
                {/* Category Header */}
                <TouchableOpacity
                  style={styles.categoryHeader}
                  onPress={() => toggleCategory(category.category)}
                  activeOpacity={0.7}
                >
                  <View style={styles.categoryLeft}>
                    <View
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: category.color + "20" },
                      ]}
                    >
                      <VectorIcons
                        name={iconLibName.Ionicons}
                        iconName={category.icon}
                        size={22}
                        color={category.color}
                      />
                    </View>
                    <Text style={styles.categoryTitle}>{category.category}</Text>
                    <View style={styles.questionCount}>
                      <Text style={styles.questionCountText}>
                        {category.questions.length}
                      </Text>
                    </View>
                  </View>
                  <VectorIcons
                    name={iconLibName.Ionicons}
                    iconName={
                      expandedCategory === category.category
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={22}
                    color={colors.gray}
                  />
                </TouchableOpacity>

                {/* Questions */}
                {expandedCategory === category.category && (
                  <View style={styles.questionsContainer}>
                    {category.questions.map((item, qIndex) => {
                      const questionKey = `${categoryIndex}-${qIndex}`;
                      return (
                        <View key={qIndex} style={styles.questionItem}>
                          <TouchableOpacity
                            style={styles.questionHeader}
                            onPress={() => toggleQuestion(questionKey)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.questionText}>{item.q}</Text>
                            <VectorIcons
                              name={iconLibName.Ionicons}
                              iconName={
                                expandedQuestion === questionKey
                                  ? "remove-circle-outline"
                                  : "add-circle-outline"
                              }
                              size={22}
                              color={colors.primary}
                            />
                          </TouchableOpacity>
                          {expandedQuestion === questionKey && (
                            <View style={styles.answerContainer}>
                              <Text style={styles.answerText}>{item.a}</Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            ))
          )}

          {/* Contact Section */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Still need help?</Text>
            <Text style={styles.contactSubtitle}>
              Our support team is here for you
            </Text>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => navigation.goBack()}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="chatbubbles-outline"
                size={20}
                color={colors.white}
              />
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default MarketplaceFAQ;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.grayE8 + "50",
    margin: wp(4),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    borderRadius: 12,
    gap: wp(2),
  },
  searchInput: {
    flex: 1,
    fontSize: getFontSize(15),
    color: colors.black,
  },
  scrollView: {
    flex: 1,
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: hp(8),
    paddingHorizontal: wp(8),
  },
  noResultsText: {
    fontSize: getFontSize(16),
    fontWeight: "600",
    color: colors.black,
    marginTop: hp(2),
  },
  noResultsSubtext: {
    fontSize: getFontSize(14),
    color: colors.gray,
    textAlign: "center",
    marginTop: hp(0.5),
  },
  categoryContainer: {
    marginBottom: hp(1),
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: wp(3),
  },
  categoryIcon: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    justifyContent: "center",
    alignItems: "center",
  },
  categoryTitle: {
    fontSize: getFontSize(16),
    fontWeight: "600",
    color: colors.black,
  },
  questionCount: {
    backgroundColor: colors.grayE8,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.2),
    borderRadius: 10,
  },
  questionCountText: {
    fontSize: getFontSize(12),
    color: colors.gray,
    fontWeight: "500",
  },
  questionsContainer: {
    backgroundColor: colors.grayE8 + "30",
    paddingHorizontal: wp(4),
  },
  questionItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: hp(2),
    gap: wp(2),
  },
  questionText: {
    flex: 1,
    fontSize: getFontSize(14),
    fontWeight: "500",
    color: colors.black,
    lineHeight: 22,
  },
  answerContainer: {
    paddingBottom: hp(2),
    paddingRight: wp(8),
  },
  answerText: {
    fontSize: getFontSize(14),
    color: colors.gray,
    lineHeight: 22,
  },
  contactSection: {
    alignItems: "center",
    padding: wp(6),
    marginTop: hp(2),
    marginBottom: hp(4),
    marginHorizontal: wp(4),
    backgroundColor: colors.grayE8 + "40",
    borderRadius: 16,
  },
  contactTitle: {
    fontSize: getFontSize(18),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp(0.5),
  },
  contactSubtitle: {
    fontSize: getFontSize(14),
    color: colors.gray,
    marginBottom: hp(2),
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: 10,
    gap: wp(2),
  },
  contactButtonText: {
    fontSize: getFontSize(15),
    fontWeight: "600",
    color: colors.white,
  },
});

