import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../firebase";
// Start component is the first screen of the app. It allows users to sign in anonymously and navigate to the chat screen.
const Start = ({ navigation }) => {
  const [name, setName] = useState(""); // State for the user's name
  const [background, setBackground] = useState(""); // State for the selected background color

  /**
   * Sign in the user anonymously and navigate to the Chat screen with the user's name,
   * background, and user ID.
   */
  const signInUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate("Chat", {
          userID: result.user.uid,
          name: name,
          background: background,
        });
        Alert.alert(`User "${name}" signed in successfully!`);
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try again later.");
      });
  };

  return (
    <View style={styles.container}>
      {/* Background image */}
      <ImageBackground
        source={require("../assets/Background Image.png")}
        style={styles.imageBackground}
      >
        {/* Title */}
        <Text style={styles.title}>Connect to Chat!</Text>
        <View style={styles.box}>
          {/* user types name */}
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
          />
          {/* Choose Background Color text */}
          <Text style={styles.chooseBgColor}>Choose Background Color</Text>
          {/* Row of color buttons */}
          <View style={styles.colorButtonContainer}>
            <TouchableOpacity
              style={[
                styles.colorButton,
                { backgroundColor: "#090C08" },
                background === "#090C08" && styles.selectedColor,
              ]}
              onPress={() => setBackground("#090C08")}
            ></TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.colorButton,
                { backgroundColor: "#474056" },
                background === "#474056" && styles.selectedColor,
              ]}
              onPress={() => setBackground("#474056")}
            ></TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.colorButton,
                { backgroundColor: "#8A95A5" },
                background === "#8A95A5" && styles.selectedColor,
              ]}
              onPress={() => setBackground("#8A95A5")}
            ></TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.colorButton,
                { backgroundColor: "#B9C6AE" },
                background === "#B9C6AE" && styles.selectedColor,
              ]}
              onPress={() => setBackground("#B9C6AE")}
            ></TouchableOpacity>
          </View>
          {/* to start chat */}
          <TouchableOpacity
            //Make the component accessible
            accessible={true}
            accessibilityRole="button"
            accessibilityHint="You can choose to enter the chat room"
            //Style the component
            style={styles.button}
            //Handle the press event
            onPress={() => {
              if (name == "") {
                Alert.alert("Add a name");
              } else {
                signInUser();
              }
            }}
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

// Styles for the Start component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    width: "88%",
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
  },
  imageBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  title: {
    flex: 1,
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
    margin: 25,
  },
  box: {
    backgroundColor: "#f2f2f2",
    borderRadius: 4,
    width: "88%",
    height: "44%",
    alignItems: "center",
    margin: 20,
    justifyContent: "space-around",
  },
  chooseBgColor: {
    color: "#757083",
    fontSize: 20,
    fontWeight: "300",
    opacity: 100,
  },
  colorButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
  selectedColor: {
    borderColor: "#c0c0c0",
    borderWidth: 5,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#757083",
    borderRadius: 4,
    height: "20%",
    justifyContent: "center",
    padding: 10,
    width: "88%",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default Start;
