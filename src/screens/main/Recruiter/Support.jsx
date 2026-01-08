import {Alert, StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import PoolHeader from '@/core/PoolHeader';
import AppButton from '@/core/AppButton';
import {colors, hp, wp, getFontSize} from '@/theme';
import AppText, {Variant} from '@/core/AppText';
import AppInputField from '@/core/AppInputField';
import AppDropDown from '@/core/AppDropDown';
import {ScrollView} from 'react-native-gesture-handler';
import VectorIcons, {iconLibName} from '@/theme/vectorIcon';
import {useNavigation} from '@react-navigation/native';
import {screenNames} from '@/navigation/screenNames';
import {
  defaultTickets,
  supportAgentProfile,
  supportFaqs,
} from './supportData';

const supportOptions = [
  {
    id: 'faqs',
    title: "FAQ's",
    subtitle: 'Find answers to common questions',
    icon: 'help-circle-outline',
    iconColor: colors.primary,
    bgColor: '#FEF3C7',
  },
  {
    id: 'chat',
    title: 'Live Chat',
    subtitle: 'Chat with our support team',
    icon: 'chatbubbles-outline',
    iconColor: '#10B981',
    bgColor: '#D1FAE5',
  },
  {
    id: 'callback',
    title: 'Request Callback',
    subtitle: 'Schedule a call with support',
    icon: 'call-outline',
    iconColor: '#6366F1',
    bgColor: '#E0E7FF',
  },
  {
    id: 'tickets',
    title: 'Support Tickets',
    subtitle: 'View and manage your tickets',
    icon: 'ticket-outline',
    iconColor: '#8B5CF6',
    bgColor: '#EDE9FE',
  },
];

const issueTypeOptions = [
  {label: 'General', value: 'general'},
  {label: 'Payments', value: 'payments'},
  {label: 'Job Offers', value: 'job_offers'},
  {label: 'Technical', value: 'technical'},
];

const Support = () => {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [postFilter, setPostFilter] = useState('general');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [tickets, setTickets] = useState(defaultTickets);

  const handlePostFilterChange = (value, option) => {
    setPostFilter(value);
    console.log('Post filter changed to:', option.label);
  };

  const handleSubmitTicket = () => {
    if (!subject.trim() || !description.trim()) {
      Alert.alert(
        'Add more details',
        'Please provide both subject and description for your ticket.',
      );
      return;
    }

    const newTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: subject.trim(),
      status: 'Open',
      priority: 'Medium',
      lastUpdated: 'Just now',
    };

    setTickets(prev => [newTicket, ...prev]);
    setSubject('');
    setDescription('');
    setPostFilter('general');
    Alert.alert(
      'Ticket submitted',
      'Thanks! Our support team will get back to you shortly.',
    );
  };

  const handleSupportAction = action => {
    switch (action) {
      case 'faqs':
        navigation.navigate(screenNames.SUPPORT_FAQ, {faqs: supportFaqs});
        break;
      case 'chat':
        navigation.navigate(screenNames.MESSAGES, {
          chatData: supportAgentProfile,
        });
        break;
      case 'callback':
        Alert.alert(
          'Callback scheduled',
          'A support specialist will reach out within the next 30 minutes.',
        );
        break;
      case 'tickets':
        navigation.navigate(screenNames.SUPPORT_TICKETS, {tickets});
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.screen}>
      <PoolHeader title="Support" />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerIconContainer}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="headset-outline"
              size={38}
              color={colors.primary}
            />
          </View>
          <AppText variant={Variant.h6} style={styles.headerTitle}>
            How can we help you?
          </AppText>
          <AppText variant={Variant.caption} style={styles.headerSubtitle}>
            Choose an option below to get started
          </AppText>
        </View>

        {/* Support Options */}
        <View style={styles.optionsContainer}>
          {supportOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleSupportAction(option.id)}
              activeOpacity={0.7}>
              <View
                style={[
                  styles.optionIconContainer,
                  {backgroundColor: option.bgColor},
                ]}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName={option.icon}
                  size={24}
                  color={option.iconColor}
                />
              </View>
              <View style={styles.optionContent}>
                <AppText variant={Variant.body} style={styles.optionTitle}>
                  {option.title}
                </AppText>
                <AppText variant={Variant.caption} style={styles.optionSubtitle}>
                  {option.subtitle}
                </AppText>
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
          <AppText variant={Variant.caption} style={styles.infoText}>
            If you need help urgently, start a Live Chat. For longer issues, submit a ticket and our team will follow up.
          </AppText>
        </View>

        {/* Create Ticket Card */}
        <View style={styles.ticketCard}>
          <AppText variant={Variant.bodybold} style={styles.ticketTitle}>
            Create New Ticket
          </AppText>
          <AppText variant={Variant.caption} style={styles.ticketSubtitle}>
            Describe your issue and we'll help you resolve it
          </AppText>

          <AppText variant={Variant.body} style={styles.inputLabel}>
            Subject
          </AppText>
          <AppInputField
            placeholder="Brief description of your issue"
            value={subject}
            onChangeText={setSubject}
            style={styles.fieldContainer}
            wrapperStyle={styles.fieldWrapper}
            inputStyle={styles.fieldInput}
          />

          <AppText variant={Variant.body} style={styles.inputLabel}>
            Related To
          </AppText>
          <AppDropDown
            placeholder="Select issue type"
            options={issueTypeOptions}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            selectedValue={postFilter}
            onSelect={handlePostFilterChange}
            style={styles.dropdownContainer}
          />

          <AppText variant={Variant.body} style={styles.inputLabel}>
            Description
          </AppText>
          <AppInputField
            placeholder="Provide detailed information..."
            value={description}
            onChangeText={setDescription}
            multiline
            style={styles.fieldContainer}
            wrapperStyle={[styles.fieldWrapper, styles.textAreaWrapper]}
            inputStyle={[styles.fieldInput, styles.textAreaInput]}
          />

          <AppButton
            text="Submit Ticket"
            bgColor={colors.primary}
            onPress={handleSubmitTicket}
            style={styles.submitBtn}
          />
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <AppText variant={Variant.body} style={styles.contactTitle}>
            Need urgent help?
          </AppText>
          <View style={styles.contactRow}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="mail-outline"
              size={18}
              color={colors.primary}
            />
            <AppText variant={Variant.caption} style={styles.contactText}>
              support@squadgoo.com.au
            </AppText>
          </View>
          <View style={styles.contactRow}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="time-outline"
              size={18}
              color={colors.primary}
            />
            <AppText variant={Variant.caption} style={styles.contactText}>
              Support hours: Mon-Fri, 9AM-6PM AEST
            </AppText>
          </View>
        </View>

        <View style={{height: hp(3)}} />
      </ScrollView>
    </View>
  );
};

export default Support;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: hp(4),
    paddingHorizontal: wp(4),
    backgroundColor: (colors.grayE8 ? colors.grayE8 : '#E8E8E8') + '30',
  },
  headerIconContainer: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    color: colors.black,
    fontSize: getFontSize(18),
    fontWeight: '700',
    marginBottom: hp(0.5),
    textAlign: 'center',
  },
  headerSubtitle: {
    color: colors.gray,
    textAlign: 'center',
  },
  optionsContainer: {
    padding: wp(4),
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: wp(4),
    borderRadius: 12,
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: colors.grayE8 ? colors.grayE8 : '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIconContainer: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    color: colors.black,
    fontWeight: '600',
    marginBottom: hp(0.3),
  },
  optionSubtitle: {
    color: colors.gray,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: (colors.grayE8 ? colors.grayE8 : '#E8E8E8') + '40',
    marginHorizontal: wp(4),
    padding: wp(4),
    borderRadius: 12,
    marginBottom: hp(2),
  },
  infoText: {
    flex: 1,
    marginLeft: wp(2),
    color: colors.gray,
    lineHeight: 20,
  },
  ticketCard: {
    marginHorizontal: wp(4),
    padding: wp(4),
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grayE8 ? colors.grayE8 : '#E8E8E8',
    marginBottom: hp(2),
  },
  ticketTitle: {
    color: colors.black,
    marginBottom: hp(0.5),
  },
  ticketSubtitle: {
    color: colors.gray,
    marginBottom: hp(2),
  },
  inputLabel: {
    color: colors.black,
    fontWeight: '600',
    marginBottom: hp(1),
  },
  fieldContainer: {
    marginBottom: hp(1.4),
  },
  fieldWrapper: {
    backgroundColor: (colors.lightGray || '#F6F7FB'),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grayE8 ? colors.grayE8 : '#E8E8E8',
  },
  fieldInput: {
    fontSize: getFontSize(14),
    color: colors.black,
  },
  textAreaWrapper: {
    // keep the default multiline height from AppInputField, just adjust padding feel
    paddingTop: hp(0.5),
  },
  textAreaInput: {
    paddingTop: hp(0.6),
  },
  dropdownContainer: {
    marginBottom: hp(1.4),
  },
  submitBtn: {
    marginTop: hp(1),
  },
  contactSection: {
    marginHorizontal: wp(4),
    padding: wp(4),
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grayE8 ? colors.grayE8 : '#E8E8E8',
    marginBottom: hp(4),
  },
  contactTitle: {
    color: colors.black,
    fontWeight: '600',
    marginBottom: hp(1.5),
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  contactText: {
    marginLeft: wp(2),
    color: colors.gray,
  },
});
