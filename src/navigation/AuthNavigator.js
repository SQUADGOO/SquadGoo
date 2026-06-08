import {StyleSheet} from 'react-native';
import React, { useEffect, useState } from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import * as ui from '../screens';
import {screenNames} from './screenNames';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const [initialRouteName, setInitialRouteName] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem('has_seen_onboarding');
        if (!mounted) return;
        setInitialRouteName(hasSeen === 'true' ? screenNames.SIGN_IN : screenNames.ON_BOARDING);
      } catch {
        if (!mounted) return;
        // safest fallback: show onboarding if storage read fails
        setInitialRouteName(screenNames.ON_BOARDING);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // Avoid mounting navigator until initial route is known
  if (!initialRouteName) return null;

  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{headerShown: false}}>
      <Stack.Screen name={screenNames.ON_BOARDING} component={ui.OnBoardingScreen} />
      <Stack.Screen name={screenNames.SIGN_IN} component={ui.Signin} />
      <Stack.Screen name={screenNames.SIGN_UP} component={ui.SignUp} />
      <Stack.Screen name={screenNames.VERIFY_EMAIL} component={ui.VerifyEmail} />
      {/* <Stack.Screen name={screenNames.FORGOT_PASSWORD} component={ui.ForgetPassword} />
      <Stack.Screen name={screenNames.CHECK_EMAIL} component={ui.CheckEmail} />
      <Stack.Screen name={screenNames.PASSWORD_RESET} component={ui.PasswordReset} />
      <Stack.Screen name={screenNames.CREATE_PASSWORD} component={ui.CreatePassword} /> */}
    </Stack.Navigator>
  );
};

export default AuthNavigator;

const styles = StyleSheet.create({});
