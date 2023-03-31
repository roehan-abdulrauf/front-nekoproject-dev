import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, StatusBar, Alert } from 'react-native';
import axios, { isCancel, AxiosError } from 'axios';
import { save, getItem } from '../components/utile/SecureStore';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaFrameContext } from 'react-native-safe-area-context';
import { useAuth } from '../components/utile/AuthContext';
import IP_ADRESS from '../components/utile/env';

const backImage = require("../images/fond.png")

const Login = ({ navigation }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useAuth();

  const goToSignUp = () => {
    setErrorMessage('');
    navigation.navigate('Register');
  }

  const seConnecter = () => {
    
    
      if(!username || !password){
          
          setErrorMessage('Tous les champs sont obligatoires, veuillez les remplir s\'il vous plait');
        } else {
          const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i; // i pour ignorer la casse
          const isMatchMail = regex.test(username);
          const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/i;
          const isMatchPassword = regexPassword.test(password);
          if(isMatchMail && isMatchPassword){

            axios.post(`http://${IP_ADRESS}:5000/api/users/login`, {
              mail: username,
              password: password,
            })
            .then( (response) => {
              setUser({
                ...response.data,
                idToken: response.data.token
              });
              console.log(response);
            })
            .catch( (error) => {
              console.error(error);
              console.log(error);
              setErrorMessage(error.response.data.message)
            });
          } else{
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
        ) : 
        <View>
            <Text style={[styles.title, styles.titleMarginTop2]}>Se Connecter</Text>
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
          placeholder="Entrez votre Password"
          autoCapitalize='none'
          textContentType="password"
          autoCorrect={false}
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)} />
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
    marginTop: 110,
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

export default Login;