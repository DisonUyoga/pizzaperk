import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import SigninWithGoogle from "@/src/components/SigninWithGoogleOrMail";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAppSelector } from "@/src/utils/hooks";

const Signup = () => {
  const { session } = useAppSelector((state) => state.auth);
  if (session) {
    return <Redirect href={"/user"} />;
  }
  return (
    <SafeAreaView className="flex-1 bg-primary items-center justify-center px-4">
      <ScrollView className="flex-1">
        <Stack.Screen
          options={{
            title: "Sign up",
            headerStyle: {
              backgroundColor: "#161622",
            },
            headerTitleStyle: {
              color: "#ffff",
              fontWeight: "300",
            },
          }}
        />
        <SigninWithGoogle title="Sign in with google" type="signup" />
        <StatusBar backgroundColor="#161622" style="light" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
