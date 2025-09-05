import {StyleSheet} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '@/core/CustomDrawer';
import TabNavigator from './TabNavigator';
import {screenNames} from './screenNames';
import { JobPreview } from '@/screens';
import * as ui from '@/screens';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: styles.drawerStyle,
      }}>
      <Drawer.Screen name={screenNames.Tab_NAVIGATION} component={TabNavigator} />
            <Drawer.Screen
        name={screenNames.JOB_PREVIEW}
        component={JobPreview}
      />
            <Drawer.Screen
        name={screenNames.QUICK_SEARCH}
        component={ui.QuickSearch}
      />
            <Drawer.Screen
        name={screenNames.MANUAL_SEARCH}
        component={ui.ManualSearch}
      />

        <Drawer.Screen
        name={screenNames.WALLET_STACK}
        component={ui.WalletStack}
      />
        
        <Drawer.Screen
        name={screenNames.MESSAGES}
        component={ui.Messages}
      />
        <Drawer.Screen
        name={screenNames.ABILITY_TO_WORK}
        component={ui.AbilityToWork}
      />
        <Drawer.Screen
        name={screenNames.STEP_THREE}
        component={ui.StepThree}
      />
        <Drawer.Screen
        name={screenNames.STEP_TWO}
        component={ui.StepTwo}
      />
            
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({
  drawerStyle: {
    width: '70%',
    borderTopRightRadius: 0,
  },
});
