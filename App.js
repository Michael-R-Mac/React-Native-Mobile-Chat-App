// import the screens
import Start from "./components/Start";
import Chat from "./components/Chat";
import { useEffect } from "react";

// import react Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Create the navigator
const Stack = createNativeStackNavigator();

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";
import { useNetInfo } from "@react-native-community/netinfo";
import { Alert } from "react-native";
import { getStorage } from "firebase/storage";
/**
 * App component is the main component of the application.
 * It sets up the navigation stack with two screens: Start and Chat.
 */
const App = () => {
  const connectionStatus = useNetInfo();

  // useEffect hook to handle network changes (online/offline)
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  // Firebase configuration (my specific config)
  const firebaseConfig = {
    apiKey: "AIzaSyCvuxgC0OCAH5Fwh7XhPpxUWBTxiZ9sc9I",
    authDomain: "chat-app-89aaf.firebaseapp.com",
    projectId: "chat-app-89aaf",
    storageBucket: "chat-app-89aaf.appspot.com",
    messagingSenderId: "65512283013",
    appId: "1:65512283013:web:aa7c8c52cc0213a77802ec",
    measurementId: "G-CCTYGWM1M2",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Get the Firestore and Storage instances
  const db = getFirestore(app);
  const storage = getStorage(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              isConnected={connectionStatus.isConnected}
              db={db}
              storage={storage}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
