import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppHeader from '@/core/AppHeader'
import { Images } from '@/assets'
import globalStyles from '@/styles/globalStyles'
import JobSeekerHomeTopTabNavigator from './HomeTabs/JobSeekerHomeTopTabNavigator'

const JobSeekerHome = () => {
  const [activeTab, setActiveTab] = React.useState(0)
  return (
    <View style={styles.container}>
      <AppHeader
        title='Dashboard'
      />
      <JobSeekerHomeTopTabNavigator 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </View>
  )
}

export default JobSeekerHome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
   
  }
})