import { Menu, MenuOptions, MenuTrigger, MenuProvider, FlatList, Picker } from 'react-native-popup-menu';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Alert, ScrollView, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../components/utile/AuthContext';
import { Logout } from '../components/utile/Logout.js';
import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar.js';
import socketService from '../components/utile/socketsService';
import axios from 'axios';
import IP_ADRESS from '../components/utile/env';


const HomeMessages = ({ navigation }) => {

  const [user, setUser] = useAuth();
  const [activeScreen, setActiveScreen] = useState('homeMessages');
  const [chats, setChats] = useState([]);

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

  const fetchChats = async () => {
    try {
      const response = await axios.get(`http://${IP_ADRESS}:5000/api/chatRooms`, { headers: { 'Authorization': `Bearer ${user.token}` } });
      if (response.status === 200) {
        console.log(response);
        const responseData = response.data;
        setChats(responseData);
      } else {
        console.log('error');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChats();
    socketService.initializeSocket();
    socketService.on("socket_chatRoom", (chatRoom) => {
      fetchChats();
      setChats(chats => [...chats, chatRoom]);
    });
  }, []);

  const handleUserPress = (chat) => {
    navigation.navigate('MessageScreen', { startChatId: chat._id, startChatName: chat.patnerPseudo, startChatInitiator: chat.initiator, startChatInitiatorPseudo: chat.initiatorPseudo, });
  };

  return (
    <MenuProvider style={styles.menuProvider}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeGroups')}>
          <Text style={styles.headerTitle}>Neko Tchat</Text>
        </TouchableOpacity>
        <Menu>
          <MenuTrigger style={styles.menuTrigger} onPress={logoutUser} >
            <Icon name="logout" size={20} color="white" />
            <Text style={{ fontSize: 12, paddingLeft: 4, color: "white" }}>Déconnexion</Text>
          </MenuTrigger>
        </Menu>
      </View>
      <View style={styles.chatHome}>
        <Text style={styles.screenName}>Chats</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false} >
        <View style={styles.container}>
          {chats && chats.length > 0 && (
            chats
              .filter(chat => chat.type === "chat" && chat.attendees.includes(user._id)) // Filtrer les chats par type
              .map(chat => (
                <TouchableOpacity style={styles.chatContainer} onPress={() => handleUserPress(chat)} >
                  <Image source={require('../images/logo_discussion.png')} style={styles.logo} />
                  <View style={styles.groupInfo}>
                    {
                      user._id !== chat.initiator ? (
                        <Text style={styles.groupName}>{chat.initiatorPseudo}</Text>
                      ) : (
                        <Text style={styles.groupName}>{chat.patnerPseudo}</Text>
                      )
                    }
                  </View>
                </TouchableOpacity>
              ))
          )}
        </View>
      </ScrollView>
      <View style={styles.buttonContainerFlottant}>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('StartMessageScreen')}>
          <Icon name="add" size={20} />
          <Text style={{ fontSize: 12, paddingLeft: 4, }}>Nouveau chat</Text>
        </TouchableOpacity>
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
  screenName: {
    color: '#ff6e40',
    fontSize: 13,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  chatHome: {
    padding: 10,
    backgroundColor: '#fff',
  },
  container: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    marginBottom: 100,
  },
  chatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
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
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonContainerFlottant: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 630,
    right: 16,
    width: 150,
    height: 56,
    borderRadius: 30,
    backgroundColor: '#ffc13b',
    justifyContent: 'center',
    elevation: 3, // Shadow on Android
    shadowColor: '#000', // Shadow on iOS
    shadowOpacity: 0.3,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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

export default HomeMessages;