import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { store } from '@/store/store'
import { logout } from '@/store/authSlice'
import icons from '@/assets/icons'
import { screenNames } from '../navigation/screenNames'
import { useSelector } from 'react-redux'
import { useNavigation, CommonActions } from '@react-navigation/native'
import FastImageView from './FastImageView'
import { Images } from '@/assets'

const CustomDrawer = ({
  onNavigate,
  onLogout
}) => {
  const insets = useSafeAreaInsets()
  const [expandedSections, setExpandedSections] = useState({})
  const navigation = useNavigation()
  // 🔹 Get current user info from Redux
  const { userInfo, role } = useSelector((state) => state.auth)
  console.log('User Info from Redux:', userInfo, 'Role:', role)

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  const getMenuItemsByRole = (role) => {
    if (role?.toLowerCase() === 'recruiter') {
      return [
        {
          key: 'home',
          title: 'Home',
          icon: 'home-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.Tab_NAVIGATION,
        },
        {
          key: 'dashboard',
          title: 'Dashboard',
          iconImage: icons.menu,
          route: screenNames.MAIN_DASHBOARD, // unified route
        },
        {
          key: 'find-staff',
          title: 'Find a Staff',
          icon: 'people-outline',
          iconLib: iconLibName.Ionicons,
          expandable: true,
          subItems: [
          { key: 'quick-search', title: 'Quick Search', icon: 'search-outline', route: screenNames.QUICK_SEARCH_STACK },
            { key: 'manual-search', title: 'Manual Search', icon: 'search-circle-outline', route: screenNames.MANUAL_SEARCH },
          ],
        },
        {
          key: 'labor-pools',
          title: 'Labor Pools',
          icon: 'layers-outline',
          iconLib: iconLibName.Ionicons,
          expandable: true,
          subItems: [
            { key: 'labor-pool', title: 'Your Pool', icon: 'briefcase-outline', route: screenNames.LABOR_POOL },
            { key: 'squad-pool', title: 'Squad Pool', icon: 'people-circle-outline', route: screenNames.SQUAD_POOL },
            { key: 'contractors', title: 'Contractors', icon: 'hammer-outline', route: screenNames.CONTRACTORS },
            { key: 'employees', title: 'Employees', icon: 'person-outline', route: screenNames.EMPLOYEES },
          ],
        },
        {
          key: 'current-offers',
          title: 'Current Offers',
          icon: 'pricetags-outline',
          iconLib: iconLibName.Ionicons,
          expandable: true,
          subItems: [
            {
              key: 'active-offers',
              title: 'Active',
              icon: 'checkmark-circle-outline',
              route: screenNames.ACTIVE_OFFERS,
              params: { fromDrawer: true, headerTitle: 'Active Offers' },
            },
            {
              key: 'completed-offers',
              title: 'Completed',
              icon: 'checkmark-done-outline',
              route: screenNames.COMPLETED_OFFERS,
              params: { fromDrawer: true, headerTitle: 'Completed Offers' },
            },
            {
              key: 'expired-offers',
              title: 'Expired',
              icon: 'time-outline',
              route: screenNames.EXPIRED_OFFERS,
              params: { fromDrawer: true, headerTitle: 'Expired Offers' },
            },
            {
              key: 'drafted-offers',
              title: 'Drafted',
              icon: 'document-outline',
              route: screenNames.DRAFTED_OFFERS,
              params: { fromDrawer: true, headerTitle: 'Drafted Offers' },
            },
          ],
        },
        {
          key: 'settings',
          title: 'Settings',
          icon: 'settings-outline',
          iconLib: iconLibName.Ionicons,
          expandable: true,
          subItems: [
            { key: 'job-settings', title: 'Job Settings', icon: 'briefcase-outline', route: screenNames.JOB_SETTINGS },
            { key: 'staff-preferences', title: 'Staff Preferences', icon: 'options-outline', route: screenNames.STAFF_PREFERENCES },
            { key: 'app-settings', title: 'App Settings', icon: 'phone-portrait-outline', route: screenNames.APP_SETTINGS },
            { key: 'squad-settings', title: 'Squad Settings', icon: 'people-outline', route: screenNames.SQUAD_SETTINGS },
            // { key: 'account-settings', title: 'Account Settings', icon: 'person-circle-outline', route: 'AccountSettings' },
          ],
        },
        {
          key: 'account-upgrades',
          title: 'Account Upgrades',
          icon: 'diamond-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.ACCOUNT_UPGRADE,
        },
        {
          key: 'support',
          title: 'Support',
          icon: 'help-circle-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.SUPPORT,
        },
        {
          key: 'notifications',
          title: 'Notifications',
          icon: 'notifications-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.NOTICATIONS,
        },
        {
          key: 'chat',
          title: 'Chat',
          icon: 'chatbubble-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.CHAT,
        },
        {
          key: 'wallet',
          title: 'Wallet',
          icon: 'wallet-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.Wallet,
        },
        {
          key: 'reports',
          title: 'Rating & Reports',
          icon: 'bar-chart-outline',
          iconLib: iconLibName.Ionicons,
          expandable: true,
          subItems: [
            { key: 'billing-spend-summary', title: 'Billing & Spend Summary', icon: 'receipt-outline', route: screenNames.RECRUITER_BILLING_REPORTS },
          ],
        },
        {
          key: 'marketplace',
          title: 'Marketplace',
          icon: 'storefront-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.MARKETPLACE_STACK,
        },
        // {
        //   key: 'orders',
        //   title: 'My Orders',
        //   icon: 'receipt-outline',
        //   iconLib: iconLibName.Ionicons,
        //   route: screenNames.MARKETPLACE_ORDERS,
        // },
        // {
        //   key: 'logout',
        //   title: 'Log out',
        //   icon: 'log-out-outline',
        //   iconLib: iconLibName.Ionicons,
        //   route: 'Logout',
        // },
      ]
    }

    if (role?.toLowerCase() === 'jobseeker') {
      return [
        {
          key: 'settings',
          title: 'Settings',
          icon: 'settings-outline',
          iconLib: iconLibName.Ionicons,
          expandable: true,
          subItems: [
            { key: 'job-settings', title: 'Job Settings', icon: 'briefcase-outline', route: screenNames.JOB_SETTINGS },
            { key: 'app-settings', title: 'App Settings', icon: 'phone-portrait-outline', route: screenNames.APP_SETTINGS },
            { key: 'squad-settings', title: 'Squad Settings', icon: 'people-outline', route: screenNames.SQUAD_SETTINGS },
          ],
        },
        {
          key: 'dashboard',
          title: 'Dashboard',
          icon: 'apps-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.JOB_SEEKER_DASHBOARD,
        },
        {
          key: 'account-upgrades',
          title: 'Account Upgrades',
          icon: 'diamond-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.ACCOUNT_UPGRADE,
        },
        {
          key: 'support',
          title: 'Support',
          icon: 'help-circle-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.SUPPORT,
        },
        {
          key: 'notifications',
          title: 'Notifications',
          icon: 'notifications-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.NOTICATIONS,
        },
        {
          key: 'chat',
          title: 'Chat',
          icon: 'chatbubble-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.CHAT,
        },
        {
          key: 'wallet',
          title: 'Wallet',
          icon: 'wallet-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.Wallet,
        },
        {
          key: 'job-pool',
          title: 'Job Pool',
          icon: 'mail-outline',
          iconLib: iconLibName.Ionicons,
          expandable: true,
          subItems: [
            { key: 'active-jobs', title: 'Active Jobs', icon: 'checkmark-circle-outline', route: screenNames.ACTIVE_OFFERS },
            { key: 'completed-jobs', title: 'Completed Jobs', icon: 'checkmark-done-outline', route: screenNames.COMPLETED_OFFERS },
            { key: 'draft-jobs', title: 'Draft Jobs', icon: 'document-outline', route: screenNames.DRAFTED_OFFERS },
          ],
        },
        {
          key: 'reports',
          title: 'Reports & Statics',
          icon: 'bar-chart-outline',
          iconLib: iconLibName.Ionicons,
          expandable: true,
          subItems: [
            { key: 'job-reports', title: 'Job Reports', icon: 'document-text-outline', route: screenNames.JOBSEEKER_JOB_REPORTS },
            { key: 'earnings-report', title: 'Earnings Report', icon: 'cash-outline', route: screenNames.JOBSEEKER_EARNING_REPORTS },
            { key: 'performance', title: 'Performance Analytics', icon: 'analytics-outline', route: 'PerformanceAnalytics' },
          ],
        },
        {
          key: 'marketplace',
          title: 'Marketplace',
          icon: 'storefront-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.MARKETPLACE_STACK,
        },
        // {
        //   key: 'orders',
        //   title: 'My Orders',
        //   icon: 'receipt-outline',
        //   iconLib: iconLibName.Ionicons,
        //   route: screenNames.MARKETPLACE_ORDERS,
        // },
      ]
    }

    // fallback for any other role
    return []
  }


  const menuItems = getMenuItemsByRole(role)

  const renderUserProfile = () => (
    <View style={styles.profileSection}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => navigation.navigate(screenNames.PROFILE)} style={styles.avatarContainer}>
      
            <FastImageView
              source={userInfo?.profile_picture ? { uri: userInfo?.profile_picture } : Images.logo}
              style={styles.avatar}
              resizeMode={'cover'}
            />
          {userInfo?.isVerified && (
            <View style={styles.verificationBadge}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="checkmark"
                size={12}
                color="#FFFFFF"
              />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <AppText variant={Variant.subTitle} style={styles.userName}>
            {userInfo?.name}
          </AppText>
          <AppText variant={Variant.bodySmall} style={styles.userRole}>
            {role}
          </AppText>
        </View>

        <TouchableOpacity style={styles.toggleSwitch}>
          <View style={styles.switchTrack}>
            <View style={styles.switchThumb} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderMenuItem = (item) => {
    const isExpanded = expandedSections[item.key]

    return (
      <View key={item.key} style={styles.menuItemContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            if (item.expandable) {
              toggleSection(item.key)
            } else if (item.route) {
              // Handle nested navigation for marketplace orders
              if (item.route === screenNames.MARKETPLACE_ORDERS) {
                navigation.dispatch(
                  CommonActions.navigate({
                    name: screenNames.MARKETPLACE_STACK,
                    params: {
                      screen: screenNames.MARKETPLACE_ORDERS,
                    },
                  })
                )
              } else {
                onNavigate(item.route, item.params)
              }
            }
          }}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <View style={styles.iconContainer}>
              {item.iconImage ? (
                <Image
                  source={item.iconImage}
                  style={styles.menuIconImage}
                  resizeMode="contain"
                />
              ) : (
                <VectorIcons
                  name={item.iconLib || iconLibName.Ionicons}
                  iconName={item.icon}
                  size={20}
                  color={colors.primary || '#6B7280'}
                />
              )}
            </View>
            <AppText variant={Variant.body} style={styles.menuItemText}>
              {item.title}
            </AppText>
          </View>

          {item.expandable && (
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName={isExpanded ? "chevron-up" : "chevron-down"}
              size={16}
              color={colors.gray || '#6B7280'}
            />
          )}
        </TouchableOpacity>

        {/* Sub Items */}
        {item.expandable && isExpanded && item.subItems && (
          <View style={styles.subItemsContainer}>
            {item.subItems.map((subItem) => (
              <TouchableOpacity
                key={subItem.key}
                style={styles.subMenuItem}
                onPress={() => {
                  if (subItem.route) {
                    onNavigate(subItem.route, subItem.params)
                  } else {
                    onNavigate(subItem.key) // fallback
                  }
                }}

                activeOpacity={0.7}
              >
                <View style={styles.subMenuBullet} />
                <AppText variant={Variant.bodySmall} style={styles.subMenuText}>
                  {subItem.title}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    )
  }

  const renderLogoutButton = () => (
    <TouchableOpacity
      style={styles.logoutButton}
      onPress={() => {
        store?.dispatch(logout())
      }}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="log-out-outline"
            size={20}
            color={colors.gray || '#6B7280'}
          />
        </View>
        <AppText variant={Variant.body} style={styles.menuItemText}>
          Log out
        </AppText>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {renderUserProfile()}

      <ScrollView
        style={styles.menuContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuContent}
      >
        {menuItems?.map(renderMenuItem)}

        <View style={styles.separator} />
        {renderLogoutButton()}
      </ScrollView>
    </View>
  )
}

export default CustomDrawer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
  },
  profileSection: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#F3F4F6',
  },
  menuIconImage: {
    width: wp(4),
    height: wp(4),
    tintColor: colors.primary || '#6B7280',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: wp(3),
  },
  avatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(7),
    resizeMode: 'contain',
    backgroundColor: colors.grayE8 || '#F3F4F6',
  },
  verificationBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    backgroundColor: colors.primary || '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: colors.black || '#000000',
    fontSize: getFontSize(14),
    fontWeight: '600',
    marginBottom: hp(0.3),
  },
  userRole: {
    color: colors.gray || '#6B7280',
    fontSize: getFontSize(12),
  },
  toggleSwitch: {
    marginLeft: wp(2),
  },
  switchTrack: {
    width: wp(12),
    height: hp(3.2),
    borderRadius: hp(1.6),
    backgroundColor: colors.grayE8 || '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: wp(0.5),
  },
  switchThumb: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  menuContainer: {
    flex: 1,
  },
  menuContent: {
    paddingVertical: hp(2),
  },
  menuItemContainer: {
    marginBottom: hp(0.2),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(6),
    paddingVertical: hp(2),
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: wp(8),
    alignItems: 'center',
    // marginRight: wp(2),
  },
  menuItemText: {
    color: colors.black || '#374151',
    fontSize: getFontSize(14),
    flex: 1,
  },
  subItemsContainer: {
    paddingLeft: wp(12),
    paddingBottom: hp(1),
  },
  subMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
  },
  subMenuBullet: {
    width: wp(1.5),
    height: wp(1.5),
    borderRadius: wp(0.75),
    backgroundColor: colors.primary || '#9CA3AF',
    marginRight: wp(3),
  },
  subMenuText: {
    color: colors.gray || '#6B7280',
    fontSize: getFontSize(14),
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: colors.grayE8 || '#F3F4F6',
    marginHorizontal: wp(6),
    marginVertical: hp(2),
  },
  logoutButton: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(2),
    marginBottom: hp(2),
  },
})