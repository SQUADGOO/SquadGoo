import React, { useMemo, useState } from 'react'
import { View, StyleSheet, FlatList, Modal, TouchableOpacity } from 'react-native'
import { wp, hp } from '@/theme'
import { colors } from '@/theme'
import AppHeader from '@/core/AppHeader'
import PoolHeader from '@/core/PoolHeader'
import AppText, { Variant } from '@/core/AppText'
import JobCard from '@/components/Recruiter/JobCard'
import { screenNames } from '@/navigation/screenNames'

const DraftedOffers = ({ navigation, route }) => {
  const fromDrawer = route?.params?.fromDrawer
  const headerTitle = route?.params?.headerTitle || 'Drafted Offers'

  const initialDraftJobs = useMemo(
    () => [
      {
        id: 'draft-quick-1',
        title: 'Forklift Operator (Urgent)',
        type: 'Casual',
        searchType: 'quick',
        salaryRange: '$32/hr to $38/hr',
        offerDate: 'Draft saved today',
        expireDate: 'Not set',
        location: 'Sydney CBD',
        experience: '1 Year 0 Month',
        salaryType: 'Hourly',
        // Draft data for Quick Search Step 1
        jobCategory: 'Logistics',
        jobSubCategory: 'Forklift Operator',
        industry: 'Transportation',
        experienceYear: '1 Year',
        experienceMonth: '0 Month',
        staffCount: 2,
      },
      {
        id: 'draft-manual-1',
        title: 'General Labourer',
        type: 'Contract',
        searchType: 'manual',
        salaryRange: '$28/hr to $35/hr',
        offerDate: 'Draft saved yesterday',
        expireDate: 'Not set',
        location: 'Melbourne',
        experience: '2 Years 0 Month',
        salaryType: 'Hourly',
        // Draft data for Manual Search Step 1
        jobCategory: 'Construction',
        jobSubCategory: 'Labourer',
        workLocation: 'Melbourne',
        rangeKm: 25,
        staffNumber: '3',
        jobType: 'Contract',
        jobTitle: 'Labourer',
      },
    ],
    [],
  )

  const [draftJobs, setDraftJobs] = useState(initialDraftJobs)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedDraft, setSelectedDraft] = useState(null)

  const handleContinueEdit = (job) => {
    if (job?.searchType === 'quick') {
      navigation.navigate(screenNames.QUICK_SEARCH_STACK, {
        screen: screenNames.QUICK_SEARCH_STEPONE,
        params: { editMode: true, draftJob: job },
      })
      return
    }

    // default to manual
    navigation.navigate(screenNames.MANUAL_SEARCH_STACK, {
      screen: screenNames.MANUAL_SEARCH,
      params: { editMode: true, draftJob: job },
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
    setDraftJobs(prev => prev.filter(job => job.id !== selectedDraft.id))
    closeDeleteModal()
  }

  return (
    <View style={styles.container}>
      {fromDrawer ? (
        <AppHeader title={headerTitle} showBackButton={false} />
      ) : (
        <PoolHeader title='Current Pool ➜  Drafted' />
      )}

      <FlatList
        data={draftJobs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            mode="draft"
            onContinueEdit={handleContinueEdit}
            onDeleteDraft={openDeleteModal}
          />
        )}
        contentContainerStyle={{ padding: wp(4) }}
      />

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
              {selectedDraft?.title ? `This will permanently delete "${selectedDraft.title}".` : 'This will permanently delete this draft.'}
            </AppText>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.modalCancel]} onPress={closeDeleteModal} activeOpacity={0.8}>
                <AppText variant={Variant.bodyMedium} style={styles.modalCancelText}>
                  Cancel
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalDelete]} onPress={confirmDeleteDraft} activeOpacity={0.8}>
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
    backgroundColor: colors.white || '#fff',
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
