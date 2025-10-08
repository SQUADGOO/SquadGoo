import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as ui from '@/screens';
import {colors, getFontSize, hp, wp} from '@/theme';
import {screenNames} from './screenNames';
import {Icons} from '@/assets';
import globalStyles from '@/styles/globalStyles';
import AppText, { Variant } from '@/core/AppText';

const Tab = createBottomTabNavigator();

const tabItems = [
  {
    name: screenNames.HOME,
    label: 'Home',
    activeIcon: Icons.homeActive,
    inactiveIcon: Icons.home,
    component: ui.Home,
  },
  {
    name: screenNames.FIND_STAFF,
    label: 'Find Staff',
    activeIcon: Icons.staffsearchActive,
    inactiveIcon: Icons.staffsearch,
    component: ui.FindStaff,
  },
  {
    name: screenNames.WALLET_STACK,
    label: 'Wallet',
    activeIcon: Icons.walletActive,
    inactiveIcon: Icons.wallet,
    component: ui.WalletStack,
  },
  {
    name: screenNames.CHAT,
    label: 'Chat',
    activeIcon: Icons.chatActive,
    inactiveIcon: Icons.chat,
    component: ui.Chat,
  },
  
];

const TabIcon = ({focused, label, activeIcon, inactiveIcon}) => (
  <View style={[globalStyles.centerContent, {gap: 5}]}>
    <Image
      source={focused ? activeIcon : inactiveIcon}
      style={styles.imageStyle}
    />

     <AppText 
      variant={Variant.smallCaption}
      style={[
        styles.tabLabel,
        { color: focused ? colors.primary || '#FF6B35' : colors.gray || '#9CA3AF' }
      ]}
    >
      {label}
    </AppText>
   
  </View>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarHideOnKeyboard: true,
      tabBarShowLabel: false,
      tabBarStyle: styles.tabBarStyle,
    }}>
    {tabItems.map(({name, label, activeIcon, inactiveIcon, component}) => (
      <Tab.Screen
        key={name}
        name={name}
        component={component}
        options={{
          tabBarIcon: props => (
            <TabIcon
              {...props}
              label={label}
              activeIcon={activeIcon}
              inactiveIcon={inactiveIcon}
            />
          ),
        }}
      />
    ))}
  </Tab.Navigator>
);

export default TabNavigator;

const styles = StyleSheet.create({
  tabBarStyle: {
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    backgroundColor: colors.white,
    height: hp(9),
    // paddingHorizontal: wp(1),
    paddingTop: hp(2.5),
  },
  imageStyle: {
    width: wp(6),
    height: wp(6),
    resizeMode: 'contain',
  },
  activeTabIndicator: {
    width: wp(3),
    height: hp(0.2),
    backgroundColor: colors.white,
    borderRadius: hp(1),
    marginTop: hp(0.7),
  },
  tabLabel: {
    textAlign: 'center',
    fontSize:getFontSize(11),
    fontWeight: 'bold',
    width: '30%'
  },
});
