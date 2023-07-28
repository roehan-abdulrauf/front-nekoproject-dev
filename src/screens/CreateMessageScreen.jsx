import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, Text } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import socketService from '../components/utile/socketsService';
import { useAuth } from '../components/utile/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, { useState, useEffect } from 'react';
import IP_ADRESS from '../components/utile/env';
import Moment from 'moment';
import axios from 'axios';

const MessageScreen = ({ navigation, route }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Check Text error
  const [postMessageError, setPostMessageError] = useState('');

  const [user, setUser] = useAuth();

  // Accéder aux infos du chat item depuis route.params
  const chatId = route.params && route.params.chatId;
  const chatName = route.params && route.params.chatName;

  const handleBack = () => {
    navigation.goBack();
  };

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
      } else {
        console.log('error');
      }
    } catch (error) {
      console.error(error);
    }

  };

  const messagesForCurrentChat = messages.filter(item => item.chatRoomId === chatId);

  const handleUserPress = (user) => {
    navigation.navigate('AutreProfilScreen', { user });
  };

  const handleSendMessage = async () => {
    if (newMessage === '') {
      setPostMessageError("Vous ne pouvez pas envoyer un message vide !");
    } else {
      try {
        const data = {};
        if (newMessage) {
          data.text = newMessage;
          data.chatRoomId = chatId;
        }
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
    <MenuProvider style={styles.menuProvider}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="keyboard-backspace" color="white" size={30} onPress={handleBack} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatRoom} onPress={() => handleUserPress(user)}>
          <View>
            <Icon name="account-circle" color="white" size={50} />
          </View>
          <View style={{ marginLeft: 10 }}>
            {chatName ? (
              <Text style={styles.chatRoomTitle}>{chatName}</Text>
            ) : (
              <Text>Loading...</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <FlatList
          inverted={true}
          onEndReached={fetchMessages}
          onEndReachedThreshold={0.5}
          data={messagesForCurrentChat}
          keyExtractor={item => `${item._id}-${item.chatRoomId}`}
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
  menuProvider: {
    flex: 1,
    backgroundColor: 'white',
  },
  menuTrigger: {
    padding: 2,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff6e40',
    height: 100,
    paddingTop: 30,
    // paddingBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
  },
  chatRoom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 25,
  },
  chatRoomTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatRoomMiniTitle: {
    color: '#FFFFFF',
    fontSize: 12,
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