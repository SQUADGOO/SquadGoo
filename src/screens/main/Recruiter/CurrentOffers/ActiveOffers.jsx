import React from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { wp, hp, getFontSize } from '@/theme'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import PoolHeader from '../../../../core/PoolHeader'
import { colors } from '../../../../theme/colors'

const jobs = [
  {
    id: '1',
    title: 'Marketing Manager - Tech Startup',
    posted: 'Posted 2 days ago',
    expires: 'Expires in 5 days',
    location: 'CBD Area, 2.5km away',
    start: 'Next Monday',
    salary: '$80,000 - $100,000/year',
    messages: 2,
  },
  {
    id: '2',
    title: 'Marketing Manager - Tech Startup',
    posted: 'Posted 2 days ago',
    expires: 'Expires in 5 days',
    location: 'CBD Area, 2.5km away',
    start: 'Next Monday',
    salary: '$80,000 - $100,000/year',
    messages: 2,
  },
  {
    id: '3',
    title: 'Marketing Manager - Tech Startup',
    posted: 'Posted 2 days ago',
    expires: 'Expires in 5 days',
    location: 'CBD Area, 2.5km away',
    start: 'Next Monday',
    salary: '$80,000 - $100,000/year',
    messages: 2,
  },
  {
    id: '4',
    title: 'Marketing Manager - Tech Startup',
    posted: 'Posted 2 days ago',
    expires: 'Expires in 5 days',
    location: 'CBD Area, 2.5km away',
    start: 'Next Monday',
    salary: '$80,000 - $100,000/year',
    messages: 2,
  },
]

const JobCard = ({ item }) => {
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
    </View>
  )
}

const JobList = () => {
  return (
    <View style={styles.container}>

        <PoolHeader title='Current Pool ➜  Active (8)'/>
 <FlatList
      data={jobs}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <JobCard item={item} />}
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
    flexDirection: 'row',
    marginTop: hp(1.5),
    justifyContent: 'space-between',
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
  editText: {
    color: colors.primary,
    fontWeight: '600',
  },
    container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    },
})
