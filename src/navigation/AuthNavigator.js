import {StyleSheet} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import * as ui from '../screens';
import {screenNames} from './screenNames';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
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
