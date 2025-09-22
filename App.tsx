import {LogBox, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {SocketProvider} from '@/providers/SocketProvider';
import NetworkProvider from './src/providers/NetworkProvider';
import {AppNavigator} from './src/navigation';
import toastConfig from './src/utilities/toastConfig';
import {store} from './src/store/store';
import {navigationRef} from './src/navigation/navigationRef';
import { enableScreens } from 'react-native-screens';

LogBox.ignoreAllLogs(true);

enableScreens();

const App = () => {
  // useEffect(() => {
  //   requestUserPermission()
  //   getFCMToken()
  //   getMessaging().onMessage(async remoteMessage => {
  //     console.log('A new FCM message arrived!', JSON.stringify(remoteMessage))
  //   })
  //   messaging().onMessage(async remoteMessage => {
  //     console.log('Foreground message received:', remoteMessage)
  //   })
  // }, [])

  return (
    <NetworkProvider>
      <Provider store={store}>
        <NavigationContainer ref={navigationRef}>
          <AppNavigator />

          <Toast config={toastConfig} />
        </NavigationContainer>
      </Provider>
    </NetworkProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
