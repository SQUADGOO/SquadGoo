import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native'
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
  // console.log('User Info from Redux:', userInfo, 'Role:', role)

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
            { key: 'quick-search', title: 'Quick Fill', icon: 'search-outline', route: screenNames.QUICK_SEARCH_STACK },
            { key: 'manual-search', title: 'Manual Fill', icon: 'search-circle-outline', route: screenNames.MANUAL_SEARCH_STACK },
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
        // Current Offers removed — handled by Dashboard per client request

        {
          key: 'settings',
          title: 'Settings',
          icon: 'settings-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.APP_SETTINGS,
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
          key: 'announcements',
          title: 'Announcements',
          icon: 'megaphone-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.ANNOUNCEMENTS,
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
            { key: 'my-reviews', title: 'My Reviews', icon: 'star-outline', route: screenNames.MY_REVIEWS, params: { audience: 'recruiter' } },
            { key: 'written-reviews', title: "Reviews I've Written", icon: 'create-outline', route: screenNames.WRITTEN_REVIEWS, params: { audience: 'recruiter' } },
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
          key: 'home',
          title: 'Home',
          icon: 'home-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.JOBSEEKER_TAB,
        },
        {
          key: 'dashboard',
          title: 'Dashboard',
          icon: 'grid-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.JOB_SEEKER_DASHBOARD,
        },
        {
          key: 'account-upgrades',
          title: 'Account Upgrades',
          icon: 'diamond-outline',
          iconLib: iconLibName.Ionicons,
          comingSoon: true,
        },
        {
          key: 'support',
          title: 'Support',
          icon: 'help-circle-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.SUPPORT,
        },
        {
          key: 'job-pool',
          title: 'Job Pool',
          icon: 'briefcase-outline',
          iconLib: iconLibName.Ionicons,
          expandable: true,
          subItems: [
            { key: 'active-offers', title: 'Active Offers', icon: 'checkmark-circle-outline', route: screenNames.ACTIVE_OFFERS_POOL },
            { key: 'completed-offers', title: 'Completed Offers', icon: 'checkmark-done-outline', route: screenNames.COMPLETED_OFFERS_POOL },
            { key: 'expired-declined', title: 'Expired/Declined Offers', icon: 'close-circle-outline', route: screenNames.EXPIRED_DECLINED_POOL },
          ],
        },
        {
          key: 'reports',
          title: 'Reports & Stats',
          icon: 'bar-chart-outline',
          iconLib: iconLibName.Ionicons,
          expandable: true,
          subItems: [
            { key: 'my-reviews', title: 'My Reviews', icon: 'star-outline', route: screenNames.MY_REVIEWS, params: { audience: 'jobseeker' } },
            { key: 'written-reviews', title: "Reviews I've Written", icon: 'create-outline', route: screenNames.WRITTEN_REVIEWS, params: { audience: 'jobseeker' } },
            { key: 'offer-reports', title: 'Offer Reports', icon: 'document-text-outline', route: screenNames.JOBSEEKER_JOB_REPORTS },
            { key: 'earnings-report', title: 'Earnings Report', icon: 'cash-outline', route: screenNames.JOBSEEKER_EARNING_REPORTS },
            { key: 'performance', title: 'Performance Analytics', icon: 'analytics-outline', route: screenNames.JOBSEEKER_PERFORMANCE_ANALYTICS },
          ],
        },
        {
          key: 'marketplace',
          title: 'Marketplace',
          icon: 'storefront-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.MARKETPLACE_STACK,
        },
        {
          key: 'announcements',
          title: 'Announcements',
          icon: 'megaphone-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.ANNOUNCEMENTS,
        },
        {
          key: 'settings',
          title: 'Settings',
          icon: 'settings-outline',
          iconLib: iconLibName.Ionicons,
          route: screenNames.APP_SETTINGS,
        },
      ]
    }

    // fallback for any other role
    return []
  }


  const isJobseeker = role?.toLowerCase() === 'jobseeker'
  const [isActive, setIsActive] = useState(true)

  const menuItems = getMenuItemsByRole(role)

  // Build initials from name
  const userName = userInfo?.name || userInfo?.firstName || ''
  const initials = userName.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
  const hasPhoto = !!userInfo?.profile_picture

  const renderUserProfile = () => (
    <View style={styles.profileSection}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => navigation.navigate(screenNames.PROFILE)} style={styles.avatarContainer}>
          {hasPhoto ? (
            <FastImageView
              source={{ uri: userInfo.profile_picture }}
              style={styles.avatar}
              resizeMode={'cover'}
            />
          ) : (
            <View style={[styles.avatar, styles.initialsAvatar]}>
              <AppText variant={Variant.subTitle} style={styles.initialsText}>{initials}</AppText>
            </View>
          )}
          {/* Camera icon overlay */}
          <View style={styles.cameraOverlay}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="camera"
              size={12}
              color="#FFFFFF"
            />
          </View>
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
            {userName || 'User'}
          </AppText>
          <AppText variant={Variant.bodySmall} style={styles.userRole}>
            {isJobseeker ? 'jobseeker' : role}
          </AppText>
        </View>

        {isJobseeker ? (
          <Switch
            value={isActive}
            // onValueChange={setIsActive}
            trackColor={{ false: '#D1D5DB', true: '#4ADE80' }}
            thumbColor="#FFFFFF"
          />
        ) : (
          <TouchableOpacity style={styles.toggleSwitch}>
            <View style={styles.switchTrack}>
              <View style={styles.switchThumb} />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Active/Inactive label for jobseeker */}
      {isJobseeker ? (
        <View style={styles.activeStatusRow}>
          <View style={[styles.activeStatusDot, { backgroundColor: isActive ? '#4ADE80' : '#9CA3AF' }]} />
          <AppText variant={Variant.caption} style={[styles.activeStatusText, { color: isActive ? '#16A34A' : '#6B7280' }]}>
            {isActive ? 'Active – Receiving Offers' : 'Inactive – Not Receiving Offers'}
          </AppText>
        </View>
      ) : null}

      {/* Warning when inactive */}
      {isJobseeker && !isActive ? (
        <View style={styles.warningBanner}>
          <VectorIcons name={iconLibName.Ionicons} iconName="warning-outline" size={14} color="#D97706" />
          <AppText variant={Variant.caption} style={styles.warningText}>
            You won't receive new job offers.
          </AppText>
        </View>
      ) : null}
    </View>
  )

  const renderMenuItem = (item) => {
    const isExpanded = expandedSections[item.key]
    const isDisabled = item.comingSoon

    return (
      <View key={item.key} style={styles.menuItemContainer}>
        <TouchableOpacity
          style={[styles.menuItem, isDisabled && styles.menuItemDisabled]}
          onPress={() => {
            if (isDisabled) return
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
          activeOpacity={isDisabled ? 1 : 0.7}
        >
          <View style={styles.menuItemLeft}>
            <View style={styles.iconContainer}>
              {item.iconImage ? (
                <Image
                  source={item.iconImage}
                  style={[styles.menuIconImage, isDisabled && { tintColor: '#D1D5DB' }]}
                  resizeMode="contain"
                />
              ) : (
                <VectorIcons
                  name={item.iconLib || iconLibName.Ionicons}
                  iconName={item.icon}
                  size={20}
                  color={isDisabled ? '#D1D5DB' : (colors.primary || '#6B7280')}
                />
              )}
            </View>
            <AppText variant={Variant.body} style={[styles.menuItemText, isDisabled && styles.menuItemTextDisabled]}>
              {item.title}
            </AppText>
          </View>

          {item.comingSoon && (
            <View style={styles.comingSoonBadge}>
              <AppText variant={Variant.caption} style={styles.comingSoonText}>
                Coming Soon
              </AppText>
            </View>
          )}

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
  menuItemDisabled: {
    opacity: 0.6,
  },
  menuItemTextDisabled: {
    color: '#9CA3AF',
  },
  initialsAvatar: {
    backgroundColor: colors.primary || '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: '#FFFFFF',
    fontSize: getFontSize(18),
    fontWeight: '700',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: wp(5.5),
    height: wp(5.5),
    borderRadius: wp(2.75),
    backgroundColor: colors.gray || '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  activeStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1),
    gap: wp(2),
    paddingLeft: wp(1),
  },
  activeStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeStatusText: {
    fontSize: getFontSize(12),
    fontWeight: '600',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginTop: hp(0.8),
    backgroundColor: '#FFFBEB',
    borderRadius: hp(1),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
  },
  warningText: {
    color: '#D97706',
    fontSize: getFontSize(11),
    fontWeight: '500',
  },
  comingSoonBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: hp(1),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.3),
  },
  comingSoonText: {
    color: '#9CA3AF',
    fontSize: getFontSize(10),
    fontWeight: '600',
  },
})