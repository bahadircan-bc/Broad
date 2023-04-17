import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Animated } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Divider } from 'react-native-paper'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { api_endpoint, csrftoken } from '../../../../../util/utils';

const TripsItem = function({pk, name, ownTrip, departure, destination, onGoing}){
  const navigation = useNavigation();
  const activeTextOpacity = useRef(new Animated.Value(0)).current

  const flashIn = Animated.timing(activeTextOpacity, {toValue:1, duration:400, useNativeDriver:true, delay:100})
  const flashOut = Animated.timing(activeTextOpacity, {toValue:0, duration:400, useNativeDriver:true, delay:100})

  const flashSequence = Animated.sequence([flashIn, flashOut])
  useEffect(()=>
  {
    Animated.loop(flashSequence).reset()
    Animated.loop(flashSequence).start()
  },[])
  
  return(
    <TouchableOpacity 
      style={styles.flatlistItem}
      onPress={() => {navigation.navigate('TripDetails', {pk:pk, name:name, ownTrip:ownTrip, departure:departure, destination:destination, onGoing:onGoing})}}>
      <FontAwesome name='road' color={colors.blue} size={16} style={{margin:8}}/>
      <Text style={{fontSize:16}}>{departure} - {destination}</Text>
      {onGoing && <Animated.View style={{borderRadius:5, padding:5, position:'absolute', right:10, backgroundColor:colors.green, opacity:activeTextOpacity}}>
        <Text style={{color:colors.white}}>AKTIF</Text>
      </Animated.View>}
    </TouchableOpacity>
  )
}

export default function TripsPage({navigation}) {
  const [activeTripList, setActiveTripList] = useState();
  const [terminatedTripList, setTerminatedTripList] = useState();
  const [registeredTripList, setRegisteredTripList] = useState();

  const fetchItems = async function(){ 
    let response = await fetch(`${api_endpoint}active_trips/`, {
      method: 'GET',
      headers: { 
        "Content-Type": "application/json",
    },
    })
    .then((response) => { if(response.status == 200) return response.json(); else throw new Error('HTTP status ' + response.status);});
    console.log(response);
    setActiveTripList(response.results);

    response = await fetch(`${api_endpoint}registered_trips/`, {
      method: 'GET',
      headers: { 
        "Content-Type": "application/json",
    },
    })
    .then((response) => { if(response.status == 200) return response.json(); else throw new Error('HTTP status ' + response.status);});
    console.log(response);
    setRegisteredTripList(response.results);
    response = await fetch(`${api_endpoint}past_trips/`, {
      method: 'GET',
      headers: { 
        "Content-Type": "application/json",
    },
    })
    .then((response) => { if(response.status == 200) return response.json(); else throw new Error('HTTP status ' + response.status);});
    console.log(response);
    setTerminatedTripList(response.results);
  }

  useEffect(()=>{
    try{
      fetchItems()
    } catch(error)
    {
      console.log(error)
    }
  }, [])

  const renderItem = function({item}){
    return (
      <TripsItem pk={item.pk} ownTrip={item.ownTrip} name={item.name} departure={item.departure} destination={item.destination} onGoing={item.on_going}/>
    )
  }

  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.foregroundContainer}>
          <View style={styles.flatListContainer}>
            <TouchableOpacity style={styles.titleContainer}>
              <Text style={styles.headerText}>Aktif Yolculuklarım</Text>
              <FontAwesome name={'angle-right'} color={colors.blue} size={15}/>
            </TouchableOpacity>
            {activeTripList?.length > 0 
            ? 
            <FlatList 
            style={{flex:1}}
            data={activeTripList}
            renderItem={renderItem}/>
            : 
            <Text>Henüz aktif yolculuğun bulunmuyor!</Text>
            }
          </View>
          <Divider/>
          <View style={styles.flatListContainer}>
            <TouchableOpacity style={styles.titleContainer}>
              <Text style={styles.headerText}>Kayıtlı Yolculuklarım</Text>
              <FontAwesome name={'angle-right'} color={colors.blue} size={15}/>
            </TouchableOpacity>
            {registeredTripList?.length > 0 
            ? 
            <FlatList
            style={{flex:1}}
            data={registeredTripList}
            renderItem={renderItem}/>
            : 
            <Text>Kayıtlı olduğun yolculuklar burada görünecek!</Text>
            }
          </View>  
          <Divider/>
          <View style={styles.flatListContainer}>
            <TouchableOpacity style={styles.titleContainer}>
              <Text style={styles.headerText}>Geçmiş Yolculuklarım</Text>
              <FontAwesome name={'angle-right'} color={colors.blue} size={15}/>
            </TouchableOpacity>
            {terminatedTripList?.length > 0 
            ? 
            <FlatList
            style={{flex:1}}
            data={terminatedTripList}
            renderItem={renderItem}/>
            : 
            <Text>Yolculukların tamamlandığında burada görebileceksin!</Text>
            }
          </View>    
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
  green: '#00cc00',
}

const styles = StyleSheet.create({
  flatlistItem:{
    flexDirection:'row', 
    borderWidth:1,
    borderRadius:16,
    padding:10, 
    margin:3, 
    borderColor:colors.blue, 
    alignItems:'center',
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
      flex:1,
      justifyContent:'space-around',
      alignItems: 'stretch',
      //marginBottom:71,
      //added bottom margin for the bottom nav bar
      //might change in the future
  },
  headerText: {
    fontSize: 16,
    color: '#2DBDFF',
    padding:15,
  },
  titleContainer:{
    flexDirection:'row', 
    alignItems:'center'
  },
  flatListContainer:{
    flex:1,
    margin:10,
  }
})