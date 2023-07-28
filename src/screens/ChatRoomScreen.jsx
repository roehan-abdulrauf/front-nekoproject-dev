import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, Text } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import Clipboard from '@react-native-community/clipboard';
import socketService from '../components/utile/socketsService';
import { useAuth } from '../components/utile/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, { useState, useEffect } from 'react';
import IP_ADRESS from '../components/utile/env';
import Moment from 'moment';
import axios from 'axios';

const ChatRoomScreen = ({ navigation, route }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const [isMessageSelect, setMessageSelect] = useState('');
  const [initiatorId, setInitiatorId] = useState('');
  const [initiatorPseudo, setInitiatorPseudo] = useState('');

  // Check Text error
  const [postMessageError, setPostMessageError] = useState('');

  const [user, setUser] = useAuth();

  // Accéder aux infos de l'espace item depuis route.params
  const chatRoomId = route.params && route.params.chatRoomId;
  const chatRoomName = route.params && route.params.chatRoomName;

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
        setInitiatorId(responseData.data.initiator);
        setInitiatorPseudo(responseData.data.initiatorPseudo);
      } else {
        console.log('error');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const messagesForCurrentChatRoom = messages.filter(item => item.chatRoomId === chatRoomId);

  const handleUserPress = (user) => {
    navigation.navigate('AutreProfilScreen', { user });
  };

  const handleDeleteText = () => {
    setNewMessage('');
  };

  // Définir une nouvelle valeur dans le presse-papiers
  function handleCopyTextToClipboard(message) {
    // Assurez-vous que message est bien un objet contenant le texte à copier
    if (message && typeof message === 'object' && message.text) {
      // Copier le texte dans le presse-papiers
      Clipboard.setString(message.text);
    }
  };

  // Obtenir le contenu du presse-papiers
  const getContentFromClipboard = async () => {
    try {
      const content = await Clipboard.getString();
      console.log('Contenu du presse-papiers :', content);
      // Faites ce que vous voulez avec le contenu du presse-papiers ici
    } catch (error) {
      console.log('Erreur lors de la récupération du presse-papiers :', error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage === '') {
      setPostMessageError("Vous ne pouvez pas envoyer un message vide !");
    } else {
      try {
        const data = {};
        if (newMessage) {
          data.text = newMessage;
          data.chatRoomId = chatRoomId;
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
        {isHeaderVisible ? (
          <TouchableOpacity style={styles.chatRoom}>
            <View>
              <Icon name="account-circle" color="white" size={50} />
            </View>
            <View style={{ marginLeft: 10 }}>
              {
                user._id === initiatorId ? (
                  <Text style={styles.chatRoomTitle}>{initiatorPseudo}</Text>
                ) : (
                  <Text style={styles.chatRoomTitle}>{chatRoomName}</Text>
                )
              }
              {/* <Text style={styles.chatRoomMiniTitle}>54 membres</Text> */}
            </View>
          </TouchableOpacity>
        ) :
          <View style={styles.chatRoom}>
            <TouchableOpacity style={{ marginLeft: 60 }}>
              <Icon name="delete" color="white" size={30} onPress={handleDeleteText} />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 40 }} onPress={handleCopyTextToClipboard(isMessageSelect)} >
              <Icon name="content-copy" color="white" size={25} />
            </TouchableOpacity>
          </View>
        }
      </View>
      <View style={styles.container}>
        {/* <Text style={styles.screenName}>Chat Room</Text> */}
        <FlatList
          inverted={true}
          onEndReached={fetchMessages}
          onEndReachedThreshold={0.5}
          data={messagesForCurrentChatRoom}
          keyExtractor={item => `${item._id}-${item.chatRoomId}`}
          renderItem={({ item }) => (
            <View>
              {user._id === item.user ? (
                <TouchableOpacity>
                  {/* <TouchableOpacity style={isHeaderVisible ? styles.backgroundColor : { backgroundColor: "#B9E0F5" }} onLongPress={() => { setHeaderVisible(false); setMessageSelect(item.text) }} onPress={() => setHeaderVisible(true)}> */}
                  <View style={[styles.smallContainer, styles.userConnect]}>
                    {/* <Text style={styles.messagePseudo}>{item.userPseudo}</Text> */}
                    <Text style={styles.messageText}>{item.text}</Text>
                    <Text style={styles.messageCreatedAtUser}>{Moment(item.createdAt).format('MMMM do, yyyy H:mma')}</Text>
                  </View>
                </TouchableOpacity>
              ) :
                <View style={[styles.imageContainer]}>
                  <TouchableOpacity onPress={() => handleUserPress(item)}>
                    {/* <Image source={item.image ? { uri: item.image } : require('../images/menu_icon.png')} style={styles.menuIcon} /> */}
                    <Icon name="account-circle" color="#ff6e40" size={50} />
                  </TouchableOpacity>
                  <View style={[styles.smallContainer, styles.otherUser]}>
                    <Text style={styles.messagePseudo}>{item.userPseudo}</Text>
                    <Text>{item.text}</Text>
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
    justifyContent: 'center',
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
    paddingLeft: 10,
    paddingRight: 10,
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
    backgroundColor: '#1e3d59',
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
    color: '#FF6E40',
  },
  messageText: {
    fontSize: 15,
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
  messageCreatedAtUser: {
    fontSize: 10,
    flex: 1,
    alignSelf: 'flex-end',
    // padding: 5,
    color: 'white',
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
});
// #ffc13b

export default ChatRoomScreen;