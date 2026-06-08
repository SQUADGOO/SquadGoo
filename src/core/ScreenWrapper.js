import {SafeAreaView, View, StyleSheet, StatusBar} from 'react-native';
import React from 'react';
import {colors} from '@/theme';

const ScreenWrapper = ({
  children,
  backgroundColor = colors.bgColor,
  customStyle = {},
}) => {
  return (
    <SafeAreaView style={[styles.wrapper, {backgroundColor}]}>
      <StatusBar barStyle={'dark-content'} />
      <View style={[styles.container, {backgroundColor}, customStyle]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
