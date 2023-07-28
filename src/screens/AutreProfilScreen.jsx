import { Menu, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Logout } from '../components/utile/Logout.js';
import NavBar from '../components/NavBar.js';
import React, { useState } from 'react';

const AutreProfilScreen = ({ navigation, route }) => {

  const [activeScreen, setActiveScreen] = useState('groups');

  // Accéder à la liste item depuis route.params
  const user = route.params.user;

  const handleNavPress = (screen) => {
    setActiveScreen(screen);
  };

  const logoutUser = () => {
    Alert.alert(
      'Confirmation de déconnexion',
      'Vous êtes sur le point de vous déconnecter.',
      [
        {
          text: 'Annuler',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Ok',
          onPress: () => {
            Logout(user.token)
            setUser(null);
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            'Vous ne serez pas déconnecté.',
          ),
      },
    );
  }

  return (
    <MenuProvider style={styles.menuProvider}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeGroups')}>
          <Text style={styles.headerTitle}>Neko Tchat</Text>
        </TouchableOpacity>
        <Menu style={styles.menuOptions}>
          <MenuTrigger style={styles.menuTrigger} onPress={logoutUser} >
            <Icon name="logout" size={20} color="white" />
            <Text style={{ fontSize: 12, paddingLeft: 4, color: "white" }}>Déconnexion</Text>
          </MenuTrigger>
        </Menu>
      </View>
      <View style={styles.container}>
        <Text style={styles.screenName}>Profil de {user.pseudo}</Text>
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.profileContainer}>
            <Icon name="person" size={120} style={styles.profileIcon} />
          </View>
          <View style={styles.allInputContainer}>
            <View style={styles.inputContainer}>
              <View style={styles.inputCon}>
                <Text>Pseudo :</Text>
                <TextInput
                  style={styles.input}
                  placeholder={`${user.pseudo}`}
                  autoCapitalize='none'
                  keyboardType="default"
                  autoFocus={false}
                  editable={false}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputCon}>
                <Text>Email :</Text>
                <TextInput
                  style={styles.input}
                  placeholder={`${user.mail}`}
                  autoCapitalize='none'
                  keyboardType="default"
                  autoFocus={false}
                  editable={false}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputCon}>
                <Text>bio :</Text>
                {user.bio === "Salut! J'utilise Neko Chat." ? (
                  <TextInput
                    style={styles.input}
                    placeholder="Salut! J'utilise Neko Chat."
                    autoCapitalize='none'
                    keyboardType="default"
                    autoFocus={false}
                    editable={false}
                  />
                ) :
                  <TextInput
                    style={styles.input}
                    placeholder={`${user.bio}`}
                    autoCapitalize='none'
                    keyboardType="default"
                    autoFocus={false}
                    editable={false}
                  />
                }
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.navBarContainer}>
        <NavBar activeScreen={activeScreen} onPress={handleNavPress} navigation={navigation} />
      </View>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  menuProvider: {
    flex: 1,
    backgroundColor: 'white',
  },
  menuTrigger: {
    flexDirection: 'row',
    padding: 4,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ff6e40',
    height: 100,
    paddingTop: 30,
    paddingLeft: 16,
    paddingRight: 16,
  },
  body: {
    flexGrow: 1,
    paddingBottom: 80,
    minHeight: 600,
  },
  menuOptions: {
    zIndex: 1, elevation: 1
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  screenName: {
    color: '#ff6e40',
    fontSize: 13,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  menuIcon: {
    width: 20,
    height: 20,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  menuOptionText: {
    marginLeft: 10,
    fontSize: 15, // Espacement entre l'icône et le texte
  },
  container: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 100,
  },
  iconContainer: {
    flexDirection: 'row', // Aligns the icons side by side
    justifyContent: 'center', // Centers the icons horizontally
    marginVertical: 10, // Adjust as needed
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  profileIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'black',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 10,
    right: 100,
    backgroundColor: '#ff6e40',
    padding: 8,
    borderRadius: 20,
  },
  allInputContainer: {
    marginTop: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 5,
    paddingTop: 10,
  },
  inputCon: {
    width: '90%',
  },
  otherProfileOption: {
    alignItems: 'center',
  },
  otherProfileOptionPadding: {
    marginRight: 30,
  },
  formContainer: {
    backgroundColor: '#fff',
    marginBottom: 100,
  },
  input: {
    height: 50,
    padding: 3,
    border: 0,
    zIndex: 1,
    backgroundColor: 'white',
    borderBottom: '2px solid #eee',
    fontSize: 14,
    lineHeight: 30
  },
  button: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#FF6E40',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonAutre: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: 'red',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  navBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 56,
    backgroundColor: '#D6D6D6',
  },
});

export default AutreProfilScreen;