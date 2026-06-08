import React from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Modal,
  TouchableOpacity,
} from 'react-native'
import { colors, hp, wp } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import AppHeader from '@/core/AppHeader'
import JobCard from '@/components/Recruiter/JobCard'
import JobFiltersBar from '@/components/Recruiter/JobFilterBar'
import { screenNames } from '@/navigation/screenNames'
import { useMyJobs, useDeleteJob } from '@/api/jobs/jobs.query'

const DraftedOffers = ({ navigation, route }) => {
  const { data: draftedJobs = [], refetch } = useMyJobs('draft')
  const deleteDraft = useDeleteJob()
  const fromDrawer = route?.params?.fromDrawer
  const headerTitle = route?.params?.headerTitle || 'Drafted Offers'

  const [refreshing, setRefreshing] = React.useState(false)
  const [filteredJobs, setFilteredJobs] = React.useState([])
  const [filters, setFilters] = React.useState({
    timeFilter: 'all',
    jobType: '',
    searchMode: '',
  })

  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false)
  const [selectedDraft, setSelectedDraft] = React.useState(null)

  const handleContinueEdit = (job) => {
    if (job?.searchType === 'quick') {
      navigation.navigate(screenNames.QUICK_SEARCH_STACK, {
        screen: screenNames.QUICK_SEARCH_STEPONE,
        params: { editMode: true, draftJob: job, jobId: job?.id },
      })
      return
    }

    // default to manual
    navigation.navigate(screenNames.MANUAL_SEARCH_STACK, {
      screen: screenNames.MANUAL_SEARCH,
      params: { editMode: true, draftJob: job, jobId: job?.id },
    })
  }

  const openDeleteModal = (job) => {
    setSelectedDraft(job)
    setDeleteModalVisible(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalVisible(false)
    setSelectedDraft(null)
  }

  const confirmDeleteDraft = () => {
    if (!selectedDraft?.id) {
      closeDeleteModal()
      return
    }

    deleteDraft.mutate(selectedDraft.id)
    closeDeleteModal()
  }

  const applyFilters = React.useCallback(() => {
    let next = [...draftedJobs]

    // Apply time filter (based on updatedAt or createdAt)
    if (filters.timeFilter && filters.timeFilter !== 'all') {
      const now = new Date()
      next = next.filter((job) => {
        const ts = job?.updatedAt || job?.createdAt
        if (!ts) return true
        const jobDate = new Date(ts)
        if (Number.isNaN(jobDate.getTime())) return true
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
      next = next.filter((job) => job.type === filters.jobType)
    }

    // Apply search mode filter (manual vs quick)
    if (filters.searchMode && filters.searchMode !== '') {
      next = next.filter((job) => job?.searchType === filters.searchMode)
    }

    setFilteredJobs(next)
  }, [draftedJobs, filters])

  React.useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const renderDraftCard = ({ item }) => (
    <JobCard
      job={item}
      mode="draft"
      onContinueEdit={handleContinueEdit}
      onDeleteDraft={openDeleteModal}
    />
  )

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <AppText variant={Variant.title} style={styles.emptyTitle}>
        {draftedJobs.length > 0 ? 'No matching results' : 'No drafted offers'}
      </AppText>
      <AppText variant={Variant.body} style={styles.emptyText}>
        {draftedJobs.length > 0
          ? 'No drafts match your current filters. Try adjusting the filters.'
          : 'Drafts you save (without posting) will appear here.'}
      </AppText>
    </View>
  )

  return (
    <View style={styles.container}>
      {fromDrawer ? (
        <AppHeader title={headerTitle} showBackButton={false} />
      ) : null}

      {/* Filter Bar */}
      <View style={{ paddingVertical: 10, backgroundColor: colors.white }}>
        <JobFiltersBar filters={filters} onFiltersChange={setFilters} />
      </View>

      {filteredJobs.length > 0 ? (
        <>
          <View style={styles.headerContainer}>
            <AppText variant={Variant.subTitle} style={styles.jobCount}>
              {filteredJobs.length} Drafted offer
              {filteredJobs.length !== 1 ? 's' : ''}
            </AppText>
          </View>

          <FlatList
            data={filteredJobs}
            renderItem={renderDraftCard}
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

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeDeleteModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <AppText variant={Variant.subTitle} style={styles.modalTitle}>
              Delete draft?
            </AppText>
            <AppText variant={Variant.body} style={styles.modalBody}>
              {selectedDraft?.title
                ? `This will permanently delete "${selectedDraft.title}".`
                : 'This will permanently delete this draft.'}
            </AppText>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancel]}
                onPress={closeDeleteModal}
                activeOpacity={0.8}
              >
                <AppText variant={Variant.bodyMedium} style={styles.modalCancelText}>
                  Cancel
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalDelete]}
                onPress={confirmDeleteDraft}
                activeOpacity={0.8}
              >
                <AppText variant={Variant.bodyMedium} style={styles.modalDeleteText}>
                  Delete
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default DraftedOffers

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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: wp(6),
  },
  modalCard: {
    backgroundColor: colors.white || '#fff',
    borderRadius: hp(2),
    padding: wp(6),
  },
  modalTitle: {
    color: colors.black,
    marginBottom: hp(1),
  },
  modalBody: {
    color: colors.gray,
    marginBottom: hp(2),
  },
  modalActions: {
    flexDirection: 'row',
    gap: wp(3),
  },
  modalButton: {
    flex: 1,
    paddingVertical: hp(1.4),
    borderRadius: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  modalCancel: {
    borderColor: colors.grayE8 || '#E5E7EB',
    backgroundColor: 'transparent',
  },
  modalCancelText: {
    color: colors.black,
  },
  modalDelete: {
    borderColor: '#EF4444',
    backgroundColor: '#EF4444',
  },
  modalDeleteText: {
    color: colors.white,
  },
})

