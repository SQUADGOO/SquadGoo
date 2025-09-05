import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppHeader from '@/core/AppHeader'
import { Images } from '@/assets'
import globalStyles from '@/styles/globalStyles'
import HomeTopTabNavigator from './HomeTabs/HomeTopTabNavigator'

const Home = () => {
  const [activeTab, setActiveTab] = React.useState(0)
  return (
    <View style={styles.container}>
      <AppHeader
        title='Dashboard'
      />
      <HomeTopTabNavigator 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
   
  }
})