import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { store } from '@/store/store'
import { logout } from '@/store/authSlice'

const CustomDrawer = ({
  userProfile = {
    name: 'Olivia Rhye',
    role: 'Recruiter',
    // role: 'Job Seeker',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b578?w=100&h=100&fit=crop&crop=face',
    isVerified: true
  },
  onNavigate,
  onLogout
}) => {
  const insets = useSafeAreaInsets()
  const [expandedSections, setExpandedSections] = useState({})
  const role = 'Recruiter'

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

 const getMenuItemsByRole = (role) => {
    if (role === 'Recruiter') {
      return [
        {
          key: 'my-profile',
          title: 'My Profile',
          icon: 'person-outline',
          iconLib: iconLibName.Ionicons,
          route: 'MyProfile'
        },
        {
          key: 'my-documents',
          title: 'My Documents',
          icon: 'document-text-outline',
          iconLib: iconLibName.Ionicons,
          route: 'MyDocuments'
        },
        {
          key: 'my-reviews',
          title: 'My Reviews',
          icon: 'star-outline',
          iconLib: iconLibName.Ionicons,
          route: 'MyReviews'
        },
        {
          key: 'my-transactions',
          title: 'My Transactions',
          icon: 'card-outline',
          iconLib: iconLibName.Ionicons,
          route: 'MyTransactions'
        },
        {
          key: 'my-requests',
          title: 'My Requests',
          icon: 'list-outline',
          iconLib: iconLibName.Ionicons,
          route: 'MyRequests'
        },
        {
          key: 'support',
          title: 'Support',
          icon: 'help-circle-outline',
          iconLib: iconLibName.Ionicons,
          route: 'Support'
        }
      ]
    }

    // Default menu for Job Seeker and other roles
    return [
      {
        key: 'settings',
        title: 'Settings',
        icon: 'settings-outline',
        iconLib: iconLibName.Ionicons,
        expandable: true,
        subItems: [
          { key: 'job-settings', title: 'Job Settings', icon: 'briefcase-outline' },
          { key: 'app-settings', title: 'App Settings', icon: 'phone-portrait-outline' },
          { key: 'squad-settings', title: 'Squad Settings', icon: 'people-outline' }
        ]
      },
      {
        key: 'dashboard',
        title: 'Dashboard',
        icon: 'apps-outline',
        iconLib: iconLibName.Ionicons,
        route: 'Dashboard'
      },
      {
        key: 'account-upgrades',
        title: 'Account Upgrades',
        icon: 'diamond-outline',
        iconLib: iconLibName.Ionicons,
        route: 'AccountUpgrades'
      },
      {
        key: 'support',
        title: 'Support',
        icon: 'help-circle-outline',
        iconLib: iconLibName.Ionicons,
        route: 'Support'
      },
      {
        key: 'notifications',
        title: 'Notifications',
        icon: 'notifications-outline',
        iconLib: iconLibName.Ionicons,
        route: 'Notifications'
      },
      {
        key: 'chat',
        title: 'Chat',
        icon: 'chatbubble-outline',
        iconLib: iconLibName.Ionicons,
        route: 'Chat'
      },
      {
        key: 'wallet',
        title: 'Wallet',
        icon: 'wallet-outline',
        iconLib: iconLibName.Ionicons,
        route: 'Wallet'
      },
      {
        key: 'job-pool',
        title: 'Job Pool',
        icon: 'mail-outline',
        iconLib: iconLibName.Ionicons,
        expandable: true,
        subItems: [
          { key: 'active-jobs', title: 'Active Jobs', icon: 'checkmark-circle-outline' },
          { key: 'completed-jobs', title: 'Completed Jobs', icon: 'checkmark-done-outline' },
          { key: 'draft-jobs', title: 'Draft Jobs', icon: 'document-outline' }
        ]
      },
      {
        key: 'reports',
        title: 'Reports & Statics',
        icon: 'bar-chart-outline',
        iconLib: iconLibName.Ionicons,
        expandable: true,
        subItems: [
          { key: 'job-reports', title: 'Job Reports', icon: 'document-text-outline' },
          { key: 'earnings-report', title: 'Earnings Report', icon: 'cash-outline' },
          { key: 'performance', title: 'Performance Analytics', icon: 'analytics-outline' }
        ]
      },
      {
        key: 'marketplace',
        title: 'Marketplace',
        icon: 'storefront-outline',
        iconLib: iconLibName.Ionicons,
        route: 'Marketplace'
      }
    ]
  }

  const menuItems = getMenuItemsByRole(userProfile.role)

  const renderUserProfile = () => (
    <View style={styles.profileSection}>
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: userProfile.avatar }}
            style={styles.avatar}
          />
          {userProfile.isVerified && (
            <View style={styles.verificationBadge}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="checkmark"
                size={12}
                color="#FFFFFF"
              />
            </View>
          )}
        </View>
        
        <View style={styles.userInfo}>
          <AppText variant={Variant.subTitle} style={styles.userName}>
            {userProfile.name}
          </AppText>
          <AppText variant={Variant.bodySmall} style={styles.userRole}>
            {userProfile.role}
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
            } else if (item.route && onNavigate) {
              onNavigate(item.route)
            }
          }}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <View style={styles.iconContainer}>
              <VectorIcons
                name={item.iconLib || iconLibName.Ionicons}
                iconName={item.icon}
                size={20}
                color={colors.gray || '#6B7280'}
              />
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
                onPress={() => onNavigate && onNavigate(subItem.key)}
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
        {menuItems.map(renderMenuItem)}
        
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
    backgroundColor: colors.gray || '#9CA3AF',
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