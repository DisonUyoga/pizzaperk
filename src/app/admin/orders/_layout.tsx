import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const Root = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#161622",
        },
        headerTitleStyle: {
          color: "#ffff",
          fontWeight: "300",
        },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="list"
        options={{ title: "Orders", headerShown: false }}
      />
    </Stack>
  );
};

export default Root;
