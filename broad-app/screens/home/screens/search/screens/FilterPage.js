import { Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import AutoComplete from 'react-native-autocomplete-input'
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { turkeyCities } from '../../../../../util/utils'

const allCities = []



export default function FilterPage({navigation, route}) {
  const [seatCount, setSeatCount] = useState(0)
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowDate(false);
    setDate(currentDate);
  };

  const [city, setCity] = useState('')
  const [citiesList, setCitiesList] = useState(turkeyCities)

  const queriedCities = React.useMemo(
    () => citiesList.filter((item) =>
    item.toLowerCase().includes(city.toLowerCase())),
    [citiesList, city]
  );

  const suggestions = React.useMemo(
    () =>
      (queriedCities.length === 1 && queriedCities[0].localeCompare(city) === 0) || city.length === 0
        ? [] // Close suggestion list in case movie title matches query
        : queriedCities.slice(0, 5),
    [queriedCities, city]
  );

  const [city_2, setCity_2] = useState('')
  const [citiesList_2, setCitiesList_2] = useState(turkeyCities)

  const queriedCities_2 = React.useMemo(
    () => citiesList_2.filter((item) =>
    item.toLowerCase().includes(city_2.toLowerCase())),
    [citiesList_2, city_2]
  );

  const suggestions_2 = React.useMemo(
    () =>
      (queriedCities_2.length === 1 && queriedCities_2[0].localeCompare(city_2) === 0) || city_2.length === 0
        ? [] // Close suggestion list in case movie title matches query
        : queriedCities_2.slice(0, 5),
    [queriedCities_2, city_2]
  );

  return (  
    <KeyboardAvoidingView style={styles.backgroundContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <SafeAreaView style={styles.safeContainer}>
        <Pressable style={styles.foregroundContainer} onPress={()=>Keyboard.dismiss()}>
          <View style={[styles.formContainer, {zIndex:2}]}><Text>Başlangıç Şehri: </Text><AutoComplete
                containerStyle={styles.formInput}
                inputContainerStyle={{borderWidth:0}}
                renderTextInput={(props)=>{return(<TextInput {...props} style={styles.autoCompleteTextInput}></TextInput>)}}
                autoCorrect={false}
                data={suggestions}
                value={city}
                onChangeText={setCity}
                flatListProps={{
                  keyboardShouldPersistTaps: 'always',
                  renderItem: ({ item }) => (
                    <TouchableOpacity style={{backgroundColor:colors.white, padding:10}} onPress={()=>setCity(item)}>
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  ),
                }}/></View>
          <View style={[styles.formContainer, {zIndex:1}]}><Text>Varış Şehri: </Text><AutoComplete
                containerStyle={styles.formInput}
                inputContainerStyle={{borderWidth:0}}
                renderTextInput={(props)=>{return(<TextInput {...props} style={styles.autoCompleteTextInput}></TextInput>)}}
                autoCorrect={false}
                data={suggestions_2}
                value={city_2}
                onChangeText={setCity_2}
                flatListProps={{
                  keyboardShouldPersistTaps: 'always',
                  renderItem: ({ item }) => (
                    <TouchableOpacity style={{backgroundColor:colors.white, padding:10}} onPress={()=>setCity_2(item)}>
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  ),
                }}/></View>
          <View style={styles.formContainer}>
            <Text>Ücret: </Text>
            <View style={styles.costInputContainer}>
              <TextInput keyboardType='numeric' placeholder='Min.' style={styles.costInput}></TextInput>
              <TextInput keyboardType='numeric' placeholder='Max.' style={styles.costInput}></TextInput>
            </View>
          </View>
          <View style={styles.formContainer}>
            <Text>Boş Koltuk Sayısı: </Text>
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
          <View style={styles.formContainer}>
            <Text>Başlangıç Tarihi: </Text>
            <View style={{justifyContent:'center', alignItems:'flex-start', marginLeft:'auto'}}>
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
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.buttons} onPress={()=>navigation.goBack()}><Text style={styles.buttonText}>Filtrele</Text></TouchableOpacity>
            <TouchableOpacity style={styles.buttons} onPress={()=>navigation.goBack()}><Text style={styles.buttonText}>Vazgeç</Text></TouchableOpacity>
          </View>
          <View style={styles.fillBottom}></View>
        </Pressable>
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
      alignItems:'flex-start',
      //marginBottom:71,
      //added bottom margin for the bottom nav bar
      //might change in the future
  },
  formContainer:{
    flexDirection:'row',
    alignItems:'center',
    paddingVertical:10,
    borderBottomWidth: 1,
    borderBottomColor: '#d9d9d9',
    width: '80%',
    marginHorizontal: '10%',
    marginVertical: 10,
  },  
  formInput: {
    borderRadius: 10,
    marginLeft:'auto',
    minWidth: '40%',
    padding: 10,
    backgroundColor: '#d9d9d9',
    maxWidth: '50%',
  },
  autoCompleteTextInput: {
    backgroundColor: '#d9d9d9',
  },
  costInputContainer: {
    marginLeft:'auto',
    flexDirection:'row',
    gap:'10%',
    maxWidth: '50%',
  },
  costInput: {
    backgroundColor: '#d9d9d9',
    flex:1,
    padding: 10,
    borderRadius: 10,
  },
  numericUpDownContainer: {
    marginLeft:'auto',
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
  buttonsContainer: {
    flexDirection:'row',
    alignSelf:'center',
    gap:20,
  },  
  buttons: {
    backgroundColor:colors.blue,
    borderRadius:10,
    padding:10,
    margin:10,
  },
  buttonText: {
    color:colors.white,
  },
  fillBottom: {
    flex:1,
  },
})