import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { Menu, MenuOptions, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import socketService from '../components/utile/socketsService';
import { useAuth } from '../components/utile/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Logout } from '../components/utile/Logout.js';
import React, { useState, useEffect } from 'react';
import Moment from 'moment';
import axios from 'axios';

const MessageScreen = ({ navigation }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Check Text error
  const [postMessageError, setPostMessageError] = useState('');
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

  const fetchMessages = async () => {
    try {
      // const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`http://${IP_ADRESS}:5000/api/messages`, { headers: { 'Authorization': `Bearer ${user.token}` } });
      if (response.status === 200) {
        const responseData = response.data.sort((a, b) => {
          if (a.createdAt > b.createdAt) return -1;
          if (a.createdAt < b.createdAt) return 1;
          return 0;
        });
        setMessages(responseData);
        // socketService.emit("send_message",responseData);
      } else {
        console.log('error');
      }
    } catch (error) {
      console.error(error);
    }

  };

  const handleSendMessage = async () => {
    if (newMessage === '') {
      setPostMessageError("Vous ne pouvez pas envoyer un message vide !");
    } else {
      try {
        const data = {};
        if (newMessage) data.text = newMessage;
        // if (newImageUrl) data.imageUrl = newImageUrl;
        const response = await axios.post(`http://${IP_ADRESS}:5000/api/messages`, data, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        if (response.status === 200) {
          setNewMessage('');
          console.log('request POST message, success !');
        }
        else {
          console.log('error');
          console.log(response.status);
        }
      } catch (error) {
        console.error(error);
        console.log(error.response);
        console.log('request POST message, error !');
      }
    }
  };

  useEffect(() => {
    fetchMessages();
    socketService.initializeSocket();
    socketService.on("socket_message", (msg) => {
      fetchMessages();
      setMessages(messages => [...messages, msg]);
    });
  }, [postMessageError]);

  return (
    <MenuProvider>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.headerTitle}>NekoChat</Text>
        </TouchableOpacity>
        <Menu>
          <MenuTrigger>
            <Image source={require('../images/menu_icon.png')} style={styles.menuIcon} />
          </MenuTrigger>
          <MenuOptions>
            <TouchableOpacity onPress={() => navigation.navigate('ProfilScreen')}>
              <Text style={styles.menuOption}><Icon name="person" size={15} />Mon profil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MemberScreen')}>
              <Text style={styles.menuOption}><Icon name="group" size={15} />Member</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={logoutUser}>
              <Text style={styles.menuOption}><Icon name="logout" size={15} />Deconnexion</Text>
            </TouchableOpacity>
          </MenuOptions>
        </Menu>
      </View>
      <View style={styles.container}>
        <Text style={styles.screenName}>Chat Room</Text>
        <FlatList
          inverted={true}
          onEndReached={fetchMessages}
          onEndReachedThreshold={0.5}
          data={messages}
          keyExtractor={item => `${item._id}-${item.createdAt}`}
          renderItem={({ item }) => (
            <View>
              {user._id === item.user ? (
                <View style={[styles.smallContainer, styles.userConnect]}>
                  <Text style={styles.messagePseudo}>{item.userPseudo}</Text>
                  <Text style={styles.messageText}>{item.text}</Text>
                  <Text style={styles.messageCreatedAt}>{Moment(item.createdAt).format('MMMM do, yyyy H:mma')}</Text>
                </View>
              ) :
                <View style={[styles.imageContainer]}>
                  <View>
                    {/* <Image source={item.image ? { uri: item.image } : require('../images/menu_icon.png')} style={styles.menuIcon} /> */}
                    <Icon name="account-circle" color="#ff6e40" size={50} />
                  </View>
                  <View style={[styles.smallContainer, styles.otherUser]}>
                    <Text style={styles.messagePseudo}>{item.userPseudo}</Text>
                    <Text style={styles.messageText}>{item.text}</Text>
                    <Text style={styles.messageCreatedAt}>{Moment(item.createdAt).format('MMMM do, yyyy H:mma')}</Text>
                  </View>
                </View>
              }
            </View>
          )}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message here..."
          />
          <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
            <Text style={styles.buttonText}>Envoyer</Text>

          </TouchableOpacity>
        </View>
      </View>
    </MenuProvider>
  )
}

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
  screenName: {
    color: '#ff6e40',
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  menuIcon: {
    width: 20,
    height: 20,
  },
  menuOption: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  imageContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
  },
  smallContainer: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'gray',
    margin: 10,
  },
  userConnect: {
    backgroundColor: '#FF6E40',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  otherUser: {
    backgroundColor: '#f5f0e1',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  messagePseudo: {
    fontSize: 13,
    marginBottom: 10,

    color: '#ffc13b',
  },
  messageText: {
    fontSize: 13,
    padding: 5,
    color: 'white',
  },
  messageCreatedAt: {
    fontSize: 10,
    flex: 1,
    alignSelf: 'flex-end',
    // padding: 5,
    // color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 20,
    width: '100%',
    marginTop: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#ff6e40',
    padding: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
  },
  messageContainer: {
    padding: 10,
    marginTop: 10,
    backgroundColor: '#eee',
    width: '80%',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
});

export default MessageScreen;