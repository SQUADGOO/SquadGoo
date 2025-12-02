import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import AppHeader from '@/core/AppHeader';
import Scrollable from '@/core/Scrollable';
import AppText, {Variant} from '@/core/AppText';
import {colors, hp, wp} from '@/theme';
import {supportFaqs as defaultFaqs} from './supportData';

const SupportFAQ = ({route}) => {
  const faqs = route?.params?.faqs?.length ? route.params.faqs : defaultFaqs;
  const [expandedId, setExpandedId] = useState(faqs?.[0]?.id ?? null);

  const handleToggle = id => {
    setExpandedId(prev => (prev === id ? null : id));
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
                  isExpanded && {borderColor: colors.primary},
                ]}
                onPress={() => handleToggle(faq.id)}>
                <View style={styles.questionRow}>
                  <AppText
                    variant={Variant.bodybold}
                    style={styles.questionText}>
                    {faq.question}
                  </AppText>
                  <AppText style={styles.toggleSymbol}>
                    {isExpanded ? '-' : '+'}
                  </AppText>
                </View>
                {isExpanded && (
                  <AppText variant={Variant.caption} style={styles.answerText}>
                    {faq.answer}
                  </AppText>
                )}
              </TouchableOpacity>
            );
          })}
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
  toggleSymbol: {
    fontSize: hp(2.4),
    color: colors.primary,
  },
  answerText: {
    color: colors.text,
    marginTop: 8,
  },
});

