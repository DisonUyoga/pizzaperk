import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";

interface PizzProps {
  id: number;
  name: string;
  description: string;
  latitude: number;
  location: string;
  phone: string;
  email: string;
  longitude: number;
  image: string;
}
const PizzaListItem = ({ pizza }: { pizza: PizzProps }) => {
  return (
    <TouchableOpacity className="px-4 items-center" activeOpacity={0.7}>
      <View style={styles.container} className="bg-green-500 px-4">
        <Text className="text-center text-white font-bold text-sm">
          {pizza.name}
        </Text>
        <View className="flex-row items-center justify-between">
          <Image
            source={{ uri: pizza.image }}
            resizeMode="contain"
            style={styles.image}
          />
          <View>
            <Text className="text-xs">{pizza.location}</Text>
            <Text className="text-xs">{pizza.email}</Text>
            <Text className="text-xs">{pizza.phone}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PizzaListItem;
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 50,
  },
});
