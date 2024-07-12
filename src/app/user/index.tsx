import { View, Text } from "react-native";
import React from "react";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useAppSelector } from "@/src/utils/hooks";
import Loading from "@/src/components/Loading";
import GrowingLoader from "@/src/components/GrowingLoader";

const Page = () => {
  const { adminToUser, userToAdmin } = useLocalSearchParams();
  const { session, authLoading, isAdmin, user } = useAppSelector(
    (state) => state.auth
  );

  if (authLoading) {
    return (
      <View className="bg-primary  flex-1">
        <GrowingLoader />
      </View>
    );
  }

  if (!session) {
    return <Redirect href={"/sign-in"} />;
  }
  if (adminToUser === "true") {
    return <Redirect href={"/user/menu"} />;
  }
  if (userToAdmin === "true") {
    return <Redirect href={"/admin/menu"} />;
  }
  if (isAdmin) {
    return <Redirect href={"/admin/menu"} />;
  }

  return <Redirect href={"/user/menu"} />;
};

export default Page;
