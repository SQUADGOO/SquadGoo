import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import AppText from '@/core/AppText';
import { colors, getFontSize, hp, wp } from '@/theme';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import { fonts } from '@/assets/fonts';
import { useSelector } from 'react-redux';
import RbSheetComponent from '@/core/RbSheetComponent';
import BasicDetailsSheet from '../profile/BasicDetailsSheet';
import AddressSheet from '../profile/AddressSheet';
import { screenNames } from '@/navigation/screenNames';
import ContactDetailsSheet from '../profile/ContactDetailsSheet';
import { useNavigation } from '@react-navigation/native';

const MenuCard = () => {
  const navigation = useNavigation();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const role = useSelector((state) => state.auth.role);
  const [activeSheet, setActiveSheet] = useState(null);
  const [sheetHeight, setSheetHeight] = useState(hp(30));
  const [selectedItem, setSelectedItem] = useState(null);
  const basicSheetRef = useRef();
  const addressSheetRef = useRef();
  const contactSheetRef = useRef();

  const menuItems = useMemo(() => {
    const normalizedRole = (role || '').toString().toLowerCase();
    const isRecruiter = normalizedRole === 'recruiter';

    return [
      { label: 'Basic details', key: 'basic', route: screenNames.BASIC_DETAILS },
      { label: 'Address', key: 'address', route: screenNames.ADDRESS },
      { label: 'Contact details', key: 'contact', route: screenNames.CONTACT_DETAILS },
      { label: 'Tax information', key: 'tax', route: screenNames.TAX_INFO },
      { label: 'Visa details', key: 'visa', route: screenNames.VISA_DETAILS },
      {
        label: isRecruiter ? 'KYB verification' : 'KYC verification',
        key: 'kyc',
        // Recruiters must complete BOTH: start from Personal KYC screen.
        route: screenNames.KYC_KYB,
      },
      { label: 'Extra job qualifications', key: 'extra', route: screenNames.EXTRA_QUALIFICATIONS },
      // { label: 'Biograph/Bio', key: 'bio', route: screenNames.BIO },
      { label: 'Social media', key: 'social', route: screenNames.SOCIAL_MEDIA },
      { label: 'Password', key: 'password', route: screenNames.PASSWORD },
    ];
  }, [role]);
  
  const handleItemPress = (item) => {
    setActiveSheet(item.key);
    setSelectedItem(item);
    if(item.key === 'basic') {
      basicSheetRef.current.open();
    } else if(item.key === 'address') {
      addressSheetRef.current.open();
    } else if(item.key === 'contact') {
      contactSheetRef.current.open();
    } else if(item.key === 'kyc') {
      navigation.navigate(item.route)
    } else if(item.key === 'visa') {
      navigation.navigate(screenNames.VISA_DETAILS)
    } else if(item.key === 'tax') {
      navigation.navigate(screenNames.TAX_INFO)
    } else if(item.key === 'social') {
      navigation.navigate(screenNames.SOCIAL_MEDIA)
    } else if(item.key === 'password') {
      navigation.navigate(screenNames.PASSWORD)
    }

   
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handleItemPress(item)}>
      <AppText style={styles.menuText}>{item.label}</AppText>
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

      {/* ✅ Dynamic RBSheet */}
      <RbSheetComponent ref={basicSheetRef} height={hp(35)}>
        <BasicDetailsSheet onClose={() => basicSheetRef.current.close()} />
      </RbSheetComponent>
      
      <RbSheetComponent ref={addressSheetRef} height={hp(55)}>
        <AddressSheet selectedItem={selectedItem} onClose={() => addressSheetRef.current.close()} />
      </RbSheetComponent>
      
      <RbSheetComponent ref={contactSheetRef} height={hp(30)}>
        <ContactDetailsSheet  selectedItem={selectedItem}  onClose={() => contactSheetRef.current.close()} />
      </RbSheetComponent>
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
    fontFamily: fonts.poppinsMedium,
    fontSize: getFontSize(14),
  },
  separator: {
    height: 1,
    backgroundColor: '#EBE8EC',
    marginHorizontal: wp(3),
  },
});
