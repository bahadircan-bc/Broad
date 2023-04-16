import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';


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
  const [likes, setLikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [profilePicture, setProfilePicture] = useState();
  const [reviewList, setReviewList] = useState([])

  const fetchItems = async function(){
    setReviewList([
      {
        name: 'test',
        imageURL: 'https://placeimg.com/640/480/any',
        comment: 'test comment',
      },
      {
        name: 'test2',
        imageURL: 'https://placeimg.com/640/480/any',
        comment: 'test2 comment',
      },
    ])
  }

  useEffect(()=>{
    try {
      setFollowers('followers');
      setUsername('username');
      setTripCount('tripCount');
      setLikes('likesCount');
      setRating('likesRating');
      setProfilePicture('profile');
      fetchItems()
    } catch (error) {
      console.log(error)
    }
    //instance.get('/user/get_profile/').then((response)=>{
    //  if(response.status == 200){
    //    setFollowers(response.data['followers']);
    //    setUsername(response.data['username']);
    //    setTripCount(response.data['tripCount']);
    //    setLikes(response.data['likesCount']);
    //    setRating(response.data['likesRating']);
    //    setProfilePicture(response.data['profile']);
    //  }
    //  var newReviewList = [];
    //  for (var k in response.data.reviews){
    //    const review = response.data.reviews[k];
    //    newReviewList.push(<ReviewElement key={k} name={review.author} image={{uri:`${ENDPOINT}/media/${review.profilePicture}`}} comment={review.content}/>);
    //  }
    //  setReviewList(newReviewList);
    //})
  }, [])

  const renderItem = function({item}){
    return (
      <ReviewElement name={item.name} imageURL={item.imageURL} comment={item.comment}/>
    )
  }
  
  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.foregroundContainer}>
          <View style={styles.pageHeaderContainer}>
            <Image source={{uri:'https://placeimg.com/640/480/any'}} style={styles.profileImage}/>
            <Text style={styles.headerText}>{username}</Text>
            <View style={styles.pageHeaderStatsContainer}>
              <View style={{alignItems:'center'}}><Text style={styles.pageHeaderStatTitleText}>Takipçi</Text><Text style={styles.pageHeaderStatText}>{followers}</Text></View>
              <View style={{alignItems:'center'}}><Text style={styles.pageHeaderStatTitleText}>Değerlendirme</Text><Text style={styles.pageHeaderStatText}>{likes>0 ? likesRating : '?'}/5</Text></View>
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
    //marginLeft:15, 
    //marginRight:15, 
    //marginTop:15, 
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
      //marginBottom:71,
      //added bottom margin for the bottom nav bar
      //might change in the future
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