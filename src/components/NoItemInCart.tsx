import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "./Button";
import { useRouter } from "expo-router";

const NoItemInCart = () => {
  const router = useRouter();
  const handlePress = () => {
    router.push("/user/menu");
  };
  return (
    <SafeAreaView className="flex-1 bg-primary px-4">
      <View>
        <Text className="text-gray-100 text-2xl text-center">
          No item in Cart!!!
        </Text>
        <Button
          text="Add Items"
          onPress={handlePress}
          otherStyles="bg-secondary p-4 w-full items-center mt-10 rounded"
        />
      </View>
    </SafeAreaView>
  );
};

export default NoItemInCart;
