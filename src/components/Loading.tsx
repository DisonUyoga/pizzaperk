// App.js
import { Stack } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { ScrollView } from "react-native";
import { StyleSheet, View } from "react-native";

export default function Loading() {
  return (
    <View style={styles.container} className="bg-white">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <LottieView
        source={require("../../assets/loading.json")}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: 200,
    height: 200,
  },
});
