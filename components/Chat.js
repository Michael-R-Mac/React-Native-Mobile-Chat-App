import { useEffect, React, useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";

// Chat component displays a chat screen with the user's, background color and messages.
const Chat = ({ route, navigation }) => {
  // State for the messages in the chat
  const [messages, setMessages] = useState([]);

  // Destructure the name and background from the route params
  const { name, background } = route.params;

  // Effect hook to set the title of the navigation and initialize the messages
  useEffect(() => {
    // Set the title of the navigation to the user's name
    navigation.setOptions({ title: name });

    // Initialize the messages with a default message and a system message
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        text: "This is a system message",
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  // Function to handle sending new messages
  const onSend = (newMessages) => {
    // Append the new messages to the existing messages using GiftedChat.append
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
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

  // Render the chat component
  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
          name,
        }}
      />
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
      {Platform.OS === "ios" ? (
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
