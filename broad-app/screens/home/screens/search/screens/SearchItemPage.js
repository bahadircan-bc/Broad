import { StyleSheet, Text, View, TextInput, SafeAreaView, Modal, TouchableOpacity, Image, ImageBackground, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Divider } from 'react-native-paper'
import Slider from '@react-native-community/slider';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps'


import { formatDate, clamp, api_endpoint } from '../../../../../util/utils'

const PassengerCard = (props) => {
  return (
    <View style={styles.passengerItem}>
      <Image source={{uri: props.imageURL}} style={styles.passengerImage}/>
      <Text style={styles.passengerNameText}>{props.username}</Text>
    </View>
  )
}

export default function SearchItemPage({navigation, route}) {
  const [tripDetails, setTripDetails] = useState({});
  const [passengerCardList, setPassengerCardList] = useState([]);
  const [starsList, setStarsList] = useState([]);
  const [showBiddingModal, setShowBiddingModal] = useState(false);
  const [biddingValue, setBiddingValue] = useState(0);
  const [region, setRegion] = useState();

  const fetchItems = async function (){
    let response = await fetch(`${api_endpoint}trips/${route.params.pk}/`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => {if(response.status == 200) return response.json(); else throw new Error(`HTTP status ${response.status}`);})
    console.log(response)
    setTripDetails({
      username: response.driver.profile_name,
      imageURL: 'https://placeimg.com/640/480/any',
      tripNote: response.note,
      date: response.departure_date,
      time: response.departure_time.substring(0,5),
      fee: response.fee,
      emptySeats: response.max_seats - response.empty_seats,
      maxSeats: response.max_seats,
      carModel: response.car_model,
    });
    var newStarsList = [];
    for (var i = 0; i < response.driver.average_rating; i++){
      newStarsList.push(<FontAwesome key={i} name='star' size={20} color={'gold'} style={{margin:2}}/>);
    }
    for (var i = response.driver.average_rating; i < 5; i++){
      newStarsList.push(<FontAwesome key={i} name='star' size={20} color={'#d9d9d9'} style={{margin:2}}/>);
    }
    setStarsList(newStarsList);

    let passengerList = [];
    response.passengers.forEach((passenger, index) => {
      passengerList.push(<PassengerCard key={index} username={passenger.profile_name} imageURL={'https://placeimg.com/640/480/any'}/>)
  });

    setPassengerCardList(passengerList)
  }

  useEffect(()=>{
      try {
        fetchItems();
      } catch (error) {
        console.log(error);
      }
        
  }, [])

  const sendMessageToDriver = function() {
    console.log('sending message to driver')
    navigation.navigate('InboxStack', {screen:'Conversation', initial:false, params:{name:tripDetails.user, image:{uri:`${ENDPOINT}/media/${tripDetails.profilePicture}`}}})
  }

  const sendBidToDriver = function(bid, date, direction, pk) {
    console.log('sending bid to driver')
    navigation.navigate('InboxStack', {screen:'Conversation', initial:false, params:{name:tripDetails.user, image:{uri:`${ENDPOINT}/media/${tripDetails.profilePicture}`}, bid:true, biddingValue:bid, tripDate:formatDate(date), tripDirection:direction, tripPK:pk}})
  }

  const onBidButtonClicked = function (){
    setBiddingValue(0);
    setShowBiddingModal(!showBiddingModal);
  }

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
                  <Text style={{color: 'white'}}>{tripDetails.tripNote ? tripDetails.tripNote : 'Açıklama yazılmamış'}</Text>
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
          <View style={styles.hoveringButtonsContainer}>
            <TouchableOpacity style={styles.simpleTouchableOpacity}
            onPress={onBidButtonClicked}>
              <Text style={styles.buttonText}>Teklif Gönder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.simpleTouchableOpacity}
            onPress={sendMessageToDriver}>
              <Text style={styles.buttonText}>Mesaj At</Text>
            </TouchableOpacity>
          </View>
          <Modal animationType="slide"
            transparent={true}
            visible={showBiddingModal}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setShowBiddingModal(!showBiddingModal);
            }}>
               <View style={{flex:1, justifyContent:'center', alignItems:'center', margin:20}}>
                <View style={{
                  backgroundColor:'white', 
                  padding:20, 
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                  justifyContent:'center',
                  alignItems:'stretch'}}>
                  <Text style={{textAlign:'center', fontSize:18}}>Teklif edilecek ücreti belirleyin.</Text>
                  <TextInput style={{fontSize:36, alignSelf:'center'}} 
                  keyboardType='numeric'
                  onChangeText={(value)=>{
                    try{
                      if (value === '')
                        value = '0'
                      
                      console.log(clamp(parseFloat(value), 0, tripDetails.fee))
                      setBiddingValue(clamp(parseFloat(value), 0, tripDetails.fee))
                    }
                    catch (error){
                      console.log(error);
                      setBiddingValue(0);
                    }
                  }}
                  value={`${biddingValue}`}/>
                  <Slider 
                    value={biddingValue}
                    minimumValue={0}
                    maximumValue={tripDetails.fee}
                    step={0.5}
                    minimumTrackTintColor={colors.ligtherblue}
                    maximumTrackTintColor="#000000"
                    onSlidingStart={()=>{Keyboard.dismiss();}}
                    onSlidingComplete={(value)=>{setBiddingValue(value);}}/>
                  <View style={{flexDirection:'row'}}>
                    <TouchableOpacity style={styles.simpleTouchableOpacity}
                    onPress={()=>{
                      setShowBiddingModal(false);
                      sendBidToDriver(biddingValue, tripDetails.date, tripDetails.path, tripDetails.pk);
                    }}>
                      <Text style={styles.buttonText}>Onayla</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.simpleTouchableOpacity}
                    onPress={()=>{
                      setShowBiddingModal(false);
                    }}>
                      <Text style={styles.buttonText}>Vazgeç</Text>
                    </TouchableOpacity>
                  </View>
                </View>
               </View>
          </Modal>
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
  pageHeader:{
    flexDirection:'row', 
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:colors.blue, 
    height:'8%', 
    width:'100%',
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
    borderRadius: 10,
    margin: 15,
    padding: 15,
    width:'40%',
    backgroundColor: colors.blue,
  },
  hoveringButtonsContainer:{
    flexDirection:'row', 
    backgroundColor: 'transparent', 
    position:'absolute', 
    bottom:0,
  },
  buttonText:{
    textAlign: 'center', 
    color: colors.white,
  },
})