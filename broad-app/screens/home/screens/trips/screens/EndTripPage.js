import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  SafeAreaView,
  Pressable,
  Keyboard,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useIsFocused } from "@react-navigation/native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { api_endpoint, csrftoken, renewCSRFToken } from "../../../../../util/utils";

export default function EndTripPage({ navigation, route }) {
  const [tripDetails, setTripDetails] = useState(
    route.params.tripDetails ?? null
  );
  const [rating, setRating] = useState(0);
  const [starList, setStarList] = useState([]);
  const [review, setReview] = useState('');

  const handleStarTouch = function (star) {
    if (star === rating) {
      setRating(0);
      return;
    }
    setRating(star);
    return;
  };

  const handleEndTrip = async(review, rating, pk) => {
    console.log('change requested');
    await renewCSRFToken()
    const response = await fetch(`${api_endpoint}trips/terminate/${pk}`, {
        method: 'PATCH',
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'review':review,
            'rating':parseInt(rating),
        })
    })
    if (response.status === 200){
      navigation.popToTop();
    }
  }

  useEffect(() => {
    let newStarList = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        newStarList.push(
          <TouchableWithoutFeedback
            key={i}
            onPress={() => {
              handleStarTouch(i);
            }}
          >
            <FontAwesome name="star" size={35} />
          </TouchableWithoutFeedback>
        );
      } else {
        newStarList.push(
          <TouchableWithoutFeedback
            key={i}
            onPress={() => {
              handleStarTouch(i);
            }}
          >
            <FontAwesome name="star-o" size={35} />
          </TouchableWithoutFeedback>
        );
      }
    }

    setStarList(newStarList);
  }, [rating]);

  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.foregroundContainer}>
          <ScrollView style={{ width: "100%" }}>
            <View
              style={{
                width: "100%",
                height: 200,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
                marginBottom: 30,
              }}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{ uri: tripDetails.imageURL }}
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 100,
                    margin: 10,
                  }}
                  resizeMode="cover"
                />
                <Text style={{ fontWeight: "bold", fontSize: 36 }}>
                  {tripDetails.username}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ fontWeight: "bold", marginBottom: 20 }}>
                Sürücünü puanla:
              </Text>
              <View style={{ flexDirection: "row", gap: 15 }}>{starList}</View>
            </View>
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", marginBottom: 20 }}>
                Sürücün ile ilgili fikirlerini paylaş:
              </Text>
              <TextInput
                placeholder="hello"
                style={{ borderWidth: 1, padding: 10, width: "80%" }}
                value={review}
                onChangeText={setReview}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 50,
              }}
            >
              <TouchableOpacity
                style={{
                  width: "40%",
                  borderRadius: 10,
                  backgroundColor: colors.blue,
                  padding: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={()=>navigation.goBack()}
              >
                <Text style={{ color: colors.white }}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: "40%",
                  borderRadius: 10,
                  backgroundColor: colors.blue,
                  padding: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={()=>handleEndTrip(review, rating, tripDetails.pk)}
              >
                <Text style={{ color: colors.white }}>Bitir</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const colors = {
  blue: "#2DBDFF",
  ligtherblue: "#2497CC",
  white: "#fff",
  black: "#000",
  deepblue: "#004369",
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  safeContainer: {
    flex: 1,
    backgroundColor: "#2DBDFF",
  },
  foregroundContainer: {
    backgroundColor: "#FFF",
    flexGrow: 1,
    justifyContent: "space-around",
    alignItems: "stretch",
    //marginBottom:71,
    //added bottom margin for the bottom nav bar
    //might change in the future
  },
  componentsContainer: {
    position: "absolute",
    zIndex: 1,
    width: "100%",
    padding: 15,
    alignItems: "stretch",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 0, 255, 0)",
  },
  backIcon: {
    padding: 15,
  },
  mapContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  markerIcon: {
    position: "absolute",
    zIndex: 1,
    paddingBottom: 60,
  },
  simpleTextInput: {
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    padding: 15,
    flexGrow: 1,
    borderColor: colors.deepblue,
  },
  buttonContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: 15,
    zIndex: 1,
    flexDirection: "row",
  },
  simpleToucableOpacity: {
    borderWidth: 1,
    borderRadius: 10,
    margin: 15,
    padding: 10,
    justifyContent: "center",
    backgroundColor: colors.blue,
    borderColor: colors.white,
  },
  buttonText: {
    color: colors.white,
  },
});
