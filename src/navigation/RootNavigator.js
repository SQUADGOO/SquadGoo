import { StyleSheet } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthNavigator from "./AuthNavigator";
import { screenNames } from "./screenNames";
import { useSelector } from "react-redux";
import MainNavigator from "./MainNavigator";
import TabNavigator from "./TabNavigator";
import DrawerNavigator from "./DrawerNavigator";
import JobSeekerDrawerNavigator from "./JobSeekerDrawer";
import { Address, BasicDetails, Biography, ContactDetails, JobQualification, KycBusiness, KycDocument, KycSubmit, KycVerification, Password, Profile, SocialMedia, TaxInformation, VisaDetails } from "@/screens";
import * as ui from '@/screens';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        role === "recruiter" ? (
          <Stack.Screen
            name={screenNames.DRAWER_NAVIGATION}
            component={DrawerNavigator}
          />
        ) : role === "jobseeker" ? (
          <Stack.Screen
            name={screenNames.JOBSEEKER_DRAWER}
            component={JobSeekerDrawerNavigator}
          />
        ) : (
          <Stack.Screen
            name={screenNames.MAIN_NAVIGATION}
            component={MainNavigator}
          />
        )
      ) : (
        <Stack.Screen
          name={screenNames.AUTH_NAVIGATION}
          component={AuthNavigator}
        />
      )}
       <Stack.Screen
          name={screenNames.PROFILE}
          component={Profile}
        />
            <Stack.Screen name={screenNames.EDIT_PROFILE} component={ui.EditProfile} />
         <Stack.Screen name={screenNames.BASIC_DETAILS} component={BasicDetails} />
              <Stack.Screen name={screenNames.ADDRESS} component={Address} />
              <Stack.Screen name={screenNames.CONTACT_DETAILS} component={ContactDetails} />
              <Stack.Screen name={screenNames.TAX_INFO} component={TaxInformation} />
              <Stack.Screen name={screenNames.VISA_DETAILS} component={VisaDetails} />
              <Stack.Screen name={screenNames.KYC_KYB} component={KycVerification} />
              <Stack.Screen name={screenNames.EXTRA_QUALIFICATIONS} component={JobQualification} />
              <Stack.Screen name={screenNames.BIO} component={Biography} />
              <Stack.Screen name={screenNames.SOCIAL_MEDIA} component={SocialMedia} />
              <Stack.Screen name={screenNames.PASSWORD} component={Password} />
              <Stack.Screen name={screenNames.KYC_KYB_DOC} component={KycDocument} />
              <Stack.Screen name={screenNames.KYC_KYB_SUBMIT} component={KycSubmit} />
              <Stack.Screen name={screenNames.KYC_BUSINESS} component={KycBusiness} />

    </Stack.Navigator>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({});
