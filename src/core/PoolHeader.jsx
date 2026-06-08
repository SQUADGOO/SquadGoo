import React from 'react'
import { View, StyleSheet, TouchableOpacity, StatusBar, ImageBackground } from 'react-native'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Images } from '@/assets'
import { useNavigation } from '@react-navigation/native'

const PoolHeader = ({
  title = '',
  showBackButton = true,
  onBackPress,
  rightComponent = null,
  stepIndicator = null,
  statusBarStyle = 'light-content',
  backgroundColor = 'transparent',
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
          <View style={{ paddingHorizontal: wp(4) }}>
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
              
              <AppText 
                variant={Variant.title} 
                style={[
                  styles.headerTitle,
                  !showBackButton && styles.headerTitleNoBack,
                  { fontWeight: 'bold' }
                ]}
              >
                {title}
              </AppText>
              
              {rightComponent ? (
                <View style={styles.rightComponent}>{rightComponent}</View>
              ) : stepIndicator ? (
                <AppText variant={Variant.bodyMedium} style={styles.stepIndicator}>
                  {stepIndicator}
                </AppText>
              ) : (
                <View style={styles.placeholder} />
              )}
            </View>

            {children}
          </View>
        </ImageBackground>
      </View>
    </>
  )
}

export default PoolHeader

const styles = StyleSheet.create({
  headerWrapper: {
    overflow: 'hidden',
    borderBottomLeftRadius: hp(3),
    borderBottomRightRadius: hp(3),
  },
  header: {
    paddingVertical: hp(2.5),
  },
  headerImageStyle: {
    resizeMode: 'cover',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
})
