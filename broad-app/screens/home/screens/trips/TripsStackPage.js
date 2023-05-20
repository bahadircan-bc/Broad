import { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import TripDetailsPage from './screens/TripDetailsPage';
import TripsPage from './screens/TripsPage';
import { resetStackStates } from '../../../../util/utils';
import EditTripPage from './screens/EditTripPage';
import MapPage from './screens/MapPage';
import EndTripPage from './screens/EndTripPage';


const TripsStack = createStackNavigator();

export default function TripsStackPage({navigation}) {
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      resetStackStates(navigation)
      // Do something manually
      // ...
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <TripsStack.Navigator screenOptions={{headerShown: false}}>
      <TripsStack.Screen name='Trips' component={TripsPage} />
      <TripsStack.Screen name='Map' component={MapPage} />
      <TripsStack.Screen name='TripDetails' component={TripDetailsPage} options={{
        headerShown:true, 
        headerTitle:'Yolculuk Bilgileri', 
        headerBackTitleVisible:false,
        headerStyle: {
          backgroundColor: '#2DBDFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }}}/>
        <TripsStack.Screen name='EditTrip' component={EditTripPage} options={{
        headerShown:true, 
        headerTitle:'Yolculuğu düzenle', 
        headerBackTitleVisible:false,
        headerStyle: {
          backgroundColor: '#2DBDFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }}}/>
        <TripsStack.Screen name='EndTrip' component={EndTripPage} options={{
        headerShown:true, 
        headerTitle:'Yolculuğu bitir', 
        headerBackTitleVisible:false,
        headerStyle: {
          backgroundColor: '#2DBDFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }}}/>
    </TripsStack.Navigator>
  );
}

