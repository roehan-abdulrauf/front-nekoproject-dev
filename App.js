import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthProvider, { useAuth } from './src/components/utile/AuthContext';
import AutreProfilScreen from './src/screens/AutreProfilScreen';
import MailValidation from './src/screens/MailValidationScreen';
import { NavigationContainer } from '@react-navigation/native';
import { checkToken } from './src/components/utile/checkToken';
import MessageScreen from './src/screens/MessageScreen';
import { StyleSheet, Text, View } from 'react-native';
import SignUpScreen from './src/screens/SignUpScreen';
import ProfilScreen from './src/screens/ProfilScreen';
import MemberScreen from './src/screens/MemberScreen';
import LoginScreen from './src/screens/LoginScreen';
import Home from './src/screens/Home';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Asyncstorage: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
const Navigator = () => {
  const Stack = createNativeStackNavigator();

  const isLoggedIn = false;
  const [user] = useAuth();
  if (!user) {

    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
        <Stack.Screen name="Register" component={SignUpScreen}></Stack.Screen>
        <Stack.Screen name="MailValidation" component={MailValidation}></Stack.Screen>
      </Stack.Navigator>
    )
  } else {


    return (

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home}></Stack.Screen>
        <Stack.Screen name="MessageScreen" component={MessageScreen} options={{ title: 'Chat Room' }}></Stack.Screen>
        <Stack.Screen name="ProfilScreen" component={ProfilScreen}></Stack.Screen>
        <Stack.Screen name="MemberScreen" component={MemberScreen} options={{ title: 'Chat Room Members' }}></Stack.Screen>
        <Stack.Screen name="AutreProfilScreen" component={AutreProfilScreen}></Stack.Screen>
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