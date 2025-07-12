import { useEffect, React, useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";

// Chat component displays a chat screen with the user's, background color and messages.
const Chat = ({ route, navigation, db, storage, isConnected }) => {
  // State for the messages in the chat
  const [messages, setMessages] = useState([]);

  // Destructure the name, userID and background from the route params
  const { name, background, userID } = route.params;

  // Effect hook to set the title of the navigation
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  // Clean up code outside the use Effect to avoid memory leaks.
  let unsubMessages;

  // Effect hook to initialize the messages
  useEffect(() => {
    if (isConnected === true) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      // Create a query to retrieve the messages from Firestore.
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

      // Listen to the query and update the messages state when the data changes.
      unsubMessages = onSnapshot(q, (docs) => {
        // Convert the Firestore documents to a format compatible with GiftedChat.
        let newMessages = [];
        docs.forEach((doc) => {
          newMessages.push({
            _id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });

        // Cache the messages and update the state.
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
      // If the user is offline, load the cached messages.
    } else loadCachedMessages();

    // Clean up the onSnapshot listener when the component unmounts.
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

  // Function to load the cached messages from AsyncStorage
  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem("messages");
    if (cachedMessages) {
      setMessages(JSON.parse(cachedMessages));
    } else {
      setMessages([]);
    }
  };

  // Function to cache the messages in AsyncStorage
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to handle sending new messages
  const onSend = async (newMessages) => {
    try {
      // Add the new message to Firestore
      await addDoc(collection(db, "messages"), newMessages[0]);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to render the bubble
  const renderBubble = (props) => {
    // Customize the bubble style based on the user's side
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };

  // Conditionally render InputToolbar component only when user is connected
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  // Defines a function that renders a CustomActions component with the provided storage, userID, and additional props.
  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} userID={userID} {...props} />;
  };

  // Conditionally renders a MapView component when a message contains a location
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  // Render the chat component
  return (
    // Container view with a dynamic background color
    <View style={[styles.container, { backgroundColor: background }]}>
      {/* GiftedChat component to display the chat interface */}
      <GiftedChat
        // Pass the messages state to GiftedChat
        messages={messages}
        // Custom render function for the chat bubbles
        renderBubble={renderBubble}
        // Custom render function for the input toolbar
        renderInputToolbar={renderInputToolbar}
        // Handle sending new messages
        onSend={(messages) => onSend(messages)}
        // Custom render function for the action buttons (e.g. camera, location)
        renderActions={renderCustomActions}
        // Custom render function for the map view
        renderCustomView={renderCustomView}
        // Pass the user's ID and name to GiftedChat
        user={{
          _id: userID,
          name,
        }}
      />

      {/* Platform-specific keyboard avoiding views */}
      {Platform.OS === "android" ? (
        // On Android, use the "height" behavior to avoid the keyboard
        <KeyboardAvoidingView behavior="height" />
      ) : null}

      {Platform.OS === "ios" ? (
        // On iOS, use the "padding" behavior to avoid the keyboard
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};
// Styles for the Chat component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
