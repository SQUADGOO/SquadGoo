import React, { useMemo, useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import Slider from '@react-native-community/slider'
import { colors, hp, wp, getFontSize } from '@/theme'
import AppHeader from '@/core/AppHeader'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import AppInputField from '@/core/AppInputField'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import { screenNames } from '@/navigation/screenNames'
import { AU_LOCATION_OPTIONS } from '@/constants/recruiterOptions'

const ManualSearchStepFour = ({ navigation, route }) => {
  const { step1Data, step2Data, step3Data, editMode, draftJob, jobId } = route.params || {}

  const initialLocation =
    step1Data?.workLocation ||
    draftJob?.location ||
    'Sydney, NSW'

  const initialRange =
    typeof step1Data?.rangeKm === 'number'
      ? step1Data.rangeKm
      : (typeof draftJob?.rangeKm === 'number' ? draftJob.rangeKm : 25)

  const [query, setQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState(initialLocation)
  const [rangeKm, setRangeKm] = useState(initialRange)

  const filteredLocations = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return AU_LOCATION_OPTIONS
    return AU_LOCATION_OPTIONS.filter((l) => l.title.toLowerCase().includes(q))
  }, [query])

  const handleSelectLocation = (title) => {
    setSelectedLocation(title)
    setQuery('')
  }

  const handleNext = () => {
    const step4Data = {
      workLocation: selectedLocation,
      rangeKm: Math.round(rangeKm),
    }

    navigation.navigate(screenNames.JOB_PREVIEW, {
      step1Data,
      step2Data,
      step3Data,
      step4Data,
      editMode: !!editMode,
      draftJob,
      jobId,
    })
  }

  return (
    <>
      <AppHeader
        showTopIcons={false}
        title="Map / Location"
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <AppText
            variant={Variant.body}
            style={{ color: colors.white, fontWeight: 'bold', fontSize: getFontSize(16) }}
          >
            Step 4/4
          </AppText>
        }
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
          Search location
        </AppText>

        <AppInputField
          placeholder="Search suburb, city..."
          value={query}
          onChangeText={setQuery}
          endIcon={
            <VectorIcons
              name={iconLibName.Ionicons}
              iconName="search"
              size={20}
              color={colors.gray}
            />
          }
        />

        {query.trim().length > 0 ? (
          <View style={styles.resultsCard}>
            <FlatList
              data={filteredLocations}
              keyExtractor={(item) => String(item.id)}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultRow}
                  activeOpacity={0.7}
                  onPress={() => handleSelectLocation(item.title)}
                >
                  <AppText variant={Variant.body} style={styles.resultText}>
                    {item.title}
                  </AppText>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        ) : null}

        <View style={styles.selectedRow}>
          <AppText variant={Variant.body} style={styles.selectedLabel}>
            Selected:
          </AppText>
          <AppText variant={Variant.bodyMedium} style={styles.selectedValue}>
            {selectedLocation}
          </AppText>
        </View>

        <AppText variant={Variant.bodyMedium} style={styles.sectionTitle}>
          Range from location (km)
        </AppText>

        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={200}
          value={rangeKm}
          onValueChange={setRangeKm}
          step={1}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.grayE8 || '#E5E7EB'}
        />

        <AppText variant={Variant.subTitle} style={styles.rangeValue}>
          {Math.round(rangeKm)} km
        </AppText>

        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <AppText variant={Variant.body} style={styles.mapHint}>
              Map preview (dummy). User can edit location/range here later.
            </AppText>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            text="Next"
            onPress={handleNext}
            bgColor={colors.primary}
            textColor="#FFFFFF"
          />
        </View>
      </ScrollView>
    </>
  )
}

export default ManualSearchStepFour

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  sectionTitle: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    fontWeight: '500',
    marginBottom: hp(1.2),
    marginTop: hp(1.2),
  },
  resultsCard: {
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    borderRadius: hp(1.5),
    marginTop: hp(1),
    marginBottom: hp(1),
    maxHeight: hp(25),
    overflow: 'hidden',
  },
  resultRow: {
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(3),
    backgroundColor: colors.white,
  },
  resultText: {
    color: colors.black,
  },
  separator: {
    height: 1,
    backgroundColor: colors.grayE8 || '#E5E7EB',
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginTop: hp(1),
  },
  selectedLabel: {
    color: colors.gray,
  },
  selectedValue: {
    color: colors.black,
    flex: 1,
  },
  slider: {
    width: '100%',
    height: hp(5),
  },
  rangeValue: {
    color: colors.primary,
    fontSize: getFontSize(16),
    fontWeight: '600',
    marginTop: hp(0.8),
  },
  mapContainer: {
    marginTop: hp(2),
  },
  mapPlaceholder: {
    height: hp(22),
    borderRadius: hp(1.5),
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(4),
  },
  mapHint: {
    color: colors.gray,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: hp(3),
    marginBottom: hp(6),
  },
})

