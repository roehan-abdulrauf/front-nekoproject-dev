import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, Text } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import socketService from '../components/utile/socketsService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../components/utile/AuthContext';
import React, { useState, useEffect } from 'react';
import IP_ADRESS from '../components/utile/env';
import axios from 'axios';

const StartMessageScreen = ({ navigation }) => {

    const [profiles, setProfiles] = useState([]);
    const [searchProfile, setSearchProfile] = useState('');

    const [user, setUser] = useAuth();

    const handleBack = () => {
        navigation.goBack();
    };

    const handleUserPress = (userSelect) => {
        const startChatUserId = userSelect._id;
        const startChatUserName = userSelect.pseudo;
        navigation.navigate('MessageScreen', { startChatUserId, startChatUserName });
        console.log('test select useer nouv conv', userSelect)
    };

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

    return (
        <MenuProvider style={styles.menuProvider}>
            <View style={styles.container}>
                <View style={styles.iconXInput}>
                    <TouchableOpacity>
                        <Icon name="keyboard-backspace" color="black" size={30} onPress={handleBack} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Nouvelle conversation</Text>
                </View>
                <View style={[styles.inputContainer]}>
                    <TextInput
                        style={styles.input}
                        value={searchProfile}
                        onChangeText={setSearchProfile}
                        placeholder="Rechercher un profil..."
                    />
                    <TouchableOpacity >
                        <Icon name="search" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    inverted={true}
                    onEndReached={fetchprofiles}
                    onEndReachedThreshold={0.5}
                    data={filteredData}
                    keyExtractor={item => `${item._id}`}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleUserPress(item)}>
                            <View>
                                {user._id === item._id ? (
                                    null
                                ) :
                                    <View style={styles.smallContainer}>
                                        <View style={[styles.smallContainer2]}>
                                            <Icon name="account-circle" color="#ff6e40" size={50} />
                                            <View style={[styles.smallContainer3]}>
                                                <Text style={styles.profilPseudo}>{item.pseudo}</Text>
                                                {item.bio ? (
                                                    <Text style={styles.profilText}>{item.bio}</Text>

                                                ) :
                                                    <Text style={styles.profilText}>Salut! J'utilise Neko Chat.</Text>
                                                }
                                            </View>
                                        </View>
                                    </View>
                                }
                            </View>
                        </TouchableOpacity>
                    )
                    }
                />
            </View>
        </MenuProvider>
    );
};


const styles = StyleSheet.create({
    menuProvider: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 100,
    },
    smallContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 25,
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
    iconXInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e3d59',
        padding: 10,
        borderRadius: 20,
        width: '100%',
        marginBottom: 10,
        marginTop: 20,
    },
    input: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginRight: 10,
    },
    buttonContainerFlottant: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 650,
        right: 16,
        width: 60,
        height: 50,
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
});

export default StartMessageScreen;