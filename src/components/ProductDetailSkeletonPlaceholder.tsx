import { View, Text } from "react-native";
import SkeletonPlaceholder from "expo-react-native-skeleton-placeholder";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

const ProductDetailSkeletonPlaceholder = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitleStyle: {
            color: "#161622",
          },
        }}
      />
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
          alignItems="center"
          width={300}
          justifyContent="center"
        >
          <SkeletonPlaceholder.Item
            width={300}
            height={250}
            borderRadius={10}
            marginBottom={20}
          />
          <SkeletonPlaceholder.Item
            alignItems="center"
            flexDirection="row"
            justifyContent="space-between"
          >
            <SkeletonPlaceholder.Item
              width={300}
              height={40}
              borderRadius={50}
            />
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item
            width={300}
            height={20}
            borderRadius={50}
            marginTop={20}
          />
          <SkeletonPlaceholder.Item
            width={300}
            height={40}
            borderRadius={50}
            marginTop={20}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

export default ProductDetailSkeletonPlaceholder;
