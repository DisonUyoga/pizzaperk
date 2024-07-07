import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { store } from "./features/store";
import { Provider } from "react-redux";
import { useColorScheme } from "@/src/components/useColorScheme";
import { LogBox, View, Text } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import { supabase } from "../lib/supabase";
import { useAppDispatch } from "../utils/hooks";
import {
  processingAuth,
  sessionToken,
  setAdmin,
  setUser,
} from "./features/slices/AuthSlice";
import QueryProvider from "../lib/QueryProvider";
import { StatusBar } from "expo-status-bar";
import { StripeProvider } from "@stripe/stripe-react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import NotificationProvider from "../components/NotificationProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { asyncStorageData } from "../utils/getAsyncStorageData";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "user",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}
const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#FF9001" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 18,
        fontWeight: "500",
      }}
      text2Style={{
        fontSize: 14,
        fontWeight: "500",
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 18,
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({ text1, props }: { text1: string; props: any }) => (
    <View style={{ height: 60, width: "100%", backgroundColor: "tomato" }}>
      <Text>{text1}</Text>
      <Text className="text-md">{props.text}</Text>
    </View>
  ),
};
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      store.dispatch(processingAuth({ authLoading: true }));
      const { data, error } = await supabase.auth.getSession();
      const userFromStorage = await asyncStorageData();

      try {
        if (userFromStorage) {
          store.dispatch(
            sessionToken({
              session: {
                email: userFromStorage.email,
                name: userFromStorage.email,
              },
            })
          );
        }
        if (data.session?.access_token) {
          store.dispatch(
            sessionToken({
              session: {
                email: data.session.user.email,
                name: data.session.user.email,
              },
            })
          );
          store.dispatch(setUser({ user: data.session }));
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.session.user.id)
            .single();
          if (profileData?.group === "ADMIN") {
            store.dispatch(setAdmin({ isAdmin: true }));
          }
        } else {
          <Redirect href={"/sign-in"} />;
        }
      } catch (error) {
      } finally {
        store.dispatch(processingAuth({ authLoading: false }));
      }
    };
    fetchSession();
    supabase.auth.onAuthStateChange((_event, session) => {
      store.dispatch(setUser({ user: session }));
      if (session) {
        store.dispatch(
          sessionToken({
            session: {
              email: session.user.email,
              name: session.user.email,
            },
          })
        );
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <RootSiblingParent>
        <QueryProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <NotificationProvider>
              <StripeProvider
                publishableKey={
                  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
                }
              >
                <ThemeProvider
                  value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                >
                  <Stack
                    screenOptions={{
                      headerStyle: {
                        backgroundColor: "#161622",
                      },
                      headerTintColor: "#fff",
                      headerTitleStyle: {
                        color: "#ffff",
                        fontWeight: "300",
                      },
                    }}
                  >
                    <Stack.Screen
                      name="user"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="admin"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="cart" />
                    <Stack.Screen
                      name="(auth)"
                      options={{ headerShown: false }}
                    />
                  </Stack>
                </ThemeProvider>
              </StripeProvider>
            </NotificationProvider>
          </GestureHandlerRootView>
        </QueryProvider>
      </RootSiblingParent>
      <StatusBar backgroundColor="#161622" style="light" />
      <Toast config={toastConfig as any} />
    </Provider>
  );
}
