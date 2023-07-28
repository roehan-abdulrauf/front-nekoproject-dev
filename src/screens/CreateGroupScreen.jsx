import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, Text, ScrollView } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../components/utile/AuthContext';
import React, { useState} from 'react';
import IP_ADRESS from '../components/utile/env';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';


const CreateGroupScreen = ({ navigation, route }) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // Accéder à la liste selectedMembers depuis route.params
    const selectedMembers = route.params.selectedMembers;
    const selectedIds = route.params.selectedIds;
    const [errorMessage, setErrorMessage] = useState('');
    const [succesMessage, setSuccesMessage] = useState('');
    const [user, setUser] = useAuth();

    const handleBack = () => {
        navigation.goBack();
    };

    handleCreateGroup = async () => {
        if (title === "") {
            setErrorMessage("Vous devez renseigné au moins le nom de l'espace !");
        }
        else {
            try {
                const data = {};
                if (title !== "" && description !== "") {
                    data.type = 'chatRoom';
                    data.chatRoomName = title;
                    data.description = description;
                    data.attendees = selectedIds;
                }
                else if (title !== "" && description === "") {
                    data.type = 'chatRoom';
                    data.chatRoomName = title;
                    data.attendees = selectedIds;
                }
                const response = await axios.post(`http://${IP_ADRESS}:5000/api/chatRooms`, data, { headers: { 'Authorization': `Bearer ${user.token}` } });
                if (response.status === 200) {
                    const responseData = response.data;
                    setSuccesMessage("Le groupe a bien été créer !");
                    setTimeout(() => {
                        navigation.navigate('HomeGroups');
                    }, 5000);
                } else {
                    console.log('error');
                    setErrorMessage("Une erreur est survenue. Veuillez réessayer !");
                }
            } catch (error) {
                console.error("catch", error);
            }
        }
    };

    return (
        <MenuProvider style={styles.menuProvider}>
            <View style={styles.container}>
                <View style={styles.iconXInput}>
                    <TouchableOpacity onPress={handleBack}>
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Créer un groupe</Text>
                </View>
                <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                    {succesMessage && (
                        <Text style={styles.succesMessage}>
                            {succesMessage}
                        </Text>)}
                    {errorMessage && (
                        <Text style={styles.errorMessage}>
                            {errorMessage}
                        </Text>)}
                    <View style={styles.allInputContainer}>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputCon}>
                                <TextInput style={styles.input}
                                    placeholder="Nom de l'espace de discussion"
                                    keyboardType="default"
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputCon}>
                                <TextInput style={styles.input}
                                    placeholder="Description (facultatif)"
                                    keyboardType="default"
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </View>
                        </View>
                    </View>
                    {selectedMembers.length > 0 && (
                        <View>
                            <Text>Vous avez ajouter {selectedMembers.length} Membre(s) au groupe :</Text>
                            <FlatList
                                data={selectedMembers}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item }) => (
                                    <View>
                                        <Text>{item.pseudo}</Text>
                                    </View>
                                )}
                            />
                        </View>
                    )}
                </ScrollView>
                <View style={styles.buttonContainerFlottant}>
                    <TouchableOpacity style={styles.addButton} onPress={() => handleCreateGroup()}>
                        <Icon name="arrow-forward" size={26} />
                    </TouchableOpacity>
                </View>
            </View>
        </MenuProvider>
    );
}
const styles = StyleSheet.create({
    menuProvider: {
        flex: 1,
        backgroundColor: 'white',
    },
    body: {
        marginTop: 30,
    },
    container: {
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 100,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 10,
    },
    iconXInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
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
    input: {
        height: 50,
        padding: 3,
        // marginBottom: 20,
        border: 0,
        zIndex: 1,
        backgroundColor: 'white',
        borderBottom: '2px solid #eee',
        fontSize: 14,
        lineHeight: 30
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
        // shadowRadius: 4,
        // shadowOffset: {
        //   width: 0,
        //   height: 2,
        // },
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    succesMessage: {
        color: 'green',
    },
    errorMessage: {
        color: 'red',
        paddingBottom: 15,
    },
});

export default CreateGroupScreen;