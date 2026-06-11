// import {
//   AuthorizationStatus,
//   getMessaging,
//   getToken,
//   onMessage,
//   requestPermission,
//   setBackgroundMessageHandler,
// } from "@react-native-firebase/messaging";
// import * as Device from "expo-device";
// import * as Linking from "expo-linking";
// import * as Notifications from "expo-notifications";
// import { useEffect } from "react";
// import { Alert, PermissionsAndroid, Platform } from "react-native";
// export async function requestUserPermission() {
//   const messaging = getMessaging();

//   const androidStatus =
//     Platform.OS === "android" &&
//     (await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//     ));
//   const iosStatus =
//     Platform.OS === "ios" ? await requestPermission(messaging) : null;
//   return (
//     androidStatus === PermissionsAndroid.RESULTS.GRANTED ||
//     iosStatus === AuthorizationStatus.AUTHORIZED ||
//     iosStatus === AuthorizationStatus.PROVISIONAL
//   );
// }

// export async function registerForPushNotificationsAsync() {
//   let token;

//   const existingStatus = await requestUserPermission();

//   if (!existingStatus) {
//     Alert.alert("Permission refusée pour les notifications push.");
//     return;
//   }

//   if (Platform.OS === "ios" && !Device.isDevice) {
//     return;
//   }
//   try {
//     token = await getToken(getMessaging());
//   } catch {
//     token = null;
//   }

//   return token;
// }
// interface DataType {
//   uri?: string;
// }

// export function useHandleNotification() {
//   useEffect(() => {
//     if (Platform.OS === "ios" && !Device.isDevice) {
//       return;
//     }
//     if (Platform.OS === "web") return; // les notifications web sont gérées différemment

//     const messaging = getMessaging();

//     // ✅ Foreground uniquement via Firebase
//     const unsubscribeForeground = onMessage(messaging, async (response) => {
//       if (response) console.info("Message reçu (foreground):", response);
//       await Notifications.scheduleNotificationAsync({
//         content: {
//           title: response.notification?.title ?? "Notification",
//           body: response.notification?.body ?? "",
//           data: response.data,
//         },
//         trigger: null, // null = affichage immédiat
//       });
//     });

//     // ✅ Background via Firebase (pas de doublon avec Expo ici)
//     setBackgroundMessageHandler(messaging, async (response) => {
//       if (response) console.info("Message reçu (background):", response);
//     });

//     // ✅ Tap sur notification → UN SEUL listener (Expo suffit)
//     const subscription = Notifications.addNotificationResponseReceivedListener(
//       (response) => {
//         const data = response.notification.request.content.data as DataType;
//         if (data?.uri) {
//           const fullUrl = data.uri.startsWith("http")
//             ? data.uri
//             : Linking.createURL(data.uri); // construit avec le bon scheme
//           Linking.openURL(fullUrl);
//         }
//       },
//     );

//     // ❌ Supprimé : getInitialNotification faisait doublon avec le listener Expo

//     return () => {
//       unsubscribeForeground();
//       subscription.remove();
//     };
//   }, []);
// }
