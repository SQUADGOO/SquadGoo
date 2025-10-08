import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import AppText, { Variant } from '@/core/AppText';
import AppHeader from '@/core/AppHeader';
import { colors, hp, wp } from '@/theme';
import VectorIcons from '@/theme/vectorIcon';
import images from '../../../../assets/images';
import PoolHeader from '../../../../core/PoolHeader';

const WorkerCard = ({ name, role, location, availability, rate, rating }) => (
  <View style={styles.card}>
    <View style={styles.cardTop}>
   
      <View style={styles.infoContainer}>
        <AppText variant={Variant.title} style={styles.name}>{name}</AppText>
        <AppText variant={Variant.body} style={styles.role}>{role}</AppText>

     
      </View>

      <View style={styles.ratingContainer}>
        <VectorIcons name="Feather" iconName="star" size={14} color="#FFA726" />
        <AppText variant={Variant.body} style={styles.ratingText}>{rating}</AppText>
      </View>
    </View>

    <View style={[styles.row]}>

   <View style={styles.mainRow} >
    <View style={styles.row}>
          <VectorIcons name="Feather" iconName="map-pin" size={14} color="#999" />
          <AppText variant={Variant.caption} style={styles.infoText}>{location}</AppText>
        </View>

        <View style={styles.row}>
          <VectorIcons name="Feather" iconName="clock" size={14} color="#999" />
          <AppText variant={Variant.caption} style={styles.infoText}>{availability}</AppText>
        </View>

       
   </View>




  <View >
      <View style={styles.buttonRow}>
      <TouchableOpacity style={styles.viewButton}>
        <AppText variant={Variant.body} style={styles.viewButtonText}>View</AppText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.offerButton}>
        <AppText variant={Variant.body} style={styles.offerButtonText}>Offer</AppText>
      </TouchableOpacity>
    </View>
  </View>

    </View>

  </View>
);

const SquadPoolScreen = () => {
  const workers = new Array(5).fill({
    name: 'Sarah Johnson',
    role: 'Hospitality Worker',
    location: 'CBD Area, 2.5km away',
    availability: 'Available immediately',
    rate: '$25–30/hour',
    rating: '4.8',
  });

  return (
    <View style={styles.container}>
      <PoolHeader
        title="Squad Pool"
        leftIcon={{ name: 'Feather', iconName: 'arrow-left', onPress: () => {} }}
        containerStyle={{ backgroundColor: 'transparent' }}
        titleStyle={{ color: '#fff' }}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {workers.map((worker, index) => (
          <WorkerCard key={index} {...worker} />
        ))}
      </ScrollView>
    </View>
  );
};

export default SquadPoolScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
    paddingTop: hp(1),
  },
  card: {
    borderWidth: 1,
    borderColor: '#EADFF7',
    borderRadius: 12,
    padding: wp(4),
    marginBottom: hp(2),
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
  },
  avatar: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    marginRight: wp(3),
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: wp(4.2),
    fontWeight: 'bold',
    color: '#333',
  },
  role: {
    fontSize: wp(3.5),
    color: '#999',
    marginBottom: hp(0.5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.3),
  },
  infoText: {
    marginLeft: wp(1.5),
    color: '#666',
    fontSize: wp(3.1),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: wp(3.5),
    color: '#333',
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2),
    alignSelf:"flex-end",
    left:25
  },
  viewButton: {
    backgroundColor: '#FFA726',
    paddingVertical: hp(1.2),
    borderRadius: 8,
    marginRight: wp(2),
    alignItems: 'center',
    height:hp(4.5),
    width:wp(20)
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp(3),
  },
  offerButton: {
 
    borderWidth: 1,
    borderColor: '#FFA726',
  paddingVertical: hp(1.2),
    borderRadius: 8,
    marginRight: wp(2),
    alignItems: 'center',
    height:hp(4.5),
    width:wp(20)
  },
  offerButtonText: {
    color: '#FFA726',
    fontWeight: '600',
    fontSize: wp(3.6),
  },
  mainRow: {
    top:5}
});

