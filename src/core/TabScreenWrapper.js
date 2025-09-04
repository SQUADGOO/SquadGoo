import React from 'react';
import {StatusBar, SafeAreaView, View} from 'react-native';
import {colors} from '@/theme';

const TabScreenWrapper = ({
  children,
  color = colors.bgColor,
  statusBarColor,
  withoutStatusBar,
}) => {
  // console.log("statusBarColor:", statusBarColor, "Type:", typeof statusBarColor)

  return (
    <>
      {!withoutStatusBar ? (
        <>
          {/* Top safe area */}
          <SafeAreaView
            style={{flex: 0, backgroundColor: statusBarColor || colors.primary}}
          />

          {/* Main content */}
          <SafeAreaView
            style={{flex: 1, backgroundColor: color || colors.white}}>
            <StatusBar
              barStyle={'light-content'}
              backgroundColor={statusBarColor}
            />
            {children}
          </SafeAreaView>

          {/* Bottom safe area */}
          <SafeAreaView style={{flex: 0, backgroundColor: colors.black}} />
        </>
      ) : (
        <>
          <View style={{flex: 1, backgroundColor: color || colors.white}}>
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

export default TabScreenWrapper;
