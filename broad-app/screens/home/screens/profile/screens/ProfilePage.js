import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { api_endpoint } from '../../../../../util/utils';
import { useIsFocused } from '@react-navigation/native';


const ReviewElement = ({name, imageURL, comment}) => {
  return (
    <View style={styles.flatlistItem} >
      <Image source={{uri:imageURL}} style={styles.itemImage}/>
      <View style={styles.itemContainer}>
        <Text style={styles.itemNameText}>{name}</Text>
        <Text style={styles.itemCommentText}>{comment}</Text>
      </View>
    </View>
  )
}

export default function ProfilePage({navigation}) {
  const [username, setUsername] = useState('');
  const [followers, setFollowers] = useState(0);
  const [tripCount, setTripCount] = useState(0);
  const [rating, setRating] = useState(0);
  const [profilePicture, setProfilePicture] = useState();
  const [reviewList, setReviewList] = useState([])
  const isFocused = useIsFocused()

  const fetchItems = async function(){
    let response = await fetch(`${api_endpoint}whoami/`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => {if(response.status == 200) return response.json(); else throw new Error(`HTTP status: ${response.status}`);})
    console.log(`response is : ${JSON.stringify(response)}`);
    const results = response.results[0];
    setReviewList(results.reviews)
    setFollowers(results.followers.length);
    setUsername(results.profile_name);
    setTripCount(results.trips_as_driver.length + results.trips_as_passenger.length);
    setRating(parseInt(results.average_rating));
    setProfilePicture(results.profile_picture);
  }

  useEffect(()=>{
    if(!isFocused) return;
    try {
      fetchItems()
    } catch (error) {
      console.log(error)
    }
  }, [isFocused])

  const renderItem = function({item}){
    return (
      <ReviewElement name={item.author.profile_name} imageURL={item.author.profile_picture} comment={item.content}/>
    )
  }
  
  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.foregroundContainer}>
          <View style={styles.pageHeaderContainer}>
            <Image source={{uri:profilePicture}} style={styles.profileImage}/>
            <Text style={styles.headerText}>{username}</Text>
            <View style={styles.pageHeaderStatsContainer}>
              <View style={{alignItems:'center'}}><Text style={styles.pageHeaderStatTitleText}>Takipçi</Text><Text style={styles.pageHeaderStatText}>{followers}</Text></View>
              <View style={{alignItems:'center'}}><Text style={styles.pageHeaderStatTitleText}>Değerlendirme</Text><Text style={styles.pageHeaderStatText}>{rating>0 ? rating : '?'}/5</Text></View>
              <View style={{alignItems:'center'}}><Text style={styles.pageHeaderStatTitleText}>Yolculuklar</Text><Text style={styles.pageHeaderStatText}>{tripCount}</Text></View>
            </View>
            <View style={{position:'absolute', top:25, right:10}}>

            <TouchableWithoutFeedback style={{padding:10, justifyContent:'flex-end', alignItems:'flex-end'}} onPress={()=>{navigation.navigate('Options')}}>
              <FontAwesome 
                name='cog' size={25} color={colors.blue} 
               />

            </TouchableWithoutFeedback>
                </View>
          </View>
          <View style={{flex:8, width:'100%', backgroundColor: colors.blue}}>
            {reviewList?.length > 0 
            ? 
            <FlatList
            data={reviewList}
            renderItem={renderItem}/> 
            : 
            <Text style={{alignSelf:'center'}}>Henüz hakkında hiç yorum yapılmamış!</Text>
            }
          </View>
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
  flatlistItem:{
    flexDirection: 'row', 
    padding:10, 
    margin:10,
    marginBottom:0,
    backgroundColor:colors.ligtherblue,
    borderRadius:15,
  },
  itemImage:{
    height: 50, 
    width: 50, 
    borderRadius: 50, 
    borderColor: colors.white, 
    borderWidth: 1,
  },
  itemContainer:{
    flexDirection: 'column',
  },
  itemNameText:{
    fontSize:20,
    fontWeight: 'bold',
    marginLeft:10,
    color:colors.white,
  },
  itemCommentText:{
    margin: 5,
    marginLeft:25,
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
  },
  pageHeaderContainer:{
    flex:5,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    position:'relative',
  },
  profileImage:{
    height: 75,
    width: 75,
    borderRadius:75,
  },
  headerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2DBDFF',
    textAlign:'center',
    marginTop:15,
  },
  pageHeaderStatTitleText:{
    fontSize:16, 
    color:colors.ligtherblue,
  },
  pageHeaderStatText:{
    color:colors.ligtherblue,
  },
  pageHeaderStatsContainer:{
    flexDirection: 'row',
    justifyContent:'space-around',
    width:'100%',
    marginTop:15,
  },
})