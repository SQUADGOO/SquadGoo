import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { colors, hp, wp } from '@/theme'
import AppText, { Variant } from '@/core/AppText'
import VectorIcons from '@/theme/vectorIcon'
import { useNavigation } from '@react-navigation/native'
import AppHeader from '@/core/AppHeader';
import PoolHeader from '../../../../core/PoolHeader'

const Contractors = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
    
    <PoolHeader title='Contractors'/>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <VectorIcons name="Feather" iconName="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <AppText variant={Variant.title} style={styles.headerTitle}>Contractors</AppText>


      {/* Center Content */}
      <View style={styles.content}>
        <VectorIcons name="Feather" iconName="user-check" size={72} color="#6B3BB8" />

        <AppText variant={Variant.title} style={styles.title}>TFN Employees Pool</AppText>
        <AppText variant={Variant.body} style={styles.subtitle}>
          Traditional employees with TFN registration
        </AppText>

        <TouchableOpacity style={styles.button}>
          <AppText variant={Variant.body} style={styles.buttonText}>
            Browse Contractors
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Contractors
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: hp(12),
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: wp(4),
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: hp(2),
  },
  backBtn: {
    marginRight: wp(2),
  },
  headerTitle: {
    color: '#fff',
    fontSize: wp(5),
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(25),
  },
  title: {
    marginTop: hp(2),
    fontSize: wp(4.5),
    color: '#6B3BB8',
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#999',
    fontSize: wp(3.4),
    marginTop: hp(1),
    marginBottom: hp(3),
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFA726',
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(8),
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp(3.6),
  },
})
