import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';

export default function PublishPage({navigation, route}) {
  
  const [departureCoordinates, setDepartureCoordinates] = useState();
  const [destinationCoordinates, setDestinationCoordinates] = useState();
  const [departureAddress, setDepartureAddress] = useState();
  const [destinationAddress, setDestinationAddress] = useState();

  const [date, setDate] = useState(new Date());
  const [hour, setHour] = useState(new Date());

  const [mode, setMode] = useState('date');
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowDate(false);
    setShowTime(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    if (Platform.OS === 'android') {
      setShow(false);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  useEffect(()=>{
      try{
        if (route.params?.mode === 'clear')
        {
          setDepartureCoordinates();
          setDepartureAddress();
          setDestinationCoordinates();
          setDestinationAddress();
        }
        if (route.params?.mode === 'departure') 
        {
          setDepartureCoordinates(route.params.coordinates);
          setDepartureAddress(route.params.address);
        }
        if (route.params?.mode === 'destination')
        {
          setDestinationCoordinates(route.params.coordinates);
          setDestinationAddress(route.params.address);
        } 


        // TODO  THIS IS ONLY FOR DEBUGGING
        setDestinationAddress('Destination Address');
        setDepartureAddress('Departure Address');
    } catch(error)
    {
      console.log(error)
      console.log(route.params)
    }
  }, [route.params])

  if (Platform.OS === 'android')
  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={[styles.foregroundContainer, {justifyContent:'space-around'}]}>
          <Text style={styles.headerText}>Yolculuk Ara</Text>
          <View style={{width:'75%'}}>
            <View style={styles.datepickerContainer}>
              <Text style={{flex:1, textAlign:'right'}}>Başlangıç Tarihi:</Text>
                <View style={{flex:1}}>
                {showDate ? <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={'date'}
                  is24Hour={true}
                  onChange={onChange}
                  locale='tr-TR'
                  /> : <TouchableOpacity style={{borderRadius:7, paddingHorizontal:10, paddingVertical:5, margin:10, backgroundColor:'#EEEEEE'}} onPress={() => setShowDate(true)}><Text style={{color:'black', fontSize:16}}>{date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}</Text></TouchableOpacity>}
                </View>
            </View>
            <View style={styles.datepickerContainer}>
              <Text style={{flex:1, textAlign:'right'}}>Saat:</Text>
              <View style={{flex:1}}>
              {showTime ? <DateTimePicker
                testID="dateTimePicker"
                value={hour}
                mode={'time'}
                is24Hour={true}
                onChange={onChange}
                locale='tr-TR'
                /> : <TouchableOpacity style={{alignSelf:'baseline', borderRadius:7, paddingHorizontal:10, paddingVertical:5, margin:10, backgroundColor:'#EEEEEE'}} onPress={() => setShowTime(true)}><Text style={{color:'black', fontSize:16}}>{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit"})}</Text></TouchableOpacity>}
                </View>
            </View>
          <TouchableOpacity style={styles.simpleTouchableOpacity} 
              onPress={() => {navigation.navigate({name:'Map', params:{placeholder:'Başlangıç noktasını seçin', mode:'departure', from:'Publish'}})}}>
              <Text>{departureAddress? departureAddress.trim() : 'Başlangıç Noktası'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.simpleTouchableOpacity} 
              onPress={() => {navigation.navigate({name:'Map', params:{placeholder:'Varış noktasını seçin', mode:'destination', from:'Publish'}})}}>
              <Text>{destinationAddress? destinationAddress.trim() : 'Varış Noktası'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.simpleTouchableOpacity} 
              onPress={() => {
                if(!destinationAddress) return;
                if(!departureAddress) return;

                navigation.navigate({name:'PublishDetails', params:{departureCoordinates:departureCoordinates, destinationCoordinates:destinationCoordinates, departureDate:date.toDateString(), departureAddress:departureAddress, destinationAddress:destinationAddress}})
                }}>
              <Text style={{textAlign:'center'}}>Onayla</Text>
              </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );

  if (Platform.OS === 'ios')
  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.foregroundContainer}>
          <Text style={styles.headerText}>Yolculuk Paylaş</Text>
          <View style={{width:'75%'}}>
            <View style={styles.datepickerContainer}>
              <Text style={{flex:1, textAlign:'right'}}>Başlangıç Tarihi:</Text>
                <View style={{flex:1, justifyContent:'center', alignItems:'flex-start'}}>
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode={'date'}
                      is24Hour={true}
                      onChange={onChange}
                      locale='tr-TR'
                    />
                </View>
              </View>
              <View style={styles.datepickerContainer}>
                <Text style={{flex:1, textAlign:'right'}}>Saat:</Text>
                  <View style={{flex:1, justifyContent:'center', alignItems:'flex-start'}}>
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode={'time'}
                      is24Hour={true}
                      onChange={onChange}
                      locale='tr-TR'
                    />
                  </View>
            </View>
            <TouchableOpacity style={styles.simpleTouchableOpacity} 
              onPress={() => {navigation.navigate({name:'Map', params:{placeholder:'Başlangıç noktasını seçin', mode:'departure', from:'Publish'}})}}>
              <Text>{departureAddress? departureAddress.trim() : 'Başlangıç Noktası'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.simpleTouchableOpacity} 
              onPress={() => {navigation.navigate({name:'Map', params:{placeholder:'Varış noktasını seçin', mode:'destination', from:'Publish'}})}}>
              <Text>{destinationAddress? destinationAddress.trim() : 'Varış Noktası'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.simpleTouchableOpacity} 
              onPress={() => {
                if(!destinationAddress) return;
                if(!departureAddress) return;

                navigation.navigate({name:'PublishDetails', params:{departureCoordinates:departureCoordinates, destinationCoordinates:destinationCoordinates, departureDate:date.toDateString(), departureAddress:departureAddress, destinationAddress:destinationAddress}})
                }}>
              <Text style={{textAlign:'center'}}>Onayla</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

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
  headerText: {
    fontSize: 48,
    color: '#2DBDFF',
    textAlign:'center',
    marginTop:15,
  },
  datepickerContainer:{
    flexDirection:'row', 
    alignItems:'center', 
    margin:15,
  },
  simpleTouchableOpacity: {
    borderWidth: 1,
    borderRadius: 10,
    margin: 15,
    padding: 15,
    alignSelf:'stretch', 
    justifyContent:'center',
  },
})