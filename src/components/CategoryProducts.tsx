import { View, Text, Modal, Pressable, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Tables } from "../database.types";
import * as Animatable from "react-native-animatable";
import { FontAwesome } from "@expo/vector-icons";
import ProductCard from "./ProductCard";

interface CategoryProps {
  toggleCategoryModal: () => void;
  categoryModalVisible: boolean;
  products: Tables<"products">[];
  categories: Tables<"categories">[];
}
const CategoryProducts = ({
  toggleCategoryModal,
  categoryModalVisible,
  products,
  categories,
}: CategoryProps) => {
  const [category, setCategory] = useState<Tables<"categories"> | undefined>();

  useEffect(() => {
    filterCategoryItem();
  }, [categories, products]);
  function filterCategoryItem() {
    const categoryId = products[0].category_id;
    const categoryItem = categories.find((c) => c.id === categoryId);
    setCategory(categoryItem);
  }
  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={categoryModalVisible}
    >
      <Animatable.View
        animation={"fadeInDown"}
        duration={1000}
        className="p-4 w-full relative"
      >
        <View className="mt-10">
          <FlatList
            data={products}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item }) => <ProductCard product={item} />}
            contentContainerStyle={{ gap: 10 }}
            ListHeaderComponent={() => (
              <View className="w-full">
                {category && (
                  <Text className="text-xl">{category.category}</Text>
                )}
              </View>
            )}
          />
        </View>
        <Pressable
          className="absolute bg-secondary-100 rounded-full p-2 items-center justify-center top-2 left-2"
          onPress={toggleCategoryModal}
        >
          <FontAwesome name="times" size={20} />
        </Pressable>
      </Animatable.View>
    </Modal>
  );
};

export default CategoryProducts;
