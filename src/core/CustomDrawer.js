import React from 'react';
import {View, StyleSheet, Image, Linking} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {colors, wp, hp, getFontSize} from '@/theme';
import {Icons, Images} from '@/assets';
import globalStyles from '@/styles/globalStyles';
import AppText, {Variant} from './AppText';
import {fonts} from '@/assets/fonts';
import AppHeader from './AppHeader';
// import DrawerButton from '@/components/DrawerButton'
import {screenNames} from '@/navigation/screenNames';
import ScreenWrapper from './ScreenWrapper';
import Scrollable from './Scrollable';
import {logout} from '@/store/authSlice';

const CustomDrawer = ({navigation}) => {
  const dispatch = useDispatch();
  const {flexDirection, alignItems} = {
    flexDirection: 'row',
    alignItems: 'center',
  };
  const role = useSelector(state => state.auth.role);
  const {userInfo} = useSelector(state => state.auth);

  let drawerItems = [
    {
      title: 'Personal Information',
      icon: Icons.userIcon,
      route: screenNames.EDIT_PROFILE,
    },
    {
      title: 'Security Settings',
      icon: Icons.lock,
      route: screenNames.CHANGE_PASSWORD,
    },
    ...(role === 'Admin' || role === 'Manager'
      ? [
          {
            title: 'All Employees',
            icon: Icons.allEmployees,
            route: screenNames.ALL_EMPLOYEES,
          },
          {
            title: 'All Departments',
            icon: Icons.allDepartments,
            route: screenNames.ALL_DEPARTMENTS,
          },
          {title: 'Jobs', icon: Icons.jobIcon, route: screenNames.JOBS_SCREEN},
          {
            title: 'Candidates',
            icon: Icons.allCandidates,
            route: screenNames.CANDIDATES_SCREEN,
          },
        ]
      : []),
    {
      title: 'Payroll',
      icon: Icons.dollarCoiin,
      route: screenNames.PAYROLL_SCREEN,
    },
    {
      title: 'Requests',
      icon: Icons.requests,
      route: screenNames.REQUEST_SCREEN,
    },
    // { title: 'Language', icon: Icons.language, route: screenNames.LANGUAGE_SCREEN },
    // { title: 'Notifications Settings', icon: Icons.bellIcon, route: screenNames.NOTIFICATION_SETTINGS },
    // { title: 'Privacy Policy', icon: Icons.privacy, route: screenNames.PRIVACY_POLICY },
    {
      title: 'Privacy Policy',
      icon: Icons.privacy,
      external: true,
      url: 'https://docs.google.com/document/d/10IwDQ3iZ1uWSJD-24bbN5dzS7Eot-NVp7y-guia6ytA/edit?usp=drive_link',
    },

    {title: 'Logout', icon: Icons.logout, color: colors.softRed},
  ];

  const handleNavigate = item => {
    if (item.title === 'Logout') {
      dispatch(logout());
    } else if (item.external && item.url) {
      Linking.openURL(item.url).catch(err =>
        console.error('Failed to open URL:', err),
      );
    } else if (item.onPress) {
      item.onPress();
    } else if (item.route) {
      navigation.navigate(item.route);
    }
  };

  return (
    <ScreenWrapper statusBarColor={colors.bgColor}>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <AppHeader onPress={() => navigation.closeDrawer()} />
          <View style={[styles.headerContainer, {flexDirection}]}>
            <Image
              source={
                userInfo?.profile_picture
                  ? {uri: userInfo?.profile_picture}
                  : Images.dummyImage
              }
              style={styles.imageStyle}
            />
            <View style={{alignItems}}>
              <AppText variant={Variant.bodybold}>{userInfo?.username}</AppText>
              <AppText style={styles.designation}>{userInfo?.role}</AppText>
            </View>
          </View>
        </View>

        <Scrollable
          containerStyle={{
            flexGrow: 1,
            paddingBottom: hp(4),
            paddingHorizontal: wp(4),
          }}
          showsVerticalScrollIndicator={false}>
          {drawerItems.map((item, index) => (
            <DrawerButton
              key={index}
              title={item.title}
              icon={item.icon}
              color={item.color}
              onPress={() => handleNavigate(item)}
            />
          ))}
        </Scrollable>
      </View>
    </ScreenWrapper>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
    paddingBottom: hp(2),
  },
  headerWrapper: {
    paddingHorizontal: wp(4),
  },
  headerContainer: {
    ...globalStyles.flexRow,
    marginTop: hp(2.3),
    gap: wp(3),
  },
  imageStyle: {
    height: wp(12),
    width: wp(12),
    borderRadius: hp(1.2),
  },
  designation: {
    fontFamily: fonts.light,
    fontSize: getFontSize(11),
    color: colors.gray,
  },
});
