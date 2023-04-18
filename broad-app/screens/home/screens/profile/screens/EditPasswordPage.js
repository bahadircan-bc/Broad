import { Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-gesture-handler'
import { Divider } from 'react-native-paper'
import { api_endpoint, csrftoken, renewCSRFToken } from '../../../../../util/utils'

/* 
body: {
  old_password: '',
  new_password: '',
  confirm_password: ''
} 
*/



export default function EditPasswordPage({navigation}) {
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [newPassword2, setNewPassword2] = useState();

  const onPasswordChange = async function (){
    await renewCSRFToken();
    await fetch(`${api_endpoint}change_password/`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: newPassword2
      })
    })
    .then(response => {if(response.status==200) return response.json(); else throw new Error(`HTTP status ${response.status}`);});
  }

  return (
    <KeyboardAvoidingView style={styles.backgroundContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <SafeAreaView style={styles.safeContainer}>
        <Pressable style={styles.foregroundContainer} onPress={()=>Keyboard.dismiss()}>
          <Text style={styles.headerText}>Şifre Değiştir</Text>
          <View style={styles.inputContainer}>
            <View style={styles.formContainer}> 
              <Text>Eski Şifre: </Text>
              <TextInput style={styles.simpleTextInput} onChangeText={setOldPassword} secureTextEntry={true}/>
            </View>
            <View style={styles.formContainer}> 
              <Text>Yeni Şifre: </Text>
              <TextInput style={styles.simpleTextInput} onChangeText={setNewPassword} secureTextEntry={true}/>
            </View>
            <View style={styles.formContainer}> 
              <Text>Yeni Şifre (tekrar): </Text>
              <TextInput style={styles.simpleTextInput} onChangeText={setNewPassword2} secureTextEntry={true}/>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={onPasswordChange}><Text style={{color: colors.white}}>Onayla</Text></TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={navigation.popToTop}><Text style={{color: colors.white}}>Vazgeç</Text></TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const colors = {
  blue: '#2DBDFF',
  ligtherblue: '#2497CC',
  white: '#fff',
  black: '#000',
  deepblue: '#004369',
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
      alignItems:'center',
      //marginBottom:71,
      //added bottom margin for the bottom nav bar
      //might change in the future
  },
  headerText: {
      fontSize: 30,
      color: '#2DBDFF',
      textAlign:'left',
      margin:25,
      alignSelf:'flex-start',
  },
  inputContainer:{
    alignItems:'stretch',
    width:'100%',
    padding:25,
  },
  formContainer:{
    justifyContent:'center',
    alignItems:'stretch',
  },
  simpleTextInput: {
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  buttonContainer: {
    flexDirection:'row',
    justifyContent:'space-around'
  },
  button:{
    backgroundColor:colors.blue,
    borderRadius: 15,
    margin: 50,
    padding: 15,
    paddingHorizontal: 30,
  },
})