import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { PizzaSize } from "../type";
interface SelectSizeProps {
  sizes: string;
  handleSelected: (size: string) => void;
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
