import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as ui from '@/screens';
import {colors, getFontSize, hp, wp} from '@/theme';
import {screenNames} from './screenNames';
import {Icons} from '@/assets';
import globalStyles from '@/styles/globalStyles';
import AppText, { Variant } from '@/core/AppText';
import VectorIcons, { iconLibName } from '@/theme/vectorIcon';
import WorkExperienceScreen from '@/screens/main/JobSeeker/DashBoard/TabScreens/WorkExperience';
import PreferredJobs from '@/screens/main/JobSeeker/DashBoard/TabScreens/PreferredJobs';
import JobSeekerHome from '@/screens/main/JobSeeker/DashBoard/TabScreens/HomeJobSeeker';

const Tab = createBottomTabNavigator();

const tabItems = [
  {
    name: screenNames.HOME,
    label: 'Home',
    activeIcon: Icons.homeActive,
    inactiveIcon: Icons.home,
    component: JobSeekerHome,
  },
  {
    name: screenNames.WORK_EXPERIENCE,
    label: 'Work Experience',
    activeIcon: Icons.staffsearchActive,
    inactiveIcon: Icons.staffsearch,
    component: WorkExperienceScreen,
  },

  {
    name: screenNames.PREFERRED_JOBS,
    label: 'Preferred Jobs',
    vectorIcon: 'heart-outline',
    vectorIconActive: 'heart',
    component: PreferredJobs,
  },
    {
    name: screenNames.WALLET_STACK,
    label: 'Wallet',
    activeIcon: Icons.walletActive,
    inactiveIcon: Icons.wallet,
    component: ui.WalletStack,
  },
  
];

const TabIcon = ({focused, label, activeIcon, inactiveIcon, vectorIcon, vectorIconActive}) => {
  const tint = focused ? (colors.primary || '#FF6B35') : (colors.gray || '#9CA3AF');
  return (
    <View style={[globalStyles.centerContent, {gap: 5}]}>
      {vectorIcon ? (
        <VectorIcons
          name={iconLibName.Ionicons}
          iconName={focused ? (vectorIconActive || vectorIcon) : vectorIcon}
          size={wp(6)}
          color={tint}
        />
      ) : (
        <Image
          source={focused ? activeIcon : inactiveIcon}
          style={styles.imageStyle}
        />
      )}

       <AppText
        variant={Variant.smallCaption}
        style={[styles.tabLabel, { color: tint }]}
      >
        {label}
      </AppText>

    </View>
  );
};

const JobSeekerTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarHideOnKeyboard: true,
      tabBarShowLabel: false,
      tabBarStyle: styles.tabBarStyle,
    }}>
    {tabItems.map(({name, label, activeIcon, inactiveIcon, vectorIcon, vectorIconActive, component}) => (
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
              vectorIcon={vectorIcon}
              vectorIconActive={vectorIconActive}
            />
          ),
        }}
      />
    ))}
  </Tab.Navigator>
);

export default JobSeekerTabNavigator;

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
