import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { Menu, MenuOptions, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import socketService from '../components/utile/socketsService';
import { useAuth } from '../components/utile/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Logout } from '../components/utile/Logout.js';
import React, { useState, useEffect } from 'react';
import IP_ADRESS from '../components/utile/env';
import Moment from 'moment';
import axios from 'axios';
import NavBar from '../components/NavBar.js';
import { BackHandler } from 'react-native';

const MessageScreen = ({ navigation, route }) => {

  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState('');
  const [chatPatnerPseudo, setChatPartnerPseudo] = useState('');
  const [chatInitiatorId, setChatInitiatorId] = useState('');
  const [chatInitiatorPseudo, setChatInitiatorPseudo] = useState('');

  // Check Text error
  const [postMessageError, setPostMessageError] = useState('');

  const [user, setUser] = useAuth();

  // Accéder aux infos du chat item depuis route.params
  const startChatName = route.params && route.params.startChatName;
  const startChatId = route.params && route.params.startChatId;
  const startChatInitiator = route.params && route.params.startChatInitiator;
  const startChatInitiatorPseudo = route.params && route.params.startChatInitiatorPseudo;
  const startChatUserId = route.params && route.params.startChatUserId;
  const startChatUserName = route.params && route.params.startChatUserName;

  const initializeChat = async () => {
    if (startChatUserId && startChatUserId !== null) {
      try {
        const getResponse = await axios.get(`http://${IP_ADRESS}:5000/api/chatRooms`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (getResponse.status === 200) {
          const responseData = getResponse.data;

          let matchingChatRoomId = null;

          // Filtrer les chatRooms qui ont un type "chat"
          const chatRoomsOfTypeChat = responseData.filter(chatRoom => chatRoom.type === 'chat');

          for (const chatRoom of chatRoomsOfTypeChat) {
            const attendees = chatRoom.attendees;
            const userAttendeeIndex = attendees.indexOf(user._id);
            const startChatUserAttendeeIndex = attendees.indexOf(startChatUserId);

            if (userAttendeeIndex !== -1 && startChatUserAttendeeIndex !== -1) {
              // Les deux IDs sont présents dans les attendees de cette chatRoom
              matchingChatRoomId = chatRoom._id;
              setChatId(matchingChatRoomId);
              setChatInitiatorId(chatRoom.initiator);
              setChatPartnerPseudo(chatRoom.patnerPseudo);
              setChatInitiatorPseudo(chatRoom.initiatorPseudo);
              console.log(`startChatUserId (${startChatUserId}) est présent dans la chatRoom avec id : ${chatRoom._id}`);
              break; // Sortir de la boucle car le chatRoom a été trouvé
            } else {
              console.log(`startChatUserId (${startChatUserId}) n'est pas présent dans la chatRoom avec id : ${chatRoom._id}`);
            }
          }

          // Si aucune chatRoom correspondante n'a été trouvée, créer une nouvelle chatRoom
          if (matchingChatRoomId === null && startChatUserName && startChatUserName !== "") {
            try {
              const selectedIds = [user._id, startChatUserId];
              const data = {
                type: 'chat',
                chatRoomName: 'Chat privé',
                initiatorPseudo: user.pseudo,
                patnerPseudo: startChatUserName,
                attendees: selectedIds
              };
              const postResponse = await axios.post(`http://${IP_ADRESS}:5000/api/chatRooms`, data, {
                headers: { 'Authorization': `Bearer ${user.token}` }
              });

              if (postResponse.status === 200) {
                const id = postResponse.data._id;
                setChatId(postResponse.data._id);
                setChatInitiatorId(postResponse.data.initiator);
                setChatPartnerPseudo(postResponse.data.patnerPseudo);
                setChatInitiatorPseudo(postResponse.data.initiatorPseudo);
                if (id) {
                  setChatId(id);
                } else {
                  console.log("ID du chatRoom non trouvé dans la réponse de l'API");
                }
              } else {
                console.log("Erreur lors de la création de la chatRoom");
              }
            } catch (error) {
              console.error(error);
            }
          }
        } else {
          console.log("Erreur lors de la récupération des chatRooms");
        }
      } catch (error) {
        console.error(error);
      }
    } else if (startChatId && startChatId !== null) {
      setChatId(startChatId);
      setChatPartnerPseudo(startChatName);
      setChatInitiatorId(startChatInitiator);
      setChatInitiatorPseudo(startChatInitiatorPseudo);
    }
  };

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
        // socketService.emit("send_message",responseData);
      } else {
        console.log('error');
      }
    } catch (error) {
      console.error(error);
    }

  };

  const messagesForCurrentChat = messages.filter(item => item.chatRoomId === chatId);

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
        } else {
          console.log('error');
          console.log(response.status);
        }
      } catch (error) {
        console.log(error.response);
        console.log('request POST message, error !');
      }
    }
  };

  useEffect(() => {
    const initialize = async () => {
      // Vérifier si le chatId est déjà défini
      if (chatId) {
        console.log('Chat déjà initialisé. ChatId:', chatId);
        return; // Sortir de la fonction car le chatId est déjà défini
      }
      // Si le chatId n'est pas défini, alors appeler initializeChat
      await initializeChat();
      await fetchMessages();
    };

    initialize(); // Appelé au chargement initial
    socketService.initializeSocket();
    socketService.on("socket_message", (msg) => {
      fetchMessages();
      setMessages(messages => [...messages, msg]);
    });
  }, []); // Tableau de dépendances vide pour exécuter ce useEffect une seule fois au chargement initial

  // useEffect(() => {
  //   // Utilisez componentDidUpdate pour mettre à jour le chatId en fonction des nouvelles informations de la route
  //   if (route.params && route.params.startChatId && route.params.startChatId !== chatId) {
  //     setChatId(route.params.startChatId);
  //   }
  // }, [route.params.startChatId]); // Surveiller les changements de startChatId uniquement

  // useEffect(() => {
  //   // Utilisez componentDidUpdate pour mettre à jour le chatRoomName en fonction des nouvelles informations de la route
  //   if (route.params && route.params.startChatName && route.params.startChatName !== chatPatnerPseudo) {
  //     setChatPartnerPseudo(route.params.startChatName);
  //   }
  // }, [route.params.startChatName]); // Surveiller les changements de startChatName uniquement

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('HomeMessages');
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  return (
    <MenuProvider style={styles.menuProvider}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="keyboard-backspace" color="white" size={30} onPress={handleBack} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatRoom}>
          <View>
            <Icon name="account-circle" color="white" size={50} />
          </View>
          <View style={{ marginLeft: 10 }}>
            {
              user._id !== chatInitiatorId ? (
                <Text style={styles.chatRoomTitle}>{chatInitiatorPseudo}</Text>
              ) : (
                <Text style={styles.chatRoomTitle}>{chatPatnerPseudo}</Text>
              )
            }
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
    alignItems: 'center',
    backgroundColor: '#ff6e40',
    height: 100,
    paddingTop: 30,
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