import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Tables } from "../database.types";

interface Items {
  item: Tables<"categories">;
  toggleModal: (category?: string, id?: number) => void;
}
const CategoryOptions = ({ item, toggleModal }: Items) => {
  const [select, setSelect] = useState<string>();

  function toggleSelect() {
    toggleModal();
    setSelect("bg-secondary text-white");
  }
  return (
    <TouchableOpacity
      className="mt-4"
      onPress={() => toggleModal(item.category as string, item.id)}
    >
      <Text className={`text-gray-500 p-2 rounded ${select}`}>
        {item.category}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryOptions;
