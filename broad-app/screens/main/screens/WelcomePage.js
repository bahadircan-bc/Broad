import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';

export default function WelcomePage({navigation}) {

    const onSignInClicked = function(){
        navigation.navigate('SignIn');
    }
    const onSignUpClicked = function(){
        navigation.navigate('SignUp');
    }

    const onBypassClicked = function(){
      navigation.navigate('Home', { screen: 'ProfileStack' });
    }
    
    return (
      <View style={styles.backgroundContainer}>
        <SafeAreaView style={styles.safeContainer}>
          <View style={styles.foregroundContainer}>
            <Text style={styles.logo}>BROAD</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.simpleTouchableOpacity} onPress={onSignInClicked}>
                <Text>Giriş Yap</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.simpleTouchableOpacity} onPress={onSignUpClicked}>
                <Text>Kaydol</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.simpleTouchableOpacity} onPress={onBypassClicked}>
                <Text>Bypass</Text>
              </TouchableOpacity> */}
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
        flex:1,
        justifyContent:'space-around',
        alignItems:'center',
        //marginBottom:71,
        //added bottom margin for the bottom nav bar
        //might change in the future
    },
    logo: {
        fontSize: 96,
        color: '#2DBDFF',
        textAlign: 'center',
    },
    buttonContainer:{
        width:'75%'
    },
    simpleTouchableOpacity: {
        borderWidth: 1,
        borderRadius: 10,
        margin: 15,
        padding: 15,
    },
})