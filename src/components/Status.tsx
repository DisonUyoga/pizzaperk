import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { OrderStatus } from "../type";
interface StatusProps {
  status: OrderStatus;
  handleSelected: (status: OrderStatus) => void;
  selected: OrderStatus | undefined;
}
const Status = ({ status, handleSelected, selected }: StatusProps) => {
 
  return (
    <TouchableOpacity
      onPress={() => handleSelected(status)}
      activeOpacity={0.7}
      className={`${
        status === selected ? "bg-gray-100" : ""
      } border px-4 py-2 rounded ml-1 ${
        status == "DELIVERED"
          ? "border-green-500"
          : status === "COOKING"
          ? "border-orange-500"
          : status === "DELIVERING"
          ? "border-secondary-100"
          : "border-gray-100"
      }`}
    >
      <Text className={`${status === selected ? "text-black" : "text-white"} `}>
        {status}
      </Text>
    </TouchableOpacity>
  );
};

export default Status;
