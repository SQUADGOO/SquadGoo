import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import * as ui from '@/screens';
import MainNavigator from './MainNavigator';
import {screenNames} from './screenNames';
import RootNavigator from './RootNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={screenNames.ROOT_STACK}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={screenNames.ROOT_STACK} component={RootStack} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

export const RootStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName={screenNames.SPLASH}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={screenNames.SPLASH} component={ui.Splash} />
      <Stack.Screen
        name={screenNames.ROOT_NAVIGATION}
        component={RootNavigator}
      />
    </Stack.Navigator>
  );
};
