import React, { useState, useRef } from 'react'
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  FlatList,
  Image
} from 'react-native'
import { useForm, FormProvider, Form } from 'react-hook-form'
import { colors, hp, wp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import AppText, { Variant } from '@/core/AppText'
import AppButton from '@/core/AppButton'
import FormField from '@/core/FormField'
import RbSheetComponent from '@/core/RbSheetComponent'
import Slider from '@react-native-community/slider'
import AppHeader from '@/core/AppHeader'
import globalStyles from '@/styles/globalStyles'
import BottomDataSheet from '@/components/Recruiter/JobBottomSheet'
import { screenNames } from '@/navigation/screenNames'

const ManualSearch = ({ navigation }) => {
  const [selectedJobTitle, setSelectedJobTitle] = useState(['Full house painting'])
  const [selectedJobType, setSelectedJobType] = useState('Full time')
  const [rangeKm, setRangeKm] = useState(119)
  const {setValue, getValues, watch} = useForm()
  
  const jobTitleSheetRef = useRef(null)
  const jobTypeSheetRef = useRef(null)
  
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      workLocation: 'Sydney',
      staffNumber: '5',
      jobTitle: null,
      jobType: null,
    }
  })

  const jobTitleOptions = [
    { id: 1, title: 'Full house painting' },
    { id: 2, title: 'House renovation' },
    { id: 3, title: 'Garden maintenance' },
    { id: 4, title: 'Cleaning services' },
    { id: 5, title: 'Plumbing services' },
    { id: 6, title: 'Electrical work' },
    { id: 7, title: 'Carpentry' },
    { id: 8, title: 'Interior design' }
  ]

  const jobTypeOptions = [
    { id: 1, title: 'Full time' },
    { id: 2, title: 'Part time' },
    { id: 3, title: 'Contract' },
    { id: 4, title: 'Casual' },
    { id: 5, title: 'Temporary' },
    { id: 6, title: 'Freelance' }
  ]

 const handleJobTitleSelect = (item) => {
  if (item?.title) {
    setValue('jobTitle', item.title, { shouldValidate: true, shouldDirty: true })
  }
  jobTitleSheetRef.current?.close()
}

const handleJobTypeSelect = (item) => {
  if (item?.title) {
    setValue('jobType', item.title, { shouldValidate: true, shouldDirty: true })
  }
  jobTypeSheetRef.current?.close()
}
  const onSubmit = (data) => {
    const searchData = {
      jobTitle: selectedJobTitle,
      jobType: selectedJobType,
      workLocation: data.workLocation,
      rangeKm: rangeKm,
      staffNumber: data.staffNumber
    }
    
    console.log('Search data:', searchData)
    // Navigate to search results or next step
  }

  const handleNext = () => {
    // jobTitleSheetRef.current?.open()
    console.log('fdks manual search')
    navigation.navigate(screenNames.STEP_TWO)
    methods.handleSubmit(onSubmit)()
  }

  return (
    <FormProvider {...methods}>
      <AppHeader
        showTopIcons={false}
        title="Manual Search"
        rightComponent={
          <View style={{}}>
            <TouchableOpacity 
              // style={styles.nextButton}
              // onPress={handleNext}
              activeOpacity={0.7}
            >
              <AppText variant={Variant.body} style={{
                color: colors.white,
                fontWeight: 'bold',
                fontSize: getFontSize(16),
              }}>
                Step 1/3
              </AppText>
            </TouchableOpacity>
          </View>
        }
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Job Title */}
        <View style={styles.formGroup}>
         <FormField
            onPressField={() => jobTitleSheetRef.current?.open()}
            name="jobTitle"
            value={watch('jobTitle')}
            label="Job title"  
            placeholder="Enter job title"
           
            // inputWrapperStyle={styles.formFieldWrapper}
          />  
        </View>

        {/* Job Type */}
        <View style={styles.formGroup}>
          <FormField
            name="jobType"
            onPressField={() => jobTypeSheetRef.current?.open()}
            label="Job type"
            value={watch('jobType')} 
            placeholder="Enter job type"
            
            // inputWrapperStyle={styles.formFieldWrapper}
          />
        </View>

        {/* Work Location */}
        <FormField
          name="workLocation"
          label="Work location"
          placeholder="Enter location"
          rules={{
            required: 'Work location is required'
          }}
          // inputWrapperStyle={styles.formFieldWrapper}
        />

        {/* Range Slider */}
        <View style={styles.formGroup}>
          <AppText variant={Variant.bodyMedium} style={styles.label}>
            Range from location (km)
          </AppText>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={200}
              value={rangeKm}
              onValueChange={setRangeKm}
              step={1}
              minimumTrackTintColor="#F59E0B"
              maximumTrackTintColor={colors.grayE8 || '#E5E7EB'}
              thumbStyle={styles.sliderThumb}
            />
          </View>
          <AppText variant={Variant.subTitle} style={styles.rangeValue}>
            {Math.round(rangeKm)} km
          </AppText>
        </View>

        {/* Map Preview */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            {/* This would be replaced with actual map component */}
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=300&fit=crop' }}
              style={styles.mapImage}
            />
            <View style={styles.mapOverlay}>
              <View style={styles.mapPin}>
                <VectorIcons
                  name={iconLibName.Ionicons}
                  iconName="location"
                  size={30}
                  color="#FF6B35"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Staff Number */}
        <FormField
          name="staffNumber"
          label="How many staff looking for"
          placeholder="Total staff number"
          keyboardType="numeric"
          rules={{
            required: 'Staff number is required',
            pattern: {
              value: /^[0-9]+$/,
              message: 'Please enter a valid number'
            }
          }}
          // inputWrapperStyle={styles.formFieldWrapper}
        />

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <AppButton
            text="Next"
            onPress={handleNext}
            // bgColor="#F59E0B"
            textColor="#FFFFFF"
            // style={styles.nextButton}
          />
        </View>
      </ScrollView>

      {/* Bottom Sheets */}
      <RbSheetComponent
        ref={jobTitleSheetRef}
        height={hp(90)}
        bgColor={colors.white}
        containerStyle={styles.sheetContainer}
      >
        <BottomDataSheet
          onSelect={handleJobTitleSelect}
        optionsData={jobTitleOptions} onClose={() => jobTitleSheetRef.current?.close()} />
      </RbSheetComponent>

      <RbSheetComponent
        ref={jobTypeSheetRef}
        height={hp(90)}
        bgColor={colors.white}
        containerStyle={styles.sheetContainer}
      >
        <BottomDataSheet
          onSelect={handleJobTypeSelect}
        optionsData={jobTypeOptions} onClose={() => jobTypeSheetRef.current?.close()} />
      </RbSheetComponent>
    </FormProvider>
  )
}

export default ManualSearch

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#FFFFFF',
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  formGroup: {
    // marginBottom: hp(3),
  },
  label: {
    color: colors.secondary,
    fontSize: getFontSize(16),
    marginBottom: hp(1),
    fontWeight: '500',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.grayE8 || '#E5E7EB',
    borderRadius: hp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: colors.white,
    minHeight: hp(6),
  },
  dropdownText: {
    flex: 1,
    color: colors.gray || '#6B7280',
    fontSize: getFontSize(16),
  },
  formFieldWrapper: {
    marginBottom: hp(3),
  },
  sliderContainer: {
    // marginVertical: hp(2),
  },
  slider: {
    width: '100%',
    height: hp(5),
  },
  sliderThumb: {
    backgroundColor: colors.primary,
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
  },
  rangeValue: {
    color: '#7C3AED',
    fontSize: getFontSize(16),
    fontWeight: '600',
    marginTop: hp(1),
  },
  mapContainer: {
    marginBottom: hp(3),
  },
  mapPlaceholder: {
    height: hp(25),
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPin: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: wp(6),
    padding: wp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    // marginTop: hp(2),
    marginBottom: hp(6),
  },
  nextButton: {
    borderRadius: hp(3),
    paddingVertical: hp(2.5),
  },
  
  // Bottom Sheet Styles
  sheetContainer: {
    paddingTop: 0,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#E5E7EB',
    marginBottom: hp(2),
  },
  sheetTitle: {
    color: colors.black,
    fontSize: getFontSize(18),
    fontWeight: '600',
  },
  closeButton: {
    padding: wp(2),
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.grayE8 || '#F3F4F6',
  },
  selectedOption: {
    backgroundColor: colors.primary + '10' || '#FF6B3510',
  },
  optionText: {
    color: colors.black,
    fontSize: getFontSize(16),
    flex: 1,
  },
  selectedOptionText: {
    color: colors.primary || '#FF6B35',
    fontWeight: '500',
  },
})