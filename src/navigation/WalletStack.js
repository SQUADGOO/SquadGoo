import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as ui from '@/screens';
import { screenNames } from './screenNames';

const Stack = createStackNavigator();

const WalletStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={screenNames.Wallet}
        component={ui.Wallet}
      />
      <Stack.Screen
        name={screenNames.PURCHASE_COINS}
        component={ui.PurchaseCoins}
      />
      <Stack.Screen
        name={screenNames.TOP_UP}
        component={ui.TopUp}
      />
      <Stack.Screen
        name={screenNames.PAYID_DEPOSIT}
        component={ui.PayIDDeposit}
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
        name={screenNames.MANAGE_BANK_ACCOUNTS}
        component={ui.ManageBankAccounts}
      />
      <Stack.Screen
        name={screenNames.FORM_SUMMARY}
        component={ui.FormSummary}
      />
      <Stack.Screen
        name={screenNames.ESCROW_HOLDS}
        component={ui.EscrowHolds}
      />
      <Stack.Screen
        name={screenNames.ACTIVE_HOLDS_VIEW_ALL}
        component={ui.ActiveHoldsViewAll}
      />
      <Stack.Screen
        name={screenNames.JOB_TIMELINE}
        component={ui.JobTimeline}
      />
      <Stack.Screen
        name={screenNames.OPEN_DISPUTE}
        component={ui.OpenDispute}
      />
      <Stack.Screen
        name={screenNames.COMPLETED_HOLDS_VIEW_ALL}
        component={ui.CompletedHoldsViewAll}
      />
      <Stack.Screen
        name={screenNames.TRANSACTION_HISTORY}
        component={ui.TransactionHistory}
      />
      <Stack.Screen
        name={screenNames.RATINGS_REPORTS}
        component={ui.RatingsReports}
      />

    </Stack.Navigator>
  );
};

export default WalletStack;
