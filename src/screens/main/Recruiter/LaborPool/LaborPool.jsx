import React from 'react'
import { View, StyleSheet } from 'react-native'
import YourPool from './YourPool'

const LaborPoolScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <YourPool navigation={navigation} />
      </View>
    </View>
  )
};

export default LaborPoolScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  body: { flex: 1 },
})

