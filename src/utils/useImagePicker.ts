import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";
import { Tables } from "../database.types";
export function useImagePicker(updatingProduct: Tables<"products">) {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<ImagePicker.ImagePickerAsset>();

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

  return { image, file };
}
