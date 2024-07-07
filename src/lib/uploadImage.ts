import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";
import { supabase } from "@/src/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import { toast } from "../utils/toast";

export async function uploadImage(
  file: ImagePicker.ImagePickerAsset | undefined,
  image: string
) {
  if (!file) return;

  if (!image?.startsWith("file://")) {
    return;
  }
  const base64 = await FileSystem.readAsStringAsync(image as string, {
    encoding: "base64",
  });
  const filePath = `${Crypto.randomUUID()}.png`;
  const contentType = file.type;
  try {
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), { contentType });

    if (data) {
      toast("File uploaded successfully", "success");
      return data.path;
    }
  } catch (error) {}
}
