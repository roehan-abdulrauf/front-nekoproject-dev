import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { Menu, MenuOptions, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import socketService from '../components/utile/socketsService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../components/utile/AuthContext';
import { Logout } from '../components/utile/Logout.js';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const MemberScreen = ({ navigation }) => {

    const [profiles, setProfiles] = useState([]);
    const [searchProfile, setSearchProfile] = useState('');
    // Check Text error
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

    const fetchprofiles = async () => {
        try {
            const response = await axios.get(`http://${IP_ADRESS}:5000/api/users`, { headers: { 'Authorization': `Bearer ${user.token}` } });
            if (response.status === 200) {
                const responseData = response.data;
                setProfiles(responseData);
                console.log(responseData);
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

    const handleUserPress = (user) => {
        navigation.navigate('AutreProfilScreen', { user });
    };

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
                <Text style={styles.screenName}>Menbres groupe</Text>
                <View style={[styles.inputContainer]}>
                    <TextInput
                        style={styles.input}
                        value={searchProfile}
                        onChangeText={setSearchProfile}
                        placeholder="Type your profil here..."
                    />
                    <TouchableOpacity >
                        <Ionicons name="search" size={24} color="white" />
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.button} onPress={handleSendprofil}>
                    <Text style={styles.buttonText}>Rechercher</Text>
                </TouchableOpacity> */}
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
                                            <View>
                                                {/* <Image style={styles.profilAvatar} source={item.image ? { uri: item.image } : require('../assets/favicon.png')} /> */}
                                                <Icon name="account-circle" color="#ff6e40" size={50} />
                                            </View>
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
                    )}
                />
            </View>
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
        // backgroundColor: '#CCCCCC',
    },
    smallContainer2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    smallContainer3: {
        flex: 1,
        marginLeft: 15,
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
});

export default MemberScreen;