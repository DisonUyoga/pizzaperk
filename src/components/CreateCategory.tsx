import {
  View,
  Text,
  Modal,
  Alert,
  TouchableOpacity,
  Image,
  Button,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import { FontAwesome } from "@expo/vector-icons";
import { Formik } from "formik";
import { Tables } from "../database.types";
import { InsertTables } from "../type";
import FormElement from "@/src/components/FormElement";
import * as ImagePicker from "expo-image-picker";
import icons from "@/constants/icons";
import { uploadImage } from "../lib/uploadImage";
import { useCreateCategory } from "../lib/mutate";
import UpLoading from "./Uploading";
import { toast } from "../utils/toast";
import { router } from "expo-router";
import { categoryValidation } from "../utils/validation";
import ValidationError from "./ValidationError";
import { useAppSelector } from "../utils/hooks";

interface FreeDeliveryProps {
  createVisible: boolean;
  toggleCreateVisible: () => void;
}
const CreateCategory = ({
  createVisible,
  toggleCreateVisible,
}: FreeDeliveryProps) => {
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const { globalErrors } = useAppSelector((state) => state.product);
  const [error, setError] = useState<any>([...globalErrors]);
  const [file, setFile] = useState<ImagePicker.ImagePickerAsset>();
  const { mutate, isPending } = useCreateCategory();
  if (isPending) {
    return (
      <View className="bg-primary flex-1 items-center justify-center">
        <UpLoading />
      </View>
    );
  }
  const openPicker = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
      });

      if (!res.canceled) {
        setImage(res.assets[0].uri);
        setFile(res.assets[0]);
      }
    } catch (error: any) {
      Alert.alert("Error", error);
    }
  };
  async function createCategoryItem() {
    const imagePath = (await uploadImage(file, image as string)) as
      | string
      | null;

    try {
      await categoryValidation.validate({
        category,
        image: imagePath,
      });
      mutate(
        { image: imagePath, category },
        {
          onSuccess: () => {
            toast(category, "success");
            toggleCreateVisible();
          },
        }
      );
    } catch (error: any) {
      error.errors.map((err: string) =>
        setError((prev: string[]) => {
          return [...prev, err];
        })
      );
    }
  }
 
  return (
    <Modal animationType="fade" transparent={true} visible={createVisible}>
      <Animatable.View
        className="relative p-4 bg-white "
        animation={"fadeInUp"}
        duration={1000}
      >
        <Text className="text-center text-gray-600 text-xl font-bold">
          Create Category
        </Text>

        <View className="w-full">
          <TextInput
            value={category}
            onChangeText={(e) => setCategory(e)}
            placeholder="category"
            className="border border-secondary-100 mt-4 rounded p-2"
          />
          <TouchableOpacity
            onPress={() => openPicker()}
            className="w-full mt-4 rounded"
          >
            <View className="w-full h-40 px-4 bg-black-100 roudned-2xl justify-center items-center space-y-2">
              <Text className="text-white">Upload Product Image</Text>
              <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-1/2 h-1/2"
                />
              </View>
              {file?.fileName && (
                <Text className="text-white text-xs">{file.fileName}</Text>
              )}
            </View>
          </TouchableOpacity>
          {isPending ? (
            <ActivityIndicator />
          ) : (
            <View className="w-full mt-4 mb-4">
              <Button
                title="Create"
                onPress={() => createCategoryItem()}
                color={"#FF8E01"}
              />
            </View>
          )}
        </View>
        <TouchableOpacity
          className="absolute top-2 left-2"
          onPress={toggleCreateVisible}
        >
          <FontAwesome name="arrow-left" size={28} color={"#000"} />
        </TouchableOpacity>
        <View className="mt-4">
          {error.length > 0 &&
            error.map((err: string, index: number) => (
              <ValidationError key={index} error={err} />
            ))}
        </View>
      </Animatable.View>
    </Modal>
  );
};

export default CreateCategory;
