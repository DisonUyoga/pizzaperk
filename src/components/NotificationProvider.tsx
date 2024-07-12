import { View, Text } from "react-native";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../lib/notification";
import { supabase } from "../lib/supabase";
import { useAppSelector } from "../utils/hooks";
import registerNNPushToken, { getPushDataObject } from "native-notify";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [pushToken, setPushToken] = useState<string | undefined>();
  const { user } = useAppSelector((state) => state.auth);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  registerNNPushToken(22177, "w9ZP0AlhSZEZNpR6PoYBDi");

  const savePushToken = async (token: string | undefined) => {
    if (!token) return;
    setPushToken(token);
    const { data, error } = await supabase
      .from("profiles")
      .update({ expo_push_token: token })
      .eq("id", user?.user.id as string);
  };
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => savePushToken(token))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      if (notificationListener.current) {
        notificationListener.current &&
          Notifications.removeNotificationSubscription(
            notificationListener.current
          );
      }
      if (responseListener.current) {
        responseListener.current &&
          Notifications.removeNotificationSubscription(
            responseListener.current
          );
      }
    };
  }, []);

  return <>{children}</>;
};

export default NotificationProvider;
