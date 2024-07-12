import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { supabase } from './supabase';
import { Tables } from '../database.types';
import { OrderStatus } from '../type';
import registerNNPushToken from 'native-notify';
import { formatDistanceToNow } from "date-fns";
import axios from 'axios'



// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
export async function sendPushNotification(
  expoPushToken: Notifications.ExpoPushToken, title: string, body: string
) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: body,
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export async function nativeNotify(message: string){
  const URL="https://cdn.pixabay.com/photo/2016/03/05/09/22/eat-1237432_960_720.png"
  const baseUrl="https://app.nativenotify.com/api/notification"

  const pushData={
    appId: 22177,
    appToken: "w9ZP0AlhSZEZNpR6PoYBDi",
    title: "PizzaPerk",
    body: message,
    dateSent: new Date().getTime(),
    pushData: { redirectUrl: "/user" },
    bigPictureURL: ""
}

const res = await axios.post(baseUrl, pushData)

}

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECTID
        
      })
    ).data;
    
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

async function getUserToken(userId: string){
    const {data}= await supabase.from("profiles").select('*').eq("id", userId).single()
    return data?.expo_push_token
}

export async function notifyUserAboutOrder(order: Tables<"orders">, status: OrderStatus){
    const token = await getUserToken(order.user_id as string)
    if(!token) return
    
    let message=""
    switch(status){
        case "COOKING":
            message="Your order is cooking"
            break
        case "DELIVERING":
            message="Your order is being delivering"
            break
        case "DELIVERED":
            message="Your order has been delivered successfully. We are grad to serve you!!!"
            break
        default:
            message="Your order has been received it will be ready within an hour"
    }
    
    await nativeNotify(message)
    // sendPushNotification(token as unknown as Notifications.ExpoPushToken, "PizzaPerk", message)
}