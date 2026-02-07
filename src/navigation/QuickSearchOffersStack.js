import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as ui from '@/screens';
import { screenNames } from './screenNames';

const Stack = createStackNavigator();

/**
 * Recruiter Quick Search Offers flow:
 * - Offers list (pending/accepted/declined/expired)
 * - Candidate Profile (push)
 *
 * This ensures back navigation works correctly (profile -> offers).
 */
const QuickSearchOffersStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={screenNames.QUICK_SEARCH_ACTIVE_OFFERS_RECRUITER}
        component={ui.QuickSearchActiveOffersRecruiter}
      />
      <Stack.Screen
        name={screenNames.QUICK_SEARCH_CANDIDATE_PROFILE}
        component={ui.QuickSearchCandidateProfile}
      />
    </Stack.Navigator>
  );
};

export default QuickSearchOffersStack;

