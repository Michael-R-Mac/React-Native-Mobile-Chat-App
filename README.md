<h1 align="center">Welcome to Chat App</h1>

> This is a Chat app for mobile devices using React Native. The app provides users with a chat interface and options to share images and their location.

## Features

> Real-time Messaging: Engage in instant conversations with others

> Image Sharing: Share photos from your gallery or capture new moments with your device's camera

> Location Sharing: Share your location with others for easy meetups or coordination

> Offline Access: Access cached messages even without an internet connection

## Technologies Used

> Frontend: Built with React Native for a seamless mobile experience

> Chat UI: Powered by GiftedChat for a beautiful and intuitive chat interface

> Backend: Utilizes Firebase for scalable and reliable storage

> Development Platform: Developed with Expo for streamlined development and testing

> Testing: Tested on Android Studio Emulator for a realistic mobile experience

> Caching: Employs AsyncStorage for efficient caching of messages

## Install

```sh
1. git clone https://github.com/Michael-R-Mac/React-Native-Mobile-Chat-App.git
3. cd Chat-App
4. npm install
5. npm install -g expo-cli
```

## Usage

```sh
npx expo start
```

## Firebase configuration

In the Firebase Console, create a new project, change the Rules to allow read and write (false -> true). In Build -> Authentication enable anonymous authentication. Then copy your Firebase config credentials to the "App.js" file:

```sh
{
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_AUTH_DOMAIN",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_STORAGE_BUCKET",
  "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
  "appId": "YOUR_APP_ID"
}
```

> Components
>
> Start component

> First page (component) where user can introduce name choose background color and authenticate.

> Chat component

> Component where user can read and write messages.

> CustomActions component

> This component renders a set of custom actions for the chat interface.
> It includes buttons for sending images, taking photos, and sharing locations.

## Author

- Github: [@Michael-R-Mac](https://github.com/Michael-R-Mac)

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
