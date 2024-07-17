import { View, Text, ScrollView } from "react-native";
import React from "react";
import SkeletonPlaceholder from "expo-react-native-skeleton-placeholder";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

const OrderPlaceholderSkeleton = () => {
  return (
    <SafeAreaView className="flex-1  px-4 bg-white">
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
            height={40}
            borderRadius={50}
            marginTop={20}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </SafeAreaView>
  );
};

export default OrderPlaceholderSkeleton;
