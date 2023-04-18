import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { api_endpoint, csrftoken, renewCSRFToken } from '../../../../../util/utils';

const SettingsMenuItem = (props) => {
  return (
    <TouchableOpacity 
      style={styles.settingsItemContainer}
      onPress={props.onPress}>
      <Text style={styles.settingsMenuItemText}>{props.menuText}</Text>
    </TouchableOpacity>
  )
}

export default function OptionsPage({navigation}) {
  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.foregroundContainer}>
          <View style={{width:'100%', alignItems:'center', justifyContent:'center'}}>
            <FontAwesome 
              name='angle-left'
              size={36}
              color={colors.blue}
              style={{position:'absolute', alignSelf:'flex-start', padding:15}}
              onPress={()=>navigation.goBack()}/>
            <Text style={styles.headerText}>Ayarlar</Text>
          </View>
          <ScrollView style={styles.menuContainer}>
            <SettingsMenuItem menuText='Profili düzenle' onPress={()=>{navigation.navigate('EditProfile')}}/>
            <SettingsMenuItem menuText='Tüm Konuşma Geçmişini Temizle' 
            onPress={()=>{
              setObjectValue(`${loggedInUsername}_chats`, {});
            }}/>
            <SettingsMenuItem menuText='Bunu yap'/>
            <SettingsMenuItem menuText='Şifreyi Değiştir' onPress={()=>navigation.navigate('EditPassword')}/>
            <SettingsMenuItem menuText='Oturumu kapat' onPress={async ()=>{
              await renewCSRFToken(); 
              const response = await fetch(`${api_endpoint}logout/`, { 
                method: 'POST', headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': csrftoken,
                }
              });
              if(response.status == 200)
              navigation.replace('Main');
            }}/>
          </ScrollView>
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
}

const styles = StyleSheet.create({
  settingsItemContainer:{
    width:'100%', 
    alignItems:'center', 
    minHeight:50, 
    justifyContent:'center', 
    backgroundColor:colors.blue, 
    borderRadius:15, 
    marginBottom:15,
  },
  settingsMenuItemText:{
    color:colors.white,
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2DBDFF',
    textAlign:'center',
    marginTop:15,
  },
  menuContainer:{
    width:'100%', 
    padding:15,
  },
})