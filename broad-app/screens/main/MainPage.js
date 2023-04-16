import { createStackNavigator } from '@react-navigation/stack';

import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import WelcomePage from './screens/WelcomePage';
import SignInPage from './screens/SignInPage';
import SignUpPage from './screens/SignUpPage';
import CredentialsPage from './screens/CredentialsPage';
import ForgotPasswordPage from './screens/ForgotPasswordPage';
import SetNewPasswordPage from './screens/SetNewPasswordPage';
import VerifyEmailPage from './screens/VerifyEmailPage';

const MainStack = createStackNavigator();

export default function MainPage({navigation}) {
    return (
        <MainStack.Navigator screenOptions={{headerShown: false}}>
            <MainStack.Screen name='Welcome' component={WelcomePage}/>
            <MainStack.Screen name='SignUp' component={SignUpPage}/>
            <MainStack.Screen name='SignIn' component={SignInPage}/>
            <MainStack.Screen name='Credentials' component={CredentialsPage}/>
            <MainStack.Screen name='ForgotPassword' component={ForgotPasswordPage}/>
            <MainStack.Screen name='SetNewPassword' component={SetNewPasswordPage}/>
            <MainStack.Screen name='VerifyEmail' component={VerifyEmailPage}/>
        </MainStack.Navigator>
    );
}