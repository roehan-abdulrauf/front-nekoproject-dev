import { Menu, MenuOptions, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../components/utile/AuthContext';
import { Logout } from '../components/utile/Logout.js';
import React, { useState } from 'react';

const Home = ({ navigation }) => {

  const [animatePress, setAnimatePress] = useState(new Animated.Value(1))
  const [user, setUser] = useAuth();

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

  const animateIn = () => {
    Animated.timing(animatePress, {
      toValue: 0.5,
      duration: 500,
      useNativeDriver: true // Add This line
    }).start();
  }

  return (
    <MenuProvider>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.headerTitle}>Neko Chat</Text>
        </TouchableOpacity>
        <Menu>
          <MenuTrigger>
            <Image source={require('../images/menu_icon.png')} style={styles.menuIcon} />
          </MenuTrigger>
          <MenuOptions>
            <TouchableOpacity onPress={() => navigation.navigate('ProfilScreen')}>
              <View style={styles.menuOption}>
                <Icon name="person" size={15} />
                <Text style={styles.menuOptionText}>Mon profil</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MemberScreen')}>
              <View style={styles.menuOption}>
                <Icon name="group" size={15} />
                <Text style={styles.menuOptionText}>Member</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={logoutUser}>
              <View style={styles.menuOption}>
                <Icon name="logout" size={15} />
                <Text style={styles.menuOptionText}>Deconnexion</Text>
              </View>
            </TouchableOpacity>
          </MenuOptions>
        </Menu>
      </View>
      <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('MessageScreen')}>
        <Image source={require('../images/logo_discussion.png')} style={styles.logo} />
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>Groupe La PLateforme</Text>
          <Text style={styles.lastMessage}>Discuter avec les étudiants</Text>
        </View>
      </TouchableOpacity>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ff6e40',
    height: 100,
    paddingTop: 30,
    // paddingBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default Home;