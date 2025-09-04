import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  StatusBar
} from 'react-native'
import React from 'react'
import { LinearGradient } from 'react-native-linear-gradient'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import globalStyles from '@/styles/globalStyles'
import { Images } from '@/assets'

const AppHeader = ({
  title = "Dashboard",
  onMenuPress,
  onNotificationPress,
  onSearchPress,
  notificationCount = 0,
  backgroundImage = Images.header, // Optional: You can pass your custom background image
  showNotificationDot = true
}) => {
  const insets = useSafeAreaInsets()

  const HeaderContent = () => (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Header Content */}
      <View style={styles.headerContent}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>



          {/* Left Side - Menu Button */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onMenuPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuIcon}>
              <View style={styles.menuDot} />
              <View style={styles.menuDot} />
              <View style={styles.menuDot} />
              <View style={styles.menuDot} />
            </View>
          </TouchableOpacity>

          {/* Notification Icon */}
          <View style={globalStyles.flexRow}>


            <TouchableOpacity
              style={styles.iconButton}
              onPress={onNotificationPress}
              activeOpacity={0.7}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="notifications-outline"
                size={24}
                color="#FFFFFF"
              />
              {(showNotificationDot || notificationCount > 0) && (
                <View style={styles.notificationDot}>
                  {notificationCount > 0 && (
                    <AppText variant={Variant.smallCaption} style={styles.notificationText}>
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </AppText>
                  )}
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={onSearchPress}
              activeOpacity={0.7}
            >
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="search-outline"
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Center - Title */}
        <View style={styles.titleContainer}>
          <AppText variant={Variant.title} style={styles.headerTitle}>
            {title}
          </AppText>
        </View>

      </View>
    </View>
  )

  if (backgroundImage) {
    return (
      <ImageBackground source={backgroundImage} style={styles.container}>
        <HeaderContent />
      </ImageBackground>
    )
  }

  return (
    <LinearGradient
      colors={['#8B5CF6', '#EC4899']} // Purple to Pink gradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <HeaderContent />
    </LinearGradient>
  )
}

export default AppHeader

const styles = StyleSheet.create({
  container: {
    height: hp(20),
    borderBottomLeftRadius: hp(4),
    borderBottomRightRadius: hp(4),
    overflow: 'hidden',
  },
  headerContent: {
    justifyContent: 'space-around',
    // backgroundColor: 'red',
    flex: 1,
  },  
  headerContainer: {
    flex: 1,
    padding: 20,
    position: 'relative',
    justifyContent: 'space-between',
  },
  decorativeShapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  shape1: {
    position: 'absolute',
    top: hp(-5),
    right: wp(-15),
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  shape2: {
    position: 'absolute',
    top: hp(5),
    right: wp(-5),
    width: wp(25),
    height: wp(25),
    borderRadius: wp(12.5),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  topIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(6),
    paddingTop: hp(1),
    zIndex: 2,
  },
  iconButton: {
    padding: wp(2),
    position: 'relative',
  },
  menuIcon: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: wp(6),
    height: wp(6),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuDot: {
    width: wp(1.2),
    height: wp(1.2),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(0.6),
    margin: wp(0.2),
  },
  titleContainer: {
    // paddingHorizontal: wp(6),
    // paddingBottom: hp(2),
    zIndex: 2,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: getFontSize(26),
    fontWeight: 'bold',
  },
  notificationDot: {
    position: 'absolute',
    top: wp(1),
    right: wp(1),
    backgroundColor: '#FF6B35',
    borderRadius: wp(2.5),
    minWidth: wp(4),
    height: wp(4),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: getFontSize(10),
    fontWeight: 'bold',
  },
})