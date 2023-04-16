import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';

const SearchItem = function({pk, name, departure, destination, departureDate, fee}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity 
      style={styles.flatlistItem}
      onPress={()=>navigation.navigate('SearchItem', {pk:pk, name:name, departure:departure, destination:destination, departureDate:departureDate, fee:fee})}>
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
  
  const fetchItems = function() {

    setTripList([
      {
        pk: '1',
        name: 'First Item',
        departure: 'test',
        destination: 'test',
        departureDate: 'dd/mm/yyyy',
        fee: 12345,
      },
      {
        pk: '2',
        name: 'Second Item',
        departure: 'test',
        destination: 'test',
        departureDate: 'dd/mm/yyyy',
        fee: 12345,
      },
      {
        pk: '3',
        name: 'Third Item',
        departure: 'test',
        destination: 'test',
        departureDate: 'dd/mm/yyyy',
        fee: 12345,
      },
    ])
    // TODO will fill the list dynamically using requests
    //instance.post('/user/get_trips/', 
    //{ data: 
    //  { exclude: { myself: 1 } , filter: {emptySeats : 3, feeGT: 0, feeLT: 2000, departureDateStart: new Date(2022, 1, 1).toDateString(), departureDateEnd: new Date(2024, 1, 1).toDateString()}} }).then((response)=>{
    //  if(response.status == 200){
    //    const newTripList = [];
    //    for(var k in response.data.tripList) {
    //      const departure=response.data.tripList[k].path.split(',')[0];
    //      const destination=response.data.tripList[k].path.split(',')[1];
    //      const fee=response.data.tripList[k].fee;
    //      const departureDate=response.data.tripList[k].date;
    //      newTripList.push(<SearchItem key={k} pk={k} name={response.data.tripList[k].user} departure={departure} destination={destination} fee={fee} departureDate={departureDate}/>)
    //    }
    //    setTripList(newTripList);
    //    //response.data.forEach((trip)=>{console.log(trip)})
    //  }
    //});
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
      <SearchItem name={item.name} departure={item.departure} destination={item.destination} departureDate={item.departureDate} fee={item.fee}/>
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