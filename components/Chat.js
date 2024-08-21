import { useEffect, React } from "react";
import { StyleSheet, View, Text } from "react-native";

// Chat component displays a chat screen with the user's name and background color
const Chat = ({ route, navigation }) => {
  const { name, background } = route.params;

  useEffect(() => {
    // Set the title of the screen to the user's name
    navigation.setOptions({
      title: name,
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      {/* Display a greeting message with the user's name */}
      <Text>Hello {name}!</Text>
    </View>
  );
};

// Styles for the Chat component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Chat;
