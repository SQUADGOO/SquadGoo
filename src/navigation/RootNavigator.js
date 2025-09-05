import {StyleSheet} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import {screenNames} from './screenNames';
import {useSelector} from 'react-redux';
import MainNavigator from './MainNavigator';
import TabNavigator from './TabNavigator';
import DrawerNavigator from './DrawerNavigator';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const token = useSelector(state => state.auth.token);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
     {token ?  <Stack.Screen
        name={'DrawerNavigator'}
        component={DrawerNavigator}
      />
      :
      <Stack.Screen
        name={screenNames.AUTH_NAVIGATION}
        component={AuthNavigator}
      />}
      {/* {token ?
                <Stack.Screen name={screenNames.MAIN_NAVIGATION} component={MainNavigator} />
                :
                <Stack.Screen name={screenNames.AUTH_NAVIGATION} component={AuthNavigator} />
            } */}
    </Stack.Navigator>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({});
