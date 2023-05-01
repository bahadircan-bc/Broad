import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { api_endpoint, getMyObject } from '../../../../../util/utils';

const InboxItem = function({imageURL, name, lastMessage}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity 
      style={styles.flatlistItem}
      onPress={() => navigation.navigate('Conversation', {name:name, imageURL:imageURL})}>
      <Image source={{uri:imageURL}} style={styles.itemImage}/>
      <View style={styles.itemContainer}>
        <Text style={styles.itemNameText}>{name}</Text>
        <Text style={styles.itemLastMessageText}>{lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function InboxPage({navigation}) {
  const [conversationList, setConversationList] = useState();
  const isFocused = useIsFocused();

  const fetchItems = async function () {
    let response = await fetch(`${api_endpoint}whoami/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        }
      })
      .then(response => {if(response.status == 200) return response.json(); else throw new Error(`HTTP status: ${response.status}`);})
      console.log(`response is : ${JSON.stringify(response)}`);
      const results = response.results[0];

    var storedData = await getMyObject(`${results.user}_chats`);
    var newConversationList = [];
    for (var k in storedData) {
        let response = await fetch(`${api_endpoint}users/${k}`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
            }
          })
          .then(response => {if(response.status == 200) return response.json(); else throw new Error(`HTTP status: ${response.status}`);})
        const results = response.results[0];
        newConversationList.push({
            "pk": 1,
            "imageURL": results.profile.profile_picture,
            "name": results.profile_name,
            "lastMessage": storedData[k][storedData[k].length-1] ? storedData[k][storedData[k].length-1]['text'] : ' ',
        })
    }
    setConversationList(newConversationList);
  }

  useEffect(()=>{
    if(!isFocused) return;
    try{
      fetchItems()
    } catch(error)
    {
      console.log(error)
    }
  }, [isFocused])

  const renderItem = function({item}) {
    return (
      <InboxItem imageURL={item.imageURL} name={item.name} lastMessage={item.lastMessage}/>
    );
  }

  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.foregroundContainer}>
            <Text style={styles.headerText}>Gelen Kutusu</Text>
            <TouchableOpacity style={styles.floatingButton} onPress={()=>{navigation.navigate('ProfileSearch')}}>
              <FontAwesome name='edit'size={20} color={colors.white}/>
            </TouchableOpacity>
          {conversationList?.length > 0
          ? 
          <FlatList 
          style={{width:'100%', flex:1}}
          data={conversationList}
          renderItem={renderItem}/> 
          : 
          <Text>Henüz bir konuşma geçmişin yok gibi görünüyor!</Text>
          }
        </View>
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
    flexDirection:'row', 
    borderWidth:1,
    borderRadius:16,
    paddingLeft:10, 
    margin:3,
    marginHorizontal:10, 
    borderColor:colors.blue, 
    alignItems:'center',
  },
  itemImage:{
    height:50, 
    width:50, 
    borderRadius:50
  },
  itemContainer:{
    flexDirection: 'column', 
    flexGrow:1, 
    padding:10, 
    borderColor:colors.blue,
  },
  itemNameText:{
    fontSize:24, 
    marginLeft:10, 
    color:colors.blue,
  },
  itemLastMessageText:{
    margin: 10, 
    marginLeft:25, 
    color:colors.black
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
    marginTop:15,
  },
  floatingButton:{
    width:50, 
    height:50, 
    borderRadius:50, 
    backgroundColor:colors.blue, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, 
    position:'absolute', 
    zIndex:1, 
    bottom:20, 
    right:20, 
    justifyContent:'center', 
    alignItems:'center',
  },
})