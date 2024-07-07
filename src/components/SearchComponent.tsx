import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useGetProducts } from "../lib/query";
import Skeleton from "./Skeleton";
import { Tables } from "../type";
import filter from "lodash/filter";
import { Icon } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import { router, useSegments } from "expo-router";
import { supabase } from "../lib/supabase";
import { FontAwesome } from "@expo/vector-icons";

const SearchComponent = ({ products }: { products: Tables<"products"> }) => {
  const [data, setData] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [textInputFossued, setTextInputFossued] = useState(true);
  const textInput = useRef<any>(0);

  const segments = useSegments();

  const handleSearch = async (query: string) => {
    if (!query) return;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .textSearch("name", query);

    setData(data);
  };

  return (
    <View className="w-72">
      <TouchableWithoutFeedback
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <View style={styles.SearchArea}>
          <Icon
            name="search"
            style={styles.searchIcon}
            type="material"
            iconStyle={{ marginLeft: 5 }}
            size={32}
          />
          <Text style={{ fontSize: 15 }}>What are you looking for ?</Text>
        </View>
      </TouchableWithoutFeedback>

      <Modal animationType="fade" transparent={false} visible={modalVisible}>
        <View style={styles.modal}>
          <View style={styles.view1}>
            <View style={styles.TextInput}>
              <Animatable.View
                animation={textInputFossued ? "fadeInRight" : "fadeInLeft"}
                duration={200}
              >
                <Icon
                  name={textInputFossued ? "arrow-back" : "search"}
                  onPress={() => {
                    if (textInputFossued) setModalVisible(false);
                    setTextInputFossued(true);
                  }}
                  style={styles.icon2}
                  type="material"
                  iconStyle={{ marginRight: 5 }}
                />
              </Animatable.View>

              <TextInput
                style={{ width: "90%" }}
                placeholder=""
                autoFocus={false}
                ref={textInput as any}
                onFocus={() => {
                  setTextInputFossued(true);
                }}
                onBlur={() => {
                  setTextInputFossued(false);
                }}
                onChangeText={(e) => handleSearch(e)}
              />

              <Animatable.View
                animation={textInputFossued ? "fadeInLeft" : ""}
                duration={200}
              >
                <Icon
                  name={textInputFossued ? ("cancel" as any) : (null as any)}
                  iconStyle={{ color: "#494848" }}
                  type="material"
                  style={{ marginRight: -10 }}
                  onPress={() => {
                    textInput.current.clear();
                    // handleSearch()
                  }}
                />
              </Animatable.View>
            </View>
          </View>

          {data?.length > 0 ? (
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss;
                    router.push(`/${segments[0]}/menu/${item?.id}`);
                    setModalVisible(false);
                    setTextInputFossued(true);
                  }}
                >
                  <View style={styles.view2}>
                    <Text style={{ color: "#000", fontSize: 15 }}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item: any) => item.id}
            />
          ) : (
            <FlatList
              data={products as any}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss;
                    router.push(`/${segments[0]}/menu/${item?.id}`);
                    setModalVisible(false);
                    setTextInputFossued(true);
                  }}
                >
                  <Animatable.Text
                    animation={"zoomIn"}
                    duration={400}
                    delay={100}
                    className="text-gray-600 px-2 py-2"
                  >
                    {item.name}
                  </Animatable.Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default SearchComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  text1: {
    color: "#ffff",
    fontSize: 16,
  },

  TextInput: {
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 0,
    borderColor: "#86939e",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },

  SearchArea: {
    marginTop: 10,
    width: "94%",
    height: 50,
    backgroundColor: "#ffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffff",
    flexDirection: "row",
    alignItems: "center",
  },

  searchIcon: { fontSize: 24, padding: 5, color: "#7a7878" },

  view1: {
    height: 70,
    justifyContent: "center",

    paddingHorizontal: 10,
  },

  view2: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },

  icon2: { fontSize: 24, padding: 5, color: "#ffff" },
  modal: {
    flex: 1,
  },
});
