import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, StatusBar, Alert } from 'react-native';
import axios, { isCancel, AxiosError } from 'axios';

const backImage = require("../images/fond.png")
const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validatePassword, setValidatePassword] = useState('');


  const goToLogin = () => {
    setErrorMessage('');
    navigation.navigate('Login');
  }

  const register = () => {
    if (!username || !email || !password) {
      setErrorMessage('Tous les champs sont obligatoires, veuillez les remplir s\'il vous plait.');
    } else {
      setErrorMessage('');
      if (username.length < 5) {
        setErrorMessage('Votre pseudo est trop court, il doit faire 5 caractères minimum.');

      } else {
        setErrorMessage('');
        const validRegexEmail = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if (email.match(validRegexEmail) == null) {
          setErrorMessage('Veuillez remplir le champ email avec une adresse mail valable.');
        } else {
          setErrorMessage('');
          const validRegexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

          if (password.match(validRegexPassword) == null) {
            setErrorMessage('Votre mot de passe doit faire 8 caractères minimum et contenir au moins une majuscule, une minuscule, un nombre et un caractère spécial.');
          } else {
            if (password != validatePassword) {
              setErrorMessage('Votre mot de passe et la confirmation de votre mot de passe sont différents.');

            }
            console.log('inscription valide');
            Alert.alert(
              'Bienvenue sur l\'application mobile Neko Chat !',
              'En vous inscrivant, vous accepter nos conditions générales d’utilisation. Nous vous souhaitons de passer un agréable moment sur notre application.',
              [
                {
                  text: 'Annuler',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'M\'inscrire',
                  onPress: () => {
                    axios.post(`http://${IP_ADRESS}:5000/api/users`, {
                      pseudo: username,
                      mail: email,
                      password: password,
                    })
                    .then((response) => {
                      navigation.navigate('Login')
                    })
                    .catch((error) => {
                      console.log(error.response.status);
                      setErrorMessage(error.response.data.message);
                    });
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
        }
      }
    }
  }

  return (
    <View style={styles.container}>
      <Image source={backImage} style={styles.backImage} />
      <Image style={styles.imageLogo} source={require('../images/logo.png')} />
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
        {errorMessage ? (
          <View>
            <Text style={[styles.title, styles.titleMarginTop1]}>S'inscrire</Text>
            <Text style={styles.errorMessage}>
              {errorMessage}
            </Text>
          </View>
        ) : 
        <View>
            <Text style={[styles.title, styles.titleMarginTop2]}>S'inscrire</Text>
          </View>
        }
        <TextInput
          style={styles.input}
          placeholder="Entrez votre Pseudo"
          autoCapitalize='none'
          keyboardType="default"
          value={username}
          onChangeText={(text) => setUsername(text)} />
        <TextInput
          style={styles.input}
          placeholder="Entrez votre Email"
          autoCapitalize='none'
          keyboardType="email-address"
          textContentType='emailAdress'
          value={email}
          onChangeText={(text) => setEmail(text)} />
        <TextInput
          style={styles.input}
          placeholder="Entrez votre Password"
          autoCapitalize='none'
          textContentType="password"
          autoCorrect={false}
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)} />
        <TextInput
          style={styles.input}
          placeholder="Confirmer votre Password"
          autoCapitalize='none'
          textContentType="password"
          autoCorrect={false}
          secureTextEntry={true}
          value={validatePassword}
          onChangeText={(text) => setValidatePassword(text)} />
        <TouchableOpacity style={styles.button} onPress={register}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
          <Text style={{ color: 'black', fontWeight: '600', fontSize: 14, }}>Vous avez un compte ?</Text>
          <TouchableOpacity onPress={() => goToLogin()}>
            <Text style={{ color: '#ffc13b', fontWeight: '600', fontSize: 14 }}> Me Connecter</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ marginTop: 20, color: 'red' }}>
          {errorMessage}
        </Text>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backImage: {
    width: "100%",
    position: "absolute",
    height: "50%",
    top: 0,
    resizeMode: 'cover'
  },
  imageLogo: {
    fontWeight: 'bold',
    color: "white",
    alignSelf: "center",
    width: "50%",
    position: "absolute",
    height: "30%",
    top: 0,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: "#ffc13b",
    alignSelf: "center",
    marginBottom: 20,
  },
  titleMarginTop1: {
    marginTop: 305,
  },
  titleMarginTop2: {
    marginTop: 230,
  },
  whiteSheet: {
    width: '100%',
    height: '75%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
  },

  input: {
    width: 300,
    backgroundColor: '#F5F0E1',
    borderRadius: 15,
    height: 50,
    padding: 12,
    margin: 10,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: '#FF6E40',
    height: 58,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: "center",
    alignItems: "center",
    fontSize: 18,
    marginTop: 18,
  },
  errorMessage: {
    marginBottom: 20,
    color: 'red',
    textAlign: 'center',
  }
});


export default SignUp;


