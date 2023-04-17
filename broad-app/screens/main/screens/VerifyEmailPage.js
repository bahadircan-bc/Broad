import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Pressable, TextInput, Keyboard, ActivityIndicator } from 'react-native';
import { api_endpoint, csrftoken } from '../../../util/utils';

export default function VerifyEmailPage({navigation, route}){
    // const [username, setUsername] = useState();
    // const [password, setPassword] = useState();
    // const [verificationCode, setVerificationCode] = useState();
    const username = route.params.username;
    const password = route.params.password;
    const verificationCode = route.params.verificationCode;
    const [inputCode, setInputCode] = useState('');
    const [buttonDisabled, setButtonDisabled]= useState(false);

    const onSignInEvent = async function(){
      let response = ''
      if (checkInputs()){
        setButtonDisabled(true);
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
      }
      else{
        setShowLoginError(true);
      }
    }

    const onVerificationRequest = async function(){
      let response = ' ';
      console.log(`${verificationCode}, ${inputCode}`)
      if (verificationCode == inputCode){
          setButtonDisabled(true);
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
      }
    }

    // useEffect(function(){
    //     setUsername(route.params.username);
    //     setPassword(route.params.password);
    //     setVerificationCode(route.params.verificationCode);
    // }, [])

    return (
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.backgroundContainer}>
          <SafeAreaView style={styles.safeContainer}>
            <View style={styles.foregroundContainer}>
              <Text style={styles.headerText}>E-Posta Adresini Doğrula</Text>
              <View style={{width:'75%'}}>
                  <TextInput 
                    style={styles.simpleTextInput} 
                    placeholder='Doğrulama kodu'
                    onChangeText={setInputCode}/>
                  <TouchableOpacity 
                    style={styles.simpleTouchableOpacity}
                    onPress={onVerificationRequest}
                    disabled={buttonDisabled}>
                    {buttonDisabled ? <ActivityIndicator/> : <Text 
                      style={{textAlign:'center'}}>Doğrula</Text>}
                  </TouchableOpacity>
                </View>
            </View>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    );
  };

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
    logoText: {
        fontSize: 96,
        color: '#2DBDFF',
        textAlign: 'center',
    },
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
    headerText: {
        fontSize: 48,
        color: '#2DBDFF',
        textAlign:'center',
        margin: 50,
    },
    simpleTouchableOpacity: {
        borderWidth: 1,
        borderRadius: 10,
        margin: 15,
        padding: 15,
        width:'50%', 
        alignSelf:'center',
    },
    simpleTextInput: {
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        padding: 15,
    },
    popupMenu: {
        optionsWrapper:{borderRadius:15},
        optionWrapper:{padding:10}, 
        optionText:{textAlign:'center', fontSize:18}, 
        optionsContainer:{width:'50%', borderRadius:15},
    },
})