import { LogBox, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { SocketProvider } from '@/providers/SocketProvider';
import NetworkProvider from './src/providers/NetworkProvider';
import { AppNavigator } from './src/navigation';
import toastConfig from './src/utilities/toastConfig';
import { store } from './src/store/store';
import { navigationRef } from './src/navigation/navigationRef';
import { enableScreens } from 'react-native-screens';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppWrapper from '@/core/AppWrapper';

LogBox.ignoreAllLogs(true);

enableScreens();

const App = () => {

  const queryClient = new QueryClient();
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
    <QueryClientProvider client={queryClient}>
      <NetworkProvider>
        <Provider store={store}>
          {/* <AppWrapper statusBarColor={'transparent'}> */}
            <NavigationContainer ref={navigationRef}>
              <AppNavigator />

              <Toast config={toastConfig} />
            </NavigationContainer>
          {/* </AppWrapper> */}
        </Provider>
      </NetworkProvider>
    </QueryClientProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
