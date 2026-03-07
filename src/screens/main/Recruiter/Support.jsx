import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { screenNames } from '@/navigation/screenNames';
import LinearGradient from 'react-native-linear-gradient';
import {
  supportFaqs,
  supportAgentProfile,
} from './supportData';

const SUPPORT_CARDS = [
  {
    id: 'faqs',
    title: "FAQ's",
    subtitle: 'Find answers quickly',
    icon: 'help-circle-outline',
  },
  {
    id: 'chat',
    title: 'Live Chat',
    subtitle: 'Connect instantly',
    icon: 'chatbubbles-outline',
  },
  {
    id: 'callback',
    title: 'Request Callback',
    subtitle: 'Talk to a representative',
    icon: 'call-outline',
  },
  {
    id: 'tickets',
    title: 'Support Tickets',
    subtitle: 'Track your issues',
    icon: 'ticket-outline',
  },
];

// Search topics for autocomplete
const SEARCH_TOPICS = [
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

const Support = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return SEARCH_TOPICS.filter((topic) =>
      topic.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSupportAction = (action) => {
    switch (action) {
      case 'faqs':
        navigation.navigate(screenNames.SUPPORT_FAQ, { faqs: supportFaqs });
        break;
      case 'chat':
        navigation.navigate(screenNames.MESSAGES, {
          chatData: supportAgentProfile,
        });
        break;
      case 'callback':
        Alert.alert(
          'Callback Requested',
          'A support specialist will reach out within the next 30 minutes.'
        );
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
    // Navigate to FAQ with search
    navigation.navigate(screenNames.SUPPORT_FAQ, {
      faqs: supportFaqs,
      searchQuery: topic,
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ═══════ Hero Header ═══════ */}
        <LinearGradient
          colors={[colors.primary || '#6C3CE1', '#8B5CF6', '#A78BFA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <AppText variant={Variant.caption} style={styles.heroLabel}>
            SQUADGOO
          </AppText>
          <AppText variant={Variant.h6} style={styles.heroTitle}>
            Support
          </AppText>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search support topics..."
              placeholderTextColor="rgba(255,255,255,0.6)"
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
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="search-outline"
              size={20}
              color="rgba(255,255,255,0.6)"
            />
          </View>
        </LinearGradient>

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
              activeOpacity={0.8}
              onPress={() => handleSupportAction(card.id)}
            >
              <LinearGradient
                colors={['rgba(139,92,246,0.85)', 'rgba(168,130,246,0.75)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={styles.cardIconWrap}>
                  <VectorIcons
                    name={iconLibName.Ionicons}
                    iconName={card.icon}
                    size={28}
                    color="rgba(255,255,255,0.9)"
                  />
                </View>
                <AppText variant={Variant.bodyMedium} style={styles.cardTitle}>
                  {card.title}
                </AppText>
                <AppText variant={Variant.caption} style={styles.cardSubtitle}>
                  {card.subtitle}
                </AppText>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* ═══════ Info Banner ═══════ */}
        <View style={styles.infoBanner}>
          <LinearGradient
            colors={['rgba(139,92,246,0.12)', 'rgba(168,130,246,0.08)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.infoBannerGradient}
          >
            <AppText variant={Variant.caption} style={styles.infoBannerText}>
              If you need urgent help, start a <AppText variant={Variant.caption} style={styles.infoBold}>Live Chat</AppText>.{'\n'}
              For longer issues, submit a ticket.
            </AppText>
          </LinearGradient>
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
    backgroundColor: '#1A1031',
  },
  scroll: {
    flex: 1,
  },
  // Hero
  hero: {
    paddingTop: hp(6),
    paddingBottom: hp(3.5),
    paddingHorizontal: wp(5),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    fontSize: getFontSize(11),
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: hp(0.5),
  },
  heroTitle: {
    color: colors.white,
    fontWeight: '800',
    fontSize: getFontSize(28),
    textAlign: 'center',
    marginBottom: hp(2.5),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
  },
  searchInput: {
    flex: 1,
    fontSize: getFontSize(14),
    color: colors.white,
    paddingVertical: 0,
  },
  // Search results
  searchResults: {
    backgroundColor: colors.white,
    marginHorizontal: wp(5),
    borderRadius: 12,
    marginTop: -hp(0.5),
    paddingVertical: hp(0.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
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
  // Cards grid
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    paddingTop: hp(2.5),
    gap: hp(1.5),
  },
  card: {
    width: '48%',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  cardGradient: {
    padding: wp(4.5),
    paddingVertical: hp(2.5),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp(16),
  },
  cardIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1.2),
  },
  cardTitle: {
    color: colors.white,
    fontWeight: '700',
    fontSize: getFontSize(14),
    textAlign: 'center',
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: getFontSize(11),
    textAlign: 'center',
    marginTop: hp(0.3),
  },
  // Info banner
  infoBanner: {
    marginHorizontal: wp(5),
    marginTop: hp(2.5),
    borderRadius: 14,
    overflow: 'hidden',
  },
  infoBannerGradient: {
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(5),
    alignItems: 'center',
  },
  infoBannerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: getFontSize(12),
    textAlign: 'center',
    lineHeight: getFontSize(18),
  },
  infoBold: {
    fontWeight: '700',
    color: colors.white,
  },
});
