import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import { Menu, MenuOptions, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { updatePasswordUser } from '../components/utile/updatePasswordUser.js';
import { updatePseudoUser } from '../components/utile/updatePseudoUser.js';
import { updateMailUser } from '../components/utile/updateMailUser.js';
import { updateBioUser } from '../components/utile/updateBioUser.js';
import { updatePhotoUser } from '../components/utile/updatePhotoUser.js';
// import ImageEditor from '@react-native-community/image-editor';
// import ImagePicker from 'react-native-image-picker';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library'; // Added import statement
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../components/utile/AuthContext';
import { Logout } from '../components/utile/Logout.js';
import React, { useState, useEffect } from 'react';

const ProfilScreen = ({ navigation }) => {

  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');

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

  // Form
  const validRegexEmail = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const validRegexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  // // function to request permission to access camera roll
  // const getPermissionAsync = async () => {
  //   if (Platform.OS !== 'web') {
  //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (status !== 'granted') {
  //       alert('Sorry, we need camera roll permissions to make this work!');
  //     }
  //   }
  // }


  // useEffect(() => {
  //   (async () => {
  //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (status !== 'granted') {
  //       Alert.alert('Permission insuffisante', 'Désolé, nous avons besoin de l\'autorisation pour accéder à votre galerie de photos!', [{ text: 'OK' }]);
  //     }

  //     const { cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
  //     if (cameraStatus !== 'granted') {
  //       Alert.alert('Permission insuffisante', 'Désolé, nous avons besoin de l\'autorisation pour accéder à votre appareil photo!', [{ text: 'OK' }]);
  //     }
  //   })();
  // }, []);

  // Demande les permissions pour accéder à la caméra et à la galerie
  // const getPermissionsAsync = async () => {
  //   const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
  //   const { status: mediaLibStatus } = await MediaLibrary.requestPermissionsAsync();

  //   if (cameraStatus !== 'granted' || mediaLibStatus !== 'granted') {
  //     alert('Vous devez autoriser l\'accès à la caméra et à la galerie pour utiliser cette fonctionnalité.');
  //   }
  // };

  async function getPermissionsAsync() {
    const { status: cameraStatus } = await Permissions.getAsync(Permissions.CAMERA)
    const { status: mediaLibraryStatus } = await Permissions.getAsync(Permissions.MEDIA_LIBRARY);

    if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
      alert('Les permissions nécessaires n\'ont pas été accordées.');
      return false;
    }

    return true;
  }

  const openImagePickerAsync = async (type) => {
    let pickerResult;
    if (type === 'gallery') {
      let image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!image.cancelled) {
        pickerResult = image;
        setImage(image.assets[0].uri);
      }
    } else if (type === 'camera') {
      const hasPermissions = await getPermissionsAsync();
      if (!hasPermissions) {
        return;
      }
      let image = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
      if (!image.cancelled) {
        pickerResult = image;
        setImage(image.assets[0].uri);
      }
    }
  
    if (!pickerResult) {
      return;
    }
  
    setSelectedImage({ localUri: pickerResult.uri });
  };


  //  // call the function to request permission when component mounts
  //  useEffect(() => {
  //   getPermissionAsync();
  // }, []);

  const updateUser = () => {

    const validPseudo = pseudo ? pseudo.length > 5 : false;
    const validMail = email ? email.match(validRegexEmail) : false;
    const validPassword = password ? password.match(validRegexPassword) : false;
    const matchPassword = password === confirmPassword ? true : false;
    const isBanned = user.isBanned;
    let update;

    // if (image) {
    //   formData.append('image', {
    //     uri: image,
    //     name: 'image.jpg',
    //     type: 'image/jpg',
    //   });
    // }

    if (validPseudo || validMail || (validPassword && matchPassword) || bio) {
      if (validPseudo) {
        setMessage('');
        update = updatePseudoUser(pseudo, user.token);
        setMessage('Vos informations ont été modifiées.');
      }
      if (validMail) {
        setMessage('');
        update = updateMailUser(email, user.token);
        setMessage('Vos informations ont été modifiées.');
      }
      if (validPassword && matchPassword) {
        setMessage('');
        update = updatePasswordUser(password, user.token);
        setMessage('Vos informations ont été modifiées.');
      }
      if (bio) {
        update = updateBioUser(bio, user.token);
        setMessage('Vos informations ont été modifiées.');
      }
    } else {
      setMessage('Veuillez remplir au moins un des champs pour modifier vos informations, vous devez également confirmer votre nouveau mot de passe.');
    }
  }

  return (
    <MenuProvider>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.headerTitle}>NekoChat</Text>
        </TouchableOpacity>
        <Menu style={styles.menuOptions}>
          <MenuTrigger>
            <Image source={require('../images/menu_icon.png')} style={styles.menuIcon} />
          </MenuTrigger>
          <MenuOptions>
            <TouchableOpacity onPress={() => navigation.navigate('ProfilScreen')}>
              <View style={styles.menuOption}>
                <Icon name="person" size={15} />
                <Text style={styles.menuOptionText}>Mon profil</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MemberScreen')}>
              <View style={styles.menuOption}>
                <Icon name="group" size={15} />
                <Text style={styles.menuOptionText}>Member</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={logoutUser}>
              <View style={styles.menuOption}>
                <Icon name="logout" size={15} />
                <Text style={styles.menuOptionText}>Deconnexion</Text>
              </View>
            </TouchableOpacity>
          </MenuOptions>
        </Menu>
      </View>
      <View style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {/* {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, }} />}
          <Button title="changer l'image" onPress={pickImage} /> */}
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.screenName}>Mon Profil</Text>
          <Image source={require("../assets/icons8-saitama-250.png")} style={styles.profileImg} />
          <Button
            title="Sélectionner une image depuis la galerie"
            onPress={() => openImagePickerAsync('gallery')}
          />
          <Button
            title="Prendre une photo"
            onPress={() => openImagePickerAsync('camera')}
          />
          {selectedImage !== null && (
            <Image
              source={{ uri: selectedImage.localUri }}
              style={{ width: 300, height: 300 }}
            />
          )}
          <Text>Votre pseudo :</Text>
          <TextInput
            style={styles.input}
            placeholder={`${user.pseudo}`}
            autoCapitalize='none'
            keyboardType="default"
            autoFocus={false}
            value={pseudo}
            onChangeText={(text) => setPseudo(text)}
            onChange={text => setPseudo(text)}
          />
          <Text>Votre email :</Text>
          <TextInput
            style={styles.input}
            placeholder={`${user.email}`}
            autoCapitalize='none'
            keyboardType="email-address"
            textContentType='emailAdress'
            autoFocus={false}
            value={email}
            onChangeText={(text) => setEmail(text)}
            onChange={text => setEmail(text)}
          />
          <Text>Votre bio :</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre bio"
            keyboardType="password"
            textContentType="bio"
            value={bio}
            onChange={text => setBio(text)}
            onChangeText={text => setBio(text)}
          />
          <Text>Votre mot de passe :</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre Password"
            autoCapitalize='none'
            textContentType="password"
            autoCorrect={false}
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
            onChange={text => setPassword(text)}
          />
          <Text>Confirmer votre mot de passe :</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirmer votre mot de passe"
            textContentType="password"
            secureTextEntry={true}
            value={confirmPassword}
            onChange={text => setConfirmPassword(text)}
            onChangeText={text => setConfirmPassword(text)}
          />

          <TouchableOpacity style={styles.button} onPress={updateUser}>
            <Text style={styles.buttonText}>Entregistrer les modifications</Text>
          </TouchableOpacity>
          <Text>
            {message}
          </Text>
        </View>
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
    // paddingBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
    // zIndex: 1,
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
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 10,
    // marginTop: 70,
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
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0, elevation: 0
  },

  profileImage: {
    width: '100%',
    height: '100%',

  },
  profileImg: {
    position: "relative", left: 120,
    width: '25%',
    height: '15%',
    margin: 0,
    borderRadius: 80,
    marginBottom: 10,
    marginTop: 10
  },
  formContainer: {
    marginBottom: 30,
    width: '90%',
    zIndex: 0, elevation: 0
  },
  input: {

    borderBottomWidth: 1,
    borderBottomColor: 'black',
    height: 50,
    padding: 12,
    margin: 10,
    border: 0,
    padding: 0,
    zIndex: 1,
    backgroundColor: 'white',
    borderBottom: '2px solid #eee',
    fontSize: 14,
    lineHeight: 30
  },
  button: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#FF6E40',
    // borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfilScreen;