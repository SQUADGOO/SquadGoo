import React, { useState, useEffect } from 'react'
import { 
  View, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
  Alert
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { colors, hp, wp } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import JobCard from '@/components/Recruiter/JobCard'
import JobFiltersBar from '@/components/Recruiter/JobFilterBar'
import AppHeader from '@/core/AppHeader'
import { screenNames } from '@/navigation/screenNames'
import { closeJob } from '@/store/jobsSlice'

const ActiveJobOffersScreen = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const activeJobs = useSelector((state) => state.jobs?.activeJobs || [])
  const fromDrawer = route?.params?.fromDrawer
  const headerTitle = route?.params?.headerTitle || 'Active Offers'
  
  const [refreshing, setRefreshing] = useState(false)
  const [filteredJobs, setFilteredJobs] = useState([])
  const [filters, setFilters] = useState({
    timeFilter: 'all',
    jobType: '',
    searchMode: '',
  })

  const applyFilters = React.useCallback(() => {
    let filtered = [...activeJobs]
    
    // Apply time filter (based on offerDate)
    if (filters.timeFilter && filters.timeFilter !== 'all') {
      const now = new Date()
      filtered = filtered.filter(job => {
        if (!job.createdAt) return true
        const jobDate = new Date(job.createdAt)
        const diffTime = Math.abs(now - jobDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        switch (filters.timeFilter) {
          case 'last_week':
            return diffDays <= 7
          case 'last_2_weeks':
            return diffDays <= 14
          case 'last_month':
            return diffDays <= 30
          default:
            return true
        }
      })
    }
    
    // Apply job type filter
    if (filters.jobType && filters.jobType !== '') {
      filtered = filtered.filter(job => job.type === filters.jobType)
    }

    // Apply search mode filter (manual vs quick)
    if (filters.searchMode && filters.searchMode !== '') {
      filtered = filtered.filter(job => job?.searchType === filters.searchMode)
    }
    
    setFilteredJobs(filtered)
  }, [activeJobs, filters])

  useEffect(() => {
    // Update filtered jobs when active jobs change or filters change
    applyFilters()
  }, [applyFilters])

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate refresh - in production this would call API
    setTimeout(() => {
      setRefreshing(false)
    }, 500)
  }

  // Job Card Action Handlers
  const handlePreview = (job) => {
    console.log('Preview job:', job.title)
    // Navigate to job details screen
    navigation.navigate(screenNames.VIEW_JOB_DETAILS, { jobId: job.id })
  }

  const handleUpdate = (job) => {
    console.log('Update job:', job.title)
    // Option A: Update should reopen the original workflow (Manual vs Quick)
    if (job?.searchType === 'quick') {
      navigation.navigate(screenNames.QUICK_SEARCH_STACK, {
        screen: screenNames.QUICK_SEARCH_STEPONE,
        params: { editMode: true, draftJob: job, jobId: job.id },
      })
      return
    }

    // Default to manual search update
    navigation.navigate(screenNames.MANUAL_SEARCH_STACK, {
      screen: screenNames.MANUAL_SEARCH,
      params: { editMode: true, draftJob: job, jobId: job.id },
    })
  }

  const handleViewCandidates = (job) => {
    console.log('View candidates for:', job.title)
    // For manual search jobs, go to Manual Offers
    if (job?.searchType === 'manual') {
      navigation.navigate(screenNames.MANUAL_OFFERS, { jobId: job.id })
      return
    }

    // For quick search jobs, go to Quick Search offers (scoped to this job)
    if (job?.searchType === 'quick') {
      navigation.navigate(screenNames.QUICK_SEARCH_ACTIVE_OFFERS_RECRUITER, {
        jobId: job.id,
      })
      return
    }

    // Fallback to manual offers if searchType is missing
    navigation.navigate(screenNames.MANUAL_OFFERS, { jobId: job.id })
  }

  const handleViewMatches = (job) => {
    // Manual search: go to manual match list
    if (job?.searchType === 'manual') {
      navigation.navigate(screenNames.MANUAL_MATCH_LIST, { jobId: job.id })
      return
    }

    // Quick search: go to quick search match list
    if (job?.searchType === 'quick') {
      navigation.navigate(screenNames.QUICK_SEARCH_MATCH_LIST, { jobId: job.id })
      return
    }

    // Fallback
    Alert.alert('Matches unavailable', 'Match list is unavailable for this job.')
  }

  const handleTrackHours = (job) => {
    const candidate =
      job?.acceptedCandidates?.[0] ||
      job?.candidates?.find(c => c.status === 'accepted') ||
      job?.candidates?.[0] ||
      {
        id: 'candidate-demo',
        name: 'Candidate',
      }
    navigation.navigate(screenNames.CANDIDATE_HOURS, {
      job,
      candidate,
    })
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
      // Dispatch Redux action to close job
      dispatch(closeJob(job.id))
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
      onViewMatches={handleViewMatches}
      onTrackHours={handleTrackHours}
    />
  )



  return (
    <View style={styles.container}>
      {fromDrawer ? (
        <AppHeader title={headerTitle} showBackButton={false} />
      ) : null}
      {/* Filter Bar */}
      <View style={{backgroundColor: colors.white }}>
        <JobFiltersBar
          filters={filters}
          onFiltersChange={setFilters}
        />
      </View>
      
      {/* Jobs List */}
      {filteredJobs.length > 0 ? (
        <>
          <View style={styles.headerContainer}>
            <AppText variant={Variant.subTitle} style={styles.jobCount}>
              {filteredJobs.length} Active offer{filteredJobs.length !== 1 ? 's' : ''}
            </AppText>
          </View>
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
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={true}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <AppText variant={Variant.title} style={styles.emptyTitle}>
            No Active Jobs
          </AppText>
          <AppText variant={Variant.body} style={styles.emptyText}>
            {activeJobs.length > 0 
              ? 'No jobs match your current filters. Try adjusting the filters.'
              : 'You don\'t have any active job offers at the moment. Post a job from Find Staff to get started.'}
          </AppText>
        </View>
      )}
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
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    backgroundColor: colors.white,
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