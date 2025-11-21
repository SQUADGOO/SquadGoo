import {StyleSheet} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '@/core/CustomDrawer';
import TabNavigator from './TabNavigator';
import {screenNames} from './screenNames';
import { JobPreview } from '@/screens';
import * as ui from '@/screens';
import SupportStack from './SupportStack';
import ManualSearchStack from './ManualSearchStack';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
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
        name={screenNames.MANUAL_SEARCH_STACK}
        component={ManualSearchStack}
      />
      
      {/* Manual Search Result Screens - moved out of stack */}
      <Drawer.Screen
        name={screenNames.MANUAL_MATCH_LIST}
        component={ui.ManualMatchList}
      />
      <Drawer.Screen
        name={screenNames.MANUAL_CANDIDATE_PROFILE}
        component={ui.ManualCandidateProfile}
      />
      <Drawer.Screen
        name={screenNames.MANUAL_OFFERS}
        component={ui.ManualOffers}
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
        name={screenNames.QUICK_SEARCH_PREVIEW}
        component={ui.QuickSearchPreview}
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
        name={screenNames.CHAT}
        component={ui.Chat}
      />
  <Drawer.Screen
        name={screenNames.Wallet}
        component={ui.Wallet}
      />
       <Drawer.Screen name={screenNames.BASIC_DETAILS} component={ui.BasicDetails} />
      <Drawer.Screen name={screenNames.ADDRESS} component={ui.Address} />
      <Drawer.Screen name={screenNames.CONTACT_DETAILS} component={ui.ContactDetails} />
      <Drawer.Screen name={screenNames.TAX_INFO} component={ui.TaxInformation} />
      <Drawer.Screen name={screenNames.VISA_DETAILS} component={ui.VisaDetails} />
      <Drawer.Screen name={screenNames.KYC_KYB} component={ui.KycVerification} />
      <Drawer.Screen name={screenNames.EXTRA_QUALIFICATIONS} component={ui.JobQualification} />
      <Drawer.Screen name={screenNames.BIO} component={ui.Biography} />
      <Drawer.Screen name={screenNames.SOCIAL_MEDIA} component={ui.SocialMedia} />
      <Drawer.Screen name={screenNames.PASSWORD} component={ui.Password} />
      <Drawer.Screen name={screenNames.PROFILE} component={ui.Profile} />
      <Drawer.Screen name={screenNames.KYC_KYB_DOC} component={ui.KycDocument} />
      <Drawer.Screen name={screenNames.KYC_KYB_SUBMIT} component={ui.KycSubmit} />

  


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
        name={screenNames.ACCEPTED_OFFERS}
        component={ui.AcceptedOffers}
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
