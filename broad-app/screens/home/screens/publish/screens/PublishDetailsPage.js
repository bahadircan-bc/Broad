import { StyleSheet, Text, View, SafeAreaView, Pressable, Keyboard, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import MapView, { Marker } from 'react-native-maps'
import NumericInput from 'react-native-numeric-input'
import AutoComplete from 'react-native-autocomplete-input'
import Slider from '@react-native-community/slider'

export default function PublishDetailsPage({navigation, route}) {
  const [carModel, setCarModel] = useState('')
  const [carModelsList, setCarModelsList] = useState([])
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

  return (
    <KeyboardAvoidingView style={styles.backgroundContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <SafeAreaView style={styles.safeContainer}>
          <ScrollView style={styles.foregroundContainer} contentContainerStyle={styles.scrollContentContainer}>
            <View>
              <Text>Yolculuk Notu:</Text>
              <TextInput multiline numberOfLines={4} maxLength={40} style={{borderWidth:1, borderRadius:15, minHeight:100, padding:10}} placeholder='Bu not yolculuğunun paylaşıldığı sayfada görüntülenecek!'/>
            </View>
            <View style={{zIndex:2}}>
              <Text>Araç Marka/Modeli</Text>
              <AutoComplete
                autoCorrect={false}
                data={suggestions}
                value={carModel}
                onChangeText={setCarModel}
                placeholder={'type a car model'}
                flatListProps={{
                  keyboardShouldPersistTaps: 'always',
                  renderItem: ({ item }) => (
                    <TouchableOpacity style={{backgroundColor:'white'}} onPress={()=>setCarModel(item)}>
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  ),
                }}/>  
            </View>
            <View style={{backgroundColor:'purple'}}>
              <View focusable={false} style={{...StyleSheet.absoluteFillObject, zIndex:1, backgroundColor:'rgba(0,0,0,0)'}}/>
              <MapView style={{...StyleSheet.absoluteFillObject, minHeight:200, position:'relative'}}/>
            </View>
            
            <View>
              <Text>Boş Koltuk Sayısı</Text>
              <NumericInput onChange={value => console.log(value)}/>
            </View>
            
            <View>
              <Text>Ücret</Text>
              <Slider
                style={{width: 200, height: 40}}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="blue"
                maximumTrackTintColor="#000000"
              />
            </View>
            
          </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
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
})