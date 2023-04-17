import { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SearchPage from './screens/SearchPage'
import MapPage from './screens/MapPage'
import SearchItemPage from './screens/SearchItemPage'
import FilterPage from './screens/FilterPage'
import { resetStackStates } from '../../../../util/utils';


const SearchStack = createStackNavigator();

export default function SearchStackPage({navigation}) {
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      resetStackStates(navigation)
      // Do something manually
      // ...
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SearchStack.Navigator screenOptions={{headerShown: false}}>
      <SearchStack.Screen name='Search' component={SearchPage}/>
      <SearchStack.Screen name='Map' component={MapPage}/>
      <SearchStack.Screen name='SearchItem' component={SearchItemPage} options={{
        headerShown:true, 
        headerTitle:'Yolculuk Detayları', 
        headerBackTitleVisible:false,
        headerStyle: {
          backgroundColor: '#2DBDFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }}}/>
      <SearchStack.Screen name='Filter' component={FilterPage} options={{
        headerShown:true, 
        headerTitle:'Filtrele', 
        headerBackTitleVisible:false,
        headerStyle: {
          backgroundColor: '#2DBDFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }}}/>
    </SearchStack.Navigator>
  );
};
