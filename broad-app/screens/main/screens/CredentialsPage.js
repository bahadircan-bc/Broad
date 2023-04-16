import { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Pressable, TextInput, Keyboard, ActivityIndicator } from 'react-native';
import Checkbox from 'expo-checkbox';

import { validateEmail } from '../../../util/utils';

export default function CredentialsPage({navigation, route}) {
    const [isCheckedKVKK, setCheckedKVKK] = useState(false);
    const [isCheckedOther, setCheckedOther] = useState(false);
    const [checkboxCheck, setCheckboxCheck] = useState(false);
    const [showEmailText, setShowEmailText] = useState(false);
    const [email, setEmail] = useState();
    const [name, setName] = useState();
    const [surname, setSurname] = useState();
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const username = route.params.username.username;
    const password = route.params.password.password;

    const CustomCheckbox = function(props){
        return (
            <View style={props.style}>
                <Checkbox style={{marginRight:8}} color={checkboxCheck && !isCheckedKVKK && 'red'} value={props.value} onValueChange={props.onValueChange}/>
                <Text>{props.text}</Text>
            </View>
        )
    }

    const checkboxesAreChecked = function(){
        if (name == '' || name == undefined){
            return false;
          }
          if (surname == '' || surname == undefined){
            return false;
          }
          if (!validateEmail(email)){
            setShowEmailText(true);
            return false;
          }
          else{
            setShowEmailText(false);
          }
          if (!isCheckedKVKK){
            setCheckboxCheck(true);
            return false;
          }
          if (!isCheckedOther){
            setCheckboxCheck(true);
            return false;
          }
          setCheckboxCheck(false);
          return true;
        }
        
        const onSignUpRequest = async function(){
            if(checkboxesAreChecked()){
                setButtonDisabled(true);
                await new Promise(function(resolve) {
                    setTimeout(function() {resolve();}, 3000);
                });
                setButtonDisabled(false);
                console.log('sign up request simulated');
            }
        }

    return (
        <KeyboardAvoidingView style={styles.backgroundContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <SafeAreaView style={styles.safeContainer}>
                <Pressable style={styles.foregroundContainer} onPressIn={Keyboard.dismiss}>
                    <Text style={styles.headerText }>Kaydol</Text>
                    <View style={{width:'75%'}}>
                        <TextInput 
                        style={styles.simpleTextInput} 
                        placeholder='Ad'
                        onChangeText={setName}/>
                        <TextInput 
                        style={styles.simpleTextInput} 
                        placeholder='Soyad'
                        onChangeText={setSurname}/>
                        <TextInput 
                        style={styles.simpleTextInput} 
                        placeholder='E-posta'
                        onChangeText={setEmail}/>
                        {showEmailText && <Text style={{color:'red'}}>Lütfen geçerli bir email adresi girin.</Text>}
                        <View style={{alignItems:'stretch'}}>
                    
                            <CustomCheckbox
                                style={{flexDirection:'row', justifyContent:'center', alignItems:'center', padding:10}}
                                value={isCheckedKVKK}
                                onValueChange={setCheckedKVKK}
                                text={<Text>Kampanyalardan haberdar olabilmem için kişisel verilerimin işlenmesini ve tarafıma elektronik ileti gönderilmesini kabul ediyorum.</Text>}/>
                            
                            
                            <CustomCheckbox
                                style={{flexDirection:'row', justifyContent:'center', alignItems:'center', padding:10}}
                                value={isCheckedOther}
                                onValueChange={setCheckedOther}
                                text={<Text>Kişisel verilerimin işlenmesine yönelik (<Text style={{textDecorationLine:'underline'}}>aydınlatma metnini</Text>) okudum ve onaylıyorum.</Text>}/>

                            <TouchableOpacity 
                                style={styles.simpleTouchableOpacity}
                                disabled={buttonDisabled} 
                                onPress={()=>{
                                        if (checkboxesAreChecked()){
                                            setButtonDisabled(true);
                                            onSignUpRequest();
                                        } 
                                    }}>
                                {buttonDisabled ? <ActivityIndicator/> : <Text style={{textAlign:'center'}}>Kaydol</Text>}
                            </TouchableOpacity>
                            
                            <Text style={{textAlign:'center', fontSize:12}}>Kaydol butonuna tıklayarak <Text style={{textDecorationLine: 'underline'}}>Üyelik Koşulları</Text>nı kabul ediyorum.</Text>
                        </View>
                    </View>
                </Pressable>
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
})