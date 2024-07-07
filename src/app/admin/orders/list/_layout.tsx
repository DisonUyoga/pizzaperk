import { View, Text } from "react-native";
import React from "react";
import Orders from "./index";
import archive from "./archive";
import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
const Tab = withLayoutContext(createMaterialTopTabNavigator().Navigator);
const Root = () => {
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <Tab
        screenOptions={{
          tabBarStyle: { backgroundColor: "#161622" },
          tabBarLabelStyle: { color: "#fff" },
          tabBarActiveTintColor: "#FF9001",
          tabBarIndicatorStyle: { backgroundColor: "#FF9001" },
        }}
      />
    </SafeAreaView>
  );
};

export default Root;
