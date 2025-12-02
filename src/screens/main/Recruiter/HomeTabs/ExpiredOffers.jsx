import React from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { colors, hp, wp } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import ExpiredJobCard from '@/components/Recruiter/ExpiredJobCard'
import { screenNames } from '@/navigation/screenNames'
import { seedDummyData } from '@/store/jobsSlice'

const ExpiredOffersScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const expiredJobs = useSelector((state) => state.jobs?.expiredJobs || [])
  const [refreshing, setRefreshing] = React.useState(false)

  // Seed dummy data on mount if empty
  React.useEffect(() => {
    console.log('ExpiredOffers useEffect - expiredJobs.length:', expiredJobs.length)
    dispatch(seedDummyData())
  }, [dispatch])

  console.log('ExpiredOffers - Number of jobs:', expiredJobs.length)

  const handleRefresh = async () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 500)
  }

  const handleViewDetails = (job) => {
    console.log('View expired job details:', job.title)
    navigation.navigate(screenNames.VIEW_JOB_DETAILS, { jobId: job.id, isExpired: true })
  }

  const renderJobCard = ({ item }) => (
    <ExpiredJobCard
      job={item}
      onViewDetails={handleViewDetails}
    />
  )

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <AppText variant={Variant.title} style={styles.emptyTitle}>
        No Expired Jobs
      </AppText>
      <AppText variant={Variant.body} style={styles.emptyText}>
        Expired job offers will appear here.
      </AppText>
    </View>
  )

  return (
    <View style={styles.container}>
      {expiredJobs.length > 0 ? (
        <>
          <View style={styles.headerContainer}>
            <AppText variant={Variant.subTitle} style={styles.jobCount}>
              {expiredJobs.length} Expired job{expiredJobs.length !== 1 ? 's' : ''}
            </AppText>
          </View>
          <FlatList
            data={expiredJobs}
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
          />
        </>
      ) : (
        renderEmptyState()
      )}
    </View>
  )
}

export default ExpiredOffersScreen

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
})

