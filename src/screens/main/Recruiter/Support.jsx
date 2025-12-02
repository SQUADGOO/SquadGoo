import {Alert, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import AppHeader from '@/core/AppHeader';
import AppButton from '@/core/AppButton';
import {colors, hp, wp} from '@/theme';
import AppText, {Variant} from '@/core/AppText';
import AppInputField from '@/core/AppInputField';
import AppDropDown from '@/core/AppDropDown';
import Scrollable from '@/core/Scrollable';
import Spacer from '@/core/Spacer';
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
    buttonText: "Browse FAQ's",
  },
  {
    id: 'chat',
    title: 'Live Chat',
    subtitle: 'Chat with our support team',
    buttonText: 'Start Chat',
  },
  {
    id: 'callback',
    title: 'Request Callback',
    subtitle: 'Schedule a call with support',
    buttonText: 'Schedule Call',
  },
  {
    id: 'tickets',
    title: 'Support Tickets',
    subtitle: 'View and manage your tickets',
    buttonText: 'View Tickets',
  },
];

const postOptions = [
  {label: 'All Post', value: 'all'},
  {label: 'Last week', value: 'last_week'},
  {label: 'Last 2 weeks', value: 'last_2_weeks'},
  {label: 'Last month', value: 'last_month'},
];

const Support = () => {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [postFilter, setPostFilter] = useState('all');
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
    setPostFilter('all');
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
    <>
      <AppHeader title="Support" showTopIcons={false} />
      <Scrollable hasInput>
        <View style={styles.container}>
          {/* Support Options */}
          {supportOptions.map(option => (
            <View key={option.id} style={styles.card}>
              <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
                {option.title}
              </AppText>
              <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
                {option.subtitle}
              </AppText>
              <AppButton
                text={option.buttonText}
                bgColor={colors.primary}
                onPress={() => handleSupportAction(option.id)}
              />
            </View>
          ))}

          {/* Create Ticket Section */}
          <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
            Create New Ticket
          </AppText>
          <AppText variant={Variant.caption} style={styles.sectionSubtitle}>
            Describe your issue and we'll help you resolve it
          </AppText>

          <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
            Subject
          </AppText>
          <AppInputField
            placeholder="Brief Description of your issue"
            value={subject}
            onChangeText={setSubject}
            style={styles.inputField}
          />

          <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
            Related To
          </AppText>
          <AppDropDown
            placeholder="All Post"
            options={postOptions}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            selectedValue={postFilter}
            onSelect={handlePostFilterChange}
            style={styles.filterDropdown}
          />

          <AppText variant={Variant.bodybold} style={styles.sectionTitle}>
            Description
          </AppText>
          <AppInputField
            placeholder="Provide Detailed Information..."
            value={description}
            onChangeText={setDescription}
            multiline
            style={styles.textArea}
          />

          {/* <Spacer size={hp(5)} /> */}
          <AppButton
            text="Submit Ticket"
            bgColor={colors.primary}
            onPress={handleSubmitTicket}
            style={styles.submitBtn}
          />
        </View>
      </Scrollable>
    </>
  );
};

export default Support;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    width: wp(90),
    borderWidth: 1,
    borderRadius: wp(2),
    padding: 12,
    marginBottom: 16,
    backgroundColor: colors.white,
    borderColor: colors.text,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 4,
    color: colors.black,
  },
  sectionSubtitle: {
    marginBottom: 12,
    color: colors.text,
  },
  inputField: {
    borderWidth: 0.5,
    borderColor: colors.text,
    borderRadius: wp(1),
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  filterDropdown: {
    marginBottom: 12,
    borderRadius: 5,
    borderColor: colors.text,
  },
  textArea: {
    borderWidth: 0.5,
    borderColor: colors.text,
    borderRadius: wp(1),
    height: hp(12),
    backgroundColor: colors.white,
    marginBottom: 16,
  },
  submitBtn: {
    // marginTop: 8,
    marginVertical: hp(5),

  },
});
