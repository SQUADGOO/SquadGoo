import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import * as ui from '@/screens';
import {screenNames} from './screenNames';
import DrawerNavigator from './DrawerNavigator';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={screenNames.DRAWER_NAVIGATION}
        component={DrawerNavigator}
      />


    

     
    </Stack.Navigator>
  );
};

export default MainNavigator;
