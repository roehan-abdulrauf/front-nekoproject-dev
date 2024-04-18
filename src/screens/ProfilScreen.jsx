import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, Button, Alert, Modal } from 'react-native';
import { Menu, MenuOptions, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { updatePasswordUser } from '../components/utile/updatePasswordUser.js';
import { updatePseudoUser } from '../components/utile/updatePseudoUser.js';
import { updateMailUser } from '../components/utile/updateMailUser.js';
import { updateBioUser } from '../components/utile/updateBioUser.js';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library'; // Added import statement
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../components/utile/AuthContext';
import { Logout } from '../components/utile/Logout.js';
import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar.js';

const ProfilScreen = ({ navigation }) => {

  const [newPseudo, setNewPseudo] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newBio, setNewBio] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [succesMessage, setSuccesMessage] = useState('');
  const [isEditingPseudo, setIsEditingPseudo] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [selectedImage, setSelectedImage] = useState(null);

  const [user, setUser] = useAuth();

  const [activeScreen, setActiveScreen] = useState('profile');

  const handleNavPress = (screen) => {
    setActiveScreen(screen);
  };

  const openPseudoModal = () => {
    setIsEditingPseudo(true);
  };

  const openEmailModal = () => {
    setIsEditingEmail(true);
  };

  const openPasswordModal = () => {
    setIsEditingPassword(true);
  };

  const openBioModal = () => {
    setIsEditingBio(true);
  };

  const closeModals = () => {
    setIsEditingPseudo(false);
    setIsEditingEmail(false);
    setIsEditingPassword(false);
    setIsEditingBio(false);
    setErrorMessage('');
    setSuccesMessage('');
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

  // Form
  const validRegexPseudo = /^[a-zA-Z0-9_-]{5,}$/;
  const validRegexEmail = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const validRegexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  const validRegexBio = /^[a-zA-Z0-9_!?\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}-\u{2BFF}]$/u;

  const savePseudoChanges = () => {
    if (newPseudo) {
      const validPseudo = newPseudo ? newPseudo.match(validRegexPseudo) : false;
      if (validPseudo) {
        // setErrorMessage('');
        update = updatePseudoUser(newPseudo, user.token);
        setSuccesMessage('Votre pseudo à été modifiée avec succès.');
        setIsEditingPseudo(false);
        setUser({ ...user, pseudo: newPseudo });
      } else {
        setErrorMessage('Votre pseudo doit faire plus de 5 caractères.');
        setNewPseudo(user.pseudo);
      }
    } else {
      setErrorMessage('Veuillez remplir le champs svp.');
      setNewPseudo(user.pseudo);
    }
  };

  const saveEmailChanges = () => {
    if (newEmail) {
      const validMail = newEmail ? newEmail.match(validRegexEmail) : false;
      if (validMail) {
        update = updateMailUser(newEmail, user.token);
        setSuccesMessage('Votre adresse mail à été modifiée avec succès.');
        setIsEditingEmail(false);
        setUser({ ...user, email: newEmail });
      } else {
        setErrorMessage('Votre adresse mail n\'est pas valide.');
        setNewEmail(user.email);
      }
    } else {
      setErrorMessage('Veuillez remplir le champs svp.');
      setNewEmail(user.email);
    }
  };

  const saveBioChanges = () => {
    if (newBio) {
      const validBio = newBio ? newBio.match(validRegexBio) : false;
      if (validBio) {
        update = updateBioUser(newBio, user.token);
        setSuccesMessage('Votre bio à été modifiée avec succès.');
        setIsEditingBio(false);
        setUser({ ...user, bio: newBio });
      } else {
        setErrorMessage('Votre bio ne doit pas contenir certains caractères.');
        setNewBio(user.bio);
      }
    } else {
      setErrorMessage('Veuillez remplir le champs svp.');
      setNewBio(user.bio);
    }
  };

  const savePasswordChanges = () => {
    if (newPassword && confirmPassword) {
      const validPassword = newPassword ? newPassword.match(validRegexPassword) : false;
      const matchPassword = newPassword === confirmPassword ? true : false;
      if (validPassword && matchPassword) {
        update = updatePasswordUser(newPassword, user.token);
        setSuccesMessage('Votre mot de passe à été modifiée avec succès.');
        setIsEditingPassword(false);
      } else {
        setErrorMessage('Votre mot de psse n\'est pas valide.');
      }
    } else {
      setErrorMessage('Veuillez remplir les deux champs svp.');
    }
  };

  return (
    <MenuProvider style={styles.menuProvider}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeGroups')}>
          <Text style={styles.headerTitle}>Neko Tchat</Text>
        </TouchableOpacity>
        <Menu style={styles.menuOptions}>
          <MenuTrigger style={styles.menuTrigger} onPress={logoutUser} >
            <Icon name="logout" size={20} color="white" />
            <Text style={{ fontSize: 12, paddingLeft: 4, color: "white" }}>Déconnexion</Text>
          </MenuTrigger>
        </Menu>
      </View>
      <View style={styles.container}>
        <Text style={styles.screenName}>Mon Profil</Text>
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View>
            {succesMessage && (
              <Text style={styles.succesMessage}>
                {succesMessage}
              </Text>)}
            <View style={styles.profileContainer}>
              <Icon name="person" size={120} style={styles.profileIcon} />
              <TouchableOpacity style={styles.cameraIcon}>
                <Icon name="photo-camera" size={24} color="white" />
              </TouchableOpacity>
            </View>
            {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />}
            <View style={styles.allInputContainer}>
              <View style={styles.inputContainer}>
                <View style={styles.inputCon}>
                  <Text>Votre email :</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={`${user.email}`}
                    autoCapitalize='none'
                    keyboardType="email-address"
                    textContentType='emailAdress'
                    autoFocus={false}
                    value={newEmail}
                    onChangeText={(text) => setNewEmail(text)}
                    onChange={text => setNewEmail(text)}
                    editable={false}
                  />
                </View>
              </View>
              <View style={styles.inputContainer}>
                <View style={styles.inputCon}>
                  <Text>Votre pseudo :</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={`${user.pseudo}`}
                    autoCapitalize='none'
                    keyboardType="default"
                    autoFocus={false}
                    value={newPseudo}
                    onChangeText={(text) => setNewPseudo(text)}
                    onChange={text => setNewPseudo(text)}
                    editable={false}
                  />
                </View>
                <TouchableOpacity
                  style={styles.editProfileImageIcon}
                  onPress={openPseudoModal}
                >
                  <Icon name="edit" size={24} color="#ff6e40" />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <View style={styles.inputCon}>
                  <Text>Votre bio :</Text>
                  {user.bio === "Salut! J'utilise Neko Chat." ? (
                    <TextInput
                      style={styles.input}
                      placeholder="Salut! J'utilise Neko Chat."
                      keyboardType="default"
                      value={newBio}
                      onChange={text => setNewBio(text)}
                      onChangeText={text => setNewBio(text)}
                      editable={false}
                    />
                  ) :
                    <TextInput
                      style={styles.input}
                      placeholder={`${user.bio}`}
                      keyboardType="default"
                      value={newBio}
                      onChange={text => setNewBio(text)}
                      onChangeText={text => setNewBio(text)}
                      editable={false}
                    />
                  }
                </View>
                <TouchableOpacity
                  style={styles.editProfileImageIcon}
                  onPress={openBioModal}
                >
                  <Icon name="edit" size={24} color="#ff6e40" />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <View style={styles.inputCon}>
                  <Text>Votre mot de passe :</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="**************"
                    autoCapitalize='none'
                    textContentType="password"
                    autoCorrect={false}
                    secureTextEntry={true}
                    value={newPassword}
                    onChangeText={(text) => setNewPassword(text)}
                    onChange={text => setNewPassword(text)}
                    editable={false}
                  />
                </View>
                <TouchableOpacity
                  style={styles.editProfileImageIcon}
                  onPress={openPasswordModal}
                >
                  <Icon name="edit" size={24} color="#ff6e40" />
                </TouchableOpacity>
              </View>

              <View style={styles.centeredView}>
                <Modal visible={isEditingPseudo} onRequestClose={closeModals} onBackdropPress={closeModals} transparent={true}>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <View style={styles.inputContainer}>
                        <View style={styles.inputCon}>
                          {errorMessage && (
                            <Text style={styles.errorMessage}>
                              {errorMessage}
                            </Text>
                          )}
                          <Text>Modifier votre pseudo :</Text>
                          <TextInput
                            style={styles.input}
                            placeholder={`${user.pseudo}`}
                            autoCapitalize='none'
                            keyboardType="default"
                            autoFocus={false}
                            value={newPseudo}
                            onChangeText={(text) => setNewPseudo(text)}
                            onChange={text => setNewPseudo(text)}
                          />
                        </View>
                      </View>
                      <View style={styles.editButton}>
                        <Button title="Annuler" onPress={closeModals} color='#D6D9D3' />
                        <Button title="Enregistrer" onPress={savePseudoChanges} color='#ffc13b' />
                      </View>
                    </View>
                  </View>
                </Modal>

                <Modal visible={isEditingBio} onRequestClose={closeModals} onBackdropPress={closeModals} transparent={true}>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <View style={styles.inputContainer}>
                        <View style={styles.inputCon}>
                          {errorMessage && (
                            <Text style={styles.errorMessage}>
                              {errorMessage}
                            </Text>
                          )}
                          <Text>Modifier votre bio</Text>
                          {user.bio === "Salut! J'utilise Neko Chat." ? (
                            <TextInput
                              style={styles.input}
                              placeholder="Nouveau bio"
                              autoCapitalize='none'
                              keyboardType="default"
                              autoFocus={false}
                              value={newBio}
                              onChangeText={text => setNewBio(text)}
                            />
                          ) :
                            <TextInput
                              style={styles.input}
                              placeholder={`${user.bio}`}
                              autoCapitalize='none'
                              keyboardType="default"
                              autoFocus={false}
                              value={newBio}
                              onChangeText={text => setNewBio(text)}
                            />
                          }
                        </View>
                      </View>
                      <View style={styles.editButton}>
                        <Button title="Annuler" onPress={closeModals} color='#D6D9D3' />
                        <Button title="Enregistrer" onPress={saveBioChanges} color='#ffc13b' />
                      </View>
                    </View>
                  </View>
                </Modal>

                <Modal visible={isEditingPassword} onRequestClose={closeModals} onBackdropPress={closeModals} transparent={true}>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <View style={styles.inputContainer}>
                        <View style={styles.inputCon}>
                          {errorMessage && (
                            <Text style={styles.errorMessage}>
                              {errorMessage}
                            </Text>
                          )}
                          <Text>Modifier votre mot de passe :</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Mot de passe"
                            autoCapitalize='none'
                            textContentType="password"
                            autoCorrect={false}
                            secureTextEntry={true}
                            value={newPassword}
                            onChangeText={(text) => setNewPassword(text)}
                            onChange={text => setNewPassword(text)}
                          />
                        </View>
                      </View>
                      <View style={styles.inputContainer2}>
                        <Text>Confirmer votre nouveau mot de passe :</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Confirmation mot de passe"
                          textContentType="password"
                          secureTextEntry={true}
                          value={confirmPassword}
                          onChange={text => setConfirmPassword(text)}
                          onChangeText={text => setConfirmPassword(text)}
                        />
                        {/* </View> */}
                      </View>
                      <View style={styles.editButton}>
                        <Button title="Annuler" onPress={closeModals} color='#D6D9D3' />
                        <Button title="Enregistrer" onPress={savePasswordChanges} color='#ffc13b' />
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
          </View>
        </ScrollView>
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
  body: {
    flexGrow: 1,
    minHeight: 600,
  },
  menuOptions: {
    zIndex: 1, elevation: 1
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
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  profileIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'black',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 10,
    right: 100,
    backgroundColor: '#ff6e40',
    padding: 8,
    borderRadius: 20,
  },
  iconContainer: {
    flexDirection: 'row', // Aligns the icons side by side
    justifyContent: 'center', // Centers the icons horizontally
    marginVertical: 10, // Adjust as needed
  },
  formContainer: {
    width: '90%',
    zIndex: 0, elevation: 0
  },
  allInputContainer: {
    marginTop: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 5,
    paddingTop: 10,
  },
  inputContainer2: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 5,
    paddingTop: 30,
  },
  inputCon: {
    width: '90%',
  },
  input: {
    height: 50,
    padding: 3,
    border: 0,
    zIndex: 1,
    borderBottom: '2px solid #eee',
    fontSize: 14,
    lineHeight: 30
  },
  button: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#FF6E40',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    minWidth: 300,
  },
  succesMessage: {
    color: 'green',
  },
  errorMessage: {
    color: 'red',
    paddingBottom: 15,
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
  editButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    color: 'black',
  },
});

export default ProfilScreen;