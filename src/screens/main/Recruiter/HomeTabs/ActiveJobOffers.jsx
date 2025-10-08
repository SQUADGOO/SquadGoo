import React, { useState, useEffect } from 'react'
import { 
  View, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
  Alert
} from 'react-native'
import { colors, hp, wp } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import JobCard from '@/components/Recruiter/JobCard'
import JobFiltersBar from '@/components/Recruiter/JobFilterBar'
import { screenNames } from '@/navigation/screenNames'

const ActiveJobOffersScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filteredJobs, setFilteredJobs] = useState([])

  // Sample job data - replace with your API calls
  const sampleJobs = [
    {
      id: '1',
      title: 'Full house painting',
      type: 'Full-time',
      salaryRange: '$5.00/hr to 15.00/hr',
      offerDate: '16 Jul 2024',
      expireDate: '17 Aug 2024',
      location: 'Gladstone Central',
      experience: '1.0 y',
      salaryType: 'Hourly'
    },
    {
      id: '2',
      title: 'House renovation',
      type: 'Part-time',
      salaryRange: '$8.00/hr to 20.00/hr',
      offerDate: '18 Jul 2024',
      expireDate: '20 Aug 2024',
      location: 'Brisbane City',
      experience: '2.0 y',
      salaryType: 'Hourly'
    },
    {
      id: '3',
      title: 'Garden maintenance',
      type: 'Contract',
      salaryRange: '$12.00/hr to 18.00/hr',
      offerDate: '20 Jul 2024',
      expireDate: '25 Aug 2024',
      location: 'Gold Coast',
      experience: '0.5 y',
      salaryType: 'Hourly'
    }
  ]

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      setLoading(true)
      // Replace with your API call
      // const response = await getActiveJobs()
      // setJobs(response.data)
      
      // For now, using sample data
      setTimeout(() => {
        setJobs(sampleJobs)
        setFilteredJobs(sampleJobs) // Initialize filteredJobs with the same data
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error loading jobs:', error)
      setJobs([])
      setFilteredJobs([]) // Make sure to reset filteredJobs on error too
      setLoading(false)
      Alert.alert('Error', 'Failed to load jobs')
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      // Replace with your API call
      // const response = await getActiveJobs()
      // setJobs(response.data)
      
      // For now, simulate refresh
      setTimeout(() => {
        const refreshedJobs = [...sampleJobs]
        setJobs(refreshedJobs) // This will trigger the useEffect to update filteredJobs
        setRefreshing(false)
      }, 1500)
    } catch (error) {
      console.error('Error refreshing jobs:', error)
      setRefreshing(false)
      Alert.alert('Error', 'Failed to refresh jobs')
    }
  }

  // Job Card Action Handlers
  const handlePreview = (job) => {
    console.log('Preview job:', job.title)
    // Navigate to job preview screen
    navigation.navigate(screenNames.JOB_PREVIEW, { jobId: job.id })
  }

  const handleUpdate = (job) => {
    console.log('Update job:', job.title)
    // Navigate to job update screen
    navigation.navigate(screenNames.UPDATE_MAIN, { jobId: job.id })
  }

  const handleViewCandidates = (job) => {
    console.log('View candidates for:', job.title)
    // Navigate to candidates screen
    navigation.navigate('JobCandidates', { jobId: job.id })
  }

  const handleCloseJob = (job) => {
    Alert.alert(
      'Close Job',
      `Are you sure you want to close "${job.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Close Job',
          style: 'destructive',
          onPress: () => confirmCloseJob(job),
        },
      ],
    )
  }

  const confirmCloseJob = async (job) => {
    try {
      // Replace with your API call
      // await closeJob(job.id)
      
      // Remove job from local state
      setJobs(prevJobs => prevJobs.filter(j => j.id !== job.id))
      Alert.alert('Success', `"${job.title}" has been closed`)
    } catch (error) {
      console.error('Error closing job:', error)
      Alert.alert('Error', 'Failed to close job')
    }
  }

  const renderJobCard = ({ item, index }) => (
    <JobCard
      job={item}
      onPreview={handlePreview}
      onUpdate={handleUpdate}
      onViewCandidates={handleViewCandidates}
      onCloseJob={handleCloseJob}
    />
  )

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <AppText variant={Variant.title} style={styles.emptyTitle}>
        No Active Jobs
      </AppText>
      <AppText variant={Variant.body} style={styles.emptyText}>
        You don't have any active job offers at the moment.
      </AppText>
    </View>
  )

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <AppText variant={Variant.subTitle} style={styles.jobCount}>
        {filteredJobs.length} Active job offer{filteredJobs.length !== 1 ? 's' : ''}
      </AppText>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <AppText variant={Variant.body} style={styles.loadingText}>
          Loading jobs...
        </AppText>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Filter Bar */}
      <View style={{paddingVertical: 10, backgroundColor: colors.white, height: hp(8)}}>

      <JobFiltersBar
        // postFilter={postFilter}
        // setPostFilter={setPostFilter}
        // searchType={searchType}
        // setSearchType={setSearchType}
        />
        </View>
      
      {/* Jobs List */}
      <FlatList
        data={filteredJobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary || '#FF6B35']}
            tintColor={colors.primary || '#FF6B35'}
          />
        }
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponent={filteredJobs.length > 0 ? renderHeader : null}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={true}
      />
    </View>
  )
}

export default ActiveJobOffersScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
  },
  listContainer: {
    flexGrow: 1,
    padding: wp(6),
    paddingBottom: hp(2),
  },
  headerContainer: {
    marginBottom: hp(2),
  },
  jobCount: {
    color: colors.black,
    fontSize: wp(4.5),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: hp(10),
    paddingHorizontal: wp(8),
  },
  emptyTitle: {
    color: colors.black,
    textAlign: 'center',
    marginBottom: hp(1),
  },
  emptyText: {
    color: colors.gray,
    textAlign: 'center',
    lineHeight: hp(2.5),
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.gray,
  },
})