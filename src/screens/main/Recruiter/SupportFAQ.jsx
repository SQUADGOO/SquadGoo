import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppHeader from '@/core/AppHeader';
import Scrollable from '@/core/Scrollable';
import AppText, { Variant } from '@/core/AppText';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { colors, hp, wp, getFontSize } from '@/theme';
import { supportFaqs as defaultFaqs, supportAgentProfile } from './supportData';
import { useNavigation } from '@react-navigation/native';
import { screenNames } from '@/navigation/screenNames';

const SupportFAQ = ({ route }) => {
  const navigation = useNavigation();
  const faqs = route?.params?.faqs?.length ? route.params.faqs : defaultFaqs;
  const [expandedId, setExpandedId] = useState(faqs?.[0]?.id ?? null);

  const handleToggle = id => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleLiveChat = () => {
    navigation.navigate(screenNames.MESSAGES, {
      chatData: supportAgentProfile,
    });
  };

  const handleSubmitTicket = () => {
    navigation.navigate(screenNames.SUPPORT_TICKETS);
  };

  return (
    <>
      <AppHeader title="Support FAQ's" showTopIcons={false} />
      <Scrollable>
        <View style={styles.container}>
          <AppText variant={Variant.bodybold} style={styles.introText}>
            Browse our most common recruiter questions. Tap a question to view
            the answer.
          </AppText>

          {faqs.map(faq => {
            const isExpanded = expandedId === faq.id;
            return (
              <TouchableOpacity
                key={faq.id}
                activeOpacity={0.8}
                style={[
                  styles.card,
                  isExpanded && { borderColor: colors.primary },
                ]}
                onPress={() => handleToggle(faq.id)}>
                <View style={styles.questionRow}>
                  <AppText
                    variant={Variant.bodybold}
                    style={styles.questionText}>
                    {faq.question}
                  </AppText>
                  <View
                    style={[
                      styles.toggleCircle,
                      isExpanded && styles.toggleCircleActive,
                    ]}>
                    <AppText
                      style={[
                        styles.toggleSymbol,
                        isExpanded && styles.toggleSymbolActive,
                      ]}>
                      {isExpanded ? '−' : '+'}
                    </AppText>
                  </View>
                </View>
                {isExpanded && (
                  <AppText variant={Variant.caption} style={styles.answerText}>
                    {faq.answer}
                  </AppText>
                )}
              </TouchableOpacity>
            );
          })}

          {/* Didn't find what you need? */}
          <View style={styles.ctaCard}>
            <AppText variant={Variant.bodyMedium} style={styles.ctaTitle}>
              Didn't find what you need?
            </AppText>
            <View style={styles.ctaRow}>
              <TouchableOpacity
                style={styles.ctaLink}
                activeOpacity={0.7}
                onPress={handleLiveChat}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="chatbubbles-outline"
                  size={16}
                  color={colors.primary}
                />
                <AppText variant={Variant.body} style={styles.ctaLinkText}>
                  Start a Live Chat
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.ctaLink}
                activeOpacity={0.7}
                onPress={handleSubmitTicket}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="ticket-outline"
                  size={16}
                  color={colors.primary}
                />
                <AppText variant={Variant.body} style={styles.ctaLinkText}>
                  Submit a Ticket
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Scrollable>
    </>
  );
};

export default SupportFAQ;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  introText: {
    color: colors.text,
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: wp(2),
    padding: 14,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    flex: 1,
    marginRight: 12,
    color: colors.black,
  },
  toggleCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleCircleActive: {
    backgroundColor: colors.primary,
  },
  toggleSymbol: {
    fontSize: getFontSize(16),
    color: colors.white,
    fontWeight: '700',
    lineHeight: getFontSize(20),
  },
  toggleSymbolActive: {
    color: colors.white,
  },
  answerText: {
    color: colors.text,
    marginTop: 8,
    lineHeight: getFontSize(18),
  },
  ctaCard: {
    borderWidth: 1.5,
    borderColor: '#E0C8FF',
    borderRadius: 14,
    backgroundColor: '#FAF5FF',
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    marginTop: hp(1),
    marginBottom: hp(2),
    alignItems: 'center',
  },
  ctaTitle: {
    color: '#333',
    fontWeight: '700',
    fontSize: getFontSize(15),
    marginBottom: hp(1.2),
  },
  ctaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: wp(6),
  },
  ctaLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
  },
  ctaLinkText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: getFontSize(13),
    textDecorationLine: 'underline',
  },
});
