import { View, Text, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Callout, Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import * as Location from "expo-location";
import { pizzaPlaces, pizzaTypes } from "@/assets/data/locationData";
import PizzaListItem from "@/components/PizzaListItem";

const Airbnb = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [selectedItem, setSelectedItem] = useState(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<any>();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);
  
  function getInitialState() {
    return {
      region: {
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude || 0,
        latitudeDelta: 0.0922 || 0,
        longitudeDelta: 0.0421 || 0,
      },
    };
  }
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MapView
        className="flex-1"
        initialRegion={{
          latitude: -1.3028425,
          longitude: 36.8887798,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {pizzaPlaces &&
          pizzaPlaces.map((place) => (
            <View key={place.id}>
              <Marker
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                title={place.name}
                description={place.description}
              >
                <View className="rounded-full w-full">
                  <Image
                    source={{ uri: place.image }}
                    className="w-[50px] h-16 aspect-square"
                  />
                </View>
              </Marker>
            </View>
          ))}
      </MapView>
      <PizzaListItem pizza={pizzaPlaces[0]} />
    </>
  );
};

export default Airbnb;
