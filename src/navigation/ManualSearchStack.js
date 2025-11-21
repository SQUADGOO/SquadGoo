import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import * as ui from '@/screens';
import {screenNames} from './screenNames';

const Stack = createStackNavigator();

const ManualSearchStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* Step 1: Manual Search */}
      <Stack.Screen
        name={screenNames.MANUAL_SEARCH}
        component={ui.ManualSearch}
      />
      
      {/* Step 2: Experience, Salary, Extra Pay */}
      <Stack.Screen
        name={screenNames.STEP_TWO}
        component={ui.StepTwo}
      />
      
      {/* Availability to Work */}
      <Stack.Screen
        name={screenNames.ABILITY_TO_WORK}
        component={ui.AbilityToWork}
      />
      
      {/* Step 3: Final Step */}
      <Stack.Screen
        name={screenNames.STEP_THREE}
        component={ui.StepThree}
      />
      
      {/* Job Preview */}
      <Stack.Screen
        name={screenNames.JOB_PREVIEW}
        component={ui.JobPreview}
      />
    </Stack.Navigator>
  );
};

export default ManualSearchStack;

