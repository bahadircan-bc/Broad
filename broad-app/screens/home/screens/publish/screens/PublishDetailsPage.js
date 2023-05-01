import { StyleSheet, Text, View, SafeAreaView, Pressable, Keyboard, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, TextInput} from 'react-native-gesture-handler'
import MapView, { Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import AutoComplete from 'react-native-autocomplete-input'
import Slider from '@react-native-community/slider'
import { FontAwesome } from '@expo/vector-icons';
import { api_endpoint, csrftoken, google_api_key, renewCSRFToken, resetStackStates } from '../../../../../util/utils'


export default function PublishDetailsPage({navigation, route}) {
  const [note, setNote] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carModelsList, setCarModelsList] = useState([]);
  const [seatCount, setSeatCount] = useState(0);
  const [fee, setFee] = useState(0);
  const departure = route.params.departure;
  const departureCoordinates = route.params.departureCoordinates;
  const destination = route.params.destination;
  const destinationCoordinates = route.params.destinationCoordinates;
  const date = route.params.date;
  const time = route.params.time;
  const mapRef = useRef(null);

  const [distanceInKilometers, setDistanceInKilometers] = useState(0);

  const queriedCarModels = React.useMemo(
    () => carModelsList.filter((item) =>
    item.toLowerCase().includes(carModel.toLowerCase())),
    [carModelsList, carModel]
  );

  const suggestions = React.useMemo(
    () =>
      (queriedCarModels.length === 1 && queriedCarModels[0].localeCompare(carModel) === 0) || carModel.length === 0
        ? [] // Close suggestion list in case movie title matches query
        : queriedCarModels,
    [queriedCarModels, carModel]
  );

  useEffect(()=>{
    setCarModelsList(['Bmw', 'Mercedes', 'Ford', 'Hyundai'])
  }, [])

  const onPublishRequest= async function(){
    console.log(time);
    await renewCSRFToken();
    const response = await fetch(`${api_endpoint}trips/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(
        {
          'departure': departure,
          'departure_coordinates': departureCoordinates,
          'destination': destination,
          'destination_coordinates': destinationCoordinates,
          'fee': fee,
          'departure_date': date,
          'departure_time': time,
          'car_model': carModel,
          'empty_seats': seatCount,
          'max_seats': seatCount,
          'note': note,
          'on_going': false,
          'terminated': false,
        }
      )
    });
    navigation.navigate('TripsStack');
  }

  useEffect(() => {
    console.log({departureCoordinates},{destinationCoordinates})
    if (mapRef.current) {
      mapRef.current.fitToCoordinates([departureCoordinates,destinationCoordinates,
      ], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, []);

  return (
    <KeyboardAvoidingView style={styles.backgroundContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <SafeAreaView style={styles.safeContainer}>
          <ScrollView style={styles.foregroundContainer} contentContainerStyle={styles.scrollContentContainer}>
            <View>
              <Text>Yolculuk Notu:</Text>
              <TextInput multiline numberOfLines={4} maxLength={40} style={styles.noteInput} onChangeText={setNote} placeholder='Bu not yolculuğunun paylaşıldığı sayfada görüntülenecek!'/>
            </View>

            <View style={{zIndex:2}}>
              <Text>Araç Marka/Modeli: </Text>
                <AutoComplete
                containerStyle={styles.formInput}
                inputContainerStyle={{borderWidth:0}}
                renderTextInput={(props)=>{return(<TextInput {...props} style={styles.autoCompleteTextInput}></TextInput>)}}
                autoCorrect={false}
                data={suggestions}
                value={carModel}
                onChangeText={setCarModel}
                placeholder='örn. Hyundai Accent'
                flatListProps={{
                  keyboardShouldPersistTaps: 'always',
                  renderItem: ({ item }) => (
                    <TouchableOpacity style={{backgroundColor:colors.white, padding:10}} onPress={()=>setCarModel(item)}>
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  ),
                }}/>
            </View>

            <View style={{backgroundColor:'purple', borderRadius:10 }}>
              <View focusable={false} style={{...StyleSheet.absoluteFillObject, zIndex:1, backgroundColor:'rgba(0,0,0,0)'}}/>
              <MapView style={{...StyleSheet.absoluteFillObject, minHeight:200, position:'relative', borderRadius:10}} ref={mapRef} >
                <MapViewDirections
                  origin={departureCoordinates}
                  destination={destinationCoordinates}
                  apikey={google_api_key} // insert your API Key here
                  strokeWidth={4}
                  strokeColor="#111111"
                  onReady={(results)=>{setDistanceInKilometers(results.distance); console.log(results.distance)}}
                />
              </MapView>
            </View>

            <View>
              <Text>Boş Koltuk Sayısı:</Text>
              <View style={styles.numericUpDownContainer}>
                <TouchableOpacity style={styles.upDownButton} onPress={()=>{if (seatCount == 0) return; setSeatCount(seatCount-1)}}>
                  <FontAwesome name={'minus'} size={10} color={colors.white}/>
                </TouchableOpacity>
                <TextInput style={styles.numericUpDownInput} onChangeText={(text)=>{if (text === ''){ setSeatCount(0); return;} setSeatCount(parseInt(text))}} keyboardType='numeric'>{seatCount}</TextInput>
                <TouchableOpacity style={styles.upDownButton} onPress={()=>setSeatCount(seatCount+1)}>
                  <FontAwesome name={'plus'} size={10} color={colors.white}/>
                </TouchableOpacity>
              </View>
            </View>
            
            <View>
              <Text>Ücret:</Text>
              <View style={{alignItems:'center', alignSelf:'flex-start'}}>
                <TextInput>{fee.toFixed(1)}</TextInput>
                <Slider
                  style={{width: 200, height: 40}}
                  value={fee}
                  minimumValue={distanceInKilometers * 0.5 * 0}
                  maximumValue={distanceInKilometers * 0.5 * 1}
                  step={0.5}
                  minimumTrackTintColor={colors.blue}
                  maximumTrackTintColor="#000000"
                  onSlidingComplete={(value)=>{setFee(value);}}
                  onValueChange={(value)=>{setFee(value);}}
                  />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={()=>{onPublishRequest()}}><Text style={{color:colors.white}}>Onayla</Text></TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={navigation.popToTop}><Text style={{color:colors.white}}>Vazgeç</Text></TouchableOpacity>
            </View>
          </ScrollView>
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
  scrollContainer: {
    flex:1,
  },
  scrollContentContainer: {
    padding: 10,
    gap:10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  noteInput:{ 
    borderRadius:10, 
    minHeight:100, 
    padding:10,
    backgroundColor: '#d9d9d9',
  },
  formInput: {
    borderRadius: 10,
    minWidth: '40%',
    padding: 10,
    backgroundColor: '#d9d9d9',
  },
  autoCompleteTextInput: {
    backgroundColor: '#d9d9d9',
  },
  numericUpDownContainer: {
    flexDirection:'row',
    maxWidth: '50%',
    gap:5,
  },
  upDownButton: {
    borderRadius: '50%',
    padding:10,
    backgroundColor: '#d9d9d9',
  },
  numericUpDownInput: {
    backgroundColor: '#d9d9d9',
    borderRadius: 10,
    minWidth: '10%',
    maxWidth: '50%',
    textAlign:'center',
  },
  buttonContainer: {
    flexDirection:'row',
    justifyContent:'space-evenly'
  },
  button:{
    backgroundColor:colors.blue,
    borderRadius: 15,
    padding: 15,
    paddingHorizontal: 30,
  },
})