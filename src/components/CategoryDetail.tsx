import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Modal,
  Text,
  View,
  Pressable,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Tables } from "../database.types";
import * as Animatable from "react-native-animatable";
import { FontAwesome } from "@expo/vector-icons";
import { toast } from "../utils/toast";
import products from "@/assets/data/products";
import ProductDetailImage from "./ProductDetailImage";
import { useDeleteCategory } from "../lib/mutate";
import EnlargeImage from "./EnlargeImage";

interface CategoryProps {
  openCategory: boolean;
  category: Tables<"categories">[];
  toggleCategory: () => void;
  categoryItemId: number;
}
const CategoryDetail = ({
  openCategory,
  category,
  toggleCategory,
  categoryItemId,
}: CategoryProps) => {
  const { mutate, isPending: isPendingDelete } = useDeleteCategory();
  const categoryItem = category.find((c) => c.id === categoryItemId);
  if (!categoryItem) {
    return;
  }

  const handleDelete = (id: number) => {
    Alert.alert("Confirm", "Are you sure you want to delete this Category", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteCategory(id),
      },
    ]);
  };
  function deleteCategory(id: number) {
    mutate(id);
    toast("item deleted", "error");
    toggleCategory();
  }
  return (
    <Modal animationType="fade" transparent={true} visible={openCategory}>
      <Animatable.View
        animation={"fadeInDown"}
        duration={1000}
        className="w-full  bg-white relative"
      >
        {categoryItem && (
          <View className="w-full px-4 py-4 mt-6">
            <View className="px-4">
              <EnlargeImage
                fallback={""}
                path={categoryItem?.image as string}
              />
            </View>
            <Text className="mt-4 font-bold">{categoryItem.category}</Text>
            <View className="w-full mt-2">
              {isPendingDelete ? (
                <ActivityIndicator />
              ) : (
                <Button
                  title="Delete"
                  color={"red"}
                  onPress={() => handleDelete(categoryItem.id)}
                />
              )}
            </View>
          </View>
        )}
        <Pressable className="absolute top-2 left-2" onPress={toggleCategory}>
          <FontAwesome name="arrow-left" size={28} />
        </Pressable>
      </Animatable.View>
    </Modal>
  );
};

export default CategoryDetail;
