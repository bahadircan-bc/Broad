import { StyleSheet, Text, View, KeyboardAvoidingView, SafeAreaView, Pressable, Keyboard, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

const UserItem = ({name, imageURL}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.flatlistItem} onPress={()=>navigation.navigate('Visit')}>
      <Image source={{uri:imageURL}} style={styles.itemImage}/>
      <View style={styles.itemContainer}>
        <Text style={styles.itemNameText}>{name}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default function ProfileSearchPage({navigation, route}) {
  const [userList, setUserList] = useState([]);
  
  const fetchItems = function() {

    setUserList([
      {
        pk: '1',
        name: 'First Item',
        imageURL: 'https://placeimg.com/640/480/any'
      },
      {
        pk: '2',
        name: 'Second Item',
        imageURL: 'https://placeimg.com/640/480/any'
      },
      {
        pk: '3',
        name: 'Third Item',
        imageURL: 'https://placeimg.com/640/480/any'
      },
    ])
  }

  useEffect(()=>{
    try{
      fetchItems()
  } catch(error)
  {
    console.log(error)
  }
}, [])

const renderItem = function({ item }) {
  return (
    <UserItem name={item.name} imageURL={item.imageURL}/>
)};

  return (
    <KeyboardAvoidingView style={styles.backgroundContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <SafeAreaView style={styles.safeContainer}>
        <Pressable style={styles.foregroundContainer} onPress={()=>Keyboard.dismiss()}>
          <TextInput style={{backgroundColor:'#EEEEEE', margin:10, borderRadius:10, padding:10}} placeholder={'Kullanıcı adı...'}/>
          <FlatList
          style={{padding:15, width:'100%'}}
          data={userList}
          renderItem={renderItem}/>
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
    backgroundColor: '#FFFFFF',
  },
  safeContainer: {
    flex: 1,
    backgroundColor: '#2DBDFF',
  },
  foregroundContainer: {
    backgroundColor: '#FFFFFF', 
    flex:1,
    //marginBottom:71,
    //added bottom margin for the bottom nav bar
    //might change in the future
  },
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
})