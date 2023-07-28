import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, Text, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import { Menu, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import socketService from '../components/utile/socketsService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../components/utile/AuthContext';
import { Logout } from '../components/utile/Logout.js';
import React, { useState, useEffect } from 'react';
import IP_ADRESS from '../components/utile/env';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import NavBar from '../components/NavBar.js';

const MemberScreen = ({ navigation }) => {

    const [profiles, setProfiles] = useState([]);
    const [searchProfile, setSearchProfile] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    // Check Text error 
    const [user, setUser] = useAuth();

    const [activeScreen, setActiveScreen] = useState('groups');

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

    const fetchprofiles = async () => {
        try {
            const response = await axios.get(`http://${IP_ADRESS}:5000/api/users`, { headers: { 'Authorization': `Bearer ${user.token}` } });
            if (response.status === 200) {
                const responseData = response.data;
                setProfiles(responseData);
            } else {
                console.log('error');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchprofiles();
        socketService.initializeSocket();
        socketService.on("socket_user", (users) => {
            fetchprofiles();
            setProfiles(profiles => [...profiles, users]);
        });
    }, []);

    const filteredData = Array.isArray(profiles)
        ? profiles.filter((item) => item.pseudo.toLowerCase().includes(searchProfile.toLowerCase()))
        : [];

    const handleUserPressChat = (userSelect) => {
        const startChatUserId = userSelect._id;
        const startChatUserName = userSelect.pseudo;
        navigation.navigate('MessageScreen', { startChatUserId, startChatUserName });
    };
    const handleUserPressOtherProfil = (item) => {
        navigation.navigate('AutreProfilScreen', { user: item });
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
            <View style={styles.container}>
                <Text style={styles.screenName}>Membres inscris</Text>
                <View style={[styles.inputContainer]}>
                    <TextInput
                        style={styles.input}
                        value={searchProfile}
                        onChangeText={setSearchProfile}
                        placeholder="Rechercher un profil..."
                    />
                    <TouchableOpacity >
                        <Ionicons name="search" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    inverted={true}
                    onEndReached={fetchprofiles}
                    onEndReachedThreshold={0.5}
                    data={filteredData}
                    keyExtractor={item => `${item._id}`}
                    renderItem={({ item }) => (
                        <View>
                            {user._id === item._id ? (
                                null
                            ) :
                                <View style={styles.smallContainer}>
                                    <TouchableOpacity style={[styles.smallContainer2]} onPress={() => { setModalVisible(true); setSelectedUser(item) }} >
                                        <View>
                                            <Icon name="account-circle" color="#ff6e40" size={50} />
                                        </View>
                                        <View style={[styles.smallContainer3]}>
                                            <Text style={styles.profilPseudo}>{item.pseudo}</Text>
                                            <Text style={styles.profilText}>{item.bio}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={styles.centeredView} >
                                        <Modal visible={isModalVisible}
                                            onRequestClose={() => setModalVisible(false)}
                                            onBackdropPress={() => setModalVisible(false)}
                                            transparent={true}>
                                            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                                                <View style={styles.modalContainer}>
                                                    <View style={styles.modalContent}>
                                                        <Text>{selectedUser && selectedUser.pseudo}</Text>
                                                        <Icon name="account-circle" color="#ff6e40" size={200} />
                                                        <View style={styles.modalIconContainer}>
                                                            <TouchableOpacity onPress={() => { handleUserPressChat(selectedUser); setModalVisible(false) }}>
                                                                <Icon name="comment" size={30} color="#ff6e40" />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => { handleUserPressOtherProfil(selectedUser); setModalVisible(false) }}>
                                                                <Icon name="info" size={30} color="#ff6e40" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </Modal>
                                    </View>
                                </View>
                            }
                        </View>
                    )
                    }
                />
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
    smallContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 30,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f0e1',
    },
    smallContainer2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    smallContainer3: {
        flex: 1,
        marginLeft: 25,
    },
    profilAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    profilPseudo: {
        fontSize: 13,
        marginBottom: 10,
        color: '#ffc13b',
    },
    profilText: {
        fontSize: 13,
        padding: 5,
        color: 'black',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e3d59',
        padding: 10,
        borderRadius: 20,
        width: '100%',
        marginBottom: 10,
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#D6D9D3',
        borderRadius: 10,
        padding: 20,
    },
    modalImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20,
    },
    modalIconContainer: {
        borderTopWidth: 1,
        borderTopColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 20,
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

export default MemberScreen;