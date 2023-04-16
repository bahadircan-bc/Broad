import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Pressable, TextInput, Keyboard, ActivityIndicator, Alert } from 'react-native';

import { validatePassword } from '../../../util/utils';

export default function SetNewPasswordPage({navigation, route}) {
    const [verificationCode, setVerificationCode] = useState();
    const [password, setPassword] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [showPasswordText, setShowPasswordText] = useState(false);
    const [showVerificationText, setShowVerificationText] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(function(){
        console.log(route.params);
        setVerificationCode(route.params.verificationCode);
    }, [route.params.verificationCode])

    const checkInputs = function(){

        if (!validatePassword(password)){
        setShowPasswordText(true);
        return false;
        }
        setShowPasswordText(false);

        if (verificationCode != inputCode){
        setShowVerificationText(true);
        return false;
        }
        setShowVerificationText(false);
        return true;
    }
    const onVerificationRequest = async function(){
        if (checkInputs()){
            setButtonDisabled(true);
            await new Promise(function(resolve) {
                setTimeout(function() {resolve();}, 3000);
            });
            setButtonDisabled(false);
            Alert.alert('', 'Şifreniz başarı ile değiştirilmiştir.', [
                {
                    onPress: () => {navigation.navigate('Welcome')},
                },
            ]);
        }
    }

    return (
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.backgroundContainer}>
                <SafeAreaView style={styles.safeContainer}>
                    <View style={styles.foregroundContainer}>
                        <Text style={styles.headerText}>E-Posta Adresini Doğrula</Text>
                        <View style={{width:'75%'}}>
                            <TextInput
                            style={styles.simpleTextInput} 
                            secureTextEntry={true}
                            placeholder='Yeni Şifre'
                            onChangeText={setPassword}/>
                            {showPasswordText && <Text style={styles.redText}>Şifreniz en az 8 haneden oluşmalı, bir büyük harf, bir küçük harf, bir sayı ve özel karakter içermelidir.</Text>}
                            <TextInput 
                            style={styles.simpleTextInput} 
                            placeholder='Doğrulama kodu'
                            onChangeText={setInputCode}/>
                            {showVerificationText && <Text style={styles.redText}>Girdiğiniz doğrulama kodu hatalıdır.</Text>}
                            <TouchableOpacity 
                            style={styles.simpleTouchableOpacity}
                            disabled={buttonDisabled}
                            onPress={onVerificationRequest}>
                                {buttonDisabled ? <ActivityIndicator/> : <Text style={{textAlign:'center'}}>Doğrula</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        </KeyboardAvoidingView>
    )
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