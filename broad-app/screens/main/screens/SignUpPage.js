import { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Pressable, TextInput, Keyboard } from 'react-native';

import { validatePassword } from '../../../util/utils.js'

export default function SignUpPage({navigation}) {
    const [passwordTextInput, setPasswordTextInput] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [showPasswordText, setShowPasswordText] = useState(false);
    const [showUsernameText, setShowUsernameText] = useState(false);

    const checkInputs = function(){
      if(username == '' || username == undefined){
        setShowUsernameText(true);
        return false;
      }
      else{setShowUsernameText(false);}
      if(!validatePassword(password)){
        setShowPasswordText(true);
        return false;
      }
      setShowPasswordText(false);
      return true; 
    }
    const onSignUpEvent = function(){
        if (checkInputs()){
          // no need to await a function since it does not make request to the backend
          navigation.navigate({name:'Credentials', params:{username: {username}, password:{password}}});
        }
    }

    return (
      <KeyboardAvoidingView style={styles.backgroundContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <SafeAreaView style={styles.safeContainer}>
            <Pressable style={styles.foregroundContainer} onPressIn={Keyboard.dismiss}>
              <Text style={styles.headerText}>Kaydol</Text>
              <View style={{width:'75%'}}>
                <TextInput 
                  style={styles.simpleTextInput} 
                  placeholder='Kullanıcı Adı'
                  onChangeText={setUsername}
                  blurOnSubmit={false}
                  onSubmitEditing={()=>passwordTextInput.focus()}/>
                {showUsernameText && <Text style={{color:'red'}}>Kullanıcı adı girin.</Text>}
                <TextInput 
                style={styles.simpleTextInput} 
                placeholder='Şifre'
                ref={setPasswordTextInput}
                onChangeText={setPassword}
                secureTextEntry={true}
                onSubmitEditing={onSignUpEvent}/>
                {showPasswordText && <Text style={{color:'red'}}>Şifreniz en az 8 haneden oluşmalı, bir büyük harf, bir küçük harf, bir sayı ve özel karakter içermelidir.</Text>}
                <TouchableOpacity 
                style={styles.simpleTouchableOpacity}
                onPress={onSignUpEvent}>
                  <Text style={{textAlign:'center'}}>İleri</Text>
                </TouchableOpacity>
                <Text style={{textAlign: 'center', textDecorationLine: 'underline', margin:10}} onPress={() => {navigation.navigate('SignIn')}}>Zaten üye misin?</Text>
              </View>
            </Pressable>
          </SafeAreaView>
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