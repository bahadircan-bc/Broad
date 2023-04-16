import { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import TripDetailsPage from './screens/TripDetailsPage';
import TripsPage from './screens/TripsPage';
import { resetStackStates } from '../../../../util/utils';


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
    </TripsStack.Navigator>
  );
}
