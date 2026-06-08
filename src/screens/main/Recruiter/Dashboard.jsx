import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import AppHeader from '@/core/AppHeader'
import { Images } from '@/assets'
import globalStyles from '@/styles/globalStyles'
import HomeTopTabNavigator from './HomeTabs/HomeTopTabNavigator'

const Dashboard = () => {
  const [activeTab, setActiveTab] = React.useState(0)
  const jobsState = useSelector((state) => state.jobs)
  
  // Debug: Log jobs state on mount
  React.useEffect(() => {
    console.log('=== RECRUITER DASHBOARD (OFFERS) - JOBS STATE ===')
    console.log('Active Jobs:', jobsState?.activeJobs?.length || 0)
    console.log('Drafted Jobs:', jobsState?.draftedJobs?.length || 0)
    console.log('Completed Jobs:', jobsState?.completedJobs?.length || 0)
    console.log('Expired Jobs:', jobsState?.expiredJobs?.length || 0)
    console.log('===================================')
  }, [])
  
  return (
    <View style={styles.container}>
      <AppHeader
        title='Home'
      />
      <HomeTopTabNavigator 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </View>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
   
  }
})