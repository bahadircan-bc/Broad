import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const HomeStack = createMaterialBottomTabNavigator();

import SearchStackPage from './screens/search/SearchStackPage';
import PublishStackPage from './screens/publish/PublishStackPage';
import TripsStackPage from './screens/trips/TripsStackPage';
import InboxStackPage from './screens/inbox/InboxStackPage';
import ProfileStackPage from './screens/profile/ProfileStackPage';


export default function HomePage({navigation}) {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}} keyboardHidesNavigationBar={false} activeColor={colors.white} inactiveColor={colors.white} barStyle={{backgroundColor:colors.blue}}>
      <HomeStack.Screen name='SearchStack' component={SearchStackPage} options={{tabBarLabel: 'Ara', tabBarIcon: ({focused, color, size})=>{return (<FontAwesome name='search' size={size} color={color}/>)}}}/>
      <HomeStack.Screen name='PublishStack' component={PublishStackPage} options={{tabBarLabel: 'Paylaş', tabBarIcon: ({focused, color, size})=>{return (<FontAwesome name='road' size={size} color={color}/>)}}}/>
      <HomeStack.Screen name='TripsStack' component={TripsStackPage} options={{tabBarLabel: 'Yolculuklarım', tabBarIcon: ({focused, color, size})=>{return (<FontAwesome name='history' size={size} color={color}/>)}}}/>
      <HomeStack.Screen name='InboxStack' component={InboxStackPage} options={{tabBarLabel: 'Gelen Kutusu', tabBarIcon: ({focused, color, size})=>{return (<FontAwesome name='inbox' size={size} color={color}/>)}}}/>
      <HomeStack.Screen name='ProfileStack' component={ProfileStackPage} options={{tabBarLabel: 'Profil', tabBarIcon: ({focused, color, size})=>{return (<FontAwesome name='user' size={size} color={color}/>)}}}/>
    </HomeStack.Navigator>
  );
};

const colors = {
  blue: '#2DBDFF',
  ligtherblue: '#2497CC',
  white: '#fff',
  black: '#000',
  deepblue: '#004369',
}