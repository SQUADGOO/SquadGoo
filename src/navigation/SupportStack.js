import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { screenNames } from './screenNames';
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
      <Stack.Screen
        name={screenNames.CREATE_TICKET}
        component={ui.CreateTicket}
      />
      <Stack.Screen
        name={screenNames.MY_TICKETS}
        component={ui.MyTickets}
      />
      <Stack.Screen
        name={screenNames.TICKET_DETAILS}
        component={ui.TicketDetails}
      />
      <Stack.Screen
        name={screenNames.LIVE_CHAT}
        component={ui.LiveChat}
      />
      <Stack.Screen
        name={screenNames.REQUEST_CALLBACK}
        component={ui.RequestCallback}
      />
      <Stack.Screen
        name={screenNames.MY_CALLBACK_REQUESTS}
        component={ui.MyCallbackRequests}
      />
    </Stack.Navigator>
  );
};

export default SupportStack;

