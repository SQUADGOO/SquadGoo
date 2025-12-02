// QuickSearchStepTwo.js - Work Location
import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native'
import { useForm, FormProvider } from 'react-hook-form'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import FormField from '@/core/FormField'
import Slider from '@react-native-community/slider'
import AppHeader from '@/core/AppHeader'
import { screenNames } from '@/navigation/screenNames'

const QuickSearchStepTwo = ({ navigation, route }) => {
  // Get data from Step 1
  const { quickSearchStep1Data } = route.params || {}

  const [rangeKm, setRangeKm] = useState(119)

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      workLocation: '',
      jobStartDate: '',
      jobEndDate: '',
    },
  })

  const onSubmit = (data) => {
    const quickSearchStep2Data = {
      ...data,
      rangeKm,
    }

    // Basic logical validation: end date should not be before start date
    if (quickSearchStep2Data.jobStartDate && quickSearchStep2Data.jobEndDate) {
      const start = new Date(quickSearchStep2Data.jobStartDate)
      const end = new Date(quickSearchStep2Data.jobEndDate)

      if (end < start) {
        Alert.alert(
          'Invalid dates',
          'Job end date must be on or after the job start date.',
        )
        return
      }
    }

    console.log('Quick Search Step 2 Data:', quickSearchStep2Data)

    // Pass both step1 and step2 data forward
    navigation.navigate(screenNames.QUICK_SEARCH_STEPTHREE, { 
      quickSearchStep1Data,
      quickSearchStep2Data,
    })
  }

  const handleNext = () => {
    methods.handleSubmit(onSubmit)()
  }

  return (
    <FormProvider {...methods}>
      <AppHeader
        showTopIcons={false}
        title="Work Location"
        rightComponent={
          <TouchableOpacity activeOpacity={0.7}>
            <AppText variant={Variant.body} style={styles.stepText}>
              Step 2/4
            </AppText>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Work Location */}
        <FormField
          name="workLocation"
          label="Work location*"
          placeholder="Enter location"
          rules={{
            required: 'Work location is required'
          }}
        />

        {/* Range Slider */}
        <View style={styles.formGroup}>
          <AppText variant={Variant.bodyMedium} style={styles.label}>
            Range from location (km)*
          </AppText>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={200}
            value={rangeKm}
            onValueChange={setRangeKm}
            step={1}
            minimumTrackTintColor="#F59E0B"
            maximumTrackTintColor={colors.grayE8 || '#E5E7EB'}
          />
          <AppText variant={Variant.subTitle} style={styles.rangeValue}>
            {Math.round(rangeKm)} km
          </AppText>
        </View>

        {/* Map Preview */}
        <View style={styles.mapContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=300&fit=crop' }}
            style={styles.mapImage}
          />
          <View style={styles.mapOverlay}>
            <View style={styles.mapPin}>
              <VectorIcons
                name={iconLibName.Ionicons}
                iconName="location"
                size={28}
                color="#FF6B35"
              />
            </View>
          </View>
        </View>

        {/* Job Start Date */}
        <FormField
          name="jobStartDate"
          label="Job start date*"
          placeholder="DD : MM : YYYY"
          type="datePicker"
          rules={{
            required: 'Job start date is required',
          }}
        />

        {/* Job End Date */}
        <FormField
          name="jobEndDate"
          label="Job end date*"
          placeholder="DD : MM : YYYY"
          type="datePicker"
          rules={{
            required: 'Job end date is required',
          }}
        />

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <AppButton
            text="Next"
            onPress={handleNext}
            textColor="#FFFFFF"
          />
        </View>
      </ScrollView>

    </FormProvider>
  )
}

export default QuickSearchStepTwo

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  stepText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: getFontSize(16),
  },
  formGroup: {
    marginTop: hp(2),
  },
  label: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    marginBottom: hp(1),
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: hp(5),
  },
  rangeValue: {
    color: '#7C3AED',
    fontSize: getFontSize(16),
    fontWeight: '600',
    marginTop: hp(1),
  },
  mapContainer: {
    height: hp(25),
    marginVertical: hp(2),
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPin: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: wp(6),
    padding: wp(2),
    elevation: 5,
  },
  buttonContainer: {
    marginBottom: hp(6),
  },
})