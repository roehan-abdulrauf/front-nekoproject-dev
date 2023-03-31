import * as SecureStore from 'expo-secure-store';

const checkToken = async () => {

  const token = SecureStore.getItemAsync('token');
   let loggedIn = false;
  if (token) {
  loggedIn = true;
  console.log('Statut en ligne:',loggedIn);
  
} else {
  loggedIn = false;
  console.log('Statut en ligne :',loggedIn);
  navigation.navigate('Home');
  }
}

export { checkToken };