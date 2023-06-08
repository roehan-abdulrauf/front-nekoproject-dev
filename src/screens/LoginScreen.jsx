import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, StatusBar, Alert } from 'react-native';
import axios, { isCancel, AxiosError } from 'axios';
import { useAuth } from '../components/utile/AuthContext';
import IP_ADRESS from '../components/utile/env';
import { Linking } from 'react-native';
import queryString from 'query-string';
import { AntDesign } from '@expo/vector-icons';
import randomstring from 'randomstring';


const backImage = require("../images/fond.png")

const Login = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessage2, setErrorMessage2] = useState('');
  const [user, setUser] = useAuth();

  const goToSignUp = () => {
    setErrorMessage('');
    navigation.navigate('Register');
  }

  const goToMailValidation = async () => {
    const verificationCode = randomstring.generate({
      length: 6,
      charset: 'numeric',
      numeric: true
    });
    try {
      const postMail = await axios.post(`http://${IP_ADRESS}:5000/api/mail`, {
        // pseudo: username,
        email: email,
        verificationCode: verificationCode,
      });
      if (postMail.status = 200) {
        navigation.navigate('MailValidation', { email, password, verificationCode });
      }
    } catch (error) {
      // console.log(error);
      setErrorMessage('Une erreur s\'est produite lors de l\'envoi du code de vérification.');
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // // Fonction qui récupère l'URL initiale
  // const getInitialUrl = async () => {
  //   // Vérifie si l'application a été ouverte avec une URL
  //   const initialUrl = await Linking.getInitialURL();

  //   // Si une URL a été trouvée, extraire le token de l'URL
  //   if (initialUrl) {
  //     const { token } = queryString.parseUrl(initialUrl).query;
  //     console.log(`Token: ${token}`);
  //     if (token != undefined && token != null && token != '') {
  //       navigation.navigate('MailValidation');
  //     }
  //   }
  // }

  // // Appeler la fonction pour récupérer l'URL initiale
  // getInitialUrl();


  const seConnecter = () => {

    if (!email || !password) {

      setErrorMessage('Tous les champs sont obligatoires, veuillez les remplir s\'il vous plait');
    } else {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i; // i pour ignorer la casse
      const isMatchMail = regex.test(email);
      const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/i;
      const isMatchPassword = regexPassword.test(password);
      if (isMatchMail && isMatchPassword) {

        axios.post(`http://${IP_ADRESS}:5000/api/users/login`, {
          mail: email,
          password: password,
        })
          .then((response) => {
            // console.log(response);
            if (response.data.mailVerified === "true") {
              setUser({
                ...response.data,
                idToken: response.data.token
              });
              // console.log(response);
            } else {
              setErrorMessage2("Vous devez vérifier votre adresse mail avant de vous connecter.");
            }
          })
          .catch((error) => {
            // console.error(error);
            // console.log(error);
            setErrorMessage(error.response.data.message)
          });
      } else {
        setErrorMessage("Erreur dans vos identifiants");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={backImage} style={styles.backImage} />
      <Image style={styles.imageLogo} source={require('../images/logo.png')} />
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
        {errorMessage ? (
          <View>
            <Text style={[styles.title, styles.titleMarginTop1]}>Se Connecter</Text>
            <Text style={styles.errorMessage}>
              {errorMessage}
            </Text>
          </View>
        ) : errorMessage2 ? (
          <View>
            <Text style={[styles.title, styles.titleMarginTop1]}>Se Connecter</Text>
            <Text style={styles.errorMessage}>
              {errorMessage2}
              <TouchableOpacity onPress={() => { goToMailValidation() }}>
                <Text style={{ color: 'green', }}> Recevoir le code de vérification</Text>
              </TouchableOpacity>
            </Text>
          </View>
        ) : (
          <View>
            <Text style={[styles.title, styles.titleMarginTop2]}>Se Connecter</Text>
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholder="Entrez votre Pseudo"
          autoCapitalize='none'
          keyboardType="default"
          value={email}
          onChangeText={(text) => setEmail(text)} />
        <View style={styles.inputPassword}>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre Password"
            autoCapitalize='none'
            textContentType="password"
            autoCorrect={false}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => setPassword(text)} />
          <TouchableOpacity style={styles.showPasswordButton} onPress={toggleShowPassword}>
            <AntDesign style={styles.showPasswordButtonDesign} name={showPassword ? 'eyeo' : 'eye'} size={24} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => { seConnecter() }}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
          <Text style={{ color: 'black', fontWeight: '600', fontSize: 14, }}>Vous n'avez pas de compte ?</Text>
          <TouchableOpacity onPress={() => { goToSignUp() }}>
            <Text style={{ color: '#ffc13b', fontWeight: '600', fontSize: 14 }}> S'inscrire</Text>
          </TouchableOpacity>
        </View>
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
    // fontWeight: 'bold',
    // color: "white",
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
    marginTop: 150,
  },
  titleMarginTop2: {
    marginTop: 50,
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
  inputPassword: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showPasswordButton: {
    padding: 5,
    position: 'absolute',
    right: 10,
  },
  showPasswordButtonDesign: {
    color: '#FF6E40',
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
    padding: 8,
  }
});

export default Login;