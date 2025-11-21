import React from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image
} from 'react-native'
import { LinearGradient } from 'react-native-linear-gradient'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import AppHeader from '@/core/AppHeader'
import { Images } from '@/assets'
import { screenNames } from '@/navigation/screenNames'

const FindStaff = ({ navigation }) => {

  const handleMenuPress = () => {
    navigation.openDrawer && navigation.openDrawer()
  }

  const handleNotificationPress = () => {
    navigation.navigate('Notifications')
  }

  const handleSearchPress = () => {
    navigation.navigate('Search')
  }

  const handleManualSearch = () => {
    navigation.navigate(screenNames.MANUAL_SEARCH_STACK)
  }

  const handleQuickSearch = () => {
    navigation.navigate(screenNames.QUICK_SEARCH_STEPONE)
  }

  const SearchOption = ({ 
    title, 
    description, 
    onPress, 
    iconColor = colors.primary 
  }) => (
    <TouchableOpacity
      style={styles.searchOptionCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.searchOptionContent}>
        <View style={styles.searchOptionHeader}>
          <AppText variant={Variant.subTitle} style={styles.searchOptionTitle}>
            {title}
          </AppText>
          <VectorIcons
            name={iconLibName.Ionicons}
            iconName="chevron-forward"
            size={24}
            color={iconColor}
          />
        </View>
        
        <AppText variant={Variant.body} style={styles.searchOptionDescription}>
          {description}
        </AppText>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <AppHeader
        title="Find a Staff"
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
        onSearchPress={handleSearchPress}
        notificationCount={2}
      />

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image 
                        source={Images.topIllustration} 
                        style={{
                          width: wp(80),
                          height: hp(30),
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        resizeMode="contain"
                      />
        </View>

        {/* Search Options */}
        <View style={styles.searchOptionsContainer}>
          
          <SearchOption
            title="Manual Search"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
            onPress={handleManualSearch}
          />

            <View style={{height: 0.5, backgroundColor: colors.textPrimary}} />            
          <SearchOption
            title="Quick Search"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
            onPress={handleQuickSearch}
          />

        </View>

      </ScrollView>
    </View>
  )
}

export default FindStaff

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: hp(4),
  },
  illustrationContainer: {
    alignItems: 'center',
    paddingVertical: hp(4),
    backgroundColor: colors.white,
  },
  illustrationPlaceholder: {
    width: wp(80),
    height: hp(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Illustration Styles (Simple CSS illustration)
  personContainer: {
    position: 'relative',
    width: wp(60),
    height: hp(35),
  },
  person: {
    position: 'absolute',
    bottom: hp(8),
    left: wp(15),
  },
  personHead: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: '#F4A261',
    position: 'absolute',
    top: -hp(2),
    left: wp(2),
  },
  personBody: {
    width: wp(12),
    height: hp(12),
    backgroundColor: '#4A90E2',
    borderRadius: wp(6),
    position: 'relative',
  },
  personLegLeft: {
    width: wp(4),
    height: hp(10),
    backgroundColor: '#6B46C1',
    borderRadius: wp(2),
    position: 'absolute',
    bottom: -hp(10),
    left: wp(1),
  },
  personLegRight: {
    width: wp(4),
    height: hp(10),
    backgroundColor: '#6B46C1',
    borderRadius: wp(2),
    position: 'absolute',
    bottom: -hp(10),
    right: wp(1),
  },
  personArm: {
    width: wp(6),
    height: wp(3),
    backgroundColor: '#4A90E2',
    borderRadius: wp(1.5),
    position: 'absolute',
    top: hp(3),
    right: -wp(4),
    transform: [{ rotate: '-20deg' }],
  },
  megaphone: {
    width: wp(8),
    height: wp(4),
    backgroundColor: '#E76F51',
    borderTopRightRadius: wp(2),
    borderBottomRightRadius: wp(2),
    position: 'absolute',
    top: hp(2),
    right: -wp(10),
  },
  megaphoneSound: {
    width: wp(15),
    height: wp(8),
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderRadius: wp(4),
    borderLeftWidth: 0,
    position: 'absolute',
    top: hp(0.5),
    right: -wp(22),
    opacity: 0.6,
  },
  bench: {
    width: wp(20),
    height: wp(3),
    backgroundColor: '#FF6B35',
    borderRadius: wp(1.5),
    position: 'absolute',
    bottom: 0,
    left: wp(10),
  },

  // Search Options Styles
  searchOptionsContainer: {
    paddingHorizontal: wp(6),
    gap: hp(2),
  },
  searchOptionCard: {
    backgroundColor: colors.white,
    // borderRadius: hp(2),
    padding: wp(3),
    shadowColor: '#000',
   
    // borderWidth: 1,
    borderColor: colors.grayE8 || '#F3F4F6',
  },
  searchOptionContent: {
    flex: 1,
  },
  searchOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  searchOptionTitle: {
    color: colors.primary || '#FF6B35',
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    flex: 1,
  },
  searchOptionDescription: {
    // color: colors.gray || '#6B7280',
    lineHeight: hp(2.5),
    fontSize: getFontSize(14),
  },
})