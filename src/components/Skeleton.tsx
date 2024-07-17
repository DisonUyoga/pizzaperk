import products from "@/assets/data/products";
import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import SkeletonCardPlaceholder from "./SkeletonCardPlaceholder";
import { Stack } from "expo-router";

const Skeleton = ({ item }: any) => {
  const [data, setData] = useState(item || products);

  return (
    <ScrollView style={styles.container} className="bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitleStyle: {
            color: "#161622",
          },
        }}
      />
      {data.map((product: any) => (
        <SkeletonCardPlaceholder key={product.id} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
});

export default Skeleton;
