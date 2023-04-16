import { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Pressable, TextInput, Keyboard, ActivityIndicator } from 'react-native';

import { validateEmail } from '../../../util/utils';

export default function ForgotPasswordPage({navigation}) {
    const [email, setEmail] = useState();

    const [showEmailText, setShowEmailText] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const checkInputs = function(){
        if(!validateEmail(email)){
            setShowEmailText(true);
            return false;
        }
        setShowEmailText(false);
        return true;
    }
    
    const onForgotPasswordEvent = async function (){
        if (checkInputs()){
            setButtonDisabled(true);
            await new Promise(function(resolve) {
                setTimeout(function() {resolve();}, 3000);
            });
            setButtonDisabled(false);
            navigation.navigate('SetNewPassword', {verificationCode: '123456', email: email})
        }
    }

    return (
        <KeyboardAvoidingView style={styles.backgroundContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <SafeAreaView style={styles.safeContainer}>
            <View style={styles.foregroundContainer}>
              <Text style={styles.headerText}>Şifreni mi unuttun?</Text>
              <View style={{width:'75%'}}>
                <TextInput 
                  style={styles.simpleTextInput} 
                  placeholder='Email'
                  onChangeText={setEmail}
                  onSubmitEditing={onForgotPasswordEvent}/>
                  {showEmailText && <Text style={styles.redText}>Lütfen geçerli bir email adresi girin.</Text>}
                <TouchableOpacity 
                  style={styles.simpleTouchableOpacity}
                  disabled={buttonDisabled}
                  onPress={onForgotPasswordEvent}>
                  {buttonDisabled ? <ActivityIndicator/> : <Text style={{textAlign:'center'}}>İleri</Text> }
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
      </KeyboardAvoidingView>
    );
  };

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
    checkbox: {
        flexDirection:'row', 
        justifyContent:'center', 
        alignItems:'center', 
        padding:10,
    },
    redText: {
        color:'red'
    }
})