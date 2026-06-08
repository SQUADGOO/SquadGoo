import React, { useMemo } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { wp, hp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import PoolHeader from '@/core/PoolHeader'
import { colors } from '@/theme/colors'
import { screenNames } from '@/navigation/screenNames'

const STATIC_JOBS = [
  {
    id: 'static-1',
    title: 'Marketing Manager - Tech Startup',
    posted: 'Posted 2 days ago',
    expires: 'Expires in 5 days',
    location: 'CBD Area, 2.5km away',
    start: 'Next Monday',
    salary: '$80,000 - $100,000/year',
    messages: 2,
  },
  {
    id: 'static-2',
    title: 'Warehouse Supervisor',
    posted: 'Posted 1 week ago',
    expires: 'Expires in 2 days',
    location: 'Richmond, 4km away',
    start: 'Next Wednesday',
    salary: '$65,000 - $75,000/year',
    messages: 1,
  },
]

const formatDateLabel = (isoString) => {
  if (!isoString) return 'Just now'
  const date = new Date(isoString)
  const diffDays = Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return 'Posted today'
  if (diffDays === 1) return 'Posted 1 day ago'
  return `Posted ${diffDays} days ago`
}

const JobCard = ({ item, onViewMatches, onViewCandidates }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>
        {item.posted} • {item.expires}
      </Text>

      <View style={styles.row}>
        <VectorIcons
          name={iconLibName.Ionicons}
          iconName="location-outline"
          size={16}
          color="#5E3A8C"
        />
        <Text style={styles.detail}>{item.location}</Text>
      </View>

      <View style={styles.row}>
        <VectorIcons
          name={iconLibName.Ionicons}
          iconName="time-outline"
          size={16}
          color="#5E3A8C"
        />
        <Text style={styles.detail}>Start: {item.start}</Text>
      </View>

      <View style={styles.row}>
        <VectorIcons
          name={iconLibName.Ionicons}
          iconName="cash-outline"
          size={16}
          color="#5E3A8C"
        />
        <Text style={styles.detail}>{item.salary}</Text>
      </View>

      <View style={styles.actions}>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.viewBtn}>
            <Text style={styles.viewText}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.msgBtn}>
            <Text style={styles.editText}>Messages({item.messages})</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.candidatesBtn}
            onPress={() => onViewCandidates?.(item.id)}
          >
            <Text style={styles.candidatesText}>Candidates</Text>
          </TouchableOpacity>

          {item.searchType === 'manual' && (
            <TouchableOpacity
              style={styles.matchBtn}
              onPress={() => onViewMatches?.(item.id)}
            >
              <Text style={styles.matchText}>Matches</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

const JobList = () => {
  const manualJobs = useSelector(state => state.manualOffers.jobs)
  const navigation = useNavigation()

  const manualJobCards = useMemo(() => {
    return manualJobs.map(job => ({
      id: job.id,
      title: job.title,
      posted: formatDateLabel(job.createdAt),
      expires: job.expireDate
        ? `Expires ${new Date(job.expireDate).toLocaleDateString()}`
        : 'Expires soon',
      location: job.location
        ? `${job.location}, ${job.rangeKm || 0}km radius`
        : 'Location not specified',
      start: job.jobStartDate || 'TBD',
      salary:
        job.salaryRange || `$${job.salaryMin || 0}/hr - $${job.salaryMax || 0}/hr`,
      messages: 0,
      searchType: 'manual',
    }))
  }, [manualJobs])

  const jobs = [...manualJobCards, ...STATIC_JOBS]

  const handleViewMatches = (jobId) => {
    // Navigate to ManualSearchStack, then to MANUAL_MATCH_LIST
    navigation.navigate(screenNames.MANUAL_MATCH_LIST, { jobId })
  }

  const handleViewCandidates = (jobId) => {
    // For manual search jobs, navigate to match list
    // For quick search jobs, navigate to candidates
    navigation.navigate(screenNames.MANUAL_MATCH_LIST, { jobId })
  }

  return (
    <View style={styles.container}>

        <PoolHeader title='Current Pool ➜  Active (8)'/>
 <FlatList
      data={jobs}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <JobCard 
          item={item} 
          onViewMatches={handleViewMatches}
          onViewCandidates={handleViewCandidates}
        />
      )}
      contentContainerStyle={{ padding: wp(4) }}
    />
    </View>
   
  )
}

export default JobList

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor:colors.secondary,
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
    backgroundColor: '#fff',
  },
  title: {
    fontSize: getFontSize(16),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: hp(0.5),
  },
  subtitle: {
    fontSize: getFontSize(12),
    color: '#666',
    marginBottom: hp(1.5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.8),
  },
  detail: {
    fontSize: getFontSize(13),
    color: '#333',
    marginLeft: wp(2),
  },
  actions: {
    marginTop: hp(1.5),
    gap: hp(1),
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(2),
    flexWrap: 'wrap',
  },
  viewBtn: {
    backgroundColor: colors.primary,
    paddingVertical: hp(1),
    paddingHorizontal: wp(6),
    borderRadius: wp(2),
  },
  viewText: {
    color: '#fff',
    fontWeight: '600',
  },
  editBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: hp(1),
    paddingHorizontal: wp(6),
    borderRadius: wp(2),
  },
  msgBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
  },
  matchBtn: {
    backgroundColor: '#FFE8D5',
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
  },
  editText: {
    color: colors.primary,
    fontWeight: '600',
  },
  matchText: {
    color: colors.secondary,
    fontWeight: '600',
  },
  candidatesBtn: {
    backgroundColor: '#E0E7FF',
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
  },
  candidatesText: {
    color: '#6366F1',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
})
