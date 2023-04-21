import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, Pressable, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { api_endpoint, csrftoken, renewCSRFToken, setCsrfToken } from '../../../../../util/utils';
import * as ImagePicker from 'expo-image-picker'

export default function EditProfilePage({navigation, route}) {
  const [pk, setPk] = useState();
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState();
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [email, setEmail] = useState();
  const [editingName, setEditingName] = useState(false);
  const textInputRef = useRef();

  const fetchItems = async function(){
    let response = await fetch(`${api_endpoint}whoami/`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => {if(response.status == 200) return response.json(); else throw new Error(`HTTP status: ${response.status}`);})
    console.log(`response is : ${JSON.stringify(response)}`);
    const results = response.results[0];
    setPk(results.pk);
    setUsername(results.profile_name);
    setName(results.name);
    setSurname(results.surname);
    setEmail(results.email);
    setProfilePicture(results.profile_picture);
  }

  useEffect(()=>{
    try {
      fetchItems()
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(()=>
  {
    if (editingName){
      textInputRef.current.focus()
    }
  }, [editingName])

  const onSaveChanges = async function() {
    console.log(JSON.stringify({
      'profile': {
        'name': name,
        'surname': surname,
        'profile_name': username
      },
      'user': {
        'email': email
      }}))
    await renewCSRFToken();
    let response = await fetch(`${api_endpoint}profiles/update/${pk}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({
        'profile': {
          'name': name,
          'surname': surname,
          'profile_name': username
        },
        'user': {
          'email': email
        }
      })
    })
    .then(response => {if(response.status==200) return response.json(); else throw new Error(`HTTP status ${response.status}`);});
    console.log(response);
    navigation.popToTop();
  }

  const onRequestProfilePictureChange = async function (result) {
    await renewCSRFToken();
    const formData = new FormData();
    formData.append('profile_picture', {
      uri: result.assets[0].uri,
      type: result.assets[0].type,
      name: `${username}_pp.jpg`,
    })
    await fetch(`${api_endpoint}profiles/update_profile_picture/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrftoken,
      },
      body: formData,
    })
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
      await onRequestProfilePictureChange(result);
    }
  };
  
  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.safeContainer}>
        <Pressable style={styles.foregroundContainer} onPress={() => Keyboard.dismiss()}>
          <View style={styles.pageHeaderContainer}>
            <View style={{justifyContent:'center'}}>
              <Image source={{uri:profilePicture}} style={styles.profileImage}/>
              <FontAwesome name='edit' size={50} color={'rgba(255, 255, 255, 0.5)'} style={{position:'absolute', marginLeft:18}} onPress={async()=>{await pickImage()}}/>
            </View>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
              <TextInput ref={textInputRef} style={styles.headerText} editable={editingName} onChangeText={setUsername} onSubmitEditing={()=>{setEditingName(false);}} onBlur={()=>{setEditingName(false)}}>{username}</TextInput> 
              <FontAwesome name='edit' size={25} onPress={()=>{setEditingName(true);}}/>
            </View>
          </View>
          <View style={{flex:8, width:'100%', backgroundColor: colors.blue, padding:50, gap:30}}>
            <View style={styles.formContainer}>
              <Text style={styles.formText}>Isim:</Text>
              <TextInput style={styles.formInput} onChangeText={setName} placeholder={name}></TextInput>
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.formText}>Soyisim:</Text>
              <TextInput style={styles.formInput} onChangeText={setSurname} placeholder={surname}></TextInput>
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.formText}>E-posta:</Text>
              <TextInput style={styles.formInput} onChangeText={setEmail} placeholder={email}></TextInput>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={onSaveChanges}><Text>Onayla</Text></TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={navigation.popToTop}><Text>Vazgeç</Text></TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </SafeAreaView>
    </View>
  );
};

const colors = {
  blue: '#2DBDFF',
  ligtherblue: '#2497CC',
  white: '#fff',
  black: '#000',
  deepblue: '#004369',
}

const styles = StyleSheet.create({
  flatlistItem:{
    flexDirection: 'row', 
    padding:10, 
    margin:10,
    marginBottom:0,
    //marginLeft:15, 
    //marginRight:15, 
    //marginTop:15, 
    backgroundColor:colors.ligtherblue,
    borderRadius:15,
  },
  itemImage:{
    height: 50, 
    width: 50, 
    borderRadius: 50, 
    borderColor: colors.white, 
    borderWidth: 1,
  },
  itemContainer:{
    flexDirection: 'column',
  },
  itemNameText:{
    fontSize:20,
    fontWeight: 'bold',
    marginLeft:10,
    color:colors.white,
  },
  itemCommentText:{
    margin: 5,
    marginLeft:25,
    color:colors.white,
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
  pageHeaderContainer:{
    flex:5,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
  },
  profileImage:{
    height: 75,
    width: 75,
    borderRadius:75,
  },
  headerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2DBDFF',
    textAlign:'center',
    marginTop:15,
  },
  pageHeaderStatTitleText:{
    fontSize:16, 
    color:colors.ligtherblue,
  },
  pageHeaderStatText:{
    color:colors.ligtherblue,
  },
  pageHeaderStatsContainer:{
    flexDirection: 'row',
    justifyContent:'space-around',
    width:'100%',
    marginTop:15,
  },
  formContainer: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'center',
  },
  formText: {
    color:colors.white,
    fontSize: 16,
    flex:1,
  },
  formInput: {
    backgroundColor: colors.white,
    flex:2,
    padding: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection:'row',
    justifyContent:'space-around'
  },
  button:{
    backgroundColor:colors.white,
    borderRadius: 15,
    margin: 50,
    padding: 15,
    paddingHorizontal: 30,
  },
})