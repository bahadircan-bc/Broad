import { StyleSheet, Text, View, SafeAreaView, Pressable, Keyboard, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useIsFocused } from '@react-navigation/native';

const BiddingBubbleView = (props)=>{
  const [bidReplied, setBidReplied] = useState(false);
  const [bidAccepted, setBidAccepted] = useState(false);

  const onAcceptBid = async function() {
    setBidAccepted(true);
    setBidReplied(true);
    console.log('reply the requester');
  }

  const onRejectBid = async function() {
    setBidAccepted(true);
    setBidReplied(true);
    console.log('reply the requester');
  }
  
  return (
    <View style={styles.customBubbleContainer}>
      <Text style={styles.customBubbleText}>
        <Text>{`${props.tripDate} tarihli\n`}</Text>
        <Text>{`${props.tripDirection} yolculuğunuza\n`}</Text>
        <Text>{`teklifiniz var.\n`}</Text>
        <Text style={{fontSize:32}}>{`${props.biddingValue}₺`}</Text>
      </Text>
      <View style={styles.customBubbleButtonsContainer}>
        {bidReplied ? (bidAccepted 
          ? <Text style={styles.customBubbleBidAcceptedText}>Kabul edildi</Text> 
          : <Text style={styles.customBubbleBidRejectedText}>Reddedildi</Text>) 
          : <>
          <TouchableOpacity style={styles.customBubbleAcceptButton}
          onPress={onAcceptBid}>
            <Text style={{color:colors.white}}>Kabul Et</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.customBubbleRejectButton}
          onPress={onRejectBid}>
            <Text style={{color:colors.white}}>Reddet</Text>
          </TouchableOpacity>
          </>}
      </View>
    </View>
  )
}

const renderBubble = (props) => {
  const { currentMessage } = props;
  if (currentMessage.biddingValue) {
    return (<BiddingBubbleView biddingValue={props.currentMessage.biddingValue} tripDate={props.currentMessage.tripDate} tripDirection={props.currentMessage.tripDirection} tripPK={props.currentMessage.tripPK}/>);
  }
  return <Bubble {...props}/>;
}

export default function ConversationPage({navigation, route}) {
  const [loggedInUsername, setLoggedInUsername] = useState();
  const [loggedInProfilePicture, setLoggedInProfilePicture] = useState();
  const [messages, setMessages] = useState([]);
  const [storedMessages, setStoredMessages] = useState();
  const isFocused = useIsFocused();  

  const sendBid = async function(){
    //get stored messages
    //append the message to the relevant history
    //set stored messages

    //send message to the receiver
  }

  useEffect(()=>{
    //get the username and profile picture from storage
    setLoggedInUsername('testUsername');
    setLoggedInProfilePicture('https://placeimg.com/640/480/any');

    //check if chatsocket is on
    //connect if its not
    //set the onmessage, onconnect, ondisconnect functions
    //change onmessage function based on isFocused
    
    //get the stored messages
    //check if relevant history exists
    //create if not

    //set messages in GiftedChat

    //send/add one extra message if route is coming from SearchItemPage
  })

  const onSend = async (messages = []) => {

    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

    //append message to GiftedChat
    
    //get stored messages
    //check if relevant history exists
    //create if not
    //append the message to the relevant history
    //set stored messages

    //send the message to chatsocket
  }

  const onDeleteHistory = async function(){

    alert(`Geçmiş Silindi.`); 
  
    //get the history
    //delete the particular part in history
    //store it back
  
    //await getMyObject(`${loggedInUsername}_chats`).then((storedMessages) => {
    //  storedMessages[`${route.params.name}`] = [];
    //  console.log(JSON.stringify(storedMessages))
    //  setObjectValue(`${loggedInUsername}_chats`, storedMessages);
    //});
    //setMessages([]);
  
  }

  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.safeContainer}>
        <Pressable style={styles.foregroundContainer} onPress={()=>Keyboard.dismiss()}>
          <View style={styles.pageHeader}>
            <FontAwesome name='angle-left' size={36} color={colors.white} style={styles.backIcon}
              onPress={()=>navigation.goBack()}/>
            <View style={styles.profileContainer}> 
              <Image style={styles.profileImage} source={route.params.image}/>
              <Text style={styles.profileNameText}>{route.params.name}</Text>
            </View>
            <Menu style={styles.menuContainer}>
              <MenuTrigger>
                <FontAwesome name='ellipsis-v' size={24} color={colors.white} style={styles.settingsIcon}/>
              </MenuTrigger>
              <MenuOptions customStyles={styles.popupMenu}>
                <MenuOption onSelect={onDeleteHistory} text='Geçmişi Sil'/>
                <MenuOption text='Sustur'/>
                <MenuOption text='Engelle'/>
                <MenuOption text='Şikayet Et'/>
              </MenuOptions>
            </Menu>
          </View>

          <GiftedChat
              renderBubble={renderBubble}
              messages={messages}
              onSend={messages => onSend(messages)}
              user={{
                _id: 1,
                name: `${loggedInUsername}`,
                avatar: loggedInProfilePicture,
              }}
              scrollToBottom={true}
              showUserAvatar={false}
              />
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
  popupMenu: {
    optionsWrapper:{borderRadius:15},
    optionWrapper:{padding:10}, 
    optionText:{textAlign:'center', fontSize:18}, 
    optionsContainer:{width:'50%', borderRadius:15},
  },
  pageHeader:{
    width:'100%', 
    justifyContent:'center', 
    alignItems:'center', 
    backgroundColor:colors.blue, 
    padding:15,
  },
  backIcon:{
    position:'absolute', 
    alignSelf:'flex-start', 
    padding:15,
  },
  settingsIcon:{
    padding:15,
  },
  profileContainer:{
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'center',
  },
  profileImage:{
    height:50, 
    width:50, 
    borderRadius:50,
  },
  profileNameText:{
    fontSize:24, 
    margin:8, 
    color:colors.white,
  },
  menuContainer:{
    position:'absolute', 
    alignSelf:'flex-end',
  },
  customBubbleContainer:{
    borderRadius:15, 
    justifyContent:'center', 
    alignItems:'center', 
    backgroundColor:colors.ligtherblue,
  },
  customBubbleText:{
    fontWeight:'bold',
    margin:10, 
    color:colors.white, 
    textAlign:'center',
  },
  customBubbleButtonsContainer:{
    flexDirection:'row',
  },
  customBubbleBidAcceptedText:{
    backgroundColor:'green', 
    margin:5, 
    padding:5, 
    justifyContent:'center', 
    alignItems:'center', 
    borderRadius:5, 
    color:colors.white,
  },
  customBubbleBidRejectedText:{
    backgroundColor:'red', 
    margin:5, 
    padding:5, 
    justifyContent:'center', 
    alignItems:'center', 
    borderRadius:5, 
    color:colors.white,
  },
  customBubbleAcceptButton:{
    backgroundColor:'green', 
    borderRadius:10, 
    margin:10, 
    padding:10,
  },
  customBubbleRejectButton:{
    backgroundColor:'red', 
    borderRadius:10, 
    margin:10, 
    padding:10,
  },
})