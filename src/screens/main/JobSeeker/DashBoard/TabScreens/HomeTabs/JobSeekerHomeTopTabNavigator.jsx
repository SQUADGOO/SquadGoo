import React from 'react'
import { View, StyleSheet } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import { screenNames } from '@/navigation/screenNames'
import JobSeekerActiveJob from './JobSeekerActiveJob'



const Tab = createMaterialTopTabNavigator()

// Custom Tab Label Component
const CustomTabLabel = ({ focused, children }) => (
  <AppText
    variant={Variant.bodyMedium}
    style={[
      styles.tabLabel,
      { color: focused ? colors.primary || '#FF6B35' : colors.gray || '#9CA3AF' }
    ]}
  >
    {children}
  </AppText>
)

const JobSeekerHomeTopTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBarStyle,
        tabBarIndicatorStyle: styles.indicatorStyle,
        tabBarScrollEnabled: true, // Enable scrolling for longer tab names
        tabBarItemStyle: styles.tabItemStyle,
        tabBarContentContainerStyle: styles.tabBarContentStyle,
        swipeEnabled: true, // Enable swipe gestures
        lazy: true, // Lazy load screens for better performance
        tabBarPressColor: 'transparent', // Remove ripple effect
        tabBarPressOpacity: 0.7,
      }}
    >
      <Tab.Screen
        name={screenNames.ACTIVE_JOB_OFFERS}
        component={JobSeekerActiveJob}
        options={{
          tabBarLabel: ({ focused }) => (
            <CustomTabLabel focused={focused}>
              Active job offers
            </CustomTabLabel>
          ),
        }}
      />
      <Tab.Screen
        name="CompletedOffers"
        component={JobSeekerActiveJob}
        options={{
          tabBarLabel: ({ focused }) => (
            <CustomTabLabel focused={focused}>
              Completed offers
            </CustomTabLabel>
          ),
        }}
      />
    
    </Tab.Navigator>
  )
}

export default JobSeekerHomeTopTabNavigator

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: colors.white || '#FFFFFF',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    paddingVertical: 5,
    borderBottomColor: colors.grayE8 || '#F3F4F6',
  },
  indicatorStyle: {
    backgroundColor: colors.primary || '#FF6B35',
    height: hp(0.3),
    borderRadius: hp(0.15),
  },
  tabItemStyle: {
    width: wp(45), // Auto width for content
    paddingHorizontal: wp(5),
    // backgroundColor: 'red',
    
  },
  tabBarContentStyle: {
    paddingHorizontal: wp(4),
  },
  tabLabel: {
    fontSize: getFontSize(14),
    // width: wp(40),
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

// Example screen components (you'll need to create these)
// ActiveJobOffersScreen.js


// CompletedOffersScreen.js  
export const CompletedOffersScreen = () => (
  <View style={screenStyles.container}>
    <AppText variant={Variant.body}>Completed Offers Content</AppText>
    {/* Your completed offers content here */}
  </View>
)

// ExpiredOffersScreen.js
export const ExpiredOffersScreen = () => (
  <View style={screenStyles.container}>
    <AppText variant={Variant.body}>Expired Offers Content</AppText>
    {/* Your expired offers content here */}
  </View>
)

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
    padding: wp(6),
  },
})

// Usage in your main Home screen:
/*
import HomeTopTabNavigator from './HomeTopTabNavigator'
import DashboardHeader from './DashboardHeader'

const HomeScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <DashboardHeader 
        title="Dashboard"
        onMenuPress={() => {}}
        onNotificationPress={() => {}}
        onSearchPress={() => {}}
      />
      <HomeTopTabNavigator />
    </View>
  )
}
*/