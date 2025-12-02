import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {screenNames} from './screenNames';
import * as ui from '@/screens';

const Stack = createNativeStackNavigator();

const SupportStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={screenNames.SUPPORT} component={ui.Support} />
      <Stack.Screen name={screenNames.SUPPORT_FAQ} component={ui.SupportFAQ} />
      <Stack.Screen
        name={screenNames.SUPPORT_TICKETS}
        component={ui.SupportTickets}
      />
    </Stack.Navigator>
  );
};

export default SupportStack;

