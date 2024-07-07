import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Tables } from "../database.types";
import RNPickerSelect, { Item } from "react-native-picker-select";
import CategoryOptions from "./CategoryOptions";
import * as Animatable from "react-native-animatable";
import { FontAwesome } from "@expo/vector-icons";

interface SelectDropDownProps {
  items: Tables<"categories">[];
  modalVisible: boolean;
  toggleModal: (category?: string, id?: number) => void;
}

const SelectDropDown = ({
  toggleModal,
  modalVisible,
  items,
}: SelectDropDownProps) => {
  const [selectedValue, setSelectedValue] = useState(null);
  return (
    <ScrollView>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => toggleModal()}
      >
        <Animatable.View
          animation={"fadeInDown"}
          duration={1000}
          className="w-full px-4 items-center py-4 bg-white relative"
        >
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <CategoryOptions toggleModal={toggleModal} item={item} />
            )}
          />
          <Pressable
            className="absolute left-2 top-2"
            onPress={() => toggleModal()}
          >
            <FontAwesome name="arrow-left" size={28} color={"#000"} />
          </Pressable>
        </Animatable.View>
      </Modal>
    </ScrollView>
  );
};

export default SelectDropDown;
