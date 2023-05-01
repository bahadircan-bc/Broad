import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, ImageBackground, TextInput, Modal, Animated, Alert } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { Divider } from 'react-native-paper'
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';


import { api_endpoint, csrftoken, formatDate, google_api_key, renewCSRFToken } from '../../../../../util/utils';
import MapViewDirections from 'react-native-maps-directions';
import { useIsFocused } from '@react-navigation/native';

const PassengerCard = (props) => {
  return (
    <View style={styles.passengerItem}>
      <Image source={{uri: props.imageURL}} style={styles.passengerImage}/>
      <Text style={styles.passengerNameText}>{props.username}</Text>
    </View>
  )
}


export default function TripDetailsPage({navigation, route}) {

  const [tripDetails, setTripDetails] = useState({});
  const [passengerCardList, setPassengerCardList] = useState([]);
  const [starsList, setStarsList] = useState([]);
  const [region, setRegion] = useState(null);

  const emergencyButtonLocation = useRef(new Animated.Value(0)).current;
  const [emergencyMenuOpen, setEmergencyMenuOpen] = useState(false);
  const expandButtonOpacity = useRef(new Animated.Value(0)).current;

  const mapRef = useRef(null);

  const isFocused = useIsFocused();

  const fetchItems = async function (){
    let response = await fetch(`${api_endpoint}${route.params.flatlistIdentifier}/${route.params.pk}/`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => {if(response.status == 200) return response.json(); else throw new Error(`HTTP status ${response.status}`);})
    console.log(response)
    setTripDetails({
      username: response.driver.profile_name,
      imageURL: response.driver.profile_picture,
      departure: response.departure,
      departureCoordinates: response.departure_coordinates,
      destination: response.destination,
      destinationCoordinates: response.destination_coordinates,
      tripNote: response.note,
      date: response.departure_date,
      time: response.departure_time.substring(0,5),
      fee: response.fee,
      emptySeats: response.max_seats - response.empty_seats,
      maxSeats: response.max_seats,
      carModel: response.car_model,
      isHidden: response.is_hidden,
    });
    
    var newStarsList = [];
    for (var i = 0; i < parseInt(response.driver.average_rating); i++){
      newStarsList.push(<FontAwesome key={i} name='star' size={20} color={'gold'} style={{margin:2}}/>);
    }
    for (var i = parseInt(response.driver.average_rating ?? 0); i < 5; i++){
      newStarsList.push(<FontAwesome key={i} name='star' size={20} color={'#d9d9d9'} style={{margin:2}}/>);
    }
    setStarsList(newStarsList);

    let passengerList = [];
    response.passengers.forEach((passenger, index) => {
      passengerList.push(<PassengerCard key={index} username={passenger.profile_name} imageURL={passenger.profile_picture}/>)
    });
    setPassengerCardList(passengerList)

    if (mapRef.current) {
      mapRef.current.fitToCoordinates([response.departure_coordinates,response.destination_coordinates,
      ], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }

    if('active_trips'.localeCompare(route.params.flatlistIdentifier) != 0) return;
          navigation.setOptions({
            headerRight: () => (
              <Menu style={styles.menuContainer}>
                <MenuTrigger>
                  <FontAwesome name='ellipsis-v' size={24} color={colors.white} style={styles.settingsIcon}/>
                </MenuTrigger>
                <MenuOptions customStyles={styles.popupMenu}>
                  <MenuOption text='Düzenle' onSelect={() => {navigation.navigate('EditTrip', {
                    pk:route.params.pk, 
                    destination:response.destination,
                    destinationCoordinates: response.destination_coordinates,
                    departure:response.departure,
                    departureCoordinates: response.departure_coordinates,
                    tripNote: response.note,
                    date: response.departure_date,
                    time: response.departure_time,
                    fee: response.fee,
                    maxSeats: response.max_seats,
                    carModel: response.car_model,
                  })}}/>
                  <MenuOption text={response.is_hidden ? 'Göster' : 'Gizle'} onSelect={()=>{onHideTrip(response.is_hidden)}}/>
                  <MenuOption text='Yayından Kaldır' onSelect={onRemoveTrip}/>
                </MenuOptions>
              </Menu>
            ),
           })
  }

  const onHideTrip = (isHidden) => {
    console.log(JSON.stringify(tripDetails))
    Alert.alert('Emin misiniz?', (tripDetails.isHidden ? 'Yolculuğunuz gösterilecektir.' : 'Yolculuğunuz gizelenecektir.'), [
      {
        text: 'Vazgeç',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Onayla', onPress: async () => {
        await renewCSRFToken();
        const response = await fetch(`${api_endpoint}trips/hide/${route.params.pk}`, {
          method: 'PATCH',
          headers: {
            'X-CSRFToken' : csrftoken,
            'Content-Type' : 'application/json',
          },
          body: JSON.stringify({
            'is_hidden': isHidden ? 'false' : 'true',  
          })
        })
        .then(response => {if(response.status == 200 || response.status == 204) return; else throw new Error(`HTTP status ${response.status}`)});
        navigation.popToTop();
      }},
    ]);
  }

  const onRemoveTrip = () => {
    Alert.alert('Emin misiniz?', 'Yolculuğunuz yayından kaldırılacaktır.', [
      {
        text: 'Vazgeç',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Onayla', onPress: async () => {
        await renewCSRFToken();
        const response = await fetch(`${api_endpoint}trips/delete/${route.params.pk}`, {
          method: 'DELETE',
          headers: {
            'X-CSRFToken' : csrftoken,
            'Content-Type' : 'application/json',
          }
        })
        .then(response => {if(response.status == 200 || response.status == 204) return; else throw new Error(`HTTP status ${response.status}`)});
        navigation.popToTop();
      }},
    ]);
  }
    

  useEffect(()=>{
    if(!isFocused) return;
    try {
      (async () => {
        await fetchItems();
      })();
    } catch (error) {
      console.log(error);
    }
  }, [isFocused])

  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.foregroundContainer}>
          <ScrollView style={{width:'100%'}}>
            <View style={styles.driverHeaderContainer}>
              <TouchableOpacity style={styles.driverProfileContainer}>
                <Image source={{uri:tripDetails.imageURL}} style={styles.driverImage}/>
                <Text style={styles.driverNameText}>{tripDetails.username}</Text>
                <View style={styles.driverStarsContainer}>
                  {starsList}
                </View>
              </TouchableOpacity>
              <ImageBackground source={require('../../../../../images/text-bubble.png')} resizeMode='stretch'>
                <View style={styles.tripNoteContainer}>
                  <Text>{tripDetails.tripNote ? tripDetails.tripNote : 'Açıklama yazılmamış'}</Text>
                </View>
              </ImageBackground>
            </View>
            <Divider/>
            <View style={{margin:10}}>
              <View style={styles.statsContainer}>
                <View style={styles.statsElementContainer}>
                  <FontAwesome size={20} color={colors.deepblue} name='calendar-o'/>
                  <Text>{formatDate(tripDetails.date)}</Text>
                </View>
                <View style={styles.statsElementContainer}>
                  <FontAwesome size={20} color={colors.deepblue} name='clock-o'/>
                  <Text>{tripDetails.time}</Text>
                </View>
                <View style={styles.statsElementContainer}>
                  <FontAwesome size={20} color={colors.deepblue} name='try'/>
                  <Text style={{alignSelf:'center'}}>{tripDetails.fee}₺</Text>
                </View>
              </View>
              <View style={styles.statsContainer}>
                <View style={styles.statsElementContainer}>
                  <FontAwesome name='users' color={colors.deepblue} size={20}/>
                  <Text>{tripDetails.emptySeats}/{tripDetails.maxSeats}</Text>
                </View>
                <View style={styles.statsElementContainer}>
                  <FontAwesome size={20} color={colors.deepblue} name='car'/>
                  <Text>{tripDetails.carModel ? tripDetails.carModel : 'Model Belirtilmemiş'}</Text>
                </View>
              </View>
            </View>
            <Divider/>
              <View style={styles.mapContainer}>
              <MapView style={styles.map} region={region} onRegionChangeComplete={setRegion} ref={mapRef}>
                <MapViewDirections
                  origin={tripDetails.departureCoordinates}
                  destination={tripDetails.destinationCoordinates}
                  apikey={google_api_key} // insert your API Key here
                  strokeWidth={4}
                  strokeColor="#111111"
                />
              </MapView>
              </View>
            <Divider/>
            <View style={{padding:10}}>
              <Text style={styles.passengerListHeader}>Yolcular:</Text>
              {passengerCardList}
              {/* this is empty space to allow scrolling further down */}
              <View style={{height:100}}/>
            </View>
          </ScrollView>
          {route.params.onGoing && 
          <>
            <Animated.View style={[styles.hoveringButtonsContainer, {transform: [{translateY: emergencyButtonLocation}]}]}>
              <TouchableOpacity style={styles.simpleTouchableOpacity} onPress={()=>{
                setEmergencyMenuOpen(!emergencyMenuOpen)
                Animated.timing(emergencyButtonLocation, {toValue: emergencyMenuOpen?0:-100, duration: 500, useNativeDriver: true}).start()
                Animated.timing(expandButtonOpacity, {toValue: emergencyMenuOpen?0:1, duration: 500, useNativeDriver:true}).start()
              }}>
                <Text style={styles.buttonText}>S.O.S.</Text>
              </TouchableOpacity>
              <FontAwesome name='exclamation-circle' size={40} style={{position:'absolute', opacity:0.5}}/>
            </Animated.View>
            <Animated.View style={[styles.expandedEmergencyButtonsContainer, {opacity:expandButtonOpacity}]}>
              <TouchableOpacity style={styles.expandedEmergencyButtons}><Text style={styles.expandedEmergencyText}>Bizimle irtibata gec</Text></TouchableOpacity>
              <TouchableOpacity style={styles.expandedEmergencyButtons}><Text style={styles.expandedEmergencyText}>112'yi ara</Text></TouchableOpacity>
            </Animated.View>
          </>
          }
          
        </View>
      </SafeAreaView>
    </View>
  )
}

const colors = {
  blue: '#2DBDFF',
  ligtherblue: '#2497CC',
  white: '#fff',
  black: '#000',
  deepblue: '#004369',
  red: 'red',
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
  divider:{
    
  },
  backButton:{
    marginHorizontal: 15,
    position: 'absolute',
    left: 5,
  },
  headerText: {
    fontSize: 24,
    color: colors.white,
    textAlign:'center',
  },
  passengerItem:{
    borderRadius:50, 
    flexDirection:'row', 
    margin:10, 
    padding:10, 
    alignItems:'center', 
    justifyContent:'flex-start', 
    backgroundColor:'#d9d9d9',
  },
  passengerImage:{
    height: 50, 
    width: 50, 
    borderRadius: 50, 
    marginRight: 25,
  },
  passengerNameText:{
    fontWeight: 'bold',
  },
  driverHeaderContainer:{
    margin:10, 
    flexDirection:'row', 
    justifyContent:'space-evenly',
  },
  driverProfileContainer:{
    margin:5, 
    alignItems:'center',
  },
  driverImage:{
    height: 100,
    width: 100,
    borderRadius:100,
    margin:10,    
  },
  driverNameText:{
    alignSelf:'center', 
    fontSize:16, 
    fontWeight:'bold',
  },
  driverStarsContainer:{
    flexDirection:'row', 
    justifyContent:'space-evenly',
  },
  tripNoteContainer:{
    flexGrow:1, 
    margin:20, 
    justifyContent:'center', 
    alignItems:'center', 
    minWidth:150,
    paddingLeft: 20,
  },
  statsContainer:{
    flexDirection:'row', 
    justifyContent:'space-evenly', 
    margin:10,
  },
  statsElementContainer:{
    flexDirection:'row', 
    alignItems:'center',
    gap:10,
  },
  mapContainer:{ 
    margin:10, 
    height:250, 
    alignItems:'center', 
    justifyContent:'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  passengerListHeader:{
    fontWeight:'bold', 
    marginHorizontal:25,
  },
  simpleTouchableOpacity: {
    borderWidth: 0,
    zIndex:2,
    flex:1,
    justifyContent:'center',
  },
  hoveringButtonsContainer:{
    backgroundColor: 'transparent', 
    alignItems:'center',
    justifyContent:'center',
    position:'absolute', 
    bottom:20,
    right:20,
    backgroundColor: colors.red,
    borderRadius: '50%',
    width:50,
    height:50,
    zIndex:2,
  },
  buttonText:{
    textAlign: 'center', 
    color: colors.white,
    fontWeight:'bold',
  },
  expandedEmergencyButtonsContainer: {
    margin:10,
    padding:10,
    position:'absolute',
    bottom:0,
    right: 0,
    gap:10,
  },
  expandedEmergencyButtons: {
    padding:10,
    backgroundColor:'red',
    borderRadius: 10,
  },
  expandedEmergencyText: {
    color: colors.white,
    textAlign:'center'
  },
  popupMenu: {
    optionWrapper:{padding:10}, 
    optionText:{textAlign:'center', fontSize:14}, 
    optionsContainer:{width:'35%', borderRadius:10, marginTop:40},
  },
  settingsIcon:{
    padding:15,
  },
})