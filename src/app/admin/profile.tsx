import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/src/components/Button";
import { supabase } from "@/src/lib/supabase";
import { useAppDispatch, useAppSelector } from "@/src/utils/hooks";
import GrowingLoader from "@/src/components/GrowingLoader";
import { Link, Redirect, router } from "expo-router";
import { sessionToken, setAdmin } from "../features/slices/AuthSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const { session, user, authLoading } = useAppSelector((state) => state.auth);
  if (authLoading) {
    return (
      <View className="bg-primary items-center justify-center flex-1">
        <GrowingLoader />
      </View>
    );
  }
  if (!session) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <SafeAreaView className="bg-primary px-4 flex-1 space-y-6">
      <Text className="text-xs text-gray-100 ">
        <Text className="text-xs text-gray-100 ">
          {user ? user?.user.email : session?.email}
        </Text>
      </Text>

      <TouchableOpacity activeOpacity={0.7}>
        <Button
          text="Sign out"
          otherStyles="w-full bg-secondary text-gray-100 text-center items-center justify-center py-4 rounded"
          onPress={async () => {
            dispatch(sessionToken({ session: null }));
            dispatch(setAdmin({ isAdmin: false }));
            await AsyncStorage.removeItem("@user");
            supabase.auth.signOut();
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.7}>
        <Button
          text="go to user"
          otherStyles="w-full bg-secondary text-gray-100 text-center items-center justify-center py-4 rounded"
          onPress={() => {
            router.push("/user/menu?adminToUser=true");
          }}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;
