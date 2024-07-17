import { Image, ImageContentFit } from "expo-image";
import { StyleSheet } from "react-native";
import React, { ComponentProps, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { blurhash } from "@/assets/data/products";
import { useSupabaseImageDownLoad } from "../utils/useSupabaseImageDownLoad";

type RemoteImageProps = {
  path?: string;
  fallback: string;
  fit: ImageContentFit | undefined;
} & Omit<ComponentProps<typeof Image>, "source">;

const RemoteImage = ({
  path,
  fit,
  fallback,
  ...imageProps
}: RemoteImageProps) => {
  const image = useSupabaseImageDownLoad(path);

  if (!image) {
  }

  return (
    <Image
      style={{ height: 60, width: 60, borderRadius: 5 }}
      source={image || fallback}
      placeholder={{ blurhash }}
      contentFit={fit}
      transition={1000}
    />
  );
};

export default RemoteImage;
