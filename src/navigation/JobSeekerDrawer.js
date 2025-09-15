import {StyleSheet} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '@/core/CustomDrawer';
import TabNavigator from './TabNavigator';
import {screenNames} from './screenNames';
import { JobPreview } from '@/screens';
import * as ui from '@/screens';

const Drawer = createDrawerNavigator();

const JobSeekerDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props}  onNavigate={(route) => props.navigation.navigate(route)}
 />}
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
             <Drawer.Screen
        name={screenNames.MAIN_DASHBOARD}
        component={ui.MainDashboard}
      />
          <Drawer.Screen
        name={screenNames.LABOR_POOL}
        component={ui.LaborPoolScreen}
      />
       <Drawer.Screen
        name={screenNames.SQUAD_POOL}
        component={ui.SquadPoolScreen}
      />
          <Drawer.Screen
        name={screenNames.CONTRACTORS}
        component={ui.Contractors}
      />

          <Drawer.Screen
        name={screenNames.ACTIVE_OFFERS}  
        component={ui.ActiveOffers}
      />

          <Drawer.Screen
        name={screenNames.DRAFTED_OFFERS}  
        component={ui.DraftedOffers}
      />
          <Drawer.Screen
        name={screenNames.COMPLETED_OFFERS}
        component={ui.CompletedOffers}
      />

          <Drawer.Screen  
        name={screenNames.EXPIRED_OFFERS}
        component={ui.ExpiredOffers}
      />
       <Drawer.Screen  
        name={screenNames.STAFF_PREFERENCES}
        component={ui.StaffPreferences}
      />

        <Drawer.Screen
        name={screenNames.UPDATE_MAIN}
        component={ui.UpdateMain}
      />
      
        <Drawer.Screen
        name={screenNames.UPDATE_SECOND}
        component={ui.UpdateSecond}
      />
          <Drawer.Screen
        name={screenNames.UPDATE_THIRD}
        component={ui.UpdateThird}
      />
       <Drawer.Screen
        name={screenNames.NOTICATIONS}
        component={ui.Notifcations}
      />

        <Drawer.Screen
        name={screenNames.QUICK_SEARCH_STEPONE}
        component={ui.StepOne}
      />
        <Drawer.Screen
        name={screenNames.QUICK_SEARCH_STEPTWO}
        component={ui.StepTwoQuickSearch}
      />
        <Drawer.Screen
        name={screenNames.QUICK_SEARCH_STEPTHREE}
        component={ui.StepThreeQuickSearch}
      />
            <Drawer.Screen
        name={screenNames.QUICK_SEARCH_STEPFOUR}
        component={ui.StepFourQuickSearch}
      />
      <Drawer.Screen
        name={screenNames.JOBSEEKER_SETTINGS}
        component={ui.JobSeekerSettings}
      />
    </Drawer.Navigator>
  );
};

export default JobSeekerDrawerNavigator;

const styles = StyleSheet.create({
  drawerStyle: {
    width: '70%',
    borderTopRightRadius: 0,
  },
});
