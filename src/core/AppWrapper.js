import React from 'react';
import {StatusBar, SafeAreaView, View} from 'react-native';
import {colors} from '@/theme';

const AppWrapper = ({
  children,
  color = colors.bgColor,
  statusBarColor,
  withoutStatusBar,
}) => {
  return (
    <>
      {!withoutStatusBar ? (
        <>
          <SafeAreaView style={{flex: 0, backgroundColor: statusBarColor}} />
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: color ? color : colors.white,
            }}>
            <StatusBar
              barStyle={'light-content'}
              backgroundColor={statusBarColor}
            />
            {children}
          </SafeAreaView>
        </>
      ) : (
        <>
          <View
            style={{
              flex: 1,
              backgroundColor: color ? color : 'transparent',
            }}>
            <StatusBar
              barStyle={'dark-content'}
              backgroundColor={statusBarColor}
            />
            {children}
          </View>
        </>
      )}
    </>
  );
};

export default AppWrapper;
