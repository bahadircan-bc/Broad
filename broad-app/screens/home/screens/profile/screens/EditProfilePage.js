import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, Pressable, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';

export default function EditProfilePage({navigation, route}) {
  const [username, setUsername] = useState('');
  const [followers, setFollowers] = useState(0);
  const [tripCount, setTripCount] = useState(0);
  const [likes, setLikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [profilePicture, setProfilePicture] = useState();
  const [reviewList, setReviewList] = useState([]);
  const [editingName, setEditingName] = useState(false);
  const textInputRef = useRef();

  const fetchItems = async function(){}

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

  useEffect(()=>
  {
    if (editingName){
      textInputRef.current.focus()
    }
  }, [editingName])
  
  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.safeContainer}>
        <Pressable style={styles.foregroundContainer} onPress={() => Keyboard.dismiss()}>
          <View style={styles.pageHeaderContainer}>
            <View style={{justifyContent:'center'}}>
              <Image source={{uri:'https://placeimg.com/640/480/any'}} style={styles.profileImage}/>
              <FontAwesome name='edit' size={50} color={'rgba(255, 0, 255, 0.5)'} style={{position:'absolute', marginLeft:18}}/>
            </View>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
              <TextInput ref={textInputRef} style={styles.headerText} editable={editingName} onSubmitEditing={()=>{setEditingName(false);}} onBlur={()=>{setEditingName(false)}}>{username}</TextInput> 
              <FontAwesome name='edit' size={25} onPress={()=>{setEditingName(true);}}/>
            </View>
          </View>
          <View style={{flex:8, width:'100%', backgroundColor: colors.blue, padding:50, gap:30}}>
            <View style={styles.formContainer}>
              <Text style={styles.formText}>Isim:</Text>
              <TextInput style={styles.formInput}></TextInput>
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.formText}>Soyisim:</Text>
              <TextInput style={styles.formInput}></TextInput>
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.formText}>E-posta:</Text>
              <TextInput style={styles.formInput}></TextInput>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate('Profile')}}><Text>Onayla</Text></TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate('Profile')}}><Text>Vazgeç</Text></TouchableOpacity>
            </View>
          </View>
        </Pressable>
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
  formContainer: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'center',
  },
  formText: {
    color:colors.white,
    fontSize: 16,
    flex:1,
  },
  formInput: {
    backgroundColor: colors.white,
    flex:2,
    padding: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection:'row',
    justifyContent:'space-around'
  },
  button:{
    backgroundColor:colors.white,
    borderRadius: 15,
    margin: 50,
    padding: 15,
    paddingHorizontal: 30,
  },
})