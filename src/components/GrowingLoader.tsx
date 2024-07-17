// App.js
import { Stack } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function DeletingLoader() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <LottieView
        source={require("../../assets/growingLoader.json")}
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
