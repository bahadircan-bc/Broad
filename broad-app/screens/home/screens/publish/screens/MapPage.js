import { StyleSheet, Text, View, Dimensions, TextInput, SafeAreaView, Pressable, Keyboard, Alert, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

const {width, height} = Dimensions.get('window')

const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO



export default function MapPage({navigation, route}) {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(()=>{
    (async () => {
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Konum izinleri yetersiz!');
        navigation.goBack();
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
      setFirstRender(false);
    })();

  }, [firstRender]);

  const GooglePlacesInput = function() {
    return (
      <GooglePlacesAutocomplete
            placeholder='Ara...'
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              setRegion({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: region.latitudeDelta,
                longitudeDelta: region.longitudeDelta,
              });
            }}
            query={{
              key: 'AIzaSyDEcBXKRUuR8cnXmiMAjTSolIUaEIAdols',
              language: 'tr',
              components: 'country:tr',
            }}
            fetchDetails={true}
            />
    );
  };

  if (firstRender){
    return (
      <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
        <ActivityIndicator/>
      </View>
    )
  }

  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.safeContainer}>
        <Pressable style={styles.foregroundContainer} onPress={()=>Keyboard.dismiss()}>
          <View style={styles.componentsContainer}>
            <GooglePlacesInput style={styles.simpleTextInput}/>
          </View>
          <TouchableOpacity style={styles.simpleToucableOpacity} onPress={async () => {
            const address = await Location.reverseGeocodeAsync({
              latitude : region.latitude,
              longitude : region.longitude
          });
            console.log(address);
            navigation.navigate('Publish', {mode: route.params.mode, coordinates:region, address: `${address[0].subregion}, ${address[0].region}`});
          }}>
            <Text style={styles.buttonText}>Onayla</Text>
          </TouchableOpacity>
          <View style={styles.mapContainer}>
            <FontAwesome name={'map-marker'} size={75} color={colors.blue} style={styles.markerIcon}/>
            <MapView style={styles.map} region={region} onRegionChangeComplete={setRegion}/>
          </View>
        </Pressable>
      </SafeAreaView>
    </View>
  )
}

/*
    
  useEffect(()=>{
    (async () => {
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    })();
  });

*/

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
      alignItems:'stretch',
      //marginBottom:71,
      //added bottom margin for the bottom nav bar
      //might change in the future
  },
  componentsContainer:{
    position:'absolute',
    zIndex:1,
    width:'100%',
    padding:15,
    alignItems:'stretch',
    justifyContent:'space-between',
    backgroundColor:'rgba(255, 0, 255, 0)',
  },
  backIcon:{
    padding:15
  },
  mapContainer: {
    justifyContent:'center',
    alignItems:'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerIcon: {
    position:'absolute', 
    zIndex:1,
    paddingBottom:60,
  },
  simpleTextInput: {
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    padding: 15,
    flexGrow:1, 
    borderColor:colors.deepblue,
  },
  simpleToucableOpacity:{
    borderWidth: 1,
    borderRadius: 10,
    margin: 15,
    padding: 10,
    alignSelf:'center', 
    justifyContent:'center',
    backgroundColor: colors.blue,
    borderColor:colors.white,
    position:'absolute',
    bottom:15,
    zIndex:1,
  },
  buttonText:{
    color:colors.white,
  },  
})