import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import * as ui from '@/screens';
import {screenNames} from './screenNames';

const Stack = createStackNavigator();

const QuickSearchStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* Step 1: Job Requirements */}
      <Stack.Screen
        name={screenNames.QUICK_SEARCH_STEPONE}
        component={ui.StepOne}
      />

      {/* Step 2: Work Location */}
      <Stack.Screen
        name={screenNames.QUICK_SEARCH_STEPTWO}
        component={ui.StepTwoQuickSearch}
      />

      {/* Step 3: Salary & Payment */}
      <Stack.Screen
        name={screenNames.QUICK_SEARCH_STEPTHREE}
        component={ui.StepThreeQuickSearch}
      />

      {/* Step 4: Additional Details */}
      <Stack.Screen
        name={screenNames.QUICK_SEARCH_STEPFOUR}
        component={ui.StepFourQuickSearch}
      />

      {/* Preview */}
      <Stack.Screen
        name={screenNames.QUICK_SEARCH_PREVIEW}
        component={ui.QuickSearchPreview}
      />

      {/* Match List */}
      <Stack.Screen
        name={screenNames.QUICK_SEARCH_MATCH_LIST}
        component={ui.QuickMatchList}
      />

      {/* Candidate Profile */}
      <Stack.Screen
        name={screenNames.QUICK_SEARCH_CANDIDATE_PROFILE}
        component={ui.QuickCandidateProfile}
      />
    </Stack.Navigator>
  );
};

export default QuickSearchStack;


