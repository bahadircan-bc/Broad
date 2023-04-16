import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';

import MainPage from './screens/main/MainPage'
import HomePage from './screens/home/HomePage'
import { api_endpoint, setCsrfToken } from './util/utils';

const RootStack = createStackNavigator();

export default function App() {

  fetch(`${api_endpoint}csrftoken/`)
  .then(response => response.json())
  .then(data => {
    setCsrfToken(data.csrfToken);
  })

  return (
    <MenuProvider>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{headerShown: false}}>
          <RootStack.Screen name="Main" component={MainPage} />
          <RootStack.Screen name="Home" component={HomePage} />
        </RootStack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}