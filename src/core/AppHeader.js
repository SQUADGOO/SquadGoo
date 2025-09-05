import React, { Children } from 'react'
import { View, StyleSheet, TouchableOpacity, StatusBar, ImageBackground, Image } from 'react-native'
import { LinearGradient } from 'react-native-linear-gradient'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import globalStyles from '@/styles/globalStyles'
import { Icons, Images } from '@/assets'
import { useNavigation } from '@react-navigation/native'

const AppHeader = ({
  title = '',
  showBackButton = true,
  onBackPress,
  rightComponent = null,
  stepIndicator = null,
  gradientColors = ['#8B5CF6', '#EC4899'],
  statusBarStyle = 'light-content',
  backgroundColor = 'transparent',
  showTopIcons = true,
  onMenuPress,
  onNotificationPress,
  onSearchPress,
  notificationCount = 0,
  useImageBackground = true,
  children
}) => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress()
    } else {
      navigation.goBack()
    }
  }

  const renderContent = () => (
    <>
      {showTopIcons && (
        <View style={styles.topIconsContainer}>
          {/* Left Side - Menu Button */}
          <TouchableOpacity

            style={styles.iconButton}
            onPress={() => navigation.openDrawer()}
            activeOpacity={0.7}
          >
            <Image source={Icons.menu} style={styles.iconStyle} />
          </TouchableOpacity>

          {/* Right Side - Notification & Search Icons */}
          <View style={globalStyles.flexRow}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onNotificationPress}
              activeOpacity={0.7}
            >
              <Image source={Icons.notification} style={styles.iconStyle} />
              {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <AppText variant={Variant.caption} style={styles.badgeText}>
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </AppText>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={onSearchPress}
              activeOpacity={0.7}
            >
              <Image source={Icons.search} style={styles.iconStyle} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.headerContent}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="arrow-back"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        )}
        
        <AppText variant={Variant.title} style={[
          styles.headerTitle,
          !showBackButton && styles.headerTitleNoBack
          , {fontWeight: 'bold'}
        ]}>
          {title}
        </AppText>
        
        {rightComponent ? (
          <View style={styles.rightComponent}>
            {rightComponent}
          </View>
        ) : stepIndicator ? (
          <AppText variant={Variant.bodyMedium} style={styles.stepIndicator}>
            {stepIndicator}
          </AppText>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </>
  )

  return (
    <>
      <StatusBar 
        barStyle={statusBarStyle} 
        backgroundColor={backgroundColor} 
        translucent 
      />
    
        <View style={styles.headerWrapper}>
          <ImageBackground 
            source={Images.header} 
            style={[styles.header, { paddingTop: insets.top }]}
            imageStyle={styles.headerImageStyle}
          >
            <View style={{paddingHorizontal: wp(4)}}>
            {renderContent()}
          {children && children}

            </View>
          </ImageBackground>
        </View>
      
    </>
  )
}

export default AppHeader

const styles = StyleSheet.create({
  headerWrapper: {
    overflow: 'hidden',
    borderBottomLeftRadius: hp(3),
    borderBottomRightRadius: hp(3),
  },
  header: {
    paddingVertical: hp(2.5),
  },
  gradientHeader: {
    borderBottomLeftRadius: hp(6),
    borderBottomRightRadius: hp(6),
  },
  headerImageStyle: {
    resizeMode: 'cover',
  },
  topIconsContainer: {
    
    flexDirection: 'row', 
    justifyContent: 'space-between',  
    paddingVertical: hp(1.2),
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: wp(4),
    paddingTop: hp(1.5),
    paddingBottom: hp(0.5),
  },
  backButton: {
    padding: wp(2),
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: getFontSize(20),
    flex: 1,
    marginLeft: wp(3),
    fontWeight: '600',
  },
  headerTitleNoBack: {
    marginLeft: 0,
    // textAlign: 'center',
  },
  stepIndicator: {
    color: '#FFFFFF',
    fontSize: getFontSize(16),
  },
  rightComponent: {
    alignItems: 'flex-end',
  },
  placeholder: {
    width: wp(10),
  },
  iconButton: {
    padding: wp(2),
    position: 'relative',
  },
  iconStyle: {
    width: wp(6),
    height: wp(6),
    resizeMode: 'contain'
  },
  notificationBadge: {
    position: 'absolute',
    top: wp(0.5),
    right: wp(0.5),
    backgroundColor: '#FF3B30',
    borderRadius: wp(2.5),
    minWidth: wp(4.5),
    height: wp(4.5),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(0.8),
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: getFontSize(9),
    fontWeight: 'bold',
  },
})