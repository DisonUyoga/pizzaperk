import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import React, { ComponentProps, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { blurhash } from "@/assets/data/products";
import { useSupabaseImageDownLoad } from "../utils/useSupabaseImageDownLoad";

type RemoteImageProps = {
  path?: string;
  fallback: string;
} & Omit<ComponentProps<typeof Image>, "source">;

const RemoteImage = ({ path, fallback, ...imageProps }: RemoteImageProps) => {
  const image = useSupabaseImageDownLoad(path);

  if (!image) {
  }

  return (
    <Image
      style={styles.image}
      source={image}
      placeholder={{ blurhash }}
      contentFit="cover"
      transition={1000}
    />
  );
};

export default RemoteImage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderBlockColor: "#FF9C01",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,

    borderRadius: 5,
  },
});
