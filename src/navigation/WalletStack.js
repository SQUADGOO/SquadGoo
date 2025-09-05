import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import * as ui from '@/screens';
import {screenNames} from './screenNames';

const Stack = createStackNavigator();

const WalletStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
             name={screenNames.Wallet}
             component={ui.Wallet}
           />
     <Stack.Screen
             name={screenNames.PURCHASE_COINS}
             component={ui.PurchaseCoins}
           />
                 <Stack.Screen
             name={screenNames.WITHDRAW_COINS}
             component={ui.WithdrawCoins}
           />
                 <Stack.Screen
             name={screenNames.ACCOUNT_DETAILS}
             component={ui.AccountDetails}
           />
                 <Stack.Screen
             name={screenNames.BANK_DETAILS}
             component={ui.BankDetails}
           />
                 <Stack.Screen
             name={screenNames.FORM_SUMMARY}
             component={ui.FormSummary}
           />
     
    </Stack.Navigator>
  );
};

export default WalletStack;
