import React from 'react'
import { View, StyleSheet } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import { screenNames } from '@/navigation/screenNames'
import ActiveJobOffers from './ActiveJobOffers'
import CompletedOffers from './CompletedOffers'
import ExpiredOffers from './ExpiredOffers'



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

const HomeTopTabNavigator = () => {
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
        component={ActiveJobOffers}
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
        component={CompletedOffers}
        options={{
          tabBarLabel: ({ focused }) => (
            <CustomTabLabel focused={focused}>
              Completed offers
            </CustomTabLabel>
          ),
        }}
      />
      <Tab.Screen
        name="ExpiredOffers"
        component={ExpiredOffers}
        options={{
          tabBarLabel: ({ focused }) => (
            <CustomTabLabel focused={focused}>
              Expired offers
            </CustomTabLabel>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default HomeTopTabNavigator

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
    width: 'auto', // Auto width for content
    paddingHorizontal: wp(5),
  },
  tabBarContentStyle: {
    paddingHorizontal: wp(4),
  },
  tabLabel: {
    fontSize: getFontSize(14),
    fontWeight: 'bold',
    textAlign: 'center',
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