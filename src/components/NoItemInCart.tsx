import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "./Button";
import { useRouter } from "expo-router";
interface NoItemProps {
  text: string;
  title: string;
}
const NoItemInCart = ({ text, title }: NoItemProps) => {
  const router = useRouter();
  const handlePress = () => {
    router.push("/user/menu");
  };
  return (
    <SafeAreaView className="flex-1 bg-primary px-4">
      <View>
        <Text className="text-gray-100 text-2xl text-center">{text}</Text>
        <Button
          text={title}
          onPress={handlePress}
          otherStyles="bg-secondary p-4 w-full items-center mt-10 rounded"
        />
      </View>
    </SafeAreaView>
  );
};

export default NoItemInCart;
