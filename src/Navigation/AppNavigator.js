import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StackNavigator from './StackNavigator';
import SavedReportsScreen from '../Screens/SavedReportsScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name= "Add a Report" component={StackNavigator} options={{headerShown:false}}/>
        <Tab.Screen name="Saved Reports" component={SavedReportsScreen} options={{headerShown:false}}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;