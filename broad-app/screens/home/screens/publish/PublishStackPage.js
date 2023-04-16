import { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MapPage from './screens/MapPage';
import PublishDetailsPage from './screens/PublishDetailsPage';
import PublishPage from './screens/PublishPage';
import { resetStackStates } from '../../../../util/utils';


const PublishStack = createStackNavigator();

export default function PublishStackPage({navigation}) {
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      resetStackStates(navigation)
      // Do something manually
      // ...
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <PublishStack.Navigator screenOptions={{headerShown: false}}>
      <PublishStack.Screen name="Publish" component={PublishPage} />
      <PublishStack.Screen name="Map" component={MapPage} options={({route}) => ({
        headerShown:true, 
        headerBackTitleVisible: false,
        title:route.params.placeholder,
        headerStyle: {
          backgroundColor: '#2DBDFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },})}/>
      <PublishStack.Screen name="PublishDetails" component={PublishDetailsPage}  options={{
        headerShown:true, 
        headerTitle:'Yolculuk Paylaş', 
        headerBackTitleVisible:false,
        headerStyle: {
          backgroundColor: '#2DBDFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }}}/>
    </PublishStack.Navigator>
  );
}