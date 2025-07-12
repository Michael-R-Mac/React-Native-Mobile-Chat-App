import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// for sending geolocations
import * as Location from "expo-location";
import { v4 as uuidv4 } from "uuid";

//This component renders a set of custom actions for the chat interface. It includes buttons for sending images, taking photos, and sharing locations.
const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  onSend,
  storage,
  userID,
}) => {
  // Initialize the action sheet
  const actionSheet = useActionSheet();
  const onActionPress = () => {
    // Define the options for the action sheet
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;

    // Show the action sheet
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },

      async (buttonIndex) => {
        // Handle the user's selection
        switch (buttonIndex) {
          case 0:
            // Send an image from the library
            pickImage();
            return;
          case 1:
            // Take a new photo
            takePhoto();
            return;
          case 2:
            // Share the user's location
            getLocation();
          default:
        }
      }
    );
  };

  //This function generates a unique reference string for the image.It combines the user ID, a timestamp, and the image name to create a unique string.
  const generateReference = (uri) => {
    //Get the current timestamp
    const timeStamp = new Date().getTime();
    //Get the image name from the URI
    const imageName = uri.split("/")[uri.split("/").length - 1];
    //Combine the user ID, timestamp, and image name to create a unique reference string
    return `${userID}-${timeStamp}-${imageName}`;
  };

  //This function uploads the image to Firebase Storage and sends the image URL as a message.
  const uploadAndSendImage = async (imageURI) => {
    //Generate a unique reference string for the image
    const uniqueRefString = generateReference(imageURI);
    //Create a new upload reference in Firebase Storage
    const newUploadRef = ref(storage, uniqueRefString);
    //Fetch the image from the URI and convert it to a blob

    const response = await fetch(imageURI);
    const blob = await response.blob();
    blob.type = "image/jpeg";

    //Upload the blob to Firebase Storage
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      //Get the download URL of the uploaded image
      const imageURL = await getDownloadURL(snapshot.ref);
      //Send the image URL as a message
      onSend([
        {
          _id: uuidv4(),
          createdAt: new Date(),
          user: {
            _id: userID,
          },
          image: imageURL,
        },
      ]);
    });
  };

  //This function is called when the user selects the "Choose From Library" option. It allows the user to select an image from their library and sends it as a message.
  const pickImage = async () => {
    // Request permission to access the media library
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("Media Library Permission Status: ", permissions);

    // Check if permission was granted
    if (permissions?.granted) {
      // Launch the image library
      let result = await ImagePicker.launchImageLibraryAsync();

      // Check if the user selected an image and Upload and send the image
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      // Display an error message if the user cancelled
      else Alert.alert("Permissions haven't been granted.");
    }
  };

  //This function is called when the user selects the "Take Picture" option. It allows the user to take a new photo and sends it as a message.
  const takePhoto = async () => {
    // Request permission to access the camera
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    console.log("Camera Permission Status: ", permissions);

    // Check if permission was granted
    if (permissions?.granted) {
      // Launch the camera
      let result = await ImagePicker.launchCameraAsync();

      // Check if the user took a photo and Upload and send the photo
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      // Display an error message if the user cancelled
      else Alert.alert("Permissions haven't been granted.");
    }
  };

  //This function is called when the user selects the "Send Location" option. It requests permission to access the user's location, gets the current location, and sends it as a message.
  const getLocation = async () => {
    // Request permission to access the location
    let permissions = await Location.requestForegroundPermissionsAsync();
    console.log("Location Permission Status: ", permissions);

    // Check if permission was granted
    if (permissions?.granted) {
      // Get the user's current location
      const location = await Location.getCurrentPositionAsync({});

      // Check if the location was obtained successfully
      if (location) {
        onSend({
          // Send the location as a message
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        });
      } else Alert.alert("Error occurred while fetching location");
    } else Alert.alert("Permissions to read location aren't granted");
  };

  //Render the CustomActions component. This component renders a TouchableOpacity with a "+" icon. When pressed, it displays an action sheet with options for sending images, taking photos, and sharing locations.
  return (
    <TouchableOpacity
      //Make the component accessible
      accessible={true}
      accessibilityLabel="More options"
      accessibilityHint="Choose to send an image, take a photo, or send your location."
      accessibilityRole="button"
      //Style the component
      style={styles.container}
      //Handle the press event
      onPress={onActionPress}
    >
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

//Styles for the CustomActions component
const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

export default CustomActions;
