import React from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { wp, hp, getFontSize } from '@/theme'
import { colors } from '../../../../theme/colors'
import PoolHeader from '../../../../core/PoolHeader'

const expiredJobs = [
  {
    id: '1',
    title: 'Warehouse Worker - Night Shift',
    expired: 'Expired 3 days ago',
  },
  {
    id: '2',
    title: 'Warehouse Worker - Night Shift',
    expired: 'Expired 3 days ago',
  },
  {
    id: '3',
    title: 'Warehouse Worker - Night Shift',
    expired: 'Expired 3 days ago',
  },
  {
    id: '4',
    title: 'Warehouse Worker - Night Shift',
    expired: 'Expired 3 days ago',
  },
  {
    id: '5',
    title: 'Warehouse Worker - Night Shift',
    expired: 'Expired 3 days ago',
  },
]

const ExpiredJobCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.expiredBadge}>
          <Text style={styles.expiredText}>Draft</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>{item.expired}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.reactivateBtn}>
          <Text style={styles.reactivateText}>Continue Editing</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editText}>Delete Draft</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const DraftedOffers = () => {
  return (
    <View style={styles.container}>
     <PoolHeader title='Current Pool ➜  Drafted'/>
    <FlatList
      data={expiredJobs}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ExpiredJobCard item={item} />}
      contentContainerStyle={{ padding: wp(4) }}
    />
    </View>
  )
}

export default DraftedOffers

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: getFontSize(16),
    fontWeight: '700',
    color: colors.secondary,
  },
  expiredBadge: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: wp(2),
    paddingVertical: hp(0.3),
    paddingHorizontal: wp(2),
  },
  expiredText: {
    fontSize: getFontSize(10),
    color: colors.primary,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: getFontSize(12),
    color: '#666',
    marginTop: hp(0.5),
    marginBottom: hp(1.5),
  },
  actions: {
    flexDirection: 'row',
    marginTop: hp(1),
    width: '100%',
  },
  reactivateBtn: {
    backgroundColor: colors.primary,
    borderRadius: wp(2),
    marginRight: wp(2),
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactivateText: {
    color: '#fff',
    fontWeight: '600',
  },
  editBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: hp(1),
    borderRadius: wp(2),
        width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editText: {
    color: colors.primary,
    fontWeight: '600',
  },
    container: {
    flex: 1,
    backgroundColor: '#fff',
    },
})
