import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppHeader from '@/core/AppHeader'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import { updateCandidateStatus } from '@/store/jobsSlice'

const JobCandidates = ({ navigation, route }) => {
  const { jobId } = route.params || {}
  const dispatch = useDispatch()
  
  // Get candidates for this job from Redux
  const candidates = useSelector(
    (state) => state.jobs?.jobCandidates?.[jobId] || []
  )
  
  // Get job details
  const job = useSelector((state) => 
    state.jobs?.activeJobs?.find(j => j.id === jobId)
  )

  const [selectedFilter, setSelectedFilter] = useState('all') // all, pending, accepted, rejected

  const filteredCandidates = candidates.filter(candidate => {
    if (selectedFilter === 'all') return true
    return candidate.status === selectedFilter
  })

  const handleCandidateAction = (candidate, action) => {
    Alert.alert(
      `${action === 'accept' ? 'Accept' : 'Reject'} Candidate`,
      `Are you sure you want to ${action} ${candidate.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            dispatch(updateCandidateStatus({
              jobId,
              candidateId: candidate.id,
              status: action === 'accept' ? 'accepted' : 'rejected',
            }))
            Alert.alert('Success', `Candidate ${action === 'accept' ? 'accepted' : 'rejected'} successfully`)
          },
        },
      ]
    )
  }

  const formatAppliedDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const renderCandidate = ({ item }) => (
    <View style={styles.candidateCard}>
      <View style={styles.candidateHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <AppText variant={Variant.h2} style={styles.avatarText}>
              {item.name?.charAt(0) || '?'}
            </AppText>
          </View>
        </View>

        <View style={styles.candidateInfo}>
          <AppText variant={Variant.bodyMedium} style={styles.candidateName}>
            {item.name || 'Unknown Candidate'}
          </AppText>
          
          <View style={styles.candidateDetailRow}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="briefcase-outline"
              size={14}
              color={colors.gray}
            />
            <AppText variant={Variant.bodySmall} style={styles.candidateDetails}>
              {item.experience || 'Experience not specified'}
            </AppText>
          </View>

          <View style={styles.candidateDetailRow}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="location-outline"
              size={14}
              color={colors.gray}
            />
            <AppText variant={Variant.bodySmall} style={styles.candidateDetails}>
              {item.location || 'Location not specified'}
            </AppText>
          </View>

          {item.phone && (
            <View style={styles.candidateDetailRow}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="call-outline"
                size={14}
                color={colors.gray}
              />
              <AppText variant={Variant.bodySmall} style={styles.candidateDetails}>
                {item.phone}
              </AppText>
            </View>
          )}

          {item.email && (
            <View style={styles.candidateDetailRow}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="mail-outline"
                size={14}
                color={colors.gray}
              />
              <AppText variant={Variant.bodySmall} style={styles.candidateDetails}>
                {item.email}
              </AppText>
            </View>
          )}

          <View style={styles.candidateDetailRow}>
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="time-outline"
              size={14}
              color={colors.gray}
            />
            <AppText variant={Variant.bodySmall} style={styles.candidateDetails}>
              Applied {formatAppliedDate(item.appliedAt)}
            </AppText>
          </View>

          {/* Skills */}
          {item.skills && item.skills.length > 0 && (
            <View style={styles.skillsContainer}>
              {item.skills.map((skill, index) => (
                <View key={index} style={styles.skillBadge}>
                  <AppText variant={Variant.caption} style={styles.skillText}>
                    {skill}
                  </AppText>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              item.status === 'accepted' && styles.statusAccepted,
              item.status === 'rejected' && styles.statusRejected,
              item.status === 'pending' && styles.statusPending,
            ]}
          >
            <AppText
              variant={Variant.bodySmall}
              style={styles.statusText}
            >
              {item.status?.toUpperCase() || 'PENDING'}
            </AppText>
          </View>
        </View>
      </View>

      {/* Action Buttons (only show if pending) */}
      {item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleCandidateAction(item, 'accept')}
          >
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="checkmark"
              size={20}
              color="#FFFFFF"
            />
            <AppText variant={Variant.bodyMedium} style={styles.buttonText}>
              Accept
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleCandidateAction(item, 'reject')}
          >
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="close"
              size={20}
              color="#FFFFFF"
            />
            <AppText variant={Variant.bodyMedium} style={styles.buttonText}>
              Reject
            </AppText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <VectorIcons
        name={iconLibName.Ionicons}
        iconName="people-outline"
        size={80}
        color={colors.gray}
      />
      <AppText variant={Variant.h3} style={styles.emptyTitle}>
        No Candidates Yet
      </AppText>
      <AppText variant={Variant.body} style={styles.emptyText}>
        Candidates who apply for this job will appear here.
      </AppText>
    </View>
  )

  const renderFilterButton = (filter, label) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <AppText
        variant={Variant.bodyMedium}
        style={[
          styles.filterText,
          selectedFilter === filter && styles.filterTextActive,
        ]}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <AppHeader
        title={job?.title || 'Job Candidates'}
        showTopIcons={false}
      />

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('pending', 'Pending')}
        {renderFilterButton('accepted', 'Accepted')}
        {renderFilterButton('rejected', 'Rejected')}
      </View>

      {/* Candidates Count */}
      <View style={styles.countContainer}>
        <AppText variant={Variant.bodyMedium} style={styles.countText}>
          {filteredCandidates.length} Candidate{filteredCandidates.length !== 1 ? 's' : ''}
        </AppText>
      </View>

      {/* Candidates List */}
      <FlatList
        data={filteredCandidates}
        renderItem={renderCandidate}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default JobCandidates

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8,
  },
  filterButton: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    marginRight: wp(2),
    borderRadius: 20,
    backgroundColor: colors.bgColor,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.gray,
    fontSize: getFontSize(13),
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  countContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
  },
  countText: {
    color: colors.secondary,
    fontSize: getFontSize(14),
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
  },
  candidateCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: wp(4),
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  candidateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: wp(3),
  },
  avatar: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(7.5),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: getFontSize(24),
    fontWeight: 'bold',
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: 'bold',
    marginBottom: hp(1),
  },
  candidateDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
    gap: wp(1.5),
  },
  candidateDetails: {
    color: colors.gray,
    fontSize: getFontSize(12),
    flex: 1,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(1.5),
    marginTop: hp(1),
  },
  skillBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
    borderRadius: hp(1),
  },
  skillText: {
    color: colors.white,
    fontSize: getFontSize(10),
    fontWeight: '600',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: 12,
    backgroundColor: colors.gray,
  },
  statusAccepted: {
    backgroundColor: '#4ADE80',
  },
  statusRejected: {
    backgroundColor: '#FF6B6B',
  },
  statusPending: {
    backgroundColor: '#FFA500',
  },
  statusText: {
    color: colors.white,
    fontSize: getFontSize(10),
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: hp(2),
    gap: wp(2),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    borderRadius: 8,
    gap: wp(1),
  },
  acceptButton: {
    backgroundColor: '#4ADE80',
  },
  rejectButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(10),
  },
  emptyTitle: {
    color: colors.secondary,
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  emptyText: {
    color: colors.gray,
    textAlign: 'center',
    paddingHorizontal: wp(10),
  },
})

