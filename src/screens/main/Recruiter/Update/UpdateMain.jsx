import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
} from 'react-native'
import Slider from '@react-native-community/slider'
import { wp, hp, getFontSize } from '@/theme'
import { colors } from '../../../../theme/colors'
import { Images } from '../../../../assets'
import PoolHeader from '../../../../core/PoolHeader'
import RbSheetComponent from '../../../../core/RbSheetComponent'
import { useNavigation } from '@react-navigation/native'
import { screenNames } from '../../../../navigation/screenNames'

const PostJobScreen = () => {
  const [jobTitle, setJobTitle] = useState('Full house paining')
  const [jobType, setJobType] = useState('Full time')
  const [location, setLocation] = useState('Sydney |')
  const [rangeKm, setRangeKm] = useState(119)
  const [staffCount, setStaffCount] = useState('5')
const navigation = useNavigation();
  const jobTypes = [
    'Apprentices and trainees',
    'Casual',
    'Daily hire and weekly hire',
    'Employees with disability',
    'Fixed term contract employees',
    'Full time',
    'Outworkers',
    'Part time',
    'Shiftworker',
    'Probation',
    'Temprery',
  ]

  const jobTitles = [
    'Plumber',
    'Electrician',
    'Musician',
    'Teacher',
    'Painter',
    'Worker',
    'House made',
    'Plumber',
    'Electrician',
    'Musician',
    'Plumber',
  ]

  const jobTitleSheet = useRef()
  const jobTypeSheet = useRef()

  return (
    <View style={styles.container}>
        <ScrollView>

      <PoolHeader title="Update" />

      <View style={{ padding: wp(4), paddingTop: hp(2) }}>
        {/* Open Job Title Sheet */}
        <Text style={styles.inputLabel}>Job title</Text>
        <TouchableOpacity style={styles.inputBox} onPress={() => jobTitleSheet.current.open()}>
          <Text style={styles.inputBoxText}>{jobTitle}</Text>
          <Text style={styles.chev}>▾</Text>
        </TouchableOpacity>

        {/* Open Job Type Sheet */}
        <Text style={styles.inputLabel}>Job type</Text>
        <TouchableOpacity style={styles.inputBox} onPress={() => jobTypeSheet.current.open()}>
          <Text style={styles.inputBoxText}>{jobType}</Text>
          <Text style={styles.chev}>▾</Text>
        </TouchableOpacity>

        {/* Work location */}
        <Text style={styles.inputLabel}>Work location</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Sydney |"
          placeholderTextColor="#bdb3c3"
          style={styles.inputBox}
        />

        {/* Range slider */}
        <Text style={[styles.inputLabel, { marginTop: hp(1.5) }]}>Range from location (km)</Text>
        <Slider
          style={{ width: '100%', height: hp(6) }}
          minimumValue={0}
          maximumValue={300}
          value={rangeKm}
          onValueChange={val => setRangeKm(Math.round(val))}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor="#f3d8b7"
          thumbTintColor={colors.primary}
          step={1}
        />
        <Text style={styles.rangeText}>{rangeKm} km</Text>

        {/* Map */}
        <View style={styles.mapWrap}>
          <Image source={Images.map} resizeMode="cover" style={styles.mapImage} />
        </View>

        {/* Staff input */}
        <Text style={styles.inputLabel}>How many staff looking for</Text>
        <TextInput
          value={staffCount}
          onChangeText={setStaffCount}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#bdb3c3"
          style={styles.inputBox}
        />

        {/* Next button */}
        <TouchableOpacity onPress={()=>navigation.navigate(screenNames.UPDATE_SECOND)} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
        </ScrollView>

      {/* Bottom Sheet: Job Titles */}
      <RbSheetComponent ref={jobTitleSheet} height={hp(100)}>

       <View >
   <PoolHeader onBackPress={()=>jobTitleSheet.current.close()} title='Job title'/>
    <FlatList
          data={jobTitles}
          keyExtractor={(item, idx) => `${idx}-${item}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {
                setJobTitle(item)
                jobTitleSheet.current.close()
              }}
            >
              <Text style={styles.listItemText}>{item}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
        </View>
      </RbSheetComponent>

      {/* Bottom Sheet: Job Types */}
      <RbSheetComponent ref={jobTypeSheet} height={hp(100)}>
         <View >
    <PoolHeader onBackPress={()=>jobTypeSheet.current.close()} title='Job type'/>
       <FlatList
          data={jobTypes}
          keyExtractor={(item, idx) => `${idx}-${item}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {
                setJobType(item)
                jobTypeSheet.current.close()
              }}
            >
              <Text style={styles.listItemText}>{item}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    </View>
      </RbSheetComponent>
    </View>
  )
}

export default PostJobScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inputLabel: {
    fontSize: getFontSize(16),
    color: '#7d4d86',
    fontWeight: '700',
    marginBottom: hp(0.8),
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#d9d7df',
    borderRadius: wp(3),
    paddingVertical: hp(1.6),
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: hp(2),
  },
  inputBoxText: { fontSize: getFontSize(16), color: '#6f6f80' },
  chev: { fontSize: getFontSize(20), color: '#b9a7bd' },

  listItem: { paddingVertical: hp(2), paddingHorizontal: wp(4) },
  listItemText: { fontSize: getFontSize(16), color: '#333' },
  separator: { height: 1, backgroundColor: '#eee' },

  rangeText: { fontSize: getFontSize(16), color: '#5f6a78', fontWeight: '700', marginBottom: hp(1) },
  mapWrap: { height: hp(23), borderRadius: wp(2), overflow: 'hidden', marginBottom: hp(2), backgroundColor: '#f2f2f2' },
  mapImage: { width: '100%', height: '100%' },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: wp(3),
    paddingVertical: hp(2.2),
    alignItems: 'center',
    marginTop: hp(3),
  },
  nextButtonText: { color: '#fff', fontSize: getFontSize(20), fontWeight: '800' },
})
