import { Link, Redirect, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { Text, View } from "@/src/components/Themed";
import { useAppSelector } from "../utils/hooks";

export default function NotFoundScreen() {
  const { session } = useAppSelector((state) => state.auth);
  if (!session) {
    return <Redirect href={"/sign-in"} />;
  }
  return <Redirect href={"/user"} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
