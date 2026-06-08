
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native'
import { wp, hp, getFontSize } from '@/theme'
import PoolHeader from '@/core/PoolHeader'

const data = [
  {
    id: '1',
    title: 'Squadgo Support',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet.',
    time: '2 min ago',
  },
  {
    id: '2',
    title: 'Squadgo Support',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet.',
    time: '2 min ago',
  },
  {
    id: '3',
    title: 'Squadgo Support',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet.',
    time: '2 min ago',
  },
  {
    id: '4',
    title: 'Squadgo Support',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet.',
    time: '2 min ago',
  },
  {
    id: '5',
    title: 'Squadgo Support',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet.',
    time: '2 min ago',
  },
]

const Notifcations = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>?</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.message} numberOfLines={3}>
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
        <PoolHeader title='Notifications'/>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: hp(1.5) }}
      />
    </View>
  )
}

export default Notifcations

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  card: {
    flexDirection: 'row',
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  avatarContainer: { marginRight: wp(3) },
  avatarCircle: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: getFontSize(20),
    fontWeight: '700',
    color: '#7c3aed',
  },

  content: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(0.5),
  },
  title: {
    fontSize: getFontSize(16),
    fontWeight: '700',
    color: '#4a1d57',
  },
  time: {
    fontSize: getFontSize(12),
    color: '#6b7280',
  },
  message: {
    fontSize: getFontSize(14),
    color: '#374151',
  },
})
