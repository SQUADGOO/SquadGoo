import {StyleSheet} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '@/core/CustomDrawer';
import {screenNames} from './screenNames';
import { JobPreview } from '@/screens';
import * as ui from '@/screens';
import SupportStack from './SupportStack';
import QuickSearchStack from './QuickSearchStack';

const Drawer = createDrawerNavigator();

const JobSeekerDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props}  onNavigate={(route, params) => props.navigation.navigate(route, params)}
 />}
      screenOptions={{
        headerShown: false,
        drawerStyle: styles.drawerStyle,
      }}>
      <Drawer.Screen
        name={screenNames.JOBSEEKER_TAB}
        component={ui.JobSeekerTabNavigator}
      />

             <Drawer.Screen
        name={screenNames.JOB_SEEKER_DASHBOARD}
        component={ui.JobSeekerDashboard}
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
        name={screenNames.CHAT}
        component={ui.Chat}
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
        component={ui.CompletedOffersJobSeeker}
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
        name={screenNames.NOTIFICATIONS}
        component={ui.Notifications}
      />

       
      <Drawer.Screen
        name={screenNames.JOB_SETTINGS}
        component={ui.JobSettings}
      />
       <Drawer.Screen
        name={screenNames.APP_SETTINGS}
        component={ui.AppSettings}
      />
           <Drawer.Screen
        name={screenNames.SQUAD_SETTINGS}
        component={ui.SquadSettings}
      />

            <Drawer.Screen
        name={screenNames.ACCOUNT_UPGRADE}
        component={ui.AccountUpgrade}
      />

            <Drawer.Screen
        name={screenNames.SUPPORT}
        component={SupportStack}
      />

      <Drawer.Screen  
        name={screenNames.Wallet}
        component={ui.Wallet}
      />
   
      <Drawer.Screen  
        name={screenNames.MARKETPLACE_STACK}
        component={ui.MarketplaceStack}
      />
      <Drawer.Screen  
        name={screenNames.MARKETPLACE_ORDERS}
        component={ui.Orders}
      />
      <Drawer.Screen  
        name={screenNames.VIEW_JOB_DETAILS}
        component={ui.ViewJobDetails}
      />
      <Drawer.Screen  
        name={screenNames.JOB_CANDIDATES}
        component={ui.JobCandidates}
      />
        <Drawer.Screen  
        name={screenNames.ADD_EXPERIENCE}
        component={ui.AddExperience}
      />
          <Drawer.Screen
        name={screenNames.ADD_JOB_STEP1}
        component={ui.AddJobStep1}
      />
          <Drawer.Screen
        name={screenNames.ADD_JOB_STEP2}
        component={ui.AddJobStep2}
      />
             <Drawer.Screen
        name={screenNames.SQUAD_SETTINGS_Groups}
        component={ui.SquadSettingsGroups}
      />

              <Drawer.Screen
        name={screenNames.GROUP_DETAIL}
        component={ui.GroupDetail}
      />
              <Drawer.Screen
        name={screenNames.MEMBERS}
        component={ui.Members}
      />

      <Drawer.Screen
          name={screenNames.ACCEPTED_OFFERS}
          component={ui.AcceptedOffers}
        />
      
      <Drawer.Screen
          name={screenNames.JOB_OFFER_DETAILS}
          component={ui.JobOfferDetails}
        />
      
      <Drawer.Screen
        name={screenNames.QUICK_SEARCH_ACTIVE_OFFERS_JS}
        component={ui.QuickSearchActiveOffersJS}
      />
      
      <Drawer.Screen
        name={screenNames.MANUAL_OFFERS_JS}
        component={ui.ManualOffersJS}
      />
      
      <Drawer.Screen
        name={screenNames.QUICK_SEARCH_ACTIVE_JOBS_JS}
        component={ui.QuickSearchActiveJobsJS}
      />
      
      <Drawer.Screen
        name={screenNames.LOCATION_SHARING}
        component={ui.LocationSharing}
      />
      
      <Drawer.Screen
        name={screenNames.PAYMENT_REQUEST}
        component={ui.PaymentRequest}
      />
      
      <Drawer.Screen
        name={screenNames.TIMER_CONTROL}
        component={ui.TimerControl}
      />
      
      <Drawer.Screen
        name={screenNames.JOB_COMPLETE}
        component={ui.JobComplete}
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
