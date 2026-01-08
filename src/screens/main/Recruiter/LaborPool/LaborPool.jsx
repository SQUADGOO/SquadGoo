import React from 'react';
import { View, StyleSheet } from 'react-native';
import PoolHeader from '../../../../core/PoolHeader';
import HomeTopTabNavigator from '../HomeTabs/HomeTopTabNavigator';

const LaborPoolScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <PoolHeader
        title="Labor Pool"
        leftIcon={{ name: 'Feather', iconName: 'arrow-left', onPress: () => navigation.goBack() }}
        containerStyle={{ backgroundColor: 'transparent' }}
        titleStyle={{ color: '#fff' }}
      />

      <View style={styles.body}>
        <HomeTopTabNavigator />
      </View>
    </View>
  );
};

export default LaborPoolScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  body: { flex: 1 },
});

