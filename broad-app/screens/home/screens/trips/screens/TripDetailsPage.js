import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, ImageBackground, TextInput, Modal, Animated } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { Divider } from 'react-native-paper'
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps'


import { formatDate } from '../../../../../util/utils';

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
  const [showBiddingModal, setShowBiddingModal] = useState(false);
  const [region, setRegion] = useState(null);

  const emergencyButtonLocation = useRef(new Animated.Value(0)).current;
  const [emergencyMenuOpen, setEmergencyMenuOpen] = useState(false);
  const expandButtonOpacity = useRef(new Animated.Value(0)).current;

  const fetchItems = async function (){
    setTripDetails({
      pk:'1',
      username: 'test',
      imageURL: 'https://placeimg.com/640/480/any',
      tripNote: 'testTripNote',
      date: 'yyyy-mm-dd',
      fee: 123456,
      emptySeats: 3,
      maxSeats: 4,
      carModel: 'BMW',
    });
    
    var newStarsList = [];
    for (var i = 0; i < 3; i++){
      newStarsList.push(<FontAwesome key={i} name='star' size={20} color={'gold'} style={{margin:2}}/>);
    }
    for (var i = 3; i < 5; i++){
      newStarsList.push(<FontAwesome key={i} name='star' size={20} color={'#d9d9d9'} style={{margin:2}}/>);
    }
    setStarsList(newStarsList);

    setPassengerCardList([
      <PassengerCard key={1} username={'passenger1'} imageURL={'https://placeimg.com/640/480/any'}/>,
      <PassengerCard key={2} username={'passenger2'} imageURL={'https://placeimg.com/640/480/any'}/>
    ])
  }

  useEffect(()=>{
      try {
        fetchItems();
      } catch (error) {
        console.log(error);
      }
        
  }, [])

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
                  <Text>Saat</Text>
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
              <MapView style={styles.map} region={region} onRegionChangeComplete={setRegion}/>
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
})