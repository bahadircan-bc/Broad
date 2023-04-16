import { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import EditPasswordPage from './screens/EditPasswordPage';
import EditProfilePage from './screens/EditProfilePage';
import EditUsernamePage from './screens/EditUsernamePage';
import OptionsPage from './screens/OptionsPage';
import ProfilePage from './screens/ProfilePage';
import { resetStackStates } from '../../../../util/utils';

const ProfileStack = createStackNavigator();

export default function ProfileStackPage({navigation}) {
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      resetStackStates(navigation)
      // Do something manually
      // ...
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <ProfileStack.Navigator screenOptions={{headerShown:false}}>
      <ProfileStack.Screen name='Profile' component={ProfilePage}/>
      <ProfileStack.Screen name='Options' component={OptionsPage}/>
      <ProfileStack.Screen name='EditProfile' component={EditProfilePage}/>
      <ProfileStack.Screen name='EditUsername' component={EditUsernamePage}/>
      <ProfileStack.Screen name='EditPassword' component={EditPasswordPage}/>
    </ProfileStack.Navigator>
  );
}