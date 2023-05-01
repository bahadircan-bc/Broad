import { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Pressable, TextInput, Keyboard } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { api_endpoint, csrftoken, getMyObject, renewCSRFToken, setObjectValue } from '../../../util/utils';



export default function SignInPage({navigation}) {
    const [passwordTextInput, setPasswordTextInput] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [showLoginError, setShowLoginError] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const checkInputs = function(){
      if(username == '' || username == undefined || password == '' || password == undefined){
            setShowLoginError(true);
            return false;
      } 
      setShowLoginError(false);
      return true;
    }
    const onSignInEvent = async function(){
      let response = ''
      if (checkInputs()){
        setButtonDisabled(true);
        await renewCSRFToken();
        response = await fetch(`${api_endpoint}login/`, {
          method: 'POST',
          headers: {
            'X-CSRFToken': csrftoken, 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        })
      }
      setButtonDisabled(false);
      if(response.status == 200){
        navigation.replace('Home');
        getMyObject(`${username}_chats`).then((data) =>{
            if(data == null){
              console.log('no chats in storage creating one');
              setObjectValue(`${username}_chats`, {});
            }
            else{
              console.log('chats found in storage');
              console.log(data);
            }
        })
      }
      else{
        setShowLoginError(true);
      }
    }
  
    return (
      <KeyboardAvoidingView style={styles.backgroundContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <SafeAreaView style={styles.safeContainer}>
            <Pressable style={styles.foregroundContainer} onPressIn={Keyboard.dismiss}>
              <Text style={styles.headerText}>Giriş Yap</Text>
              <View style={{width:'75%'}}>
                <TextInput 
                  style={styles.simpleTextInput} 
                  placeholder='Kullanıcı Adı' 
                  onChangeText={setUsername}
                  blurOnSubmit={false}
                  onSubmitEditing={()=>passwordTextInput.focus()}/>
                <TextInput 
                  style={styles.simpleTextInput} 
                  placeholder='Şifre'
                  ref={setPasswordTextInput}
                  secureTextEntry={true}
                  onChangeText={setPassword}
                  onSubmitEditing={onSignInEvent}/>
                {showLoginError && <Text style={{color:'red'}}>Kullanıcı adı veya şifre hatalı</Text>}
                <TouchableOpacity 
                  style={styles.simpleTouchableOpacity} 
                  disabled={buttonDisabled}
                  onPress={onSignInEvent}>
                  {buttonDisabled ? <ActivityIndicator/> : <Text style={{textAlign:'center'}}>Giriş Yap</Text>}
                </TouchableOpacity>
                <Text 
                  style={{textAlign: 'center', textDecorationLine: 'underline', margin:10}} 
                  onPress={() => {navigation.navigate('SignUp')}}>
                    Hesabın yok mu?</Text>
                <Text 
                  style={{textAlign: 'center', textDecorationLine: 'underline'}} 
                  onPress={() => {navigation.navigate('ForgotPassword')}}>
                    Şifreni mi unuttun?</Text>
              </View>
            </Pressable>
          </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  const styles = StyleSheet.create({
    backgroundContainer: {
        flex:1,
        backgroundColor: '#FFF',
    },
    safeContainer: {
        flex: 1,
        backgroundColor: '#2DBDFF',
    },
    foregroundContainer: {
        backgroundColor: '#FFF', 
        flexGrow:1,
        justifyContent:'space-around',
        alignItems:'center',
        //marginBottom:71,
        //added bottom margin for the bottom nav bar
        //might change in the future
    },
    logo: {
        fontSize: 96,
        color: '#2DBDFF',
        textAlign: 'center',
    },
    buttonContainer:{
        width:'75%'
    },
    simpleTouchableOpacity: {
        borderWidth: 1,
        borderRadius: 10,
        margin: 15,
        padding: 15,
        width:'50%', 
        alignSelf:'center', 
        justifyContent:'center',
    },
    headerText: {
        fontSize: 48,
        color: '#2DBDFF',
        textAlign:'center',
        margin:50,
    },
    simpleTextInput: {
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        padding: 15,
    },
})