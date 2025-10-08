// components/MenuCard.js
import React from 'react';
import {StyleSheet, View, TouchableOpacity, FlatList, Text} from 'react-native';
import AppText, {Variant} from '@/core/AppText';
import {colors, getFontSize, wp} from '@/theme';
import VectorIcons, {iconLibName} from '@/theme/vectorIcon';
import {useNavigation} from '@react-navigation/native';
import { screenNames } from '@/navigation/screenNames';
import { fonts } from '@/assets/fonts';

const menuItems = [
  {label: 'Basic details', route: screenNames.BASIC_DETAILS},
  {label: 'Address', route: screenNames.ADDRESS},
  {label: 'Contact details', route: screenNames.CONTACT_DETAILS},
  {label: 'Tax information', route: screenNames.TAX_INFO},
  {label: 'Visa details', route: screenNames.VISA_DETAILS},
  {label: 'KYC & KYB verifications', route: screenNames.KYC_KYB},
  {label: 'Extra job qualifications', route: screenNames.EXTRA_QUALIFICATIONS},
  {label: 'Biograph/Bio', route: screenNames.BIO},
  {label: 'Social media', route: screenNames.SOCIAL_MEDIA},
  {label: 'Password', route: screenNames.PASSWORD},
];

const MenuCard = () => {
  const navigation = useNavigation();

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => navigation.navigate(item.route)}>
      <AppText  style={styles.menuText}>
        {item.label}
      </AppText>
      <VectorIcons
        name={iconLibName.AntDesign}
        iconName="right"
        size={16}
        color={colors.text}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.menuCard}>
      <FlatList
        data={menuItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        scrollEnabled={false}
      />
    </View>
  );
};

export default MenuCard;

const styles = StyleSheet.create({
  menuCard: {
    backgroundColor: colors.white,
    marginTop: 12,
    borderRadius: wp(2),
    overflow: 'hidden',
    width: wp(95),
    alignSelf: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: wp(3),
  },
  menuText: {
    flex: 1,
    color: colors.text,
    fontFamily:fonts.poppinsMedium,
    fontSize: getFontSize(14),
  },
  separator: {
    height: 1,
    backgroundColor: '#EBE8EC',
    marginHorizontal: wp(3),
  },
});
