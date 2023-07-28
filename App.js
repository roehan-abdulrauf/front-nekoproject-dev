import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthProvider, { useAuth } from './src/components/utile/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { checkToken } from './src/components/utile/checkToken';
import { StyleSheet, Text, View } from 'react-native';
import { LogBox } from 'react-native';
import CreateGroupMemberScreen from './src/screens/CreateGroupMemberScreen';
import CreateGroupScreen from './src/screens/CreateGroupScreen';
import AutreProfilScreen from './src/screens/AutreProfilScreen';
import MailValidation from './src/screens/MailValidationScreen';
import ChatRoomScreen from './src/screens/ChatRoomScreen';
import MessageScreen from './src/screens/MessageScreen';
import HomeMessages from './src/screens/HomeMessages';
import SignUpScreen from './src/screens/SignUpScreen';
import ProfilScreen from './src/screens/ProfilScreen';
import MemberScreen from './src/screens/MemberScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeGroups from './src/screens/HomeGroups';
import StartMessageScreen from './src/screens/StartMessageScreen';


LogBox.ignoreLogs(['Asyncstorage: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
const Navigator = () => {
  const Stack = createNativeStackNavigator();

  const isLoggedIn = false;
  const [user] = useAuth();

  const screenOptions = {
    headerShown: false,
    animation: 'fade', // Utilise la transition de fondu (fade)
    // Ajoutez d'autres options de transition ici si nécessaire
  };
  
  if (!user) {

    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
        <Stack.Screen name="Register" component={SignUpScreen}></Stack.Screen>
        <Stack.Screen name="MailValidation" component={MailValidation}></Stack.Screen>
      </Stack.Navigator>
    )
  } else {


    return (

      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="HomeGroups" component={HomeGroups}></Stack.Screen>
        <Stack.Screen name="HomeMessages" component={HomeMessages}></Stack.Screen>
        <Stack.Screen name="MessageScreen" component={MessageScreen}></Stack.Screen>
        <Stack.Screen name="ChatRoomScreen" component={ChatRoomScreen}></Stack.Screen>
        <Stack.Screen name="ProfilScreen" component={ProfilScreen}></Stack.Screen>
        <Stack.Screen name="MemberScreen" component={MemberScreen}></Stack.Screen>
        <Stack.Screen name="AutreProfilScreen" component={AutreProfilScreen}></Stack.Screen>
        <Stack.Screen name="CreateGroupMemberScreen" component={CreateGroupMemberScreen}></Stack.Screen>
        <Stack.Screen name="CreateGroupScreen" component={CreateGroupScreen}></Stack.Screen>
        <Stack.Screen name="StartMessageScreen" component={StartMessageScreen}></Stack.Screen>
      </Stack.Navigator>
    )
  }

}


export default function App() {
  const Stack = createNativeStackNavigator();

  checkToken;
  return (
    <NavigationContainer >
      <AuthProvider>
        <Navigator></Navigator>
      </AuthProvider>
    </NavigationContainer>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});