import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import { Redirect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import { Pressable, Text, TouchableOpacity } from "react-native";
import {
  processingAuth,
  sessionToken,
  setAdmin,
  setProfileData,
  setUser,
} from "../app/features/slices/AuthSlice";
import { supabase } from "../lib/supabase";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { toast } from "../utils/toast";

WebBrowser.maybeCompleteAuthSession();
interface SigninProps {
  email: string;
  name: string;
}

const GoogleLogin = () => {
  const dispatch = useAppDispatch();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_CLIENT_ID_ANDROID,
    iosClientId: process.env.EXPO_PUBLIC_CLIENT_ID_IOS,
  });
  const { session, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!session) {
      googleSignIn();
    }
  }, [response]);

  async function googleSignIn() {
    dispatch(processingAuth({ authLoading: true }));
    const user = await AsyncStorage.getItem("@user");
    try {
      if (!user) {
        if (response?.type === "success") {
          toast("google sign in successfull", "success");
          dispatch(processingAuth({ authLoading: true }));
          await getUserInfo(response.authentication?.accessToken);
        }
      } else {
        const parseUser = JSON.parse(user);

        const { error: supabaseErrorLogin } =
          await supabase.auth.signInWithPassword({
            email: parseUser.email,
            password: parseUser.name,
          });
        const { data, error } = await supabase.auth.getSession();
        if (!error) {
          dispatch(
            sessionToken({
              session: {
                email: data.session?.user.email,
                name: data.session?.user.email,
              },
            })
          );
          dispatch(setUser({ user: data.session }));
          dispatch(processingAuth({ authLoading: false }));
        }
      }
    } catch (error) {
      toast(JSON.stringify(error), "error");
    } finally {
      dispatch(processingAuth({ authLoading: false }));
    }
  }

  async function getUserInfo(token: string | undefined) {
    dispatch(processingAuth({ authLoading: true }));
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      if (user) {
        handleSignInWithGoogle(user);
      }
    } catch (error) {
      toast(JSON.stringify(error), "error");
    } finally {
      dispatch(processingAuth({ authLoading: false }));
    }
  }

  async function handleSignInWithGoogle(user: any) {
    dispatch(processingAuth({ authLoading: true }));
    if (!user) return;
    await AsyncStorage.setItem("@user", JSON.stringify(user));

    const data: SigninProps = {
      email: user?.email,
      name: user?.name,
    };

    const { error: supabaseError } = await supabase.auth.signUp({
      email: data.email,
      password: data.name,
    });

    if (!supabaseError?.message || "User already registered") {
      const { error: supabaseErrorLogin } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.name,
        });
      if (!supabaseError?.message) {
        toast("login successfull", "success");
        const { data, error } = await supabase.auth.getSession();
        if (!error) {
          dispatch(
            sessionToken({
              session: {
                email: data.session?.user.email,
                name: data.session?.user.email,
              },
            })
          );
          dispatch(processingAuth({ authLoading: false }));
        }

        dispatch(setUser({ user: data.session }));
        // query profile data to determine the role i.e user or admin session
        if (data.session) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.session.user.id)
            .single();

          dispatch(setProfileData({ profile: profileData }));
          dispatch(
            setAdmin({ isAdmin: profileData?.group === "ADMIN" ? true : false })
          );
          dispatch(processingAuth({ authLoading: false }));
        }
        return;
      }
    }
    if (supabaseError?.message !== "User already registered") {
      toast(supabaseError?.message, "error");
    }
  }

  return (
    <Pressable className="bg-transparent w-full border border-secondary rounded mb-2">
      <TouchableOpacity
        className="flex-row items-center justify-center"
        activeOpacity={0.7}
        onPress={() => promptAsync()}
      >
        <FontAwesome name="google" size={25} color={"red"} />
        <Text className="text-center p-4 text-white">Login with google</Text>
      </TouchableOpacity>
    </Pressable>
  );
};

export default GoogleLogin;
