import { StyleSheet } from 'react-native';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '@/core/CustomDrawer';
import TabNavigator from './TabNavigator';
import { screenNames } from './screenNames';
import { JobPreview } from '@/screens';
import * as ui from '@/screens';
import SupportStack from './SupportStack';
import ManualSearchStack from './ManualSearchStack';
import QuickSearchStack from './QuickSearchStack';
import QuickSearchOffersStack from './QuickSearchOffersStack';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      backBehavior="history"
      drawerContent={props => (
        <CustomDrawer
          {...props}
          onNavigate={(route, params) =>
            props.navigation.navigate(route, params)
          }
        />
      )}
      screenOptions={{
        headerShown: false,
        drawerStyle: styles.drawerStyle,
      }}>
      <Drawer.Screen
        name={screenNames.Tab_NAVIGATION}
        component={TabNavigator}
      />
      <Drawer.Screen name={screenNames.JOB_PREVIEW} component={JobPreview} />
      <Drawer.Screen
        name={screenNames.QUICK_SEARCH}
        component={ui.QuickSearch}
      />
      <Drawer.Screen
        name={screenNames.QUICK_SEARCH_STACK}
        component={QuickSearchStack}
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

      <Drawer.Screen name={screenNames.MESSAGES} component={ui.Messages} />
      <Drawer.Screen
        name={screenNames.MAIN_DASHBOARD}
        component={ui.Home}
      />
      <Drawer.Screen
        name={screenNames.MATCHED_CANDIDATES_POOL}
        component={ui.MatchedCandidatesPool}
      />
      <Drawer.Screen
        name={screenNames.MATCHED_CANDIDATE_PROFILE}
        component={ui.MatchedCandidateProfile}
      />
      <Drawer.Screen
        name={screenNames.PENDING_OFFER_ACCEPTANCE}
        component={ui.PendingOfferAcceptance}
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
        name={screenNames.SQUAD_REVIEWS}
        component={ui.SquadReviews}
      />
      <Drawer.Screen
        name={screenNames.CONTRACTORS}
        component={ui.Contractors}
      />
      <Drawer.Screen name={screenNames.EMPLOYEES} component={ui.Employees} />

      <Drawer.Screen
        name={screenNames.ACTIVE_OFFERS}
        component={ui.ActiveJobOffers}
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

      <Drawer.Screen name={screenNames.UPDATE_MAIN} component={ui.UpdateMain} />

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
        component={ui.Notifications}
      />

      {/* Quick Search Screens - Job Seeker */}
      <Drawer.Screen
        name={screenNames.QUICK_SEARCH_ACTIVE_OFFERS_JS}
        component={ui.QuickSearchActiveOffersJS}
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
      <Drawer.Screen
        name={screenNames.CANDIDATE_HOURS}
        component={ui.CandidateHours}
      />

      {/* Quick Search Screens - Recruiter */}
      <Drawer.Screen
        name={screenNames.QUICK_SEARCH_ACTIVE_OFFERS_RECRUITER}
        component={QuickSearchOffersStack}
      />
      <Drawer.Screen
        name={screenNames.QUICK_SEARCH_ACTIVE_JOBS_RECRUITER}
        component={ui.QuickSearchActiveJobsRecruiter}
      />
      <Drawer.Screen
        name={screenNames.LIVE_TRACKING}
        component={ui.LiveTracking}
      />
      <Drawer.Screen
        name={screenNames.TIMER_MANAGEMENT}
        component={ui.TimerManagement}
      />
      <Drawer.Screen
        name={screenNames.QUICK_SEARCH_MATCH_LIST}
        component={ui.QuickSearchMatchList}
      />
      <Drawer.Screen
        name={screenNames.QUICK_SEARCH_CANDIDATE_PROFILE}
        component={ui.QuickSearchCandidateProfile}
      />
      <Drawer.Screen
        name={screenNames.COMPLETED_WORKER_PROFILE}
        component={ui.CompletedWorkerProfile}
      />
      <Drawer.Screen name={screenNames.SEND_OFFER} component={ui.SendOffer} />
      {/* <Drawer.Screen
        name={screenNames.QUICK_SEARCH_MATCH_LIST}
        component={ui.QuickSearchMatchList}
      />
       */}
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
      <Drawer.Screen name={screenNames.CHAT} component={ui.Chat} />
      <Drawer.Screen name={screenNames.Wallet} component={ui.Wallet} />
      <Drawer.Screen
        name={screenNames.BASIC_DETAILS}
        component={ui.BasicDetails}
      />
      <Drawer.Screen name={screenNames.ADDRESS} component={ui.Address} />
      <Drawer.Screen
        name={screenNames.CONTACT_DETAILS}
        component={ui.ContactDetails}
      />
      <Drawer.Screen
        name={screenNames.TAX_INFO}
        component={ui.TaxInformation}
      />
      <Drawer.Screen
        name={screenNames.VISA_DETAILS}
        component={ui.VisaDetails}
      />
      <Drawer.Screen
        name={screenNames.KYC_KYB}
        component={ui.KycVerification}
      />
      <Drawer.Screen
        name={screenNames.EXTRA_QUALIFICATIONS}
        component={ui.JobQualification}
      />
      <Drawer.Screen name={screenNames.BIO} component={ui.Biography} />
      <Drawer.Screen
        name={screenNames.SOCIAL_MEDIA}
        component={ui.SocialMedia}
      />
      <Drawer.Screen name={screenNames.PASSWORD} component={ui.Password} />
      <Drawer.Screen name={screenNames.PROFILE} component={ui.Profile} />
      <Drawer.Screen name={'AccountSettings'} component={ui.AccountSettings} />
      <Drawer.Screen
        name={screenNames.KYC_KYB_DOC}
        component={ui.KycDocument}
      />
      <Drawer.Screen
        name={screenNames.KYC_KYB_SUBMIT}
        component={ui.KycSubmit}
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
        name={screenNames.NOTIFICATION_PREFERENCES}
        component={ui.NotificationPreferences}
      />
      <Drawer.Screen
        name={screenNames.SECURITY_PASSWORD}
        component={ui.SecurityPassword}
      />
      <Drawer.Screen
        name={screenNames.PASSWORD_MANAGEMENT}
        component={ui.PasswordManagement}
      />
      <Drawer.Screen
        name={screenNames.TWO_FACTOR_AUTH}
        component={ui.TwoFactorAuth}
      />
      <Drawer.Screen
        name={screenNames.PRIVACY_CONTROLS}
        component={ui.PrivacyControls}
      />
      <Drawer.Screen
        name={screenNames.SECURITY_ALERTS}
        component={ui.SecurityAlerts}
      />
      <Drawer.Screen
        name={screenNames.ACCOUNT_RECOVERY}
        component={ui.AccountRecovery}
      />
      <Drawer.Screen
        name={screenNames.OTHER_SECURITY_FEATURES}
        component={ui.OtherSecurityFeatures}
      />
      <Drawer.Screen
        name={screenNames.LEGAL_COMPLIANCE}
        component={ui.LegalCompliance}
      />
      <Drawer.Screen
        name={screenNames.DELETE_ACCOUNT}
        component={ui.DeleteAccount}
      />
      <Drawer.Screen
        name={screenNames.SWITCH_PROFILE}
        component={ui.SwitchProfile}
      />
      <Drawer.Screen
        name={screenNames.LIVE_CHAT}
        component={ui.LiveChat}
      />
      <Drawer.Screen
        name={screenNames.REQUEST_CALLBACK}
        component={ui.RequestCallback}
      />
      <Drawer.Screen
        name={screenNames.MY_CALLBACK_REQUESTS}
        component={ui.MyCallbackRequests}
      />

      <Drawer.Screen
        name={screenNames.ACCOUNT_UPGRADE}
        component={ui.AccountUpgrade}
      />
      <Drawer.Screen name={screenNames.SUPPORT} component={SupportStack} />

      <Drawer.Screen
        name={screenNames.ACCEPTED_OFFERS}
        component={ui.AcceptedOffers}
      />

      <Drawer.Screen
        name={screenNames.RECRUITER_BILLING_REPORTS}
        component={ui.RecruiterBillingReports}
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
