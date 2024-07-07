import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "@/src/components/constants/Colors";
import { useColorScheme } from "@/src/components/useColorScheme";
import { useAppSelector } from "@/src/utils/hooks";

const Root = () => {
  const colorScheme = useColorScheme();
  const { totalQuantity } = useAppSelector((state) => state.cart);
  return (
    <Stack
      screenOptions={{
        headerTintColor: "#fff",
        headerStyle: {
          backgroundColor: "#040463",
        },

        headerTitleStyle: {
          color: "#ffff",
          fontWeight: "300",
        },
        headerRight: () => (
          <Link href="/cart" asChild>
            <Pressable>
              {({ pressed }) => (
                <View className="relative">
                  <FontAwesome
                    name="shopping-cart"
                    size={25}
                    color="#ffff"
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                  <Text style={styles.container}>{totalQuantity}</Text>
                </View>
              )}
            </Pressable>
          </Link>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Menu",
        }}
      />
    </Stack>
  );
};

export default Root;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF9C01",
    aspectRatio: 1,
    padding: 5,
    fontSize: 10,
    textAlign: "center",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: -1,
    top: -15,
    color: "#ffff",
  },
});
