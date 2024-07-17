import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { PizzaSize, Tables } from "../type";
import { CartItems } from "../app/features/slices/cartSlice";
interface SelectSizeProps {
  sizes: PizzaSize;
  handleSelected: (size: PizzaSize) => void;
  selected: string;
}
const SelectSize = ({ sizes, handleSelected, selected }: SelectSizeProps) => {
  return (
    <TouchableOpacity
      onPress={() => handleSelected(sizes)}
      activeOpacity={0.4}
      style={styles.container}
      className={selected === sizes ? `bg-secondary` : ""}
    >
      <Text className="text-white font-bold text-xl">{sizes}</Text>
    </TouchableOpacity>
  );
};

export default SelectSize;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#FF9C01",
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
