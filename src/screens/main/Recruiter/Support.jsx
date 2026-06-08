import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { screenNames } from '@/navigation/screenNames';
import GradientHeader from '@/core/GradientHeader';
import { useSelector } from 'react-redux';
import {
  supportFaqs as recruiterFaqs,
} from './supportData';
import {
  supportFaqs as jobseekerFaqs,
} from '../JobSeeker/supportData';
import LinearGradient from 'react-native-linear-gradient';

const SUPPORT_CARDS = [
  {
    id: 'faqs',
    title: "FAQ's",
    subtitle: 'Find answers quickly',
    icon: 'help-circle-outline',
    gradient: ['#7C3AED', '#A78BFA'],
  },
  {
    id: 'chat',
    title: 'Live Chat',
    subtitle: 'Connect instantly',
    icon: 'chatbubbles-outline',
    gradient: ['#2563EB', '#60A5FA'],
  },
  {
    id: 'callback',
    title: 'Request Callback',
    subtitle: 'Schedule a call',
    icon: 'call-outline',
    gradient: ['#059669', '#34D399'],
  },
  {
    id: 'tickets',
    title: 'Support Tickets',
    subtitle: 'Track your issues',
    icon: 'ticket-outline',
    gradient: ['#DC2626', '#F87171'],
  },
];

// Search topics for autocomplete
const RECRUITER_SEARCH_TOPICS = [
  'How to post a job',
  'How to manage offers',
  'Payment methods',
  'Refund policy',
  'Account settings',
  'Change password',
  'Two-factor authentication',
  'Delete my account',
  'Profile visibility',
  'Labour pool',
  'Switch profile type',
  'Subscription plans',
  'Contact support',
  'Report a bug',
  'Privacy policy',
  'Terms of service',
];

const JOBSEEKER_SEARCH_TOPICS = [
  'How to accept a job offer',
  'How to decline an offer',
  'Request modification',
  'Cancel a job',
  'Wallet withdrawal',
  'Payment status',
  'KYC verification',
  'Update profile',
  'Upload qualifications',
  'Change password',
  'Account recovery',
  'Contact support',
  'Report a bug',
  'Escrow and holds',
  'Acceptance rating',
  'Privacy policy',
];

const Support = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const role = useSelector((state) => state.auth?.role);
  const isJobseeker = role?.toLowerCase() === 'jobseeker';
  const supportFaqs = isJobseeker ? jobseekerFaqs : recruiterFaqs;
  const SEARCH_TOPICS = isJobseeker ? JOBSEEKER_SEARCH_TOPICS : RECRUITER_SEARCH_TOPICS;

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return SEARCH_TOPICS.filter((topic) =>
      topic.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, SEARCH_TOPICS]);

  const handleSupportAction = (action) => {
    switch (action) {
      case 'faqs':
        navigation.navigate(screenNames.SUPPORT_FAQ, { faqs: supportFaqs });
        break;
      case 'chat':
        navigation.navigate(screenNames.LIVE_CHAT);
        break;
      case 'callback':
        navigation.navigate(screenNames.REQUEST_CALLBACK);
        break;
      case 'tickets':
        navigation.navigate(screenNames.SUPPORT_TICKETS);
        break;
      default:
        break;
    }
  };

  const handleSearchSelect = (topic) => {
    setSearchQuery('');
    setShowResults(false);
    navigation.navigate(screenNames.SUPPORT_FAQ, {
      faqs: supportFaqs,
      searchQuery: topic,
    });
  };

  return (
    <View style={styles.screen}>
      {/* ═══════ Gradient Header ═══════ */}
      <GradientHeader
        title="How can we help you?"
        label="SQUADGOO"
        showBackButton={false}
        showMenuButton={true}
      >
        {/* Search Bar */}
        {/* <View style={styles.searchContainer}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="search-outline"
            size={18}
            color="#999"
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search support topics..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setShowResults(text.trim().length > 0);
            }}
            onFocus={() => {
              if (searchQuery.trim()) setShowResults(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowResults(false), 200);
            }}
          />
        </View> */}
      </GradientHeader>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Results Dropdown */}
        {showResults && filteredTopics.length > 0 && (
          <View style={styles.searchResults}>
            {filteredTopics.map((topic, index) => (
              <TouchableOpacity
                key={index}
                style={styles.searchResultItem}
                activeOpacity={0.7}
                onPress={() => handleSearchSelect(topic)}
              >
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="search-outline"
                  size={14}
                  color={colors.gray}
                />
                <AppText variant={Variant.body} style={styles.searchResultText}>
                  {topic}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ═══════ Support Cards Grid ═══════ */}
        <View style={styles.cardsGrid}>
          {SUPPORT_CARDS.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => handleSupportAction(card.id)}
            >
              <View style={styles.cardInner}>
                <LinearGradient
                  colors={card.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardIconCircle}
                >
                  <VectorIcons
                    name={iconLibName.Ionicons}
                    iconName={card.icon}
                    size={24}
                    color={colors.white}
                  />
                </LinearGradient>
                <View style={styles.cardTextWrap}>
                  <AppText variant={Variant.bodyMedium} style={styles.cardTitle}>
                    {card.title}
                  </AppText>
                  <AppText variant={Variant.caption} style={styles.cardSubtitle}>
                    {card.subtitle}
                  </AppText>
                </View>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="chevron-forward"
                  size={18}
                  color="#C4C4C4"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ═══════ Quick Help Section ═══════ */}
        <View style={styles.quickHelpSection}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Quick Help
          </AppText>

          <TouchableOpacity
            style={styles.quickHelpCard}
            activeOpacity={0.7}
            onPress={() => handleSupportAction('chat')}
          >
            <View style={[styles.quickHelpIcon, { backgroundColor: '#EDE9FE' }]}>
              <VectorIcons name={iconLibName.Ionicons} iconName="flash-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.quickHelpContent}>
              <AppText variant={Variant.bodyMedium} style={styles.quickHelpTitle}>
                Need urgent help?
              </AppText>
              <AppText variant={Variant.caption} style={styles.quickHelpSubtitle}>
                Start a Live Chat for instant support
              </AppText>
            </View>
            <VectorIcons name={iconLibName.Ionicons} iconName="arrow-forward-circle" size={24} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickHelpCard}
            activeOpacity={0.7}
            onPress={() => handleSupportAction('tickets')}
          >
            <View style={[styles.quickHelpIcon, { backgroundColor: '#FEE2E2' }]}>
              <VectorIcons name={iconLibName.Ionicons} iconName="create-outline" size={20} color="#DC2626" />
            </View>
            <View style={styles.quickHelpContent}>
              <AppText variant={Variant.bodyMedium} style={styles.quickHelpTitle}>
                Have a longer issue?
              </AppText>
              <AppText variant={Variant.caption} style={styles.quickHelpSubtitle}>
                Submit a support ticket for follow-up
              </AppText>
            </View>
            <VectorIcons name={iconLibName.Ionicons} iconName="arrow-forward-circle" size={24} color="#DC2626" />
          </TouchableOpacity>
        </View>

        {/* ═══════ Contact Info ═══════ */}
        <View style={styles.contactSection}>
          <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
            Contact Info
          </AppText>
          <View style={styles.contactCard}>
            <View style={styles.contactRow}>
              <VectorIcons name={iconLibName.Ionicons} iconName="mail-outline" size={16} color={colors.primary} />
              <AppText variant={Variant.caption} style={styles.contactText}>
                support@squadgoo.com.au
              </AppText>
            </View>
            <View style={styles.contactDivider} />
            <View style={styles.contactRow}>
              <VectorIcons name={iconLibName.Ionicons} iconName="time-outline" size={16} color={colors.primary} />
              <AppText variant={Variant.caption} style={styles.contactText}>
                Mon–Fri, 9AM–6PM AEST
              </AppText>
            </View>
          </View>
        </View>

        <View style={{ height: hp(5) }} />
      </ScrollView>
    </View>
  );
};

export default Support;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F2F9',
  },
  // Hero Header (handled by GradientHeader)
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.2),
    gap: wp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: getFontSize(14),
    color: '#333',
    paddingVertical: hp(1.2),
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: hp(1),
  },
  // Search results
  searchResults: {
    backgroundColor: colors.white,
    marginHorizontal: wp(5),
    borderRadius: 12,
    paddingVertical: hp(0.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
    marginBottom: hp(1),
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2.5),
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F3F3',
  },
  searchResultText: {
    color: '#333',
    fontSize: getFontSize(13),
  },
  // Cards grid — list style
  cardsGrid: {
    paddingHorizontal: wp(5),
    paddingTop: hp(1.5),
    gap: hp(1.2),
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    gap: wp(3.5),
  },
  cardIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextWrap: {
    flex: 1,
  },
  cardTitle: {
    color: '#111',
    fontWeight: '700',
    fontSize: getFontSize(15),
  },
  cardSubtitle: {
    color: '#888',
    fontSize: getFontSize(12),
    marginTop: hp(0.2),
  },
  // Quick help
  quickHelpSection: {
    paddingHorizontal: wp(5),
    marginTop: hp(2.5),
  },
  sectionTitle: {
    color: '#333',
    fontWeight: '700',
    fontSize: getFontSize(16),
    marginBottom: hp(1.2),
  },
  quickHelpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    gap: wp(3),
    marginBottom: hp(1),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  quickHelpIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickHelpContent: {
    flex: 1,
  },
  quickHelpTitle: {
    color: '#111',
    fontWeight: '600',
    fontSize: getFontSize(13),
  },
  quickHelpSubtitle: {
    color: '#888',
    fontSize: getFontSize(11),
    marginTop: hp(0.2),
  },
  // Contact
  contactSection: {
    paddingHorizontal: wp(5),
    marginTop: hp(2.5),
  },
  contactCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: wp(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2.5),
    paddingVertical: hp(0.8),
  },
  contactText: {
    color: '#555',
    fontSize: getFontSize(13),
  },
  contactDivider: {
    height: 1,
    backgroundColor: '#F3F3F3',
    marginVertical: hp(0.3),
  },
});
