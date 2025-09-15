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
import { Profile } from "@/screens";

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
    </Stack.Navigator>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({});
