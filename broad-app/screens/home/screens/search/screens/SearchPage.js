import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { api_endpoint } from '../../../../../util/utils';

const SearchItem = function({pk, name, departure, destination, departureDate, fee}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity 
      style={styles.flatlistItem}
      onPress={()=>navigation.navigate({name: 'SearchItem', params:{pk:pk, name:name, departure:departure, destination:destination, departureDate:departureDate, fee:fee}})}>
      <FontAwesome name='car' color={colors.deepblue} size={20}/>
      <View style={{flexDirection: 'column', flexGrow:1, padding:10}}>
        <Text style={styles.itemUsernameText}>{name}</Text>
        <Text style={styles.deepblueText}>{departure} {'>'} {destination}</Text>
        <Text style={styles.itemDateText}>{departureDate}</Text>
      </View>
        <Text style={styles.itemFeeText}>{fee}₺</Text>
    </TouchableOpacity>
  );
};

export default function SearchPage({navigation}) {
  const [tripList, setTripList] = useState();
  
  const fetchItems = async function() {
    let response = await fetch(`${api_endpoint}trips/`, {
      method: 'GET',
      headers: { 
        "Content-Type": "application/json",
    },
    })
    .then((response) => { if(response.status == 200) return response.json(); else throw new Error('HTTP status ' + response.status);});
    console.log(response.results);
    setTripList(response.results);
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
      <SearchItem pk={item.pk} name={item.driver.profile_name} departure={item.departure} destination={item.destination} departureDate={item.departure_date} fee={item.fee}/>
  )};

  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.safeContainer}>
      <View style={styles.foregroundContainer}>
          <Text style={styles.headerText}>Yolculuklar</Text>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <TextInput style={styles.simpleTextInput} placeholder='Yolculuk Ara...'/>
            <TouchableOpacity 
              style={styles.simpleTouchableOpacity}
              onPress={()=>navigation.navigate('Filter')}>
              <FontAwesome name='tasks' size={20} color={colors.deepblue}/> 
              <Text style={{fontSize: 10}}>Filtrele</Text>
            </TouchableOpacity>
          </View>
          <FlatList
          style={{padding:15, width:'100%'}}
          data={tripList}
          renderItem={renderItem}/>
        </View>
      </SafeAreaView>
    </View>
  )
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
    borderColor:colors.blue, 
    alignItems:'center',
  },
  itemUsernameText:{
    fontSize:24, 
    color:'#2dabff'
  },
  itemDateText:{
    borderRadius:15,
    overflow:'hidden', 
    backgroundColor:colors.blue, 
    color:colors.white, 
    borderWidth:1, 
    borderColor:colors.blue, 
    alignSelf:'baseline', 
    padding:5,
  },
  itemFeeText:{
    marginRight:20, 
    fontSize:24, 
    color:colors.blue,
  },
  deepblueText:{
    color:colors.deepblue,
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
  simpleTextInput: {
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    padding: 15,
    flexGrow:1, 
    borderColor:colors.deepblue,
  },
  simpleTouchableOpacity: {
    borderWidth: 1,
    borderRadius: 10,
    margin: 15,
    padding: 5, 
    alignItems:'center',
    justifyContent:'center',
  },

})