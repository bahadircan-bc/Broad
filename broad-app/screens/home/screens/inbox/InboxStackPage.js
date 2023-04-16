import { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ConversationPage from './screens/ConversationPage';
import InboxPage from './screens/InboxPage';
import ProfileSearchPage from './screens/ProfileSearchPage';
import VisitPage from './screens/VisitPage';
import { resetStackStates } from '../../../../util/utils';


const InboxStack = createStackNavigator();

export default function InboxStackPage({navigation}) {
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      resetStackStates(navigation)
      // Do something manually
      // ...
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <InboxStack.Navigator screenOptions={{headerShown: false}}>
      <InboxStack.Screen name='Inbox' component={InboxPage}/>
      <InboxStack.Screen name='Conversation' component={ConversationPage}/>
      <InboxStack.Screen name='Visit' component={VisitPage}/>
      <InboxStack.Screen name='ProfileSearch' component={ProfileSearchPage} options={{
        headerShown:true, 
        headerTitle:'Kullanıcı Ara', 
        headerBackTitleVisible:false,
        headerStyle: {
          backgroundColor: '#2DBDFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }}}/>
    </InboxStack.Navigator>
  );
}