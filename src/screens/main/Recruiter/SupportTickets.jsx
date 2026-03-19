import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { colors, hp, wp, getFontSize } from '@/theme';
import AppText, { Variant } from '@/core/AppText';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import PoolHeader from '@/core/PoolHeader';
import { useNavigation } from '@react-navigation/native';
import { screenNames } from '@/navigation/screenNames';
import LinearGradient from 'react-native-linear-gradient';

const SupportTickets = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.screen}>
      <PoolHeader title="Support Tickets" />

      <View style={styles.content}>
        {/* Option 1: Create New Ticket */}
        <TouchableOpacity
          style={styles.optionCard}
          activeOpacity={0.7}
          onPress={() => navigation.navigate(screenNames.CREATE_TICKET)}
        >
          <LinearGradient
            colors={['#7C3AED', '#A78BFA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.optionIconCircle}
          >
            <VectorIcons name={iconLibName.Ionicons} iconName="create-outline" size={24} color={colors.white} />
          </LinearGradient>
          <View style={styles.optionContent}>
            <AppText variant={Variant.bodyMedium} style={styles.optionTitle}>
              Create New Ticket
            </AppText>
            <AppText variant={Variant.caption} style={styles.optionSubtitle}>
              Submit a new support request
            </AppText>
          </View>
          <VectorIcons name={iconLibName.Ionicons} iconName="chevron-forward" size={18} color="#C4C4C4" />
        </TouchableOpacity>

        {/* Option 2: My Tickets */}
        <TouchableOpacity
          style={styles.optionCard}
          activeOpacity={0.7}
          onPress={() => navigation.navigate(screenNames.MY_TICKETS)}
        >
          <LinearGradient
            colors={['#2563EB', '#60A5FA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.optionIconCircle}
          >
            <VectorIcons name={iconLibName.Ionicons} iconName="list-outline" size={24} color={colors.white} />
          </LinearGradient>
          <View style={styles.optionContent}>
            <AppText variant={Variant.bodyMedium} style={styles.optionTitle}>
              My Tickets
            </AppText>
            <AppText variant={Variant.caption} style={styles.optionSubtitle}>
              View all your support tickets
            </AppText>
          </View>
          <VectorIcons name={iconLibName.Ionicons} iconName="chevron-forward" size={18} color="#C4C4C4" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SupportTickets;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F2F9',
  },
  content: {
    padding: wp(5),
    gap: hp(1.2),
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    gap: wp(3.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    color: '#111',
    fontWeight: '700',
    fontSize: getFontSize(15),
  },
  optionSubtitle: {
    color: '#888',
    fontSize: getFontSize(12),
    marginTop: hp(0.2),
  },
});
